// routes.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const User = require('./models/userModel');
const Image = require('./image/imagemodel');
const { upload } = require("./image/upload");
const {createDepartement, getAllDepartements, updateDepartement, deleteDepartement,getDepartementById} = require ('./departement/controllerdepartement');
const { getSpecialty, addSpecialty, updateSpecialty, deleteSpecialty, getSpecialtyById } = require('./specialité/controllerspecialité');
const { getAide, addaides, updateAide, deleteAide, getAideById ,checkAideEmailExistence, GetAidesByMedecinId} = require('./aide/controlleraide');
const {getMedecins,  updateMedecin, deleteMedecin, getMedecinById, addmed} = require ('./medecin/controllermedecin');
const { getAdmin, addAdmin, updateAdmin, deleteAdmin, getAdminById } = require ('./admin/controlleradmin');
const  { getPatient, addPatient, updatePatient, deletePatient, gePatientById,StatistiquePatient , globalPatient} = require('./patient/controllerpatient');
const {createRendezVous,getRendezVousByPatientId,rendezvousParJour,getAllRendezVousAjourdhui, getAllRendezVous, getRendezVousById, updateRendezVous, deleteRendezVous}= require("./rdv/rdvController")
const { enregistrerPatientSalleAttente}= require("./salleAttente/salleAttenteController")
const {createHistorique, getAllHistoriques, deleteHistorique}=require("./historique/historiqueController")
const {sendEmail} = require ('./mail/controllerEmail');
const {globalMedecin, globalAssistant } = require ('./statistics/statistic');
const {sendSMS} = require ('./sms/SMScontroller');
const requireAuth = require('./middleware/requireAuth');
const  { getAlldemandRendezVous, deleteDemandeRendezVous } = require ('./demandeRDV/demanderdvController');
const router = express.Router();

router.use(cors());

router.get("/getAllspecialities", getSpecialty);
router.post("/addspecialite", addSpecialty); 
router.put("/updateSpecialite/:id", updateSpecialty);
router.get("/getSpecialtyById/:id", getSpecialtyById);
router.delete("/deleteSpecialite/:id", deleteSpecialty);

router.get("/getAllDepartement", getAllDepartements);
router.post("/addDepartement", createDepartement); 
router.put("/updateDepartement/:id", updateDepartement);
router.get("/getDepartementById/:id", getDepartementById);
router.delete("/deleteDepartement/:id", deleteDepartement);


router.get("/getAide", getAide);
router.post("/addaides",upload.single("image"), addaides); 
router.put("/updateAide/:id",upload.single("image"), updateAide);
router.get("/getAideById/:id", getAideById);
router.delete("/deleteAide/:id", deleteAide);
router.get("/getAidesByMedecinId/:medecinId", GetAidesByMedecinId);

router.post("/addmed",upload.single("image"), addmed);
router.get("/getMedecins", getMedecins);
//router.post("/addMedecin",upload.single("image"), addMedecin); 
router.put("/updateMedecin/:id",upload.single("image"), updateMedecin);
router.get("/getMedecinById/:id", getMedecinById);
router.delete("/deleteMedecin/:id", deleteMedecin);
router.use('/uploads', express.static(path.join(__dirname, 'uploads')));

router.get("/getAdmin", getAdmin);
router.post("/addAdmin",upload.single("image"), addAdmin); 
router.put("/updateAdmin/:id",upload.single("image"), updateAdmin);
router.get("/getAdminById/:id", getAdminById);
router.delete("/deleteAdmin/:id", deleteAdmin);

router.get("/getPatient", getPatient);
router.post("/addPatient", addPatient); 
router.put("/updatePatient/:id", updatePatient);
router.get("/gePatientById/:id", gePatientById);
router.delete("/deletePatient/:id", deletePatient);

router.post("/sendEmail", sendEmail);




router.post('/checkAideEmailExistence', checkAideEmailExistence);


router.post('/creerrendezvous', requireAuth, createRendezVous);
router.get('/getAllRendezVous',requireAuth, getAllRendezVous);
router.get('/getRendezVousById/:id', getRendezVousById);
router.put('/updateRendezVous/:id', updateRendezVous);
router.delete('/deleteRendezVous/:id', deleteRendezVous);
  
router.get('/patients/:patientId/rendezvous',getRendezVousByPatientId);


router.get('/getallHistorique', getAllHistoriques);
router.delete('/deleteHistorique/:id', deleteHistorique);
    
router.post('/creerhistorique', createHistorique);

router.get('/api/patient/statistics',StatistiquePatient);
router.get('/api/global/patients', globalPatient);
router.get('/api/rendezvous/statistique', rendezvousParJour)
router.get('/api/global/medecins', globalMedecin);
router.get('/api/global/assistants', globalAssistant);

router.get('/getAlldemandRendezVous',requireAuth, getAlldemandRendezVous);
router.delete('/deleteDemandeRendezVous/:id', deleteDemandeRendezVous);


router.post('/sendSMS', async (req, res) => {
    const { phoneNumber, message } = req.body;
    try {
        // Appeler la fonction sendSMS avec les données phoneNumber et message
        const response = await sendSMS(phoneNumber, message);
        res.status(200).json({ success: true, response });
    } catch (error) {
        console.error('Erreur lors de l\'envoi du SMS:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/images/:imageId', async (req, res) => {
    try {
      // Recherche de l'image dans la base de données par son ID
      const image = await Image.findById(req.params.imageId);
  
      if (!image) {
        return res.status(404).json({ message: "Image not found" });
      }
  
      // Renvoyer les détails de l'image
      res.json({
        id: image._id,
        filename: image.filename,
        filepath: image.filepath,
        // Ajoutez d'autres détails de l'image que vous souhaitez renvoyer
      });
    } catch (error) {
      console.error('Error fetching image:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
module.exports = { router };
