import React, { useEffect, useState } from "react";
import logo from "../assets/Images/logo.png";
import { useNavigate } from "react-router-dom";
// import { FiX, FiUser, FiCamera } from "react-icons/fi";
function Myday() {
  const navigate = useNavigate();
  const [habits, sethabits] = useState([]);
  const [name, setname] = useState("");
  const [Timeicon, setTimeicon] = useState("☀️")
  // load habits
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("habits")) || [];
    sethabits(stored);
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  //  load username
  useEffect(() => {
    const User = localStorage.getItem("name");
    if (User) setname(User);
  }, []);
      const handleToggle = (index) => {
        const updatedHabits = [...habits];
        updatedHabits[index].completed = !updatedHabits[index].completed;
        sethabits(updatedHabits);
        localStorage.setItem("habits", JSON.stringify(updatedHabits));
      }
// habit reset after 24 every hours 
useEffect(()=>{
  const reset =()=>{
    const today = new Date().toDateString();
    const lastReset = localStorage.getItem("lastHabitReset");

    if( lastReset != today){
       const stored = JSON.parse(localStorage.getItem("habits")) || [];
       const Update = stored.map((h)=>({...h, completed:false}))
       sethabits(Update)
       localStorage.setItem("habits", JSON.stringify(Update))
       localStorage.setItem("lastHabitReset", today);
    }
  }
  reset()
  const interval = setInterval(reset,60000);
    return () => clearInterval(interval);

},[])



// load Timeicon 
useEffect(()=>{
 const checkTime = ()=>{
    const hour = new Date().getHours();
  if(hour>=6 &&hour<16)
    { // Morning day 
      setTimeicon("☀️");   
    }
  else if(hour>=16 && hour<20)
     { // Evening
      setTimeicon("🌇"); 
     }
  else {  // Night 
   setTimeicon("🌙");    }
 };
checkTime();
const interval = setInterval(checkTime, 60000);
   return () => clearInterval(interval);
},[])
  return (
    <div className="bg-purple-100 min-h-screen ">
      <header className="flex justify-between items-center  px-1 mt-0 pt-0  ">
        <img src={logo} alt="Logo" className="w-auto h-26  " />
        {/* logout button */}
        <div>
         <button onClick={handleLogout} className="relative flex items-center gap-2 px-5 py-2
          border-2 border-indigo-400 text-indigo-500
          font-mono font-semibold rounded-xl overflow-hidden
          hover:text-white transition-all duration-300 group">
          <span className="absolute inset-0 bg-linear-to-r from-indigo-400 to-purple-400
            transform -translate-x-full group-hover:translate-x-0
            transition-transform duration-300"></span>
          <span className="relative">Logout ✦</span>
        </button>
        
        </div>
      </header>
<div className="h-0.5 mb-8 bg-linear-to-r from-transparent via-indigo-400 to-transparent" />
      <h1 className=" sm:text-3xl text-3xl font-mono text-indigo-700 text-center mb-4">
        My Day {Timeicon}
      </h1>
      <p className="sm:text-xl text-xl font-mono text-indigo-700 text-center mb-8">
        Hey, {name}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 p-2 gap-5 max-w-4xl mx-auto">
        {habits.map((habit, index) => (
          
          <div
          key={index}
           className={` flex justify-between rounded-2xl shadow-md p-5 border-2 transition-all duration-300
      ${
        habit.completed
          ? "bg-gray-200 border-gray-300 opacity-80"
          : "bg-white border-indigo-100"
      }
    `}
          >
            <div>
            {/* habit.name */}
          <p  className={`font-mono font-bold text-lg ${habit.completed ? "line-through text-gray-500"
        : "text-indigo-700"  } `}>
              {habit.name}
            </p>
            
  
            {/* habit.time  */}
            <p className={ ` ${habit.completed?  'text-gray-500' : 'text-indigo-700'  } text-sm font-mono mt-2`}>
            
              ⏰{habit.time}
            </p>
            </div>  
            {/* checkbox */}
             <div >  <input
         type="checkbox"
         checked={habit.completed}
         onChange={() => handleToggle(index)}
className="w-5 h-5 cursor-pointer appearance-none rounded-full border-2 border-gray-400
bg-white transition-all
checked:bg-gray-500 checked:border-gray-500"       /></div>
             
                 </div>
               
        ))}
       
      </div>
 <div className="text-center mt-8">
    <button onClick={() => navigate('/lifestyleselection')} className="px-6 py-2 border-2 border-indigo-500 text-indigo-600 font-mono font-bold rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-300">
      ← Edit Habits
    </button>
  </div>
    </div>
  );
}

export default Myday;
