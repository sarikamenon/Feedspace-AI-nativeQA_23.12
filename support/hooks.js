const { Before, After, BeforeAll, AfterAll, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');

setDefaultTimeout(180 * 1000);

let browser;
let context;
let page;

BeforeAll(async function () {
    const isCI = process.env.CI || process.env.GITHUB_ACTIONS;
    browser = await chromium.launch({
        headless: isCI ? true : false,
        args: isCI ? ['--no-sandbox', '--disable-setuid-sandbox'] : []
    });
});

AfterAll(async function () {
    await browser.close();
});

Before(async function () {
    context = await browser.newContext();
    page = await context.newPage();
    this.page = page; // Attach page to the world instance
    this.context = context; // Attach context to the world instance
});

After(async function () {
    await page.close();
    await context.close();
});
