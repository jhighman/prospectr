require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { initializeDbConnection } = require('./config/db');
const createFileModel = require('./models/file');
const FileController = require('./controllers/fileController');
const fileRoutes = require('./routes/fileRoutes');
const app = express();

app.use(bodyParser.json());
app.set('view engine', 'ejs');

let fileController; // Placeholder for the file controller

// Define the middleware to ensure fileController is initialized
function ensureFileControllerInitialized(req, res, next) {
    if (!fileController) {
        return res.status(503).send("Service unavailable. The file controller is not initialized.");
    }
    req.fileController = fileController; // Make fileController available in the request object
    next();
}

// Use the middleware globally or before specific routes that require the fileController
app.use(ensureFileControllerInitialized);

// Then, set up your routes
app.use('/', fileRoutes);

async function startServer() {
    try {
        const { gfs } = await initializeDbConnection();
        const fileModel = createFileModel(gfs);
        fileController = new FileController(fileModel); // Initialize fileController after DB connection

        const port = process.env.PORT || 3000;
        app.listen(port, () => console.log(`Server running on port ${port}`));
    } catch (error) {
        console.error('Failed to start the server:', error);
        process.exit(1);
    }
}

startServer();
