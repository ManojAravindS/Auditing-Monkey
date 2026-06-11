import fs from "fs";

export const generateReport = (report) => {

    if (!fs.existsSync("./reports")) {
        fs.mkdirSync("./reports");
    }

    fs.writeFileSync(
        "./reports/report.json",
        JSON.stringify(report, null, 2)
    );

};