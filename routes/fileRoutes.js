const express = require('express');
const FileController = require('../controllers/fileController'); // Adjust path as needed

// Function to configure and return the router
function configureFileRoutes(gfs) {
    const router = express.Router();

    if (!gfs) {
        throw new Error("configureFileRoutes requires a valid gfs instance.");
    }

    // Instantiate the FileController with gfs
    const fileControllerInstance = new FileController(gfs);


        // Define the route for fetching file details and rendering
        router.get('/file-detail', (req, res) => {
            console.log(`********  Received request for file details with query: ${JSON.stringify(req.query)}`);
            fileControllerInstance.fetchFileDetailsAndRender(req, res).catch(error => {
                console.error('Error fetching file details:', error);
                res.status(500).send("Server error while accessing file details");
            });
        });

    // Define the route for uploading files
    router.post('/upload', (req, res) => {
        console.log("Received request to upload file.");
        fileControllerInstance.uploadFile(req, res);
    });



    router.post('/delete/:filename', async (req, res) => {
        // Extract filename from URL params and decode it
        const filename = decodeURIComponent(req.params.filename);
        console.log("Received request to delete file.");
        fileControllerInstance.deleteFile(req,res);
    });

    // Define the route for listing all files
    router.get("/", (req, res) => {
        console.log("Received request to list files.");
        fileControllerInstance.listFiles(req, res).catch(error => {
            console.error('Error listing files:', error);
            res.status(500).send("Server error while accessing files");
        });
    });



    // Define the route for redirecting to view a specific file by filename
    router.get('/:filename', (req, res) => {
        console.log(`Received redirect request to view file: ${req.params.filename}`);
        res.redirect(`/file-detail?action=view&filename=${encodeURIComponent(req.params.filename)}`);
    });




    return router;
}

module.exports = configureFileRoutes;
