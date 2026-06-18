const mongoose = require('mongoose');


const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [ true, "Technical question is required" ]
    },
    intention: {
        type: String,
        required: [ true, "Intention is required" ]
    },
    answer: {
        type: String,
        required: [ true, "Answer is required" ]
    }
}, {
    _id: false
})

const behavioralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [ true, "Technical question is required" ]
    },
    intention: {
        type: String,
        required: [ true, "Intention is required" ]
    },
    answer: {
        type: String,
        required: [ true, "Answer is required" ]
    }
}, {
    _id: false
})

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [ true, "Skill is required" ]
    },
    severity: {
        type: String,
        enum: [ "low", "medium", "high" ],
        required: [ true, "Severity is required" ]
    },
    reason: {
        type: String
    }
}, {
    _id: false
})

const learningRoadmapSchema = new mongoose.Schema({
    week: {
        type: Number,
        required: [ true, "Week is required" ]
    },
    focus: {
        type: String,
        required: [ true, "Focus is required" ]
    },
    tasks: [ {
        type: String,
        required: [ true, "Task is required" ]
    } ],
    checkpoint: {
        type: String,
        required: [ true, "Checkpoint is required" ]
    }
}, {
    _id: false
})

const recommendedProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [ true, "Project title is required" ]
    },
    description: {
        type: String,
        required: [ true, "Project description is required" ]
    },
    skillsPracticed: [ {
        type: String,
        required: [ true, "Skill is required" ]
    } ]
}, {
    _id: false
})

const learningResourceSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [ true, "Skill name is required" ]
    },
    resourceName: {
        type: String,
        required: [ true, "Resource name is required" ]
    },
    type: {
        type: String,
        required: [ true, "Resource type is required" ]
    },
    url: {
        type: String,
        required: [ true, "Resource url is required" ]
    }
}, {
    _id: false
})

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [ true, "Day is required" ]
    },
    focus: {
        type: String,
        required: [ true, "Focus is required" ]
    },
    tasks: [ {
        type: String,
        required: [ true, "Task is required" ]
    } ]
})

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [ true, "Job description is required" ]
    },
    resume: {
        type: String,
    },
    selfDescription: {
        type: String,
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100,
    },
    technicalQuestions: [ technicalQuestionSchema ],
    behavioralQuestions: [ behavioralQuestionSchema ],
    skillGaps: [ skillGapSchema ],
    preparationPlan: [ preparationPlanSchema ],
    jobReadinessScore: {
        type: Number,
        min: 0,
        max: 100
    },
    estimatedTimeline: {
        type: String
    },
    learningRoadmap: [ learningRoadmapSchema ],
    recommendedProjects: [ recommendedProjectSchema ],
    learningResources: [ learningResourceSchema ],
    mockInterview: {
        status: {
            type: String,
            enum: [ "not_started", "in_progress", "evaluated" ],
            default: "not_started"
        },
        questions: [ {
            type: {
                type: String,
                enum: [ "technical", "behavioral" ],
                required: [ true, "Question type is required" ]
            },
            question: {
                type: String,
                required: [ true, "Question is required" ]
            },
            skill: {
                type: String,
                required: [ true, "Skill tested is required" ]
            },
            difficulty: {
                type: String,
                enum: [ "easy", "medium", "hard" ],
            },
            candidateAnswer: {
                type: String,
                default: ""
            },
            feedback: {
                type: String,
                default: ""
            },
            suggestedAnswer: {
                type: String,
                default: ""
            }
        } ],
        evaluation: {
            technicalScore: { type: Number },
            communicationScore: { type: Number },
            problemSolvingScore: { type: Number },
            overallScore: { type: Number },
            strengths: [ { type: String } ],
            improvements: [ { type: String } ],
            nextSteps: [ { type: String } ]
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    title: {
        type: String,
        required: [ true, "Job title is required" ]
    }
}, {
    timestamps: true
})


const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema);

module.exports = interviewReportModel;  