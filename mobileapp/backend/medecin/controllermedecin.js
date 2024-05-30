const Medecin = require('./medecinshema');
const Specialite = require('../specialité/specialitiesSchema');
const bcrypt = require('bcrypt');
const multer = require('multer');
const User = require("../models/userModel");
const Image = require("../image/imagemodel");
const expressHandler = require("express-async-handler");
const Aide = require('../aide/aideshema');


const getMedecins = async (req, res) => {
    try {
        const medecins = await Medecin.find({})
            .populate({
                path: 'user',
                select: 'nomPrenom telephone email dateAdhesion dateNaissance adresse sexe password role cin image',
                populate: {
                    path: 'image',
                    select: 'filepath'
                }
            })
            .populate('specialite');
        
        res.send(medecins);
    } catch (err) {
        console.error("Erreur lors de la recherche des Médecins :", err);
        res.status(500).send("Erreur serveur: " + err.message);
    }
};

const getAidesByMedecinId  = async (req, res) => {
    try {
      const { medecinId } = req.params;
      const aides = await Aide.find({ medecin: medecinId }).populate('user').populate('image');
      res.json(aides);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };


const getMedecinById = async (req, res) => {

    try {
        const medecin = await Medecin.findById(req.params.id)
            .populate('user')
            .populate('image')
            .populate('specialite');

        if (!medecin) {
            return res.status(404).json({ message: "Medecin non trouvée" });
        }

        res.status(200).json(medecin);
    } catch (error) {

        res.status(500).json({ message: error.message });
    }
};
const addmed = expressHandler(async (req, res) => {
    try {
        const { cin, sexe, nomPrenom, telephone, role, email, password, dateAdhesion, specialite, dateNaissance, adresse } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUserByEmail = await User.findOne({ email: email });
        if (existingUserByEmail) {
            return res.status(400).json({ error: "Cet email est déjà utilisé." });
        }

        const existingUserByCIN = await User.findOne({ cin: cin });
        if (existingUserByCIN) {
            return res.status(401).json({ error: "Un utilisateur avec ce CIN existe déjà." });
        }

        let specialiteid = await Specialite.findOne({ _id: specialite }).select('_id');
        if (!specialiteid) {
            return res.status(400).json({ error: "L'ID de la spécialité spécifiée n'existe pas." });
        }

        const newImage = new Image({
            filename: req.file.filename,
            filepath: req.file.path,
        });
        const savedImage = await newImage.save();

        const newUser = new User({
            cin: cin,
            email: email,
            password: hashedPassword,
            nomPrenom: nomPrenom,
            telephone: telephone,
            dateAdhesion: dateAdhesion,
            sexe: sexe,
            dateNaissance: dateNaissance,
            adresse: adresse,
            role: role,
        });
        const savedUser = await newUser.save();

        const newMed = new Medecin({
            user: savedUser._id,
            specialite: specialiteid._id,
            image: savedImage._id,
            isSelected: req.body.isSelected || true
        });

        const savedMed = await newMed.save();

        res.status(201).json({
            _id: savedMed._id,
            cin: savedUser.cin,
            nomPrenom: savedUser.nomPrenom,
            specialite: specialiteid._id,
            telephone: savedUser.telephone,
            email: savedUser.email,
            dateAdhesion: savedUser.dateAdhesion,
            sexe: savedUser.sexe,
            role: savedUser.role,
            dateNaissance: savedUser.dateNaissance,
            adresse: savedUser.adresse,
            image: {
                filename: savedImage.filename,
                filepath: savedImage.filepath,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});







const updateMedecin = async (req, res) => {
   // console.log(req.body);
  //  console.log(req._id);
    const { cin, sexe, nomPrenom, specialite, telephone, email, password, dateAdhesion, role, dateNaissance, adresse } = req.body;
    try {
        let updateData = {
            nomPrenom,
            telephone,
            email,
            dateAdhesion,
            role,
            cin,
            sexe,
            dateNaissance,
            adresse,
            isSelected: req.body.isSelected !== undefined ? req.body.isSelected : true
        };
        

        // Vérifier si le mot de passe est défini
        if (password) {
            // Hasher le mot de passe seulement s'il est défini
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        let specialiteId = await Specialite.findOne({ _id: specialite }).select('_id');

        if (!specialiteId) {
            return res.status(400).json({ error: "Le département ou la spécialité spécifiée n'existe pas" });
        }

        updateData.specialite = specialiteId;

        const updatedMedecin = await Medecin.findByIdAndUpdate(req.params.id, updateData, { new: true });

        const updatedUser = await User.findByIdAndUpdate(updatedMedecin.user, updateData);

        if (updatedMedecin && updatedUser) {
            res.status(200).json({ message: 'Médecin et utilisateur mis à jour avec succès', data: { medecin: updateData, user: updatedUser } });
        } else {
            res.status(404).json({ error: 'Médecin ou utilisateur non trouvé' });
        }
    } catch (err) {
        res.status(500).json({ error: `Erreur lors de la mise à jour du médecin : ${err.message}` });
    }
};





const deleteMedecin = async (req, res) => {
    try {
        const deletedMedecin = await Medecin.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: 'Médecin supprimé avec succès', data: deletedMedecin });
    } catch (err) {
        res.status(400).send({ error: `Erreur lors de la suppression du médecin : ${err.message}` });
    }
};


module.exports = { getMedecins, updateMedecin, deleteMedecin, getMedecinById, addmed ,getAidesByMedecinId}; 