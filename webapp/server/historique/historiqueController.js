const Historique = require('../historique/historiqueModel');
const Patient = require('../patient/patientshema');

// Créer un nouvel historique
const createHistorique = async (req, res) => {
    try {
        const { nomPrenom, description } = req.body;
        
        // Rechercher le patient par nom et prénom
        const patient = await Patient.findOne({ nomPrenom });
        if (!patient) {
            return res.status(404).json({ error: 'Patient non trouvé' });
        }
        
        // Créer l'historique avec l'ID du patient
        const historique = new Historique({ patient: patient._id, description });
        const savedHistorique = await historique.save();
        
        res.status(201).json(savedHistorique);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de l\'historique' });
    }
};
const getAllHistoriques = async (req, res) => {
    try {
        const historiques = await Historique.find().populate('patient');
        res.status(200).json(historiques);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des historiques' });
    }
};

// Supprimer un historique
const deleteHistorique = async (req, res) => {
    try {
        const historique = await Historique.findById(req.params.id);
        if (!historique) {
            return res.status(404).json({ error: 'Historique non trouvé' });
        }
        await historique.remove();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'historique' });
    }
};

module.exports = {
    createHistorique,
    getAllHistoriques,
    deleteHistorique
  };