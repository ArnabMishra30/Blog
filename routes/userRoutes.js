const express = require('express')
const { getAllUsers, registerController, loginController } = require('../controllers/userController')

//router object
const router = express.Router()

//get all users || GET method
router.get('/all-users',getAllUsers)

//create user || POST
router.post('/register',registerController)

//Login || POST
router.post('/login', loginController)

module.exports = router