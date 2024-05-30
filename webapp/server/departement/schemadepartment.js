//shemadepartement.js
const mongoose = require('mongoose');

const DepartementSchema = new mongoose.Schema({
    nom: String,
    nombreEmployes: String,
    localisation: String,
    responsable: String,
    dateCreation: { type: Date, default: Date.now },
    description: String,

});

module.exports = mongoose.model('Departement', DepartementSchema);
