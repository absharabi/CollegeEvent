const mongoose = require("mongoose");
const EventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  location: String,
  category: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
module.exports = mongoose.model("Event", EventSchema);
