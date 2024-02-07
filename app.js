require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mainController = require('./controllers/mainController');
// Import configureFileRoutes as a function, not as a router directly
const configureFileRoutes = require('./routes/fileRoutes'); // This now exports a function
const configureFileActionRoutes = require('./routes/fileActionRoutes'); // Import the new function

const jobsRoutes = require('./routes/jobsRoutes');
const { initializeDbConnection } = require('./config/db');
const { connectDb } = require('./config/db')


const app = express();

app.use(bodyParser.json());
app.set('view engine', 'ejs');

// Define a route for the main page
app.get('/', mainController.renderMainPage);

app.get('/test', (req, res) => {
    res.send('Test route is working');
});

async function startServer() {
    try {

        await connectDb();
        // Initialize DB connection before setting up routes
        const { gfs } = await initializeDbConnection();
        
        console.log('second connection for gfs initialized instance.');

        // Call configureFileRoutes with gfs to get the configured router
        const fileRouter = configureFileRoutes(gfs);
        app.use('/files', fileRouter); // Use the configured file routes
        const fileActionRouter = configureFileActionRoutes(gfs); // Initialize with gfs
        
        // In your file routes configuration or directly in app.js
        //app.use('/file-actions', fileActionRouter); // Use the new router with its base path
        // Setup other routes
        app.use('/jobs', jobsRoutes); // Use jobs routes

        // Start listening for requests after everything is initialized
        const port = process.env.PORT || 3000;
        app.listen(port, () => console.log(`Server running on port ${port}`));
    } catch (error) {
        console.error('Failed to start the server:', error);
        process.exit(1);
    }
}

startServer();
