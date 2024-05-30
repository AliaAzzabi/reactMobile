const mongoose = require('mongoose');

const listeAttenteSchema = new mongoose.Schema({
  nomPrenom: {
    type: String,
    required: true
  },
  
}, { timestamps: true });

const ListeAttente = mongoose.model('ListeAttente', listeAttenteSchema);

module.exports = ListeAttente;
