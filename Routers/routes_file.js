const express=require('express');
const student=require('../database/databases')
const validator=require('email-validator')
const bcrypt=require('bcrypt');
const router=express.Router();
const path=require('path');
const jwt=require('jsonwebtoken');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs')
const csv = require('csv-parser')

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
    // const stu=new student({
    //     name:name,
    //     roll_no:roll_no,
    //     email:email,
    //     branch:branch,
    //     address:address,
    //     password:HashedPassword,
    //     conPassword:conPassword
    const csvWriter = createCsvWriter({
        path: 'studentdb.csv',
        header: [
            {id: 'name', title: 'NAME'},
            {id: 'roll_no', title: 'ROLL NO'},
            {id: 'email', title: 'EMAIL'},
            {id: 'branch', title: 'BRANCH'},
            {id: 'address', title: 'ADDRESS'},
            {id: 'password', title: 'PASSWORD'}
        ]
    });
    const stu=[
        {name:name,roll_no:roll_no,email:email,branch:branch,address:address,password:HashedPassword}
    ];
   
       
    //})
    if(!name||!roll_no||!branch||!email||!address||!password||!conPassword)
    {
        return res.status(401).json({"error":"Please enter all the field correctly"});
    }
    if(!validator.validate(email))
    {
return res.status(400).send({"error":"Entered email is not correct"})
    }
   // const emailExists=await student.findOne({email:email});
    //console.log(emailExists);
    // if(emailExists)
    // {
    //     return res.status(400).json({"error":"This email is already registered!! Please try with some another one"})
    // }
 if(password!=conPassword)
{
    return res.status(400).json({"error":"Your Password not matches with Confirm Password"})
}
    // res.send("This endpoint is designed to register data in your database");
else
{
try{

    //const insert=await stu.save();
     
    csvWriter.writeRecords(stu)       // returns a promise
        .then(() => {
            console.log('...Done');
        });
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
  const users = [];
 fs.createReadStream('input.csv')
  .pipe(csv())
  .on('data',async function (row) {
    //const username = generateUsername(row.Firstname, row.Surname);
    
    
    const user = {
        email:row.EMAIL,
        password:row.PASSWORD
    }
    //users.push(user)
  
    if(email!=row.EMAIL)
    {
      return res.status(401).send("Your email is not registered with us!! Kindly register it first")
    }
   // console.log(row.PASSWORD);
   const matches=await bcrypt.compare(password,row.PASSWORD);
     console.log(matches);
     if(matches)
     {
        //  const token=await jwt.sign({email:},secret_key,{expiresIn:"1 day"})
        //  console.log(token);
        return res.sendFile(path.join(__dirname,'../homepage.html'))
         //return res.status(200).send({"message":"Login Success"})
     }
     else{
         return res.status(401).send("Wrong Credentials!!");
     }
})
  .on('end', function () {
     console.log(users)
      // TODO: SAVE users data to another file
      
    })
  //console.log(email);
//   const exists=()=>{
//     if(email==results.email)
//     {
//         return true
//     }
//     else
//     {
//         return false;
//     }
//   }

 // console.log(users)
  
  
  
//  
  
  
  
})
module.exports=router