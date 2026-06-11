import { chromium } from "playwright";

export const testForms = async (url) => {
    const browser = await chromium.launch({
        headless: true
    });

    const page = await browser.newPage();

    const report = [];

    try {

        await page.goto(url, {
            waitUntil: "networkidle"
        });

        const forms = await page.$$("form");

        for (let i = 0; i < forms.length; i++) {

            const inputs = await forms[i].$$("input");

            for (const input of inputs) {

                const type = await input.getAttribute("type");

                try {

                    if (type === "email") {
                        await input.fill("test@example.com");
                    } else if (type === "password") {
                        await input.fill("Password123");
                    } else {
                        await input.fill("AutoQA Test");
                    }

                } catch { }
            }

            report.push({
                formNumber: i + 1,
                status: "Filled"
            });
        }

        await browser.close();

        return report;

    } catch (error) {

        await browser.close();
        throw error;

    }
};