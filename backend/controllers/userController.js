const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}


const loginUser = async (req, res) => {
  const {email, password} = req.body

  try {
    const user = await User.login(email, password)

   
    const token = createToken(user._id)

    res.status(200).json({email, token, role: user.role, nomPrenom: user.nomPrenom ,telephone: user.telephone, dateNaissance:user.dateNaissance, adresse: user.adresse, user_id: user._id });
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

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

module.exports = { signupUser, loginUser }