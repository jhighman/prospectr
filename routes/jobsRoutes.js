const express = require('express');
const router = express.Router();
const jobsController = require("../controllers/jobsController");

// Route for listing all jobs with rendering and error handling
router.get('/', async (req, res) => {
    try {
        await jobsController.listJobs(req, res);
    } catch (error) {
        console.error('Error listing jobs:', error);
        res.status(500).send('Server error while fetching jobs.');
    }
});

// Route for adding a new job via POST request
router.post('/add', async (req, res) => {
    try {
        await jobsController.addJob(req, res);
    } catch (error) {
        console.error('Error adding job:', error);
        res.status(500).send('Server error while adding job.');
    }
});

// Route for viewing job detail
router.get('/:id', async (req, res) => {
    try {
        await jobsController.showJobDetail(req, res);
    } catch (error) {
        console.error('Error fetching job detail:', error);
        // Redirect back to jobs list or send a user-friendly error message
        res.status(404).send('Job not found.');
    }
});

module.exports = router;
