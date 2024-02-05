const GridFsStorage = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');

const multer = require('multer');
// Create storage engine
const storage = new GridFsStorage({
  url: process.env.DB_URI,
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
          // Additional metadata
        };

        // Conditionally add the processingState tag for CSV files
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
const upload = multer({ storage });

class FileController {
  constructor(fileModel) {
    this.fileModel = fileModel;
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

    upload.single('file')(req, res, async (err) => {
      if (err) {
        console.error("Error during file upload:", err);
        return res.status(500).send("Error uploading file.");
      }

      console.log("File uploaded successfully.");
      console.log("Uploaded file details:", req.file); // Log the file details provided by multer

      // Redirect or inform of success
      res.redirect('/'); // Or display a success message
    });
  }

  async deleteFile(req, res) {
    try {
      const fileId = req.params.id; // Assuming the file ID is passed as a URL parameter
      await this.fileModel.removeById(fileId);
      res.redirect('/'); // Redirect back to the files list, or send a success response
    } catch (error) {
      console.error('Error deleting file:', error);
      res.status(500).send("Server error while deleting file.");
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
}

module.exports = FileController;
