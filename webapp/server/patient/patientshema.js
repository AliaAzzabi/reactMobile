const mongoose = require('mongoose');
const User = require("../models/userModel");

const patientSchema = new mongoose.Schema({
    cin: String,
    nomPrenom: String,
    telephone: String,
    email: String,
    sexe: String,
    dateNaissance: Date,
    notifier: [String]
}, { timestamps: true }); 

patientSchema.post('findOneAndDelete', async function(Patient) {
    try {
        const userId = Patient.user;

        if (userId) {
            await User.findByIdAndDelete(userId);
        }
    } catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur associé:", error);
    }
});

module.exports = mongoose.model('Patient', patientSchema);
