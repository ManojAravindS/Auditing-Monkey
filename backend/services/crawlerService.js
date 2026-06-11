import { chromium } from "playwright";
import { io } from "../server.js";
import { saveScreenshot } from "./screenshotService.js";
import { generateReport } from "./reportGenerator.js";

export const crawlWebsite = async (url) => {

    let browser;

    try {

        console.log("Starting scan for:", url);

        browser = await chromium.launch({
            headless: true
        });

        const page = await browser.newPage();

        const report = {
            pagesVisited: [],
            linksFound: [],
            buttonsFound: [],
            brokenLinks: []
        };

        io.emit("scanUpdate", {
            type: "status",
            message: `Opening ${url}`
        });

        await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 15000
        });

        report.pagesVisited.push(url);

        try {
            await saveScreenshot(page, "home");
        } catch (error) {
            console.log("Screenshot failed:", error.message);
        }

        const links = await page.$$eval(
            "a",
            anchors =>
                anchors
                    .map(a => a.href)
                    .filter(link => link.startsWith("http"))
        );

        report.linksFound = links;

        io.emit("scanUpdate", {
            type: "status",
            message: `${links.length} links found`
        });

        const buttons = await page.$$("button");

        report.buttonsFound = buttons.length;

        io.emit("scanUpdate", {
            type: "status",
            message: `${buttons.length} buttons found`
        });

        for (const button of buttons) {

            try {

                const text =
                    await button.textContent() ||
                    "Unnamed Button";

                io.emit("scanUpdate", {
                    type: "button",
                    message: `Exploring button: ${text}`
                });

                await button.click({
                    timeout: 3000
                });

                io.emit("scanUpdate", {
                    type: "success",
                    message: `Clicked ${text}`
                });

            } catch (error) {

                console.log("Button click failed:", error.message);

            }

        }

        for (const link of links.slice(0, 5)) {

            try {

                io.emit("scanUpdate", {
                    type: "link",
                    message: `Visiting ${link}`
                });

                const newPage = await browser.newPage();

                await newPage.goto(link, {
                    waitUntil: "domcontentloaded",
                    timeout: 10000
                });

                report.pagesVisited.push(link);

                await newPage.close();

            } catch (error) {

                report.brokenLinks.push(link);

                io.emit("scanUpdate", {
                    type: "error",
                    message: `Broken link: ${link}`
                });

            }

        }

        try {
            generateReport(report);
        } catch (error) {
            console.log("Report generation failed:", error.message);
        }

        io.emit("scanComplete", report);

    } catch (error) {

        console.error("CRAWLER ERROR:", error);

        io.emit("scanUpdate", {
            type: "error",
            message: error.message
        });

    } finally {

        if (browser) {
            await browser.close();
        }

    }

};