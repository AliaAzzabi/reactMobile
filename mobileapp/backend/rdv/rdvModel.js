const mongoose = require('mongoose');

const rendezVousSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String, 
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  medecin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medecin',
    required: true
  },
  status: {
    type: String,
    required: true,
    default: 'En attente' 
  },
  secretaire: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Aide',
    required: true
  }],
});

const DemandeRendezVous = mongoose.model('DemandeRendezVous', rendezVousSchema);

module.exports = DemandeRendezVous;
