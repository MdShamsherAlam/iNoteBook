const express=require('express');
const Users = require('../models/User');
const bcrypt=require('bcryptjs')
var jwt = require('jsonwebtoken')
const router=express.Router();
const { body,validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const JWT_SECRET='shamsher';
//create a user using:post"api/auth/createuser".No login required
router.post('/createuser',[

    body('name','enter a valid name').isLength({min:3}),
    body('email','enter a valid email').isEmail(),
    body('password','enter a valid password').isLength({min:5}),
], async (req,res)=>{
    let success=false;
//if the errors occurs,return bad request and the error

    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({success,errors:errors.array()});
    }
    try{

   
    //check whether the user with this email exists already
let user= await Users.findOne({email:req.body.email});
if(user){
    return res.status(400).json({success,error:"sorry a user with this email already exists"})
}
//create a new user
const salt= await bcrypt.genSalt(10);
 const secPass= await bcrypt.hash(req.body.password,salt)
    user=await Users.create({
        name:req.body.name,
        password:secPass,
        email:req.body.email,
    })
        const data= {
user:{
    id:user.id
}
        }
    const authtoken=jwt.sign(data, JWT_SECRET)
    
   res.json({success,authtoken})
    
// res.json(user)
    }catch(error){
        console.error(error.message);
   res.status(500).send("some error occured")



}


})
//route 2:for User login verification
router.post('/login',[


    body('email','Enter a valid Email').isEmail(),
    body('password','password cannot be  blank').exists(),
  
], async (req,res)=>{
    let success=false;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({errors:errors.array()});
    }
    const {email,password}=req.body;
    try {
        let user= await Users.findOne({email})
        if(!user){
            success=false
            res.status(404).json({ success,error:"Please try to login correct credentials"})
        }
        const passwordCompare= await bcrypt.compare(password,user.password)
        if(!passwordCompare){
            success=false;
            res.status(404).json({ success,error:"Please try to login correct credentials"})
        }
        const data= {
            user:{
                id:user.id
            }
                    }
                const authtoken=jwt.sign(data, JWT_SECRET)
                success=true;
               res.json({ success,authtoken})
    } catch(error){
        console.error(error.message);
   res.status(500).send("Internal Server Error")



}
})
//route 3: Get Loggin User Details using :Post "api/auth/getuser".Login required
router.post('/getuser', fetchuser ,async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({errors:errors.array()});
    }
    try {
        userid=req.user.id;
        const user=await Users.findById(userid).select("-password");
        res.send(user);
        
    } catch (error) {
        
    }
})

module.exports=router;