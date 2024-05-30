const DemandeRendezVous = require('../rdv/rdvModel');
const Aide = require('../aide/aideshema'); 
const Patient = require('../patient/patientshema');
const Medecin = require('../medecin/medecinshema');
const multer = require('multer');
const User = require("../models/userModel");
const Image = require("../image/imagemodel");

const createRendezVous = async (req, res) => {
  try {
    const { date, time, patient, medecin, secretaire, status } = req.body;

    if (!date || !time || !patient || !medecin || !secretaire) {
      return res.status(400).json({ error: 'Toutes les informations du rendez-vous sont requises' });
    }

    // Ajouter la vérification du format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(patient.emaill)) {
      return res.status(402).json({ error: 'Format d\'email invalide' });
    }

    let existingPatientByCIN = await Patient.findOne({ cin: patient.cin });
    if (existingPatientByCIN) {
      return res.status(400).json({ error: 'Patient avec ce CIN existe déjà' });
    }

    let existingPatientByEmail = await Patient.findOne({ emaill: patient.emaill });
    if (existingPatientByEmail) {
      return res.status(401).json({ error: 'Patient avec ce même EMAIL existe déjà' });
    }

    let existingPatient = await Patient.findOne({ cin: patient.cin });
    if (!existingPatient) {
      const newPatient = new Patient({
        cin: patient.cin,
        nomPrenom: patient.nomPrenom,
        sexe: patient.sexe,
        telephone: patient.telephone,
        emaill: patient.emaill,
        dateNaissance: patient.dateNaissance,
        address: patient.address,
        notifier: patient.notifier
      });

      existingPatient = await newPatient.save();
    }

    const demanderendezVous = new DemandeRendezVous({
      date,
      time,
      patient: existingPatient._id,
      medecin,
      secretaire,
      status: status || 'En attente' 
    });

    await demanderendezVous.save();

    res.status(201).json({ message: 'Rendez-vous créé avec succès', demanderendezVous });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

const createRendezVousCin = async (req, res) => {
  try {
    const { date, time, cin, medecin, secretaire, status } = req.body;

    let existingPatientByCIN = await Patient.findOne({ cin });

    if (existingPatientByCIN) {
      const demanderendezVous = new DemandeRendezVous({
        date,
        time,
        patient: existingPatientByCIN._id,
        medecin,
        secretaire, 
        status: status || 'En attente' 
      });

      await demanderendezVous.save();

      return res.status(201).json({ message: 'Rendez-vous créé avec succès', demanderendezVous });
    } else {
      return res.status(404).json({ error: 'Patient avec ce CIN n\'existe pas' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
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

    const demanderendezVous = await DemandeRendezVous.find({ medecin: medecinId })
      .populate({
        path: 'patient',
        select: 'nomPrenom email telephone notifier' 
      })
      .populate({
        path: 'medecin',
        populate: {
          path: 'user',
          select: 'nomPrenom telephone email dateAdhesion dateNaissance adresse sexe role cin image',
          populate: {
            path: 'image',
            select: 'filepath'
          }
        }
      })      .populate('secretaire'); 

    res.status(200).json(demanderendezVous);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur ' });
  }
};

const getRendezVousById = async (req, res) => {
  try {
    const { id } = req.params;

    const rendezVous = await DemandeRendezVous.findById(id)
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

const getRDVByCIN = async (req, res) => {
  try {
    const { cin } = req.query; // Accessing the cin parameter correctly
    if (!cin) {
      return res.status(400).json({ error: 'CIN is required' });
    }
    const patient = await Patient.findOne({ cin });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    const appointments = await DemandeRendezVous.find({ patient: patient._id })
      .populate({
        path: 'patient',
        select: 'cin nomPrenom email telephone notifier' 
      })
      .populate({
        path: 'medecin',
        populate: {
          path: 'user',
          select: 'nomPrenom image',
          populate: {
            path: 'image',
            select: 'filepath'
          }
        }
      })
      .populate('secretaire');
     
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createRendezVous,
  getAllRendezVous,
  getRDVByCIN,
  getRendezVousById,
  createRendezVousCin,
};
