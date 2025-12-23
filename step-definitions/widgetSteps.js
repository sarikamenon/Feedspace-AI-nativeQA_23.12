const { When, Then } = require('@cucumber/cucumber');
const { WidgetsPage } = require('../pages/WidgetsPage');

When('I navigate to the Widgets page via menu', async function () {
    if (!this.widgetsPage) this.widgetsPage = new WidgetsPage(this.page);
    await this.widgetsPage.navigateToWidgets();
});

When('I select the Carousel template', async function () {
    if (!this.widgetsPage) this.widgetsPage = new WidgetsPage(this.page);
    await this.widgetsPage.selectCarouselTemplate();
});

When('I select the first 5 reviews for the widget', async function () {
    if (!this.widgetsPage) this.widgetsPage = new WidgetsPage(this.page);
    await this.widgetsPage.selectFirstFiveWidgetReviews();
});

When('I click on Save and Next on widget page', async function () {
    if (!this.widgetsPage) this.widgetsPage = new WidgetsPage(this.page);
    await this.widgetsPage.clickSaveAndNext();
});

When('I click on Save and Share on widget page', async function () {
    if (!this.widgetsPage) this.widgetsPage = new WidgetsPage(this.page);
    await this.widgetsPage.clickSaveAndShare();
});

Then('I click on the Widget Preview button', async function () {
    if (!this.widgetsPage) this.widgetsPage = new WidgetsPage(this.page);
    await this.widgetsPage.clickWidgetPreview();
});
