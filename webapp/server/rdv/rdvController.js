const RendezVous = require('../rdv/rdvModel');
const Aide = require('../aide/aideshema'); 
const Patient = require('../patient/patientshema');
const Medecin = require('../medecin/medecinshema');
 
const createRendezVous = async (req, res) => {
  try {
    const { date, time, patientNom } = req.body;

    if (!date || !time) {
      return res.status(400).json({ error: 'La date et l\'heure du rendez-vous sont requises' });
    }

    const patient = await Patient.findOne({ nomPrenom: patientNom });
    if (!patient) {
      return res.status(404).json({ error: `Patient '${patientNom}' introuvable` });
    }

    let medecinId, secretaireId;

    const aide = await Aide.findOne({ user: req.user._id }).populate('medecin');
    if (aide) {
      medecinId = aide.medecin._id;
      secretaireId = aide._id;
    } else {
      const medecin = await Medecin.findOne({ user: req.user._id });
      if (medecin) {
        medecinId = medecin._id;
        const aideAssociated = await Aide.findOne({ medecin: medecin._id });
        secretaireId = aideAssociated ? aideAssociated._id : null; // Optional, depending on your schema
      } else {
        return res.status(404).json({ error: 'Utilisateur non autorisé pour créer un rendez-vous' });
      }
    }

    const rendezVous = new RendezVous({
      date,
      time,
      patient: patient._id,
      medecin: medecinId,
      secretaire: secretaireId
    });

    await rendezVous.save();

    res.status(201).json({ message: 'Rendez-vous créé avec succès', rendezVous });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la création du rendez-vous' });
  }
};



const getAllRendezVous = async (req, res) => {
  try {
    let medecinId;

    const aide = await Aide.findOne({ user: req.user._id });
    if (aide) {
      medecinId = aide.medecin;
    } else {
      const medecin = await Medecin.findOne({ user: req.user._id });
      if (!medecin) {
        return res.status(404).json({ error: 'utilisateur introuvable' });
      }
      medecinId = medecin._id;
    }

    const rendezVous = await RendezVous.find({ medecin: medecinId })
      .populate({
        path: 'patient',
        select: 'nomPrenom email telephone notifier' 
      })
      .populate('medecin') 
      .populate('secretaire'); 

    
    res.status(200).json(rendezVous);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur ' });
  }
};




const updateRendezVous = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time,patientNom } = req.body;

    if (!date || !time) {
      return res.status(400).json({ error: 'La date et l\'heure du rendez-vous sont requises' });
    }

    let rendezVous = await RendezVous.findById(id);
    if (!rendezVous) {
      return res.status(404).json({ error: 'Rendez-vous introuvable' });
    }

    const patient = await Patient.findOne({ nomPrenom: patientNom });
    if (!patient) {
      return res.status(404).json({ error: `Patient '${patientNom}' introuvable` });
    }

    const dateTime = new Date(date);
    const timeParts = time.split(':');
    dateTime.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]));

    rendezVous.date = dateTime;
    rendezVous.patient = patient._id;
    rendezVous.time = time;
    await rendezVous.save();

    res.status(200).json({ message: 'rendez-vous mis a jour avec succes', rendezVous });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'erreur ' });
  }
};

const deleteRendezVous = async (req, res) => {
  try {
    const { id } = req.params;

    await RendezVous.findByIdAndDelete(id);

    res.status(200).json({ message: 'rendez-vous supprimé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'erreur ' });
  }
};

const getRendezVousById = async (req, res) => {
  try {
    const { id } = req.params;

    
    const rendezVous = await RendezVous.findById(id)
      .populate('patient') 
      .populate('medecin') 
      .populate('secretaire'); 

    if (!rendezVous) {
      return res.status(404).json({ error: 'rendez-vous introuvable' });
    }

    res.status(200).json(rendezVous);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'erreur ' });
  }
};

const getAllRendezVousAjourdhui = async (req, res) => {
  try {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const rendezVousToday = await RendezVous.find({
      date: { $gte: startOfToday, $lt: endOfToday }
    }).populate('patient');

    return rendezVousToday;
  } catch (err) {
    console.error(err);
    throw new Error('Erreur lors de la récupération des rendez-vous d\'aujourd\'hui');
  }
};
const rendezvousParJour = async (req, res) => {
  try {
    const rdvparjour = await RendezVous.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%m-%d-%Y', date: '$date' } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    const statistics = {};
    rdvparjour.forEach(appointment => {
      statistics[appointment._id] = appointment.count;
    });

    res.json(statistics);
  } catch (error) {
    console.error('Error fetching appointment statistics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const getRendezVousByPatientId = async (req, res) => {
  try {
    const patientId = req.params.patientId;

    const rendezVous = await RendezVous.find({ patient: patientId })
    .populate({
      path: 'patient',
      select: 'nomPrenom' 
    })
    .populate({
      path: 'medecin',
      select: 'nomPrenom',
      populate: {
        path: 'user',
        select: 'nomPrenom' // Sélectionnez les champs que vous souhaitez afficher
      }
    })
      .populate('secretaire');

    res.status(200).json(rendezVous);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération des rendez-vous du patient' });
  }
};

module.exports = {
  createRendezVous,
  getAllRendezVous,
  updateRendezVous,
  deleteRendezVous,
  getRendezVousById,
  getAllRendezVousAjourdhui,
  rendezvousParJour,
  getRendezVousByPatientId
};

