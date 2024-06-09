const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Aide = require('../aide/aideshema');
const Image = require('../image/imagemodel');

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    // Créer un token pour l'utilisateur
    const token = createToken(user._id);

    let responseData = {
      email,
      token,
      role: user.role,
      nomPrenom: user.nomPrenom,
      telephone: user.telephone,
      dateNaissance: user.dateNaissance,
      adresse: user.adresse,
      user_id: user._id,
      image: user.image
    };

    // Si l'utilisateur a le rôle 'aide', récupérer les informations du médecin associé
    if (user.role === 'aide') {
      const aide = await Aide.findOne({ user: user._id }).populate('medecin');
      if (aide && aide.medecin) {
        responseData.medecin = aide.medecin;
      }
    }

    res.status(200).json(responseData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const signupUser = async (req, res) => {
  const { email, password, role, nomPrenom } = req.body;

  try {
    const user = await User.signup(email, password, role, nomPrenom );

    
    const token = createToken(user._id);

    
    res.status(200).json({ email, token, role, nomPrenom, user_id: user._id });
    } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const getUserProfile = async (req, res) => {
  try {
      const userId = req.user._id; // Utiliser _id au lieu de id
      const user = await User.findById(userId).populate('image'); // populate image if it's a reference

      if (!user) {
          return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      res.json({
          nomPrenom: user.nomPrenom,
          email: user.email,
          telephone: user.telephone,
          adresse: user.adresse,
          role: user.role,
          dateNaissance: user.dateNaissance,
          image: user.image // Add the image path here
      });
  } catch (error) {
      console.error('Erreur lors de la récupération du profil utilisateur :', error);
      res.status(500).json({ message: 'Erreur serveur lors de la récupération du profil utilisateur' });
  }
};



// userController.js
const updateUserProfile = async (req, res) => {
  const { nomPrenom, email, telephone, adresse, dateNaissance, password } = req.body;
  const userId = req.user._id;

  try {
      let updatedFields = { nomPrenom, email, telephone, adresse, dateNaissance };

      if (password) {
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(password, salt);
          updatedFields.password = hash;
      }

      if (req.file) {
          const newImage = new Image({
              filename: req.file.filename,
              filepath: req.file.path,
          });
          const savedImage = await newImage.save();
          updatedFields.image = savedImage._id;
      }

      const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, { new: true }).populate('image');
      res.status(200).json(updatedUser);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};


module.exports = { loginUser, signupUser, updateUserProfile,getUserProfile }