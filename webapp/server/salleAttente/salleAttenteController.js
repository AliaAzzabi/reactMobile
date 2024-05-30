const RendezVous = require('../rdv/rdvModel');
const SalleAttente = require('../salleAttente/salleAttenteModel');

const enregistrerPatientSalleAttente = async (req, res) => {
  try {
    const { patientId ,nom } = req.body;

    const rendezVousAujourdhui = await RendezVous.find({ date: { $gte: new Date().setHours(0, 0, 0, 0), $lt: new Date().setHours(23, 59, 59, 999) } });

    const patientRendezVousAujourdhui = rendezVousAujourdhui.find(rendezVous => rendezVous.patient.toString() === patientId);

    if (!patientRendezVousAujourdhui) {
      return res.status(404).json({ message: "Le patient n'a pas de rendez-vous aujourd'hui." });
    }

    const salleAttente = new SalleAttente({ patient: patientId ,nomPrenom:nom});
    await salleAttente.save();

    res.status(200).json({ message: "Le patient a été enregistré dans la salle d'attente avec succès." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de l'enregistrement du patient dans la salle d'attente." });
  }
};

module.exports = {
  enregistrerPatientSalleAttente,
};
