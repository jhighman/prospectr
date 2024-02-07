const mongoose = require("mongoose");

// Function to just connect to MongoDB with Mongoose's default connection
async function connectDb() {
    try {
        await mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected successfully with Mongoose default connection.');
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        throw error; // Ensures that the application handles this error appropriately
    }
}

// Function to initialize the GridFS connection specifically
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
            console.log('GridFS Initialized');
            resolve({ conn, gfs }); // Resolves with both the connection and gfs object
        }).on('error', (err) => {
            console.error("Failed to initialize GridFS:", err);
            reject(err);
        });
    });
}

// Export both the connectDb and initializeDbConnection functions
module.exports = { connectDb, initializeDbConnection };
