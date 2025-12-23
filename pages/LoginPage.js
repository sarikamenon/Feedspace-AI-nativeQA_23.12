class LoginPage {
    constructor(page) {
        this.page = page;
        this.url = 'https://app.feedspace.io/signin';

        // --- Locators ---
        this.emailInput = 'input[type="email"], input[placeholder*="email" i]';
        this.sendCodeBtn = 'button:has-text("Send Sign-In Code")';
        this.otpInput = 'input[placeholder*="000000"], input[type="text"]';

        // Dynamic locator for any button with specific text
        this.genericBtn = (text) => `button:has-text("${text}")`;
    }

    async navigate() {
        console.log(`Navigating to ${this.url}`);
        // Increased timeout to 60s and using domcontentloaded
        await this.page.goto(this.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        const emailField = this.page.locator(this.emailInput).first();
        await emailField.waitFor({ state: 'visible', timeout: 30000 });
    }

    async enterEmail(email) {
        // 1. Force fix: Replace '%40' with '@' if it exists
        let cleanEmail = email.replace('%40', '@');

        // 2. Remove any accidental whitespace
        cleanEmail = cleanEmail.trim();

        console.log(`Original input: ${email}`);
        console.log(`Typing fixed email: ${cleanEmail}`);

        const emailField = this.page.locator(this.emailInput).first();

        // 3. Clear the field completely
        await emailField.fill('');

        // 4. Type one key at a time (Safer than fill for special characters)
        await emailField.pressSequentially(cleanEmail, { delay: 100 });
    }

    async clickSendCode() {
        const sendCodeBtn = this.page.locator(this.sendCodeBtn).first();
        await sendCodeBtn.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.click(this.sendCodeBtn);
    }

    async enterOtp(otp) {
        const otpInput = this.page.locator(this.otpInput).first();
        await otpInput.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.fill(this.otpInput, otp);

        // PRESS ENTER: Triggers submission if there is no button
        await this.page.keyboard.press('Enter');
    }

    // Handles "Launch Workspace" or other buttons
    async clickButtonByText(text) {
        const btnSelector = this.genericBtn(text);
        // Wait for the button to appear (it might take a moment after login)
        await this.page.locator(btnSelector).first().waitFor({ state: 'visible', timeout: 30000 });
        await this.page.click(btnSelector);
    }

    async getCurrentUrl() {
        await this.page.waitForLoadState('domcontentloaded');
        return this.page.url();
    }
}

module.exports = { LoginPage };
