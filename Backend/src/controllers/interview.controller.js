const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf, scrapeJobDescription, generateMockQuestions, evaluateMockAnswers } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")
const { catchAsync } = require("../middlewares/error.middleware")




/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {

    try {
        let resumeText = ""

        if (req.file) {
            const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
            resumeText = resumeContent.text
        }

        const { selfDescription, jobDescription } = req.body

        if (!jobDescription) {
            return res.status(400).json({
                message: "Job description is required."
            })
        }

        if (!resumeText && !selfDescription) {
            return res.status(400).json({
                message: "Either a resume or self description is required."
            })
        }

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        })

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interViewReportByAi
        })

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: "Failed to generate interview report.",
            error: err.message
        })
    }

}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

/**
 * @description Controller to scrape job description from a URL.
 */
async function scrapeJobDescriptionController(req, res) {
    try {
        const { url } = req.body

        if (!url) {
            return res.status(400).json({
                message: "URL is required."
            })
        }

        try {
            new URL(url)
        } catch (_) {
            return res.status(400).json({
                message: "Please enter a valid URL."
            })
        }

        const scrapedDetails = await scrapeJobDescription(url)

        if (scrapedDetails.isBlockedOrError) {
            return res.status(400).json({
                message: "This job listing is protected, blocked by security (like Cloudflare), or requires a login. Please copy and paste the job description manually."
            })
        }

        res.status(200).json({
            message: "Job description scraped successfully.",
            ...scrapedDetails
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: "Failed to scrape job description from the URL.",
            error: err.message
        })
    }
}

/**
 * @description Controller to start mock interview and generate questions.
 */
async function startMockInterviewController(req, res) {
    try {
        const { interviewId } = req.params
        const report = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

        if (!report) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        const mockData = await generateMockQuestions({
            resume: report.resume,
            jobDescription: report.jobDescription,
            randomSeed: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
        })

        report.mockInterview = {
            status: "in_progress",
            questions: mockData.questions.map(q => ({
                type: q.type,
                question: q.question,
                skill: q.skill,
                difficulty: q.difficulty || "medium",
                candidateAnswer: "",
                feedback: "",
                suggestedAnswer: ""
            }))
        }

        await report.save()

        res.status(200).json({
            message: "Mock interview questions generated successfully.",
            questions: report.mockInterview.questions,
            status: report.mockInterview.status
        })
    } catch (err) {
        console.error(err)
        const isRateLimit = err.status === 429 || (err.message && err.message.includes("429")) || (err.message && err.message.includes("quota"));
        const isOverloaded = err.status === 503 || (err.message && err.message.includes("503")) || (err.message && err.message.includes("overloaded"));
        
        let message = "Failed to start mock interview.";
        let statusCode = 500;
        
        if (isRateLimit) {
            message = "Google Gemini AI rate limit exceeded. Please wait a few seconds and try starting again.";
            statusCode = 429;
        } else if (isOverloaded) {
            message = "Google Gemini AI is temporarily overloaded. Please wait a few seconds and try starting again.";
            statusCode = 503;
        }

        res.status(statusCode).json({
            message,
            error: err.message
        })
    }
}

/**
 * @description Controller to submit candidate answers and evaluate them.
 */
async function submitMockInterviewController(req, res) {
    try {
        const { interviewId } = req.params
        const { answers } = req.body // Array of { question, candidateAnswer }

        const report = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

        if (!report) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        // Prepare evaluation questions mapping
        const questionsWithAnswers = report.mockInterview.questions.map(q => {
            const candidateAnsObj = (answers || []).find(ans => ans.question === q.question)
            return {
                question: q.question,
                type: q.type,
                skill: q.skill,
                candidateAnswer: candidateAnsObj ? candidateAnsObj.candidateAnswer : ""
            }
        })

        const evaluationResult = await evaluateMockAnswers(questionsWithAnswers)

        // Save evaluation results back to DB
        report.mockInterview.questions = report.mockInterview.questions.map(q => {
            const evalQ = evaluationResult.questions.find(eq => eq.question === q.question)
            const candidateAnsObj = (answers || []).find(ans => ans.question === q.question)
            return {
                type: q.type,
                question: q.question,
                skill: q.skill,
                difficulty: q.difficulty,
                candidateAnswer: candidateAnsObj ? candidateAnsObj.candidateAnswer : "",
                feedback: evalQ ? evalQ.feedback : "No feedback generated.",
                suggestedAnswer: evalQ ? evalQ.suggestedAnswer : "No suggested answer generated."
            }
        })

        report.mockInterview.evaluation = {
            technicalScore: evaluationResult.evaluation.technicalScore,
            communicationScore: evaluationResult.evaluation.communicationScore,
            problemSolvingScore: evaluationResult.evaluation.problemSolvingScore,
            overallScore: evaluationResult.evaluation.overallScore,
            strengths: evaluationResult.evaluation.strengths,
            improvements: evaluationResult.evaluation.improvements,
            nextSteps: evaluationResult.evaluation.nextSteps
        }

        report.mockInterview.status = "evaluated"

        await report.save()

        res.status(200).json({
            message: "Mock interview evaluated successfully.",
            mockInterview: report.mockInterview
        })
    } catch (err) {
        console.error(err)
        const isRateLimit = err.status === 429 || (err.message && err.message.includes("429")) || (err.message && err.message.includes("quota"));
        const isOverloaded = err.status === 503 || (err.message && err.message.includes("503")) || (err.message && err.message.includes("overloaded"));
        
        let message = "Failed to evaluate mock interview.";
        let statusCode = 500;
        
        if (isRateLimit) {
            message = "Google Gemini AI rate limit exceeded. Please wait a few seconds and try submitting again.";
            statusCode = 429;
        } else if (isOverloaded) {
            message = "Google Gemini AI is temporarily overloaded. Please wait a few seconds and try submitting again.";
            statusCode = 503;
        }

        res.status(statusCode).json({
            message,
            error: err.message
        })
    }
}

module.exports = {
    generateInterViewReportController: catchAsync(generateInterViewReportController),
    getInterviewReportByIdController: catchAsync(getInterviewReportByIdController),
    getAllInterviewReportsController: catchAsync(getAllInterviewReportsController),
    generateResumePdfController: catchAsync(generateResumePdfController),
    scrapeJobDescriptionController: catchAsync(scrapeJobDescriptionController),
    startMockInterviewController: catchAsync(startMockInterviewController),
    submitMockInterviewController: catchAsync(submitMockInterviewController)
}