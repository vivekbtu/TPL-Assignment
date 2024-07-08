const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  projectName: { 
    type: String,
    required: true
  },
  location: { 
    type: String,
    required: true
  },
  startDate: { 
    type: Number,
    required: true
  },
  endDate: {
    type: Number,
    required: true
  },
  priority: { 
    type: String, 
    enum: ["High", "Medium", "Low"], 
    required: true 
  },
  reason: {
    type: String,
    enum: ["Business", "Dealership", "Transport"],
    required: true,
  },
  type: {
    type: String,
    enum: ["Internal", "External", "Vendor"],
    required: true,
  },
  division: {
    type: String,
    enum: ["Pumps", "Filters", "Compressor", "Glass", "Water Heater"],
    required: true,
  },
  category: {
    type: String,
    enum: ["Quality A", "Quality B", "Quality C", "Quality D"],
    required: true,
  },
  department: {
    type: String,
    enum: ["Strategy", "Finance", "Quality", "Maintenance", "Stores"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Registered", "Running", "Cancelled", "Closed"],
    default: "Registered",
    required: true,
  },
});

const ProjectModel = mongoose.model("tplproject", projectSchema);

module.exports = { ProjectModel };
