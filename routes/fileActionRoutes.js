// fileActionRoutes.js
const express = require('express');
const fileActionRouter = express.Router();
const FileController = require('../controllers/fileController'); // Adjust path as needed
 // Adjust path as needed

// Assuming FileController is adjusted to be instantiated with necessary dependencies like gfs
// And assuming there's a way to access or pass an initialized instance of FileController or gfs here

module.exports = function(gfs) {
    const fileControllerInstance = new FileController(gfs);

    fileActionRouter.get('/detail', async (req, res) => {
        console.log('Received request for file action with query:', req.query);
        await fileControllerInstance.fetchFileDetailsAndRender(req, res);
    });

    return fileActionRouter;
};
