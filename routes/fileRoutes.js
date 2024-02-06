// fileRoutes.js
const express = require('express');
const router = express.Router();

router.post('/upload', (req, res) => req.fileController.uploadFile(req, res));

router.get("/", async (req, res) => {
    try {
        const files = await req.fileController.fileModel.listFiles();
        res.render('files', { files });
    } catch (error) {
        console.error('Error listing files:', error);
        res.status(500).send("Server error while accessing files");
    }
});

router.get('/file-detail', async (req, res) => {
    await req.fileController.fetchFileDetailsAndRender(req, res);
});

router.get('/files/:filename', (req, res) => {
    res.redirect(`/file-detail?action=view&filename=${encodeURIComponent(req.params.filename)}`);
});

router.get('/files/delete/:filename', (req, res) => {
    res.redirect(`/file-detail?action=delete&filename=${encodeURIComponent(req.params.filename)}`);
});

module.exports = router;
