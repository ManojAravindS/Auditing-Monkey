import { crawlWebsite } from "../services/crawlerService.js";

export const startScan = async (req, res) => {

    try {

        const { url } = req.body;

        res.json({
            success: true,
            message: "Scan started"
        });

        crawlWebsite(url);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
};