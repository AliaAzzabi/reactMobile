//controllerdepartement.js
const Departement = require('./schemadepartment')


exports.createDepartement = async (req, res) => {
    try {
        const departement = new Departement(req.body);
        const savedDepartement = await departement.save();
        res.status(201).json(savedDepartement);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.getAllDepartements = async (req, res) => {
    try {
        const departements = await Departement.find();
        res.status(200).json(departements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getDepartementById = async (req, res) => {
    try {
        const departement = await Departement.findById(req.params.id);
        if (!departement) {
            return res.status(404).json({ message: "Département non trouvé" });
        }
        res.status(200).json(departement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.updateDepartement = async (req, res) => {
    try {
        const updatedDepartement = await Departement.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedDepartement) {
            return res.status(404).json({ message: "Département non trouvé" });
        }
        res.status(200).json(updatedDepartement);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.deleteDepartement = async (req, res) => {
    try {
        const deletedDepartement = await Departement.findByIdAndDelete(req.params.id);
        if (!deletedDepartement) {
            return res.status(404).json({ message: "Département non trouvé" });
        }
        res.status(200).json({ message: "Département supprimé avec succès" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
