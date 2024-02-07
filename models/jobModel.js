const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  identifier: String,
  name: String,
  startTime: Date,
  finishTime: Date,
  exitStatus: String,
  // Additional fields as needed
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
