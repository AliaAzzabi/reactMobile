const Historique = require('../historique/historiqueModel');
const Patient = require('../patient/patientshema');
const Aide = require('../aide/aideshema');


const createHistorique = async (req, res) => {
    try {
      const { patientId, aideId, description } = req.body;
      
      const patient = await Patient.findById(patientId);
      if (!patient) {
        return res.status(404).json({ error: 'Patient non trouvé' });
      }

      const aide = aideId;
  
      const historique = new Historique({ 
        patient: patient._id, 
        aide: aide, 
        description 
      });
      const savedHistorique = await historique.save();
      
      res.status(201).json(savedHistorique);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la création de l\'historique' });
    }
  };
  
  
  

const getAllHistoriques = async (req, res) => {
    try {
        const historiques = await Historique.find()
            .populate('patient')
            .populate({
                path: 'aide',
                populate: { path: 'user', select: 'nomPrenom' } 
            });
        res.status(200).json(historiques);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des historiques' });
    }
};


const deleteHistorique = async (req, res) => {
    try {
        const deletedHistorique = await Historique.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: 'Aide supprimé avec succès', data: deletedHistorique });
    } catch (err) {
        res.status(400).send({ error: `Erreur lors de la suppression du Aide : ${err.message}` });
    }
};
module.exports = {
    createHistorique,
    getAllHistoriques,
    deleteHistorique
};
