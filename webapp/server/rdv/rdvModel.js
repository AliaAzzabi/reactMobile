const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema({
  text: { type: String, required: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  addedAt: { type: Date, default: Date.now }
});

const rendezVousSchema = new Schema({
  date: { type: Date, required: true },
  time: { type: String, required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  medecin: { type: mongoose.Schema.Types.ObjectId, ref: 'Medecin', required: true },
  secretaire: { type: mongoose.Schema.Types.ObjectId, ref: 'Aide', required: true },
  notes: [noteSchema]
});

const RendezVous = mongoose.model('RendezVous', rendezVousSchema);
module.exports = RendezVous;