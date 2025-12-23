const reporter = require('cucumber-html-reporter');

const options = {
    theme: 'bootstrap',
    jsonFile: 'reports/cucumber-report.json',
    output: 'reports/cucumber-report.html',
    reportSuiteAsScenarios: true,
    scenarioTimestamp: true,
    launchReport: true,
    metadata: {
        "App Version": "1.0.0",
        "Test Environment": "STAGING",
        "Browser": "Chrome/Playwright",
        "Platform": "Windows",
        "Parallel": "Scenarios",
        "Executed": "Local"
    },
    failedSummaryReport: true,
};

reporter.generate(options);
