// Existing imports
const mongoose = require("mongoose");
const GridFsStorage = require("multer-gridfs-storage");
const crypto = require("crypto");
const path = require("path");


// Modified connection setup to use a function
function initializeDbConnection() {
  return new Promise((resolve, reject) => {
    const conn = mongoose.createConnection(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    conn.once("open", () => {
      const gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "uploads"
      });
      console.log('MongoDB Connected and GridFS Initialized');
      resolve({ conn, gfs }); // Resolve the promise with the connection and gfs
    }).on('error', (err) => {
      reject(err); // Reject the promise on error
    });
  });
}

// Export the initialize function instead of the raw objects
module.exports = { initializeDbConnection };
