const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Aide = require('../aide/aideshema');

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
      // Récupérer l'ID utilisateur à partir du token d'authentification
      const userId = req.user.id; // Assurez-vous d'avoir un middleware d'authentification pour définir req.user

      // Rechercher l'utilisateur dans la base de données par son ID
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      // Renvoyer les informations du profil utilisateur
      res.status(200).json(user);
  } catch (error) {
      console.error('Erreur lors de la récupération du profil utilisateur :', error);
      res.status(500).json({ message: "Erreur serveur lors de la récupération du profil utilisateur" });
  }
};


const updateUserProfile = async (req, res) => {
  const { nomPrenom, email, telephone, adresse, dateNaissance, password } = req.body;
  const userId = req.user._id; // Obtenez l'ID de l'utilisateur connecté à partir du middleware requireAuth

  try {
      let updatedFields = { nomPrenom, email, telephone, adresse, dateNaissance };

      // Si le mot de passe est fourni dans les données mises à jour
      if (password) {
          // Générez un hash du nouveau mot de passe
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(password, salt);

          // Ajoutez le nouveau mot de passe hashé aux champs mis à jour
          updatedFields.password = hash;
      }

      // Mettez à jour le profil de l'utilisateur avec les champs mis à jour
      const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, { new: true });

      // Réponse avec les détails mis à jour de l'utilisateur
      res.status(200).json(updatedUser);
  } catch (error) {
      // En cas d'erreur, renvoyez un message d'erreur
      res.status(400).json({ error: error.message });
  }
};


module.exports = { loginUser, signupUser, updateUserProfile,getUserProfile }