const GridFsStorage = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');
const multer = require('multer');
const getFileModel = require('../models/file'); // Adjust the import path as necessary

class FileController {
    constructor(gfs) {
        if (!gfs) {
            throw new Error("FileController requires a gfs instance.");
        }
        if (FileController.instance) {
            return FileController.instance;
        }

        // Initialize GridFsStorage with the provided gfs instance
        const storage = new GridFsStorage({
            url: process.env.DB_URI,
            options: { useNewUrlParser: true, useUnifiedTopology: true },
            file: (req, file) => {
                return new Promise((resolve, reject) => {
                    crypto.randomBytes(16, (err, buf) => {
                        if (err) {
                            return reject(err);
                        }
                        const filename = buf.toString('hex') + path.extname(file.originalname);
                        const metadata = {
                            mimeType: file.mimetype,
                            originalName: file.originalname,
                            size: file.size,
                            uploadDate: new Date(),
                            // Additional metadata can be added here
                        };

                        if (file.mimetype === 'text/csv') {
                            metadata.processingState = 'pending';
                        }

                        const fileInfo = {
                            filename: filename,
                            bucketName: 'uploads',
                            metadata: metadata
                        };
                        resolve(fileInfo);
                    });
                });
            }
        });

        this.upload = multer({ storage });
        this.fileModel = getFileModel(gfs);

        FileController.instance = this;
    }

    async listFiles(req, res) {
        try {
          const files = await this.fileModel.listFiles();
          res.render('files', { files }); // Assuming you've set up EJS or another templating engine
        } catch (error) {
          console.error('Error listing files:', error);
          res.status(500).send("Server error while accessing files");
        }
      }

      uploadFile(req, res) {
        console.log("Attempting to upload file...");
    
        this.upload.single('file')(req, res, async (err) => {
          if (err) {
            console.error("Error during file upload:", err);
            return res.status(500).send("Error uploading file.");
          }
    
          console.log("File uploaded successfully.");
          console.log("Uploaded file details:", req.file); // Log the file details provided by multer
    
          // Redirect or inform of success
          res.redirect('/files'); // Or display a success message
        });
      }

      async deleteFile(req, res) {
        try {
            // Check both URL params and query strings for 'filename'
            const filename = req.params.filename || req.query.filename;
    
            if (!filename) {
                console.error('No filename provided for deletion.');
                return res.status(400).send("Filename required for deletion.");
            }
    
            console.log(`Attempting to delete file: ${filename}`);
            
            // Ensure filename is properly decoded
            const decodedFilename = decodeURIComponent(filename);
            await this.fileModel.removeByFilename(decodedFilename);
    
            console.log(`File ${decodedFilename} deleted successfully.`);
            // Redirect back to the files list, or send a success response
            res.redirect('/files'); // Adjusted to redirect to '/files' assuming that's the listing page
        } catch (error) {
            console.error('Error deleting file:', error);
            res.status(500).send("Server error while deleting file.");
        }
    }
    

      async fetchFileDetailsAndRender(req, res) {
        // Default action to 'view' if not specified in either path or query parameters
        const action = req.params.action || req.query.action || 'view';
        let filename = req.params.filename || req.query.filename;
    
        console.log(`Requested action: ${action}, filename: ${filename}`);
    
        // Ensure filename is properly decoded
        filename = decodeURIComponent(filename);
        console.log(`Decoded filename: ${filename}`);
    
        try {
            // Attempt to find the file by its filename
            const file = await this.fileModel.findOneByFilename(filename);
            console.log(file ? `File found: ${file.filename}` : 'File not found.');
    
            if (!file) {
                console.log('No file matches the provided filename.');
                return res.status(404).send("File not found.");
            }
    
            // Log the action to be taken based on the request
            console.log(`Performing action: ${action}`);
    
            // Decide what to render based on the action
            switch (action) {
                case 'view':
                    console.log('Rendering file for viewing.');
                    res.render('file-detail', { action: 'view', file });
                    break;
                case 'delete':
                    console.log('Rendering delete confirmation for file.');
                    // For delete, just pass the filename to the form action URL
                    res.render('file-detail', { action: 'delete', file: { ...file, fileId: encodeURIComponent(file.filename) } });
                    break;
                default:
                    console.log(`Invalid action requested: ${action}. Defaulting to 'view'.`);
                    res.render('file-detail', { action: 'view', file });
            }
        } catch (error) {
            console.error('Error occurred while fetching file details:', error);
            res.status(500).send("Server error while accessing file details.");
        }
    }
    
    


      async viewFile(req, res) {
        try {
          const filename = req.params.filename; // Assuming the filename is passed as a URL parameter
          const file = await this.fileModel.findOneByFilename(filename);
          if (!file) {
            return res.status(404).send("File not found.");
          }
          // For viewing, you might want to stream the file directly or provide a download link
          // This example simply sends a JSON response with file details
          res.send(file);
        } catch (error) {
          console.error('Error viewing file:', error);
          res.status(500).send("Server error while accessing file.");
        }
      }
    // Your existing methods remain unchanged...
}

// Adjust how you export the FileController
// Instead of exporting an instance directly, export the class itself to allow initialization with gfs
module.exports = FileController;
