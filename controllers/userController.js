const userModel = require("../models/userModel")
const bcrypt = require("bcrypt")

//create registered user
exports.registerController = async (req, res) => {
    try {
        const { username, email, password } = req.body
        //validation
        if (!username || !email || !password) {
            return res.status(400).send({
                sucess: false,
                message: 'Please fill all fields'
            })
        }

        //existing user
        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.status(401).send({
                sucess: false,
                message: 'user already existing'
            })
        }

        //protecting password
        const hashedPassword = await bcrypt.hash(password, 10)

        //save new user
        const user = new userModel({ username, email, password: hashedPassword })
        await user.save()
        return res.status(201).send({
            sucess: true,
            message: 'new user created',
            user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Error in Register callback',
            sucess: false,
            error
        })
    }
};

//get all user
exports.getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({});
        return res.status(200).send({
            userCount: users.length,
            sucess: true,
            message: 'all users data',
            users
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            sucess: false,
            message: 'Error in Get all users',
            error
        })
    }
};

//login
exports.loginController = async (req, res) => {
    try {
        const { email, password } = req.body
        //validation
        if (!email || !password) {
            return res.status(401).send({
                sucess: false,
                message: 'please provide email and password'
            })
        }
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(200).send({
                sucess: false,
                message: 'email not registered'
            })
        }
        //password
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(401).send({
                sucess: false,
                message: 'Invalid username or password'
            })
        }
        return res.status(200).send({
            sucess: true,
            message: 'Login Sucessfull',
            user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            sucess: false,
            message: 'Error in Login callback',
            error
        })
    }
};