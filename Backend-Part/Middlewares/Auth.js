const jwt = require('jsonwebtoken');
const ensureAuthenticated = (req, res, next)=>{
    const auth= req.headers['authorization'];
    if(!auth){
        return res.status(401).json({message:"unauthorized, JWT tokn"})
    }
        const token = auth.split(' ')[1];

    try{
        const decoded = jwt.verify(auth, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(error){
               return res.status(401)
               .json({message:"unauthorized, JWT tokn"})
    
    }
    }
    module.exports = ensureAuthenticated;