

const Specialtie = require('./specialitiesSchema');
const Medecin= require('../medecin/medecinshema');

const getSpecialty = async (req, res) => {
    try {
        const specialties = await Specialtie.find({}); 
        res.send(specialties);
    } catch (err) {
        console.error("Erreur lors de la recherche des Specialties :", err);
        res.status(500).send("Erreur serveur");
    }
};

const getSpecialtyById = async (req, res) => {
    try {
        const specialtie = await Specialtie.findById(req.params.id);
        if (!specialtie) {
            return res.status(404).json({ message: "Specialtie non trouvé" });
        }
        res.status(200).json(specialtie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

  
const addSpecialty = async (req, res) => {
    try {
        const { nom, description } = req.body;

        const existingSpecialty = await Specialtie.findOne({ nom: nom });
        if (existingSpecialty) {
            return res.status(400).json({ error: "Cette spécialité existe déjà." });
        }

        const newSpecialty = new Specialtie({ nom, description, isSelected: req.body.isSelected || true });
        const savedSpecialty = await newSpecialty.save();

        res.status(201).json({
            nom: savedSpecialty.nom,
            description: savedSpecialty.description,
            isSelected: savedSpecialty.isSelected,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};




const updateSpecialty = async (req, res) => {
    const { nom, description, isSelected } = req.body;
    try {
        const updatedSpecialty = await Specialtie.findByIdAndUpdate(req.params.id, { nom, description, isSelected }, { new: true });
        res.status(200).send({ message: 'Spécialité mise à jour avec succès', data: updatedSpecialty });
    } catch (err) {
        res.status(400).send({ error: `Erreur lors de la mise à jour de la spécialité: ${err.message}` });
    }
};


const deleteSpecialty = async (req, res) => {
    try {
        const medecinsUsingSpecialty = await Medecin.find({ specialite: req.params.id });

        if (medecinsUsingSpecialty.length > 0) {
            return res.status(500).send({ error: "Cette spécialité est utilisée par au moins un médecin. Veuillez supprimer la référence dans la table des médecins avant de la supprimer." });
        }

        const deletedSpecialty = await Specialtie.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: 'Spécialité supprimée avec succès', data: deletedSpecialty });
    } catch (err) {
        res.status(400).send({ error: `Erreur lors de la suppression de la spécialité: ${err.message}` });
    }
};


module.exports = { getSpecialty, addSpecialty, updateSpecialty, deleteSpecialty, getSpecialtyById };
