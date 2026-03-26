const mongoose =require('mongoose');
const habitSchema = new mongoose.Schema(
   { userId:{type:mongoose.Schema.ObjectId, ref:"User", required:"true"},
    name:{type:String, required:true},
    time:{type:String},
    completed:{type:Boolean, default:false}

});
module.exports=mongoose.model("habit", habitSchema);