const express=require('express');
const student=require('../database/databases')
const validator=require('email-validator')
const bcrypt=require('bcrypt');
const router=express.Router();
const path=require('path');
const jwt=require('jsonwebtoken');

const secret_key="Hello everyone!! This is my first project on Node"
router.get('/signup',(req,res)=>{

    res.sendFile(path.join(__dirname,'../register.html'));
})

router.get('/signin',(req,res)=>{
    res.sendFile(path.join(__dirname,'../login.html'))
})

router.post('/register',async (req,res)=>{
    console.log("Register route pr request aa gyi hai")
   // const {name,roll_no,branch,stream,address,password,conPassword}=req.body;
       const name=req.body.name;
        const roll_no=req.body.roll_no;
        const email=req.body.email;
        const password=req.body.password;
        const conPassword=req.body.conPassword
        const address=req.body.address;
        const branch=req.body.branch;
        console.log(password);
        const HashedPassword=await bcrypt.hash(password,4)
    const stu=new student({
        name:name,
        roll_no:roll_no,
        email:email,
        branch:branch,
        address:address,
        password:HashedPassword,
        conPassword:conPassword
       
    })
    if(!name||!roll_no||!branch||!email||!address||!password||!conPassword)
    {
        return res.status(401).json({"error":"Please enter all the field correctly"});
    }
    if(!validator.validate(email))
    {
return res.status(400).send({"error":"Entered email is not correct"})
    }
    const emailExists=await student.findOne({email:email});
    //console.log(emailExists);
    if(emailExists)
    {
        return res.status(400).json({"error":"This email is already registered!! Please try with some another one"})
    }
 if(password!=conPassword)
{
    return res.status(400).json({"error":"Your Password not matches with Confirm Password"})
}
    // res.send("This endpoint is designed to register data in your database");
else
{
try{

    const insert=await stu.save();
    return res.sendFile(path.join(__dirname,'../login.html'))
    
}
catch(err)
{
    return res.send("Error ocuured while storing data"+err);
}
}
})

router.post("/login",async(req,res)=>{

   const email=req.body.email;
   const password=req.body.password;
console.log(password);
   if(!email||!password)
   {
       return res.json({error:"Please Enter all the fields"})
   }
  //const hashed= bcrypt.hash(password,saltRounds);
  console.log(email);
  const exists=await student.findOne({email:email});
  //console.log(exists)
  if(!exists)
  {
    return res.status(401).send("Your email is not registered with us!! Kindly register it first")
  }
  
  const matches=await bcrypt.compare(password,exists.password);
  //console.log(matches);
  if(matches)
  {
      const token=await jwt.sign({email:email},secret_key,{expiresIn:"1 day"})
      console.log(token);
     return res.sendFile(path.join(__dirname,'../homepage.html'))
      //return res.status(200).send({"message":"Login Success"})
  }
  else{
      return res.status(401).send("Wrong Credentials!!");
  }
  
  
  
})
module.exports=router