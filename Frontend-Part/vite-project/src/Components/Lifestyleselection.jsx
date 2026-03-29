import React, { useEffect, useState } from "react";
import logo from "../assets/Images/logo.png";
import { useNavigate } from "react-router-dom";
import HabitCoach from "./HabitCoach";
import { fetchHabits, addHabitApi, updateHabitApi,deleteHabitApi,}  from "../api/habitApi";
function Lifestyleselection() {
  const navigate = useNavigate();

  const [habit, setHabit] = useState("");
  const [habitTime, setHabitTime] = useState("");

  const [habitsList, setHabitsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editHabitId, setEditHabitId] = useState(null);
  const [activeTab, setActiveTab] = useState("manual");

  useEffect(()=>{
    const loadHabits = async ()=>{
      const habits =await fetchHabits();
      setHabitsList(habits);
      setLoading(false);
    };
    loadHabits();
   
  },[]); 


  const handleAdd = async() => {
    if (!habit.trim() || !habitTime) return;
 if (editHabitId) { const updated = await updateHabitApi(editHabitId, { name: habit, time: habitTime });
setHabitsList(prev =>
        prev.map(h => h._id === updated._id ? updated : h)
 );
setEditHabitId(null);
} 

else {
const saved = await addHabitApi({ name: habit, time: habitTime });
setHabitsList(prev => [...prev, saved]);
    }
 
    setHabit("");
    setHabitTime("");


};

  
  const handleEdit = (item) => {
      setHabit(item.name);         
    setHabitTime(item.time);     
    setEditHabitId(item._id);
  };

  const handleDelete = async(id) => {
 await deleteHabitApi(id);
  setHabitsList(prev => prev.filter(h => h._id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
      localStorage.removeItem("name");
    navigate("/login");
  };

  const handleAddFromAI = async (aiHabit) => {
    const saved = await addHabitApi({ name: aiHabit.habit, time: aiHabit.time });
    setHabitsList(prev => [...prev, saved]);
  };
 

  return (
    <div className="bg-purple-100 min-h-screen flex flex-col items-center">
      {/* HEADER */}
      <header className="flex justify-between items-center w-full px-6 mt-0 pt-0">
        <img src={logo} alt="Logo" className="w-auto h-26" />
        <button
          onClick={handleLogout}
          className="relative flex items-center gap-2 px-5 py-2 border-indigo-500 bg-linear-to-r from-indigo-500 to-purple-500 text-white font-mono font-semibold rounded-xl overflow-hidden hover:text-white transition-all duration-300 group"
        >
          <span className="absolute inset-0 bg-linear-to-r from-indigo-400 to-purple-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
          <span className="relative">Logout ✦</span>
        </button>
      </header>

      <div className="h-0.5 mb-8 w-full bg-linear-to-r from-transparent via-indigo-400 to-transparent" />

      {/* MODE TOGGLE */}
      <div className="flex gap-2 justify-center my-4">
        <button
          onClick={() => setActiveTab("manual")}
          className={`px-5 py-2 rounded-xl font-semibold border-2 transition-all duration-200 ${
            activeTab === "manual"
              ? "bg-linear-to-r from-indigo-500 to-purple-500 text-white border-indigo-500"
              : "border-indigo-400 text-indigo-500"
          }`}
        >
          Add Manually
        </button>
        <button
          onClick={() => setActiveTab("ai")}
          className={`px-5 py-2 rounded-xl font-semibold border-2 transition-all duration-200 ${
            activeTab === "ai"
              ? "bg-linear-to-r from-indigo-500 to-purple-500 text-white border-indigo-500"
              : "border-indigo-400 text-indigo-500"
          }`}
        >
          AI Coach ✨
        </button>
      </div>

      {/* ── TWO-COLUMN ON MD+, SINGLE COLUMN ON MOBILE ── */}
      <div className="w-full max-w-5xl px-4 flex flex-col md:flex-row gap-6 items-stretch justify-center">

        {/* LEFT — Input Panel */}
        <div className="w-full md:w-1/2 flex flex-col">
          {activeTab === "manual" ? (
            <div className="flex flex-col gap-4 p-6 bg-white rounded-3xl shadow-xl border border-gray-100 h-full">
              <h2 className="text-lg font-bold text-indigo-700 font-mono">➕ Add a Habit and Time</h2>
              <input
                type="text"
                value={habit}
                onChange={(e) => setHabit(e.target.value)}
                placeholder="Enter habit name"
                className="w-full p-3 rounded-xl border-none text-base bg-white
                           shadow-[5px_5px_15px_#bebebe,-5px_-5px_15px_#ffffff]
                           focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="time"
                value={habitTime}
                onChange={(e) => setHabitTime(e.target.value)}
                className="w-full p-3 rounded-xl border-none text-base bg-white
                           shadow-[5px_5px_15px_#bebebe,-5px_-5px_15px_#ffffff]
                           focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                onClick={handleAdd}
                type="button"
                className="w-full py-3 rounded-xl font-mono font-bold text-white text-lg bg-linear-to-r from-red-500 to-rose-500 shadow-lg hover:shadow-red-300 transform transition-all duration-300 hover:scale-105 hover:from-red-600 hover:to-rose-600 active:scale-95"
              >
                {editHabitId !== null ? "Update Habit ✏️" : "Add Habit 🔥"}
              </button>
            </div>
          ) : (
            /* AI Coach fills the left column */
            <HabitCoach onAddHabit={handleAddFromAI} />
          )}
        </div>

        {/* RIGHT — Habits List */}
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 flex flex-col h-full">
            <h2 className="text-lg font-bold text-indigo-700 font-mono mb-3">📋 Your Habits</h2>

            <div className="flex-1 flex flex-col overflow-hidden">
            {habitsList.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">
                No habits yet. Add some on the left! 👈
              </p>
            ) : (
              <>
                {/* Table Header */}
                <div className="flex justify-between font-bold text-indigo-700 mb-2 px-1 text-sm">
                  <p className="flex-1">Habit</p>
                  <p className="w-20 text-center">Time</p>
                  <p className="w-24 text-center">Actions</p>
                </div>

                {/* Habit Rows */}
                <div className="flex flex-col gap-2 flex-1 overflow-y-auto pr-1">
                  {habitsList.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-purple-50 rounded-xl px-3 py-2 border border-purple-100"
                    >
                      <span className="flex-1 text-sm text-gray-800 truncate">{item.name}</span>
                      <span className="w-20 text-center text-xs text-gray-500">{item.time}</span>
                      <div className="flex gap-1.5 w-24 justify-center">
                        <button
                          onClick={() => handleEdit(item)}
                          className="px-2 py-1 text-xs border border-cyan-500 text-cyan-500 rounded-lg hover:bg-cyan-500 hover:text-white transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="px-2 py-1 text-xs border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                        >
                          Del
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            </div>

            {/* Let's Go inside the right panel on desktop */}
            <button
              onClick={() => navigate("/myday", { state: { habits: habitsList } })}
              className="w-full mt-auto pt-4 py-3 rounded-xl font-mono font-bold text-white text-lg bg-linear-to-r from-indigo-500 to-purple-500 shadow-lg hover:shadow-indigo-300 transform transition-all duration-300 hover:scale-105 hover:from-indigo-600 hover:to-purple-600 active:scale-95"
            >
              Let's Go 🚀
            </button>
          </div>
        </div>
      </div>

     
    </div>
  );
}

export default Lifestyleselection;