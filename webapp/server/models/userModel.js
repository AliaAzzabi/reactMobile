const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const Image = require('../image/imagemodel')
const Schema = mongoose.Schema

const userSchema = new Schema({
  cin: String,
  nomPrenom: String,
  telephone: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  sexe: String,
  dateNaissance: Date,
  adresse: String,
  role: {
    type: String,
    required: true
  },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image"
},  dateAdhesion: { type: Date, default: Date.now }
})

userSchema.statics.signup = async function (email, password, role, nomPrenom) {

  // validation
  if (!email || !password || !role || !nomPrenom) {
    throw Error('tous les champs doivent être remplis')
  }
  if (!validator.isEmail(email)) {
    throw Error('email invalide')
  }
  if (!validator.isStrongPassword(password)) {
    throw Error('mot de passe pas assez fort')
  }

  const exists = await this.findOne({ email })

  if (exists) {
    throw Error('email deja utilisé')
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  const user = await this.create({ email, password: hash, role, nomPrenom })

  return user
}


userSchema.statics.login = async function (email, password) {

  if (!email || !password) {
    throw Error('tous les champs doivent être remplis')
  }

  const user = await this.findOne({ email }); 
    if (!user) {
    throw Error(' email incorrecte')
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    throw Error('mot de passe incorrect')
  }

  return user
}


module.exports = mongoose.model('User', userSchema)