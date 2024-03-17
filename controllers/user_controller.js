const User = require('../models/user_model')
const sendToken = require('../utils/sendToken')
const bcrypt = require('bcrypt')

const registerUser = async (req, res) => {
    try {
        const {email, password, role} = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const userData = await User.create({email, password: hashedPassword, role})
        res.status(200).json({message: 'User register successfull'})
    } catch (error) {
        console.log(error)
        if (error.code === 11000) {
            res.status(400).json({ error: 'Duplicate key error - Email already exists' });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

const loginUser = async (req, res) => {
    try {
        console.log('req', req.body)
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({
                error: "Please enter email or password"
            })
        }
        const user = await User.findOne({email: req.body.email})
        console.log('user', user)
        if(!user) {
            return res.status(401).json({
                status: false,
                error: "Invalid email or password"
            })
        }

        const isPassword = await bcrypt.compare(password, user.password)

        if(!isPassword){
            return res.status(401).json({
                error: "Invalid password",
            });
        }
        const token = sendToken(user)
        if(token)
            return res.status(200).json({token: token})
        else
            return res.status(400).json({error: "Something happend"})
    } catch (error) {
        console.log(error)
        if (error.code === 11000) {
            res.status(400).json({ error: 'Duplicate key error - Email already exists' });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

module.exports = {
    registerUser,
    loginUser
}
