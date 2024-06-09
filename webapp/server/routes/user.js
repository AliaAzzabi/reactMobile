// userRoute.js
const express = require('express');
const { loginUser, signupUser, updateUserProfile, getUserProfile } = require('../controllers/userController');
const requireAuth = require('../middleware/requireAuth');
const { upload } = require('../image/upload');
const router = express.Router();
const cors = require("cors");
const path = require("path");

router.use(cors());
const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 
router.post('/login', loginUser);
router.post('/signup', signupUser);
router.put('/profile', requireAuth, upload.single('image'), updateUserProfile); // Ajout du middleware upload
router.get('/getprofile', requireAuth, getUserProfile);

module.exports = router;