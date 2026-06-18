const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")

const interviewRouter = express.Router()



/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user self description,resume pdf and job description.
 * @access private
 */
interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterViewReportController)

/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId.
 * @access private
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController)


/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController)


/**
 * @route GET /api/interview/resume/pdf
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController)

/**
 * @route POST /api/interview/scrape
 * @description Scrape job description from a URL using Puppeteer.
 * @access private
 */
interviewRouter.post("/scrape", authMiddleware.authUser, interviewController.scrapeJobDescriptionController)

/**
 * @route POST /api/interview/mock/start/:interviewId
 * @description Start mock interview, generate questions.
 * @access private
 */
interviewRouter.post("/mock/start/:interviewId", authMiddleware.authUser, interviewController.startMockInterviewController)

/**
 * @route POST /api/interview/mock/submit/:interviewId
 * @description Submit mock answers and get evaluation.
 * @access private
 */
interviewRouter.post("/mock/submit/:interviewId", authMiddleware.authUser, interviewController.submitMockInterviewController)

module.exports = interviewRouter