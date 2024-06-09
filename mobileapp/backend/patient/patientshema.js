const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    cin: String,
    nomPrenom: String,
    telephone: String,
    emaill: String,
    sexe: String,
    dateNaissance: Date,
    address:String,
    notifier: [String]
}, { timestamps: true }); 



module.exports = mongoose.model('Patient', patientSchema);










