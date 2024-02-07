const mongoose = require("mongoose");

// Counter Schema to keep track of the workflowId sequence
const CounterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  seq: {
    type: Number,
    default: 0
  }
});

const Counter = mongoose.model('Counter', CounterSchema);

// Dates Sub-Schema
const DatesSchema = new mongoose.Schema({
  startedDate: {
    type: Date,
  },
  completedDate: {
    type: Date,
  },
  publishedDate: {
    type: Date,
  },
  archivedDate: {
    type: Date,
  },
});

// WorkItem Schema
const WorkItemSchema = new mongoose.Schema({
  workflowId: {
    type: Number
  },
  status: {
    type: String,
    required: true,
    trim: true,
    default: "notStarted",
  },
  referenceType: {
    type: String,
    trim: true,
    default: "claim",
  },
  dates: DatesSchema,
  isStarted: {
    type: Boolean,
    default: false
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isArchived: {
    type: Boolean,
    default: false
  }
});

WorkItemSchema.pre('save', async function(next) {
  const doc = this;

  // Initialize dates as an empty object if it doesn't exist
  if (!doc.dates) {
    doc.dates = {};
  }

  // Update boolean fields based on the presence of date fields
  doc.isStarted = !!doc.dates.startedDate;
  doc.isCompleted = !!doc.dates.completedDate;
  doc.isPublished = !!doc.dates.publishedDate;
  doc.isArchived = !!doc.dates.archivedDate;

  // Auto-increment workflowId for new documents if workflowId is not set
  if (doc.isNew && doc.workflowId == null) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'workflowId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      doc.workflowId = counter.seq;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});


const WorkItem = mongoose.model("WorkItem", WorkItemSchema);

module.exports = WorkItem;