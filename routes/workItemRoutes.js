const express = require('express');
const router = express.Router();
const workItemsController = require('../controllers/workItemController');

router.post('/add', workItemsController.createWorkItem);
router.get('/', workItemsController.listWorkItems);
router.get('/edit/:workflowId', workItemsController.getWorkItem);
router.put('/edit/:workflowId', workItemsController.updateWorkItem);
router.delete('/delete/:workflowId', workItemsController.deleteWorkItem);
    
module.exports = router;
