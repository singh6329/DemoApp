const mongoose=require('mongoose');

const data= new mongoose.Schema({
name:
{
type:String,
required:true
},
roll_no:
{
type:Number,
required:true
},
branch:
{
    type:String,
    required:true
},
email:
{
    type:String,
    required:true
},
address:
{
type:String,
required:true
},
password:
{
    type:String,
    required:true
}
})

module.exports=mongoose.model('StudentDb',data)