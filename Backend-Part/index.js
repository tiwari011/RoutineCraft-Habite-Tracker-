require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const router = require('./Routes/AuthRouter');
require('dotenv').config();
const db=require('./Models/Database');
// const ProductRouter = require('./Routes/ProductRouter');

const PORT = process.env.PORT || 8080;
// app.get('/auth',(req, res)=>{
//     res.send('Auth route is working')

// })
// app.use(bodyParser.json());
app.use(cors()); 
app.use(express.json());
app.use('/auth', router)
// app.use('/products', ProductRouter)
app.listen(PORT, ()=>{
    console.log(`server is running on ${PORT}`)
})
