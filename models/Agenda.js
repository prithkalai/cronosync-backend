const mongoose = require("mongoose");
const agendaJobModel = mongoose.model(
  "agendaJobs",
  new mongoose.Schema({}, { strict: false, collection: "agendaJobs" })
);

module.exports.agendaJobModel = agendaJobModel;
