const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances"),
        reason: z.string().describe("A brief explanation of why this skill is missing and why it is critical for this job")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    jobReadinessScore: z.number().describe("An estimated readiness score (0-100) representing how ready the candidate will be after executing the roadmap"),
    estimatedTimeline: z.string().describe("The estimated time required to become fully interview ready, e.g., '4 Weeks' or '6 Weeks'"),
    learningRoadmap: z.array(z.object({
        week: z.number().describe("The week number starting from 1"),
        focus: z.string().describe("The focus or main topic of this week (estimating hours if needed)"),
        tasks: z.array(z.string()).describe("List of practice tasks or specific things to study"),
        checkpoint: z.string().describe("Milestone or progress checkpoint at the end of the week")
    })).describe("A week-by-week learning roadmap to close the skill gaps"),
    recommendedProjects: z.array(z.object({
        title: z.string().describe("Title of the mini-project"),
        description: z.string().describe("Short description of what the project does and how it helps practice"),
        skillsPracticed: z.array(z.string()).describe("List of missing skills practiced in this project")
    })).describe("Practical mini-projects for major missing skills"),
    learningResources: z.array(z.object({
        skill: z.string().describe("The name of the missing skill"),
        resourceName: z.string().describe("The title of the learning resource"),
        type: z.string().describe("The type of resource, e.g., Video, Article, Documentation, Course"),
        url: z.string().describe("A relevant URL or placeholder path to the learning resource")
    })).describe("Relevant learning resources for the missing skills"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {


    const prompt = `Generate a detailed interview report and learning roadmap for a candidate by comparing their resume and self description against the target job description.
    
                    Candidate Background:
                    Resume: ${resume || 'None'}
                    Self Description: ${selfDescription || 'None'}
                    
                    Target Job Description:
                    ${jobDescription}
                    
                    Instructions:
                    1. Evaluate Match Score (0-100) based on current alignment.
                    2. Analyze missing skills, tools, frameworks, and concepts required for the job. Populate 'skillGaps' (categorize severity as low, medium, or high, and provide the 'reason' explaining why it is critical for the job).
                    3. Build a structured, week-by-week 'learningRoadmap' (Week 1, Week 2, etc.) to close the identified skill gaps and get the user job-ready. Give estimated study focus, practice tasks, and progress checkpoints.
                    4. Estimate the time required (e.g. '4 Weeks') to complete the roadmap under 'estimatedTimeline'. Set 'jobReadinessScore' (0-100) representing how ready they will be after completing this learning plan.
                    5. Recommend practical, hands-on mini-projects under 'recommendedProjects' that specifically target the missing skills.
                    6. Suggest relevant documentation, course, or video learning resources under 'learningResources' for the missing skills.
                    7. Generate highly tailored technical and behavioral questions and answers based on the job requirements.
`

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    })

    return JSON.parse(response.text)


}



let browserInstance = null;

async function getBrowser() {
    if (!browserInstance || !browserInstance.connected || !browserInstance.process() || browserInstance.process().killed) {
        browserInstance = await puppeteer.launch({
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-blink-features=AutomationControlled',
                '--window-size=1920,1080'
            ]
        });
    }
    return browserInstance;
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await getBrowser()
    const page = await browser.newPage();
    try {
        await page.setContent(htmlContent, { waitUntil: "networkidle0" })

        const pdfBuffer = await page.pdf({
            format: "A4", margin: {
                top: "20mm",
                bottom: "20mm",
                left: "15mm",
                right: "15mm"
            }
        })

        return pdfBuffer
    } finally {
        await page.close()
    }
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })


    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}

async function scrapeJobDescription(url) {
    let page;
    try {
        const browser = await getBrowser()
        page = await browser.newPage()
        
        // Hide webdriver automated flags
        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined,
            });
        });
        
        await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36")
        await page.setViewport({ width: 1920, height: 1080 })
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
        })
        
        // Navigate to the URL
        await page.goto(url, { waitUntil: "networkidle2", timeout: 20000 })
        
        // Extract plain text from the body
        const rawText = await page.evaluate(() => document.body.innerText)
        await page.close()
        page = null;

        const truncatedText = rawText.substring(0, 20000)

        const prompt = `You are an expert ATS and recruiter tool. Extract the clean job title and the detailed job description (including responsibilities, requirements, and benefits) from the following raw text scraped from a job board website. Ignore navigation headers, footers, related jobs, cookies banners, and HTML boilerplate.
        
        If the content appears to be a login wall, cookie consent wall, CAPTCHA, Cloudflare security check, access denied page, or general application error page rather than an actual job description, set isBlockedOrError to true. Otherwise, set it to false.
        
        Provide the output in a structured format.
        
        Scraped Webpage Content:
        """
        ${truncatedText}
        """`

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(z.object({
                    title: z.string().describe("The extracted job title"),
                    description: z.string().describe("The clean extracted job description in markdown format"),
                    isBlockedOrError: z.boolean().describe("Set to true if the text indicates an access denied, Cloudflare block, login wall, or application error instead of a job description")
                }))
            }
        })

        return JSON.parse(response.text)
    } catch (err) {
        if (page) {
            await page.close()
        }
        throw err
    }
}

