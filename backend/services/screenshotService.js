import fs from "fs";

export const saveScreenshot = async (page, name) => {

    if (!fs.existsSync("./screenshots")) {
        fs.mkdirSync("./screenshots");
    }

    await page.screenshot({
        path: `./screenshots/${name}.png`,
        fullPage: true
    });

};