const express = require('express')


const { loginUser, signupUser ,updateUserProfile,getUserProfile } = require('../controllers/userController')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()


router.post('/login', loginUser)


router.post('/signup', signupUser)

router.put('/profile', requireAuth, updateUserProfile)
router.get('/getprofile', requireAuth, getUserProfile);

module.exports = router