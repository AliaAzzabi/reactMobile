const Aide = require('./aideshema');
const bcrypt = require('bcrypt');
const multer = require('multer');
const User = require("../models/userModel");
const Image = require("../image/imagemodel");
const Medecin = require('../medecin/medecinshema');
const expressHandler = require("express-async-handler");

const GetAidesByMedecinId = async (req, res) => {
    try {
      const { medecinId } = req.params;
      console.log(medecinId);
      const aides = await Aide.find({ medecin: medecinId })
          .populate('user')
          .populate('image')
          .populate('medecin');
  
      res.json(aides);
      console.log(aides);
    } catch (error) {
      res.status(500).json({ error: `Erreur lors de la recherche des aides pour ce médecin : ${error.message}` });
    }
  };
const getAide = async (req, res) => {
    try {

        const aides = await Aide.find({})
        .populate({
            path: 'user',
            select: 'nomPrenom telephone email dateAdhesion dateNaissance adresse sexe password role cin image',
            populate: {
                path: 'image',
                select: 'filepath'
            }
        })            .populate({
                path: 'medecin',
                populate: { path: 'user' }
            });

        res.send(aides);
    } catch (err) {
        console.error("Erreur lors de la recherche des aides :", err);
        res.status(500).send("Erreur serveur");
    }
};

const getAideById = async (req, res) => {
    try {
        const aide = await Aide.findById(req.params.id)
            .populate('user')
            .populate('image')
            .populate('medecin');

        if (!aide) {
            return res.status(404).json({ message: "Aide non trouvée" });
        }

        res.status(200).json(aide);
    } catch (error) {

        res.status(500).json({ message: error.message });
    }
};



const addaides = expressHandler(async (req, res) => {
    try {
        const { cin, sexe, nomPrenom, telephone, role, email, password, dateAdhesion, medecin, education, dateNaissance, adresse } = req.body;

        const existingUserWithCIN = await User.findOne({ cin: cin });
        if (existingUserWithCIN) {
            return res.status(401).json({ error: "Un utilisateur avec ce CIN existe déjà." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ error: "Cet email est déjà utilisé." });
        }
       
        let medecinId = await Medecin.findOne({ _id: medecin }).select('_id');


    
        if (!medecinId) {
            return res.status(400).json({ error: "Le médecin spécifié n'existe pas" });
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
            image: savedImage._id,

        });
        const savedUser = await newUser.save();

        const newAide = new Aide({
            user: savedUser._id,
            medecin: medecinId,

            education: education,
        });

        const savedAide = await newAide.save();

        res.status(201).json({
            _id: savedAide._id,
            cin: savedUser.cin,
            nomPrenom: savedUser.nomPrenom,
            medecin: medecinId,
            telephone: savedUser.telephone,
            email: savedUser.email,
            dateAdhesion: savedUser.dateAdhesion,
            sexe: savedUser.sexe,
            role: savedUser.role,
            education: savedAide.education,
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


const updateAide = async (req, res) => {
    const { cin, sexe, nomPrenom, telephone, email, password, dateAdhesion, role, medecin, education, dateNaissance, adresse } = req.body;
    try {
        console.log(req._id);
        let updateData = {
            nomPrenom,
            telephone,
            email,
            dateAdhesion,
            role,
            cin,
            sexe,
            education,
            dateNaissance,
            adresse,
        };

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        const medecintId = await Medecin.findById(medecin).select('_id');

        if (!medecintId) {
            return res.status(400).json({ error: "Le médecin spécifié n'existe pas" });
        }

        updateData.medecin = medecintId._id;

        if (req.file) {
            const newImage = new Image({
                filename: req.file.filename,
                filepath: req.file.path,
            });
            const savedImage = await newImage.save();
            updateData.image = savedImage._id;
        }

        const updatedAide = await Aide.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!updatedAide) {
            return res.status(404).json({ error: 'Aide non trouvée' });
        }

        if (!updatedAide.user) {
            return res.status(404).json({ error: 'Utilisateur associé non trouvé' });
        }
        const updatedUser = await User.findByIdAndUpdate(updatedAide.user, updateData);

       

        if (updatedUser) {
            res.status(200).json({ message: 'Aide et utilisateur mis à jour avec succès', data: { aide: updatedAide, user: updatedUser } });
        } else {
            res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
    } catch (err) {
        res.status(500).json({ error: `Erreur lors de la mise à jour de l'aide : ${err.message}` });
    }
};




const deleteAide = async (req, res) => {
    try {
        const deletedAide = await Aide.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: 'Aide supprimé avec succès', data: deletedAide });
    } catch (err) {
        res.status(400).send({ error: `Erreur lors de la suppression du Aide : ${err.message}` });
    }
};

const checkAideEmailExistence = async (email) => {
    try {
        const existingAide = await Aide.findOne({ email: email });
        return existingAide !== null;
    } catch (error) {
        console.error("Erreur lors de la vérification de l'existence de l'email de l'aide :", error);
        throw new Error("Erreur lors de la vérification de l'existence de l'email de l'aide");
    }
};


module.exports = { getAide, addaides, updateAide, deleteAide, getAideById, checkAideEmailExistence ,GetAidesByMedecinId}; 