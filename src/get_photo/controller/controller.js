const { join } = require("path")
const fs = require('fs');


async function getFileController(req, res) {
    try {
        const imageUrl = req.query.imageUrl
        if (!imageUrl) {
            return res.status(400).json({ success: false, message: "Image URL is required" });
        }
        const uploadsDir = join(__dirname,'./../../../../libs/common/src/uploads')
        const filePath = join(uploadsDir, imageUrl);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ success: false, message: "Image not found" });
        }

        return res.sendFile(filePath);
    } catch (error) {
        console.error("Error serving image:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

module.exports = getFileController;
