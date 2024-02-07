const mongoose = require('mongoose');

class FileModel {
  constructor(gfs) {
    if (!gfs) {
      throw new Error("FileModel cannot be instantiated without a gfs instance.");
    }
    
    if (FileModel.instance) {
      return FileModel.instance;
    }

    this.gfs = gfs;
    FileModel.instance = this;
  }

// Assuming this is part of an Express route handler method in your controller
// In your FileModel
async listFiles() {
  if (!this.gfs) {
    throw new Error('gfs is not initialized.');
  }

  try {
    const files = await this.gfs.find().toArray();
    if (!files || files.length === 0) {
      return [];
    }

    const processedFiles = files.map(file => ({
      ...file,
      mimeType: file.metadata && file.metadata.mimeType ? file.metadata.mimeType : 'Unknown',
    })).sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());

    return processedFiles;
  } catch (err) {
    console.error('Error retrieving files:', err);
    throw err; // Let the controller handle the error
  }
}


  async findOneByFilename(filename) {
    try {
      const result = await this.gfs.find({ filename: filename }).toArray();
      return result[0] || null;
    } catch (err) {
      throw err;
    }
  }

  async removeByFilename(filename) {
    try {
      const file = await this.findOneByFilename(filename);
      if (!file) {
        throw new Error("File not found");
      }
      const objectId = new mongoose.Types.ObjectId(file._id);
      return new Promise((resolve, reject) => {
        this.gfs.delete(objectId, (err) => {
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

  async removeById(id) {
    try {
      const objectId = new mongoose.Types.ObjectId(id);
      return new Promise((resolve, reject) => {
        this.gfs.delete(objectId, (err) => {
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
}

// Wrapper function to manage the Singleton instance
function getFileModel(gfs) {
  return new FileModel(gfs);
}

module.exports = getFileModel;
