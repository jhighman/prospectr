const WorkItem = require('../models/workItemModel'); // Adjust the path as needed

class WorkItemsController {
    // Create a new work item
    async createWorkItem(req, res) {
        try {
            const newWorkItem = new WorkItem(req.body);
            const savedWorkItem = await newWorkItem.save();
            res.status(201).json(savedWorkItem);
        } catch (error) {
            console.error('Failed to create work item:', error);
            res.status(500).send('Error creating work item.');
        }
    }

    async addWorkItem(req, res) {
        try {
            const newWorkItem = new WorkItem(req.body);
            await newWorkItem.save();
            // Redirect back to the list and form page to see the new work item added
            res.redirect('/workitems');
        } catch (error) {
            console.error('Failed to add work item:', error);
            // Optionally, render the list and form page with an error message
            res.status(500).render('workItem-list', { error: 'Failed to add work item.' });
        }
    }

    // Get a list of all work items
    async listWorkItems(req, res) {
        try {
            const workItems = await WorkItem.find();
            res.render('workItem-list', { workItems });
        } catch (error) {
            console.error('Failed to fetch work items:', error);
            res.status(500).send('Error fetching work items.');
        }
    }

    

    // Get a single work item by workflowId
    async getWorkItem(req, res) {
        try {
            const workItem = await WorkItem.findOne({ workflowId: req.params.workflowId });
            if (!workItem) {
                return res.status(404).send('Work item not found.');
            }
            // Use res.render() to display the workItem-detail.ejs view, passing the workItem as data
            res.render('workItem-detail', { workItem });
        } catch (error) {
            console.error('Failed to fetch work item:', error);
            res.status(500).send('Error fetching work item.');
        }
    }
    
    // Update a work item by workflowId
    async updateWorkItem(req, res) {
        console.log('Attempting to update work item...');
        console.log('Workflow ID:', req.params.workflowId);
        console.log('Update data:', req.body);
    
        try {
            const updatedWorkItem = await WorkItem.findOneAndUpdate(
                { workflowId: req.params.workflowId },
                req.body,
                { new: true }
            );
    
            if (!updatedWorkItem) {
                console.log('Work item not found with Workflow ID:', req.params.workflowId);
                return res.status(404).send('Work item not found.');
            }
    
            console.log('Successfully updated work item:', updatedWorkItem);
            res.status(200).json(updatedWorkItem);
        } catch (error) {
            console.error('Failed to update work item:', error);
            res.status(500).send('Error updating work item.');
        }
    }
    

    // Delete a work item by workflowId
    async deleteWorkItem(req, res) {
        try {
            const deletedWorkItem = await WorkItem.findOneAndDelete({ workflowId: req.params.workflowId });
            if (!deletedWorkItem) {
                return res.status(404).send('Work item not found.');
            }
            res.status(200).send('Work item successfully deleted.');
        } catch (error) {
            console.error('Failed to delete work item:', error);
            res.status(500).send('Error deleting work item.');
        }
    }
}

module.exports = new WorkItemsController();
