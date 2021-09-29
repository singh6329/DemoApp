const express=require('express')
const router=require('./Routers/routes_db')
const mongoose=require('mongoose');
const bodyparser=require("body-parser");
const dotenv=require("dotenv");
const router2=require('./Routers/routes_file')

dotenv.config({path:'./config.env'})

const app=express()

mongoose.connect(process.env.URL,{useNewUrlParser:true})
const conn=mongoose.connection

conn.on('open',()=>{
    console.log("Connected to database");
})
//app.use(express.urlencoded({extended:false}));
app.use(bodyparser.json())
app.use(express.urlencoded({extended:false}));
app.use(router2);
app.listen(process.env.PORT,()=>{
    console.log("Listening on Port number 3030")
})