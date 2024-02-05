const mongoose = require('mongoose'); // Required for ObjectId conversion in removeById

function createFileModel(gfs) {
  return {

    listFiles: async function() {
      try {
        const files = await gfs.find().toArray();
        // Assuming you want to include MIME type in the file listing
        const filesWithMime = files.map(file => {
          return {
            ...file,
            mimeType: file.metadata ? file.metadata.mimeType : 'Unknown'
          };
        });
        return filesWithMime;
      } catch (err) {
        throw err;
      }
    },

    findOneByFilename: async function(filename) {
      try {
        const result = await gfs.find({ filename: filename }).toArray();
        return result[0] || null; // Return the first file matching the filename or null if not found
      } catch (err) {
        throw err;
      }
    },

    removeById: async function(id) {
      try {
        // Ensure the id is a valid ObjectId
        const objectId = new mongoose.Types.ObjectId(id);
        return new Promise((resolve, reject) => {
          gfs.delete(objectId, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve({ message: "File deleted successfully." });
            }
          });
        });
      } catch (err) {
        throw err;
      }
    }
  };
}

module.exports = createFileModel;
