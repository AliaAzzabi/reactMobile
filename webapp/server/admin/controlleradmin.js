const Admin = require('./adminshema');
const bcrypt = require('bcrypt');
const multer = require('multer');
const User = require("../models/userModel");
const Image = require("../image/imagemodel");


const expressHandler = require("express-async-handler");

const getAdmin = async (req, res) => {
    try {
        const admins = await Admin.find({})
        .populate({
            path: 'user',
            select: 'nomPrenom telephone email dateAdhesion dateNaissance adresse sexe password role cin image',
            populate: {
                path: 'image',
                select: 'filepath'
            }
        })    
              res.send(admins);
    } catch (err) {
        console.error("Erreur lors de la recherche des admins :", err);
        res.status(500).send("Erreur serveur");
    }
};

const getAdminById = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id)
            .populate('user')
            .populate('image');
      
        
        if (!admin) {
            return res.status(404).json({ message: "Admin non trouvée" });
        }
        
        res.status(200).json(admin);
    } catch (error) {
        
        res.status(500).json({ message: error.message });
    }
};
const addAdmin = expressHandler(async (req, res) => {
  try {
      const { cin, sexe, nomPrenom, telephone, role, email, password, dateNaissance, adresse, dateAdhesion } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
          return res.status(400).json({ error: "Cet email est déjà utilisé." });
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
          dateNaissance: dateNaissance,
          adresse: adresse,
          dateAdhesion: dateAdhesion,
          sexe: sexe,
          telephone:telephone,
          role:role,
          image: savedImage._id,
      });
      const savedUser = await newUser.save();

      const newAdmin = new Admin({
          user: savedUser._id,
        
         
      });

      const savedAdmin = await newAdmin.save();

      res.status(201).json({
          _id: savedAdmin._id,
          cin: savedUser.cin,
          nomPrenom: savedUser.nomPrenom,
          telephone: savedUser.telephone,
          email: savedUser.email,
          dateNaissance: savedUser.dateNaissance,
          adresse: savedUser.adresse,
          dateAdhesion: savedUser.dateAdhesion,
          sexe: savedUser.sexe,
          role: savedUser.role,
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

const updateAdmin = async (req, res) => {
    const { cin, sexe, nomPrenom, telephone, email, password, dateNaissance, adresse, dateAdhesion, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        let updateUserData = {
            nomPrenom,
            telephone,
            email,
            dateNaissance,
            adresse,
            dateAdhesion,
            role,
            cin,
            sexe,
            password: hashedPassword,
        };

        if (req.file) {
            const newImage = new Image({
                filename: req.file.filename,
                filepath: req.file.path,
            });
            const savedImage = await newImage.save();
            updateUserData.image = savedImage._id;
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, updateUserData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        const updatedAdmin = await Admin.findOneAndUpdate({ user: req.params.id }, {}, { new: true });

        if (!updatedAdmin) {
            return res.status(404).json({ error: 'Admin non trouvé' });
        }

        res.status(200).json({ message: 'Admin et utilisateur mis à jour avec succès', data: { admin: updatedAdmin, user: updatedUser } });
    } catch (err) {
        res.status(500).json({ error: `Erreur lors de la mise à jour de l'administrateur : ${err.message}` });
    }
};


const deleteAdmin = async (req, res) => {
    try {
        const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: 'Admin supprimé avec succès', data: deletedAdmin });
    } catch (err) {
        res.status(400).send({ error: `Erreur lors de la suppression de l'administrateur : ${err.message}` });
    }
};

module.exports = { getAdmin, addAdmin, updateAdmin, deleteAdmin, getAdminById };
