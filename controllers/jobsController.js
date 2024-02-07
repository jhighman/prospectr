const Job = require('../models/jobModel'); // Adjust path as needed

class JobsController {
    // Method to list jobs with console logging
    async listJobs(req, res) {
        console.log('Attempting to list jobs...');
        try {
            const jobs = await Job.find() || [];
            console.log(`${jobs.length} jobs found.`);
            res.render('jobs-list', { jobs }); // Ensure this EJS file exists in your views folder
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
            res.status(500).send('Error fetching jobs.');
        }
    }

    // Method to add a job with console logging
    async addJob(req, res) {
        console.log('Attempting to add a new job with the following data:', req.body);
        try {
            const { identifier, name, startTime, finishTime, exitStatus } = req.body;
            const newJob = new Job({ identifier, name, startTime, finishTime, exitStatus });
            const savedJob = await newJob.save();
            console.log('New job added successfully:', savedJob);
            res.redirect('/jobs'); // Redirect back to job listing after successful addition
        } catch (error) {
            console.error('Failed to add job:', error);
            res.status(500).send('Error adding job.');
        }
    }

    // Method to show job detail with console logging
    async showJobDetail(req, res) {
        console.log(`Attempting to fetch job detail for job ID: ${req.params.id}`);
        try {
            const job = await Job.findById(req.params.id);
            if (!job) {
                console.log(`Job not found with ID: ${req.params.id}`);
                return res.status(404).send('Job not found.');
            }
            console.log('Job detail fetched successfully:', job);
            res.render('job-detail', { job }); // job-detail.ejs should be the name of your job detail view file
        } catch (error) {
            console.error('Failed to fetch job detail:', error);
            res.status(500).send('Error fetching job detail.');
        }
    }
}

module.exports = new JobsController();
