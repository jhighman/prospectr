
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { initializeDbConnection } = require('./config/db');
const createFileModel = require('./models/file');
const FileController = require('./controllers/fileController');



const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.set('view engine', 'ejs');


// Placeholder for the file controller to be set after DB initialization
let fileController;


app.post('/upload', (req, res) => fileController.uploadFile(req, res));


// Define the route. Actual handling will defer to the controller which will be initialized later.
app.get("/", async (req, res) => {
  if (!fileController) {
    // If the fileController isn't ready yet, send an appropriate response
    return res.status(503).send("Service unavailable. Please try again later.");
  }

  try {
    // Assuming fileController has a method to get the fileModel and listFiles
    const files = await fileController.fileModel.listFiles();
    // Render the 'files' view, passing the files array to the template
    res.render('files', { files });
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).send("Server error while accessing files");
  }
});

app.get('/file-detail', async (req, res) => {
  await fileController.fetchFileDetailsAndRender(req, res);
});


// Adjust route for viewing file details to use filename
app.get('/files/:filename', (req, res) => {
  res.redirect(`/file-detail?action=view&filename=${encodeURIComponent(req.params.filename)}`);
});

// Adjust route for the delete confirmation page to use filename
app.get('/files/delete/:filename', (req, res) => {
  res.redirect(`/file-detail?action=delete&filename=${encodeURIComponent(req.params.filename)}`);
});



async function startServer() {
  try {
    const { conn, gfs } = await initializeDbConnection();
    const fileModel = createFileModel(gfs); // Instantiate the fileModel with gfs
    fileController = new FileController(fileModel); // Now instantiate the controller with fileModel

    app.listen(port, () => console.log(`App listening on port ${port}!`));
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    // It's a good idea to handle initialization failures, possibly with a retry logic or a graceful shutdown.
    process.exit(1);
  }
}

startServer();