async function generateMockQuestions({ resume, jobDescription, randomSeed }) {
    const mockQuestionsSchema = z.object({
        questions: z.array(z.object({
            type: z.enum([ "technical", "behavioral" ]).describe("Type of question: 'technical' or 'behavioral'"),
            question: z.string().describe("The interview question"),
            skill: z.string().describe("The skill or competency tested by this question"),
            difficulty: z.enum([ "easy", "medium", "hard" ]).optional().describe("For technical questions, the difficulty level (easy, medium, hard)")
        })).describe("A list of exactly 16 interview questions, containing 10 technical questions and 6 behavioral questions.")
    })

    const prompt = `Generate a customized list of interview questions for a candidate based on their background and the target job description.
    
                    Candidate Profile:
                    ${resume || "None provided"}
                    
                    Target Job Description:
                    ${jobDescription}
                    
                    Instructions:
                    1. Create exactly 16 questions in total: exactly 10 technical questions targeting the required skills and frameworks (e.g. React, Node, SQL) with difficulty levels assigned (easy, medium, or hard), and exactly 6 behavioral questions assessing relevant core competencies and soft skills.
                    2. Prioritize questions matching key required job skills. Make the questions specific, realistic, and clear. Avoid duplicate or generic questions.
                    3. To ensure that the generated questions are highly dynamic and not repetitive across multiple sessions, focus on unique subtopics, different angles of the candidate's profile, and various real-world scenarios. Use the following random context token to vary the selection: ${randomSeed || 'default-seed'}.
                    4. Ensure that the questions cover a wide range of different skills and scenarios, rather than focusing on the same topics repeatedly.`

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(mockQuestionsSchema),
        }
    })

    return JSON.parse(response.text)
}

async function evaluateMockAnswers(questionsWithAnswers) {
    const mockEvaluationSchema = z.object({
        questions: z.array(z.object({
            question: z.string().describe("The original question"),
            candidateAnswer: z.string().describe("The candidate's response"),
            feedback: z.string().describe("Contextual feedback detailing accuracy, clarity, and recommendations"),
            suggestedAnswer: z.string().describe("A professional, high-scoring model answer for this question")
        })),
        evaluation: z.object({
            technicalScore: z.number().describe("Technical accuracy score out of 10"),
            communicationScore: z.number().describe("Communication and articulation score out of 10"),
            problemSolvingScore: z.number().describe("Problem solving approach score out of 10"),
            overallScore: z.number().describe("Overall score out of 10 representing overall performance"),
            strengths: z.array(z.string()).describe("A list of key strengths demonstrated"),
            improvements: z.array(z.string()).describe("A list of specific areas needing improvement"),
            nextSteps: z.array(z.string()).describe("List of actionable next steps")
        })
    })

    const prompt = `Evaluate the candidate's responses to the following mock interview questions. Analyze the technical accuracy of their answer, their communication clarity, and their problem-solving approach.
    
                    Mock Interview Questions and Candidate Answers:
                    ${JSON.stringify(questionsWithAnswers, null, 2)}
                    
                    Instructions:
                    1. For each question, provide constructive 'feedback' pointing out what was good and what was missing. Provide a 'suggestedAnswer' showing a top-tier industry response.
                    2. Evaluate and score the candidate's performance out of 10 for: Technical Knowledge, Communication, Problem Solving, and an Overall Average score.
                    3. Outline overall strengths, key areas for improvement, and recommended next steps to prepare.`

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(mockEvaluationSchema),
        }
    })

    return JSON.parse(response.text)
}

module.exports = {
    generateInterviewReport,
    generateResumePdf,
    scrapeJobDescription,
    generateMockQuestions,
    evaluateMockAnswers
}