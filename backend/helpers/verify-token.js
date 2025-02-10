const jwt = require('jsonwebtoken')

//middleware
const checkToken = (req, res, next) =>{

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    
    if(!req.headers.authorization){
        return res.status(401).json({ message: 'Acesso negado, sem autorização!' })
    }

    if(!token){
        return res.status(401).json({ message: 'Acesso negado!' })
    }

    try{
        const verified = jwt.verify(token, 'nossosecret')
        req.user = verified
        next()
    }catch(err){
        return res.status(400).json({ message: 'Token inválido' })
    }
}

module.exports = checkToken