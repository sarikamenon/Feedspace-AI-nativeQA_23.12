const nodemailer = require('nodemailer');

class EtherealEmailPage {
    constructor(context) {
        this.context = context;
        this.testAccount = null;
    }

    /**
     * Create an Ethereal test account (free, no signup required)
     * This generates a temporary email account for testing
     */
    async createTestAccount() {
        if (!this.testAccount) {
            this.testAccount = await nodemailer.createTestAccount();
            console.log(`[Ethereal] Created test account: ${this.testAccount.user}`);
            console.log(`[Ethereal] Password: ${this.testAccount.pass}`);
            console.log(`[Ethereal] Web URL: https://ethereal.email/messages`);
        }
        return this.testAccount;
    }

    /**
     * Get the test email address to use for Feedspace sign-in
     */
    async getTestEmail() {
        const account = await this.createTestAccount();
        return account.user;
    }

    /**
     * Fetch OTP from Ethereal inbox using web interface
     * More reliable than IMAP in CI environments
     */
    async getOtp(maxWaitTime = 90000) {
        const account = await this.createTestAccount();
        const startTime = Date.now();

        console.log(`[Ethereal] Waiting for OTP email at ${account.user}...`);

        // Open Ethereal web interface
        const page = await this.context.newPage();

        try {
            // Login to Ethereal web interface
            await page.goto('https://ethereal.email/login');
            await page.fill('input[name="email"]', account.user);
            await page.fill('input[name="password"]', account.pass);
            await page.click('button[type="submit"]');

            await page.waitForLoadState('networkidle');
            await page.goto('https://ethereal.email/messages');

            // Poll for new messages
            while (Date.now() - startTime < maxWaitTime) {
                await page.reload();
                await page.waitForTimeout(3000);

                // Check for messages in the inbox
                const messageRows = await page.locator('table tbody tr').count();

                if (messageRows > 0) {
                    console.log(`[Ethereal] Found ${messageRows} message(s)`);

                    // Click the first message
                    await page.locator('table tbody tr').first().click();
                    await page.waitForTimeout(2000);

                    // Get the email content
                    const emailContent = await page.locator('.message-content').textContent().catch(() => '');
                    const subject = await page.locator('.message-subject').textContent().catch(() => '');

                    const fullText = subject + ' ' + emailContent;
                    console.log(`[Ethereal] Email content preview: ${fullText.substring(0, 200)}`);

                    // Extract 6-digit OTP
                    const match = fullText.match(/\b(\d{6})\b/);
                    if (match) {
                        const otp = match[1];
                        console.log(`[Ethereal] ✓ OTP Found: ${otp}`);
                        await page.close();
                        return otp;
                    }
                }

                console.log('[Ethereal] No OTP found yet, retrying...');
                await page.waitForTimeout(5000);
            }

            throw new Error('[Ethereal] Timeout: OTP not received within time limit');

        } catch (error) {
            await page.close();
            throw error;
        }
    }
}

module.exports = { EtherealEmailPage };
