const { expect } = require('@playwright/test');

class SharePage {
    constructor(page) {
        this.page = page;
        this.magicLinkBtn = '.js-clipboard-default';
        this.closeBtn = this.page.getByRole('button', { name: 'Close' });
    }

    async clickMagicLinkAndHandleTab() {
        console.log('Clicking Magic Link...');

        const popupPromise = this.page.waitForEvent('popup');

        await this.page.locator(this.magicLinkBtn).first().waitFor({
            state: 'visible',
            timeout: 30000
        });

        await this.page.locator(this.magicLinkBtn).first().click();

        const popup = await popupPromise;
        console.log('New tab opened via magic link');

        await popup.waitForLoadState('domcontentloaded');

        // Switch back to original page
        await this.page.bringToFront();
        console.log('Switched back to original tab');
    }

    async clickCloseButton() {
        console.log('Clicking Close button');
        await this.closeBtn.waitFor({ state: 'visible', timeout: 30000 });
        await this.closeBtn.click();
    }

    async navigateToWidgets() {
        console.log('Navigating to Widgets page...');
        await this.page.goto('https://app.feedspace.io/widgets', { waitUntil: 'domcontentloaded' });
        console.log('Navigated to Widgets page');
    }
}

module.exports = { SharePage };
