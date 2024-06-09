const DemandeRendezVous = require('../demandeRDV/rdvModel');
const Aide = require('../aide/aideshema'); 
const Patient = require('../patient/patientshema');
const Medecin = require('../medecin/medecinshema');
const RendezVous = require('../rdv/rdvModel');

const getAlldemandRendezVous = async (req, res) => {
  try {
    const aide = await Aide.findOne({ user: req.user._id });
    if (!aide) {
      return res.status(404).json({ error: 'Aide introuvable' });
    }

    const medecinId = aide.medecin;

    // Obtenir la date et l'heure actuelles
    const now = new Date();

    // Requête pour les demandes de rendez-vous à partir de maintenant pour le médecin
    const demanderendezVous = await DemandeRendezVous.find({
      medecin: medecinId,
      date: {
        $gte: now // Utiliser la date et l'heure actuelles comme critère
      }
    })
      .populate({
        path: 'patient',
        select: 'cin nomPrenom email telephone'
      })
      .populate('medecin')
      .populate('secretaire');

    res.status(200).json(demanderendezVous);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération des demandes de rendez-vous' });
  }
};
const deleteDemandeRendezVous = async (req, res) => {
  try {
    const { id } = req.params;

    await RendezVous.findByIdAndDelete(id);

    res.status(200).json({ message: 'rendez-vous supprimé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la suppression du rendez-vous' });
  }
};

const updateDemandeRendezVousStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log(`Received request to update status for ${id} to ${status}`); // Debugging line

  try {
    const demandeRendezVous = await DemandeRendezVous.findById(id);
    if (!demandeRendezVous) {
      return res.status(404).json({ message: 'Demande de rendez-vous non trouvée' });
    }

    demandeRendezVous.status = status;
    await demandeRendezVous.save();

    if (status === 'Accepté') {
      const newRendezVous = new RendezVous({
        date: demandeRendezVous.date,
        time: demandeRendezVous.time,
        patient: demandeRendezVous.patient,
        medecin: demandeRendezVous.medecin,
        secretaire: demandeRendezVous.secretaire[0] 
      });
      await newRendezVous.save();
    }

    res.status(200).json({ message: 'Statut mis à jour avec succès', demandeRendezVous });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du statut' });
  }
};



module.exports = {
  getAlldemandRendezVous,
  deleteDemandeRendezVous,
  updateDemandeRendezVousStatus,
};
