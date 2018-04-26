// "features": {
//   "psm-feature-000": {
//     "description": String,
//     "status": String ["Complete", "InProgress", "NotStarted"],
//     "startDate": String[Date] or null,
//     "completedDate": String[Date] or null,
//     "requirements": [
//       "psm-FR-8.2",
//       "psm-FR-8.3",
//       ...
//     ]
//   },
//   "psm-feature-001": {
//     ...
//   }
// }

var features = {
  "psm-feature-000": {
    description: "This is a description of feature 000.",
    status: "InProgress",
    startDate: "2018-06-11",
    completedDate: "2018-07-11",
    requirements: ["psm-FR-8.2", "psm-FR-8.3"]
  },
  "psm-feature-001": {
    description: "This is a description of feature 001.",
    status: "NotStarted",
    startDate: "2018-06-11",
    completedDate: "2018-08-22",
    requirements: ["psm-FR-8.2", "psm-FR-8.3"]
  },
  "psm-feature-002": {
    description: "This is a description of feature 002.",
    status: "Complete",
    startDate: "2018-06-11",
    completedDate: "2018-06-22",
    requirements: ["psm-FR-8.2", "psm-FR-8.3"]
  },
  "psm-feature-003": {
    description: "This is a description of feature 003.",
    status: "InProgress",
    startDate: "2018-06-11",
    completedDate: "2018-07-11",
    requirements: ["psm-FR-8.2", "psm-FR-8.3"]
  },
  "psm-feature-004": {
    description: "This is a description of feature 004.",
    status: "NotStarted",
    startDate: "2018-06-11",
    completedDate: "2018-08-22",
    requirements: ["psm-FR-8.2", "psm-FR-8.3"]
  },
  "psm-feature-005": {
    description: "This is a description of feature 005.",
    status: "Complete",
    startDate: "2018-06-11",
    completedDate: "2018-06-22",
    requirements: ["psm-FR-8.2", "psm-FR-8.3"]
  }
};
