// routes.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const User = require('./models/userModel');
const { upload } = require("./image/upload");
const { getSpecialty, addSpecialty, updateSpecialty, deleteSpecialty, getSpecialtyById } = require('./specialité/controllerspecialité');
const { getAide, addaides, updateAide, deleteAide, getAideById , GetAidesByMedecinId} = require('./aide/controlleraide');
const {getMedecins,  updateMedecin, deleteMedecin, getMedecinById, addmed, getAidesByMedecinId} = require ('./medecin/controllermedecin');
const  { getPatient, addPatient, updatePatient, deletePatient, gePatientById,StatistiquePatient , globalPatient} = require('./patient/controllerpatient');
const {createRendezVous, createRendezVousCin,getAllRendezVous, getRendezVousById,getRDVByCIN }= require("./rdv/rdvController")
const requireAuth = require('./middleware/requireAuth');
const router = express.Router();
const Aide = require('./aide/aideshema');

router.use(cors());

router.get("/getAllspecialities", getSpecialty);
router.post("/addspecialite", addSpecialty); 
router.put("/updateSpecialite/:id", updateSpecialty);
router.get("/getSpecialtyById/:id", getSpecialtyById);
router.delete("/deleteSpecialite/:id", deleteSpecialty);




router.get("/getAide", getAide);
router.post("/addaides",upload.single("image"), addaides); 
router.put("/updateAide/:id",upload.single("image"), updateAide);
router.get("/getAideById/:id", getAideById);
router.delete("/deleteAide/:id", deleteAide);
router.get("/getAidesByMedecinId/:medecinId", GetAidesByMedecinId);

router.post("/addmed",upload.single("image"), addmed);
router.get("/getMedecins", getMedecins);
router.get("/getAidesByMedecinId", getAidesByMedecinId);
//router.post("/addMedecin",upload.single("image"), addMedecin); 
router.put("/updateMedecin/:id",upload.single("image"), updateMedecin);
router.get("/getMedecinById/:id", getMedecinById);
router.delete("/deleteMedecin/:id", deleteMedecin);
router.use('/uploads', express.static(path.join(__dirname, 'uploads')));



router.get("/getPatient", getPatient);
router.post("/addPatient", addPatient); 
router.put("/updatePatient/:id", updatePatient);
router.get("/gePatientById/:id", gePatientById);
router.delete("/deletePatient/:id", deletePatient);




createRendezVousCin

router.post('/createRendezVousCin', createRendezVousCin);

router.post('/creerrendezvous', createRendezVous);
router.get('/getAllRendezVous',requireAuth, getAllRendezVous);
router.get('/getRendezVousById/:id', getRendezVousById);
router.get('/rdvByCIN', getRDVByCIN);






module.exports = { router };
