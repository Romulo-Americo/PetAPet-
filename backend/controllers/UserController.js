const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//Helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')


module.exports = class UserController{
    static async register(req, res){

        const { name, email, phone, password, confirmpassword } = req.body

        //validations
        if(!name){
            res.status(422).json({ message: 'O nome é obrigatório' })
            return
        }
        if(!email){
            res.status(422).json({ message: 'O email é obrigatório' })
            return
        }
        if(!phone){
            res.status(422).json({ message: 'O telefone é obrigatório' })
            return
        }
        if(!password){
            res.status(422).json({ message: 'A senha é obrigatória' })
            return
        }
        if(!confirmpassword){
            res.status(422).json({ message: 'a confirmação de senha é obrigatória' })
            return
        }

        if(password !== confirmpassword){
            res.status(422).json({ message: "A confirmação de senha não confere" })
            return
        }

        //check if user exists
        const userExists = await User.findOne({ email:email })

        if(userExists){
            res.status(422).json({ message: "Esse email já existe" })
            return
        }

        //Create password
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        // create user
        const user = new User({
            name,
            email,
            phone,
            password: passwordHash
        })

        try{
            const newUser = await user.save()
            await createUserToken(newUser, req, res)
        }catch(error){
            res.status(500).json({ message: error })
        }


    }

    //login
    static async login(req, res){
        const { email, password } = req.body

        if(!email){
            res.status(422).json({ message: 'O email é obrigatório' })
            return
        }
        if(!password){
            res.status(422).json({ message: 'A senha é obrigatória' })
            return
        }

        //check if user exists
        const user = await User.findOne({ email:email })

        if(!user){
            res.status(422).json({ message: "Não há usuário cadastro nesse e-mail" })
            return
        }

        //check if passord match
        const checkPassword = await bcrypt.compare(password, user.password)

        if(!checkPassword){
            res.status(422).json({ message: "Senha inválida" })
            return
        }

        await createUserToken(user, req, res)

    }

    static async checkUser(req, res){
        let currentUser


        if(req.headers.authorization){
            const token = getToken(req)
            const decoded = jwt.verify(token, 'nossosecret')

            currentUser = await User.findById(decoded.id)

            currentUser.password = undefined
        }else{
            currentUser = null
        }

        res.status(200).send(currentUser)

    }

    static async getUserById(req, res){
        const id = req.params.id

        const user = await User.findById(id).select('-password')

        if(!user){
            res.status(422).json({ message: "Usuário não encontrado" })
            return
        }

        res.status(200).json({ user })
    }

    static async editUser(req, res){

        const id = req.params.id

        //Check if user exists
        const token = getToken(req)
        const user = await getUserByToken(token)

        const { name, email, phone, password, confirmpassword } = req.body

        let image = ''
        if(req.file){
            const imageName = req.file.filename
            user.image = imageName
        }

        //validations
        if(!name){
            res.status(422).json({ message: 'O nome é obrigatório' })
            return
        }

        user.name = name

        if(!email){
            res.status(422).json({ message: 'O email é obrigatório' })
            return
        }

        //check if email has already taken
        const userExists = await User.findOne({ email: email })

        if(user.email !== email && userExists){
            res.status(422).json({ message: "Usuário não encontrado" })
            return
        }

        user.email = email

        if(!phone){
            res.status(422).json({ message: 'O telefone é obrigatório' })
            return
        }

        user.phone = phone
        
        if(password !== confirmpassword){
            res.status(422).json({ message: "A confirmação de senha não conferem" })
            return
        }else if(password == confirmpassword && password != null){

            //Create password
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)

            user.password = passwordHash
        }

        try{
            //return user upadated data
            const upadatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $set: user },
                { new: true }
            )

            res.status(500).json({ message: "Usuário atualizado com sucesso!" })
        }catch(err){
            res.status(500).json({ message: err })
            return
        }

    }

}