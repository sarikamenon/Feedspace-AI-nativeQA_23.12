const { When, Then } = require('@cucumber/cucumber');
const { SharePage } = require('../pages/SharePage');

When('I click on the magic link and switch back to the original tab', async function () {
    this.sharePage = new SharePage(this.page);
    await this.sharePage.clickMagicLinkAndHandleTab();
});

Then('I click on the close button', async function () {
    if (!this.sharePage) this.sharePage = new SharePage(this.page);
    await this.sharePage.clickCloseButton();
});

Then('I navigate to the Widgets page', async function () {
    if (!this.sharePage) this.sharePage = new SharePage(this.page);
    await this.sharePage.navigateToWidgets();
});
