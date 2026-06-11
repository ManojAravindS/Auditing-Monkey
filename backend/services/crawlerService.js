import { chromium } from "playwright";
import { io } from "../server.js";
import { saveScreenshot } from "./screenshotService.js";
import { generateReport } from "./reportGenerator.js";

export const crawlWebsite = async (url) => {

    const browser = await chromium.launch({
        headless: true
    });

    const page = await browser.newPage();

    const report = {
        pagesVisited: [],
        linksFound: [],
        buttonsFound: [],
        brokenLinks: []
    };

    try {

        io.emit("scanUpdate", {
            type: "status",
            message: `Opening ${url}`
        });

        await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 10000
        });

        report.pagesVisited.push(url);

        await saveScreenshot(page, "home");

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

            } catch {

                io.emit("scanUpdate", {
                    type: "warning",
                    message: "Button click failed"
                });

            }

        }

        for (const link of links.slice(0, 10)) {

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

            } catch {

                report.brokenLinks.push(link);

                io.emit("scanUpdate", {
                    type: "error",
                    message: `Broken link: ${link}`
                });

            }

        }

        generateReport(report);

        io.emit("scanComplete", report);

        await browser.close();

    } catch (error) {

        io.emit("scanUpdate", {
            type: "error",
            message: error.message
        });

        await browser.close();
    }

};