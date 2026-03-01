const { Signup , login, googleLogin } = require('../Controllers/AuthController');
const { SignupValidation , loginValidation} = require('../Middlewares/AuthValidation');
const router = require ('express').Router();
// router.post('/login',(req, res)=>{
    //     res.send('login successful')
    // })
    // router.post('/signup',(req, res)=>{
        //     res.send('registered successful')
        // })
        router.post('/login',loginValidation, login)
        router.post('/signup',SignupValidation, Signup)
//   GOOGLE LOGIN ROUTE 
router.post('/google', googleLogin);
module.exports=router;