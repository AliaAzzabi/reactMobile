// specialitySchema.js
const mongoose = require("mongoose");

const SpecialtiesSchema = new mongoose.Schema({
    nom: String,
    description: String,
    isSelected: Boolean,
});

module.exports = mongoose.model("Specialtie", SpecialtiesSchema);
