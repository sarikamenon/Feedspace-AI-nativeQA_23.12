const { expect } = require('@playwright/test');

class WidgetsPage {
    constructor(page) {
        this.page = page;
    }

    async navigateToWidgets() {
        console.log('Navigating to Widgets page...');
        // Locator provided by user
        await this.page.getByRole('link', { name: 'Widgets' }).click();
        console.log('Navigated to Widgets page');
    }

    async selectCarouselTemplate() {
        console.log('Selecting Carousel template...');
        // Locator provided by user
        const templateBtn = this.page.getByText('Use this Template Carousel').first();
        await templateBtn.waitFor({ state: 'visible', timeout: 30000 });
        await templateBtn.click();
        console.log('Carousel template selected');
    }

    async selectFirstFiveWidgetReviews() {
        console.log('Selecting first 5 widget reviews...');

        const noReviews = this.page.locator('#widgets-no-reviews-found');
        if (await noReviews.isVisible()) {
            console.log('No reviews found in widget');
            return;
        }

        const list = this.page.locator('#widget-feeds-list');
        await list.waitFor({ state: 'visible', timeout: 60000 });

        const checkboxes = list.locator('input[type="checkbox"]');

        // Wait for at least one
        try {
            await checkboxes.first().waitFor({ state: 'attached', timeout: 30000 });
        } catch (e) {
            console.log('No checkboxes found!');
        }

        const count = await checkboxes.count();
        console.log(`Found ${count} total checkboxes`);

        let selected = 0;
        for (let i = 0; i < count && selected < 5; i++) {
            const cb = checkboxes.nth(i);
            // Force click in case of overlay/custom styling
            await cb.click({ force: true });
            selected++;
            console.log(`Selected review ${selected}`);
            // Small delay to ensure state update
            await this.page.waitForTimeout(500);
        }
    }


    async clickSaveAndNext() {
        console.log('Clicking Save & Next on widget page...');
        const btn = this.page.getByRole('button', { name: /Save & Next/i }).first();
        await btn.waitFor({ state: 'visible', timeout: 30000 });
        await btn.click({ force: true });
        console.log('Clicked Save & Next');
    }

    async clickSaveAndShare() {
        console.log('Clicking Save & Share on widget page...');
        const btn = this.page.getByRole('button', { name: /Save & Share/i }).first();
        await this.page.waitForTimeout(2000); // Wait for transition
        await btn.waitFor({ state: 'visible', timeout: 30000 });
        await btn.click({ force: true });
        console.log('Clicked Save & Share');
    }

    async clickWidgetPreview() {
        console.log('Clicking Widget Preview button...');
        const btn = this.page.locator('#widget-preview-btn').first();
        await btn.waitFor({ state: 'visible', timeout: 30000 });
        await btn.click();
        console.log('Clicked Widget Preview');
    }
}

module.exports = { WidgetsPage };
