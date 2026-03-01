import React, { useEffect, useState } from 'react'
import logo from "../assets/Images/logo.png"

import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
function Lifestyleselection() {
    const navigate = useNavigate();
    const [habit, sethabit] = useState("");
    const [habitTime, sethabitTime]= useState('');
    const [habitslist, sethabitslist]= useState(()=>{
        return JSON.parse(localStorage.getItem("habits")) || [];
    });
    const [editIndex, setEditIndex] = useState(null);
   
    const saveLs=(habitslist)=>{
    localStorage.setItem("habits", JSON.stringify(habitslist))
    }
    const handleAdd = ()=>{
        if(habit.trim()==""&&!habitTime)return;
        const newHabit ={
          id:editIndex !== null ? habitslist[editIndex] : Date.now(),
          name:habit,
          time:habitTime,
          completed:false
        };
         let updatelist=   [...habitslist];
   if(editIndex !==null){
    // editing existing habit
    updatelist[editIndex] = newHabit;
  
    setEditIndex(null);
   }
   else{
    // adding new habit
    updatelist.push(newHabit);
   }
         sethabitslist(updatelist)
            saveLs(updatelist)
            // clear input
            sethabit("");
            sethabitTime("");
        
    };
    // edit button
    const handleEdit =(index)=>{
        sethabit(habitslist[index].name);
        sethabitTime(habitslist[index].time);
        setEditIndex(index);

    }
// delete button
    const handleDelete=(index)=>{
        const updatelist = habitslist.filter((item,i)=>i !== index)
        sethabitslist(updatelist);
        saveLs(updatelist)

    }
// logout button 

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

 

  return (
 <>
 <div className="bg-purple-100 min-h-screen ">
 <header className='flex justify-between items-center   px-1 mt-0 pt-0 '>
    <img src={logo} alt="Logo" className='w-auto h-26  ' />
    {/* logout button */}
  <button onClick={handleLogout} class="relative flex items-center gap-2 px-5 py-2
          border-2 border-indigo-400 text-indigo-500
          font-mono font-semibold rounded-xl overflow-hidden
          hover:text-white transition-all duration-300 group">
          <span class="absolute inset-0 bg-linear-to-r from-indigo-400 to-purple-400
            transform -translate-x-full group-hover:translate-x-0
            transition-transform duration-300"></span>
          <span class="relative">Logout ✦</span>
        </button>


 </header>
 <form className='p-6 sm:p-6'>
    <h1 className='text-center sm:text-3xl text-3xl font-mono text-indigo-700'>Add your daily habits</h1>
    <div className='flex flex-col items-center mt-10 sm:mt-10'>
<input value={habit} onChange={(e)=>sethabit(e.target.value)} type="text" placeholder='Add your habits'className='border-2 h-10 sm:h-12 w-full max-w-xs sm:max-w-md rounded-md m-2 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400' />
<input type="time" value={habitTime} onChange={(e)=> sethabitTime(e.target.value)}/>

  <button onClick={handleAdd}
            className="
              w-full max-w-xs sm:max-w-md
              px-4 sm:px-6 py-2 sm:py-3
              mt-3
              bg-linear-to-r from-red-500 to-pink-500
              text-white font-bold
              rounded-md
              shadow-xl
              transform transition-all duration-300
              hover:scale-105 hover:from-red-600 hover:to-pink-600
              active:scale-95
              focus:outline-none focus:ring-4 focus:ring-pink-300
            "
            type='button'
          >
            Add
          </button>
          
          {/* display the habits */}

       <div className="border-2 h-auto  w-full max-w-xs sm:max-w-md mt-6 p-4 rounded-md bg-white shadow-md">
       <div className="flex justify-between items-center font-bold text-indigo-700 mb-2 
                text-sm sm:text-base px-2 sm:px-0">
  <p className="w-8">Habit</p>
  <p className="">Completed By</p>
  <p className=" text-center">Actions</p>
</div>

        {habitslist.map((item, index)=>{
            return(
                <div className=' gap-2 flex justify-between' key={index}>
                    
            <li className=' list-none font-mono text-indigo-700 text-bold w-16 truncate shrink-0 '>{item.name}</li>
            <li className='list-none font-mono text-indigo-700 text-bold w-17 truncate shrink-0'>
 {item.time}
</li>
            <div className='flex gap-2 mb-2'>
                {/* Edit button  */}
    <button  onClick={()=>handleEdit(index)} type='button' className=" shrink-0 px-3 py-2 border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-white font-medium rounded-lg transition-all duration-200">
  Edit
</button>
{/* Delete button */}
                   <button onClick={()=>handleDelete(index)} type='button' className=" shrink-0 px-3 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-medium rounded-lg transition-all duration-200">
  Delete
</button>
                    </div>
                </div>
            )})}
            <button></button>
       </div>
       <button
  onClick={() => navigate('/myday')}
  type='button'
  className="w-full max-w-xs sm:max-w-md mt-4 py-3 rounded-xl font-mono font-bold text-white text-lg
    bg-linear-to-r from-indigo-500 to-purple-500
    shadow-lg hover:shadow-indigo-300
    transform transition-all duration-300
    hover:scale-105 hover:from-indigo-600 hover:to-purple-600
    active:scale-95"
>
  Let's Go 🚀
</button>
</div>
 </form>
 </div>
 </>
  )
}

export default Lifestyleselection
