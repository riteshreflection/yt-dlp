import express from "express";
import { exec } from "child_process";

const app = express();
const PORT = process.env.PORT || 3000;

// Your raw cookie string
const COOKIE_HEADER = process.env.YT_COOKIE || `LOGIN_INFO=AFmmF2swRAIgHBeC...;__Secure-3PSIDCC=AKEyXzUWfEDCVptZyglGdhhKCVzhAOkYaCBgHHpPlUYgyAP6KlgAa43HOrmLQSNf8K8ekQWJSw`;

app.get("/video", (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) {
        return res.status(400).json({ error: "Missing 'url' parameter" });
    }

    const cmd = `yt-dlp --add-header "Cookie: ${COOKIE_HEADER}" -g "${videoUrl}"`;

    exec(cmd, (err, stdout, stderr) => {
        if (err) {
            console.error(stderr);
            return res.status(500).json({ error: "Failed to fetch video URL" });
        }
        res.json({ direct_url: stdout.trim() });
    });
});

app.get("/", (req, res) => {
    res.send("YT-DLP API Server ✅");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
