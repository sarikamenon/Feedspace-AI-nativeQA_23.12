class MailinatorPage {
    constructor(context) {
        this.context = context;
    }

    async getOtp(username) {
        const page = await this.context.newPage();
        const mailinatorUrl = `https://www.mailinator.com/v4/public/inboxes.jsp?msgid=&to=${username}`;

        console.log(`Checking Mailinator for: ${username}`);

        // Retry logic variables
        const maxTime = 60000; // 60 seconds
        const startTime = Date.now();
        let otp = null;

        while (Date.now() - startTime < maxTime) {
            try {
                await page.goto(mailinatorUrl);
                await page.waitForLoadState('domcontentloaded');
                await page.waitForTimeout(2000); // Wait for table refresh

                // Check for email rows
                const rows = await page.$$('table.table-striped tbody tr');

                if (rows.length > 0) {
                    const firstRow = rows[0];
                    const subjectElement = await firstRow.$('td:nth-child(3)');
                    const subjectText = await subjectElement.textContent();
                    console.log(`Found subject: ${subjectText}`);

                    // Extract digits
                    const match = subjectText.match(/\b(\d{6})\b/);
                    if (match) {
                        otp = match[1];
                        console.log(`OTP Found: ${otp}`);
                        break;
                    }
                } else {
                    console.log('No email rows found yet.');
                }
            } catch (e) {
                console.log(`Error fetching Mailinator: ${e.message}`);
            }
            await page.waitForTimeout(5000);
        }

        await page.close();

        if (!otp) throw new Error('Failed to retrieve OTP from Mailinator');
        return otp;
    }
}

module.exports = { MailinatorPage };
