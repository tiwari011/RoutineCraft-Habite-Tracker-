const Habit = require("../Models/habit");

// Get - fetch all habits
const getHabits= async(req, res)=>{
    try{
const habits= await Habit.find({userId: req.user._id});
res.status(200).json({success:true, habits});
    }
    catch (error)
    {
res.status(500).json({success:false, message:"Server error"});
    }
};
// post- add new habit 
const addHabit = async(req, res)=>{
    try{
        const {name, time}=req.body;
        const habit = await Habit.create({
            userId:req.user._id,
            name,
            time,
            completed:false
        });
        res.status(201).json({success:true, habit});
    }
    catch(error){
        res.status(500).json({success:false, message:"server error"});
    }
};

// Update(edit name/time and toggle complete)
const updateHabit= async(req, res)=>{
    try{
        const habit= await Habit.findByIdAndUpdate(req.params.id,
              req.body,
        {new:true}
    
        );
        res.status(200).json({success:true, habit});
    }
    catch(error){
        res.status(500).json({success:false, message:"Server error"});
    }

};
// Delete habit 
const deleteHabit = async (req, res)=>{
    try{
        await Habit.findByIdAndDelete(req.params.id);
        res.status(200).json({success:true, message:"Habit deleted"});
    }catch(error){
        res.status(500).json({success:false, message:"Server error"});
    }
};
module.exports={getHabits, addHabit, updateHabit, deleteHabit};