const jwt = require('jsonwebtoken');
require('dotenv').config()

module.exports = async (req, res, next) => {
    const token = req.cookies.travel_journal_jwt
    if(!token){
        return res.status(403).json({message: "Authorization denied", success: false})
    }
    try{
        const verify = jwt.verify(token, process.env.jwtSecret)
        req.user = verify.user
        next()
    } catch(err){
        console.error(err.message)
        res.status(401).json({message: "Token invalid", success: false})
    }
}