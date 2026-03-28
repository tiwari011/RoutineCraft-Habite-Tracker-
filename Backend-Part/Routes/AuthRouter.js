// const { Signup , login, googleLogin } = require('../Controllers/AuthController');
// const { SignupValidation , loginValidation} = require('../Middlewares/AuthValidation');
// const router = require ('express').Router();
// // router.post('/login',(req, res)=>{
//     //     res.send('login successful')
//     // })
//     // router.post('/signup',(req, res)=>{
//         //     res.send('registered successful')
//         // })
//         router.post('/login',loginValidation, login)
//         router.post('/signup',SignupValidation, Signup)
// //   GOOGLE LOGIN ROUTE 
// router.post('/google', googleLogin);

// module.exports=router;
const { Signup, login, googleLogin } = require('../Controllers/AuthController');
const { SignupValidation, loginValidation } = require('../Middlewares/AuthValidation');
const router = require('express').Router();

//  Normal auth routes
router.post('/login', loginValidation, login);
router.post('/signup', SignupValidation, Signup);

// GOOGLE LOGIN — frontend POSTs ID token in JSON body (@react-oauth/google)
router.post('/google', googleLogin);

//  Google callback 
router.get('/google/callback', async (req, res) => {
  try {
    const code = req.query.code;

    // call controller
   
    res.send("Google login successful ✅");

  } catch (err) {
    console.error(err);
    res.status(500).send("Google login failed");
  }
});

module.exports = router;