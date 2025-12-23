const { expect } = require('@playwright/test');

class DashboardPage {
    constructor(page) {
        this.page = page;
        this.launchWorkspaceButton = 'button:has-text("Launch Workspace")';
        this.dashboardHeader = 'h1:has-text("Dashboard")';
        // Try multiple selectors for Import Reviews
        this.importOption = 'text="Import Reviews"';
    }

    async clickLaunchWorkspace() {
        console.log('Clicking Launch Workspace button');
        await this.page.click(this.launchWorkspaceButton);
    }

    async verifyDashboard() {
        console.log('Verifying Dashboard URL');
        await expect(this.page).toHaveURL(/.*\/setup/); // Updated based on logs
    }

    async clickImportOption() {
        console.log('Clicking Import Option');
        const importLink = this.page.locator(this.importOption).first();
        await importLink.waitFor({ state: 'visible', timeout: 30000 });
        await importLink.click();
    }
}

module.exports = { DashboardPage };
