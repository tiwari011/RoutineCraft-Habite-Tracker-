import React, { useEffect, useState, useRef } from "react";
import logo from "../assets/Images/logo.png";
import { useNavigate } from "react-router-dom";
import { fetchHabits, updateHabitApi } from "../api/habitApi";

function Myday() {
  const navigate = useNavigate();
  const [habits, sethabits] = useState([]);
  const [name, setname] = useState("");
  const [Timeicon, setTimeicon] = useState("☀️");
  const habitsRef = useRef([]);

  // keep ref in sync with habits state
  useEffect(() => {
    habitsRef.current = habits;
  }, [habits]);

  // load habits
  useEffect(() => {
    const loadHabits = async () => {
      try {
        const data = await fetchHabits();
        sethabits(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load habits:", err);
        sethabits([]);
      }
    };
    loadHabits();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("lastHabitReset");
    navigate("/login");
  };

  // load username
  useEffect(() => {
    const User = localStorage.getItem("name");
    if (User) setname(User);
  }, []);

  const handleToggle = async (index) => {
    const targetHabit = habits[index];
    if (!targetHabit) return;
    const newCompleted = !targetHabit.completed;
    sethabits(prev =>
      prev.map(h => h._id === targetHabit._id ? { ...h, completed: newCompleted } : h)
    );
    try {
      await updateHabitApi(targetHabit._id, { completed: newCompleted });
    } catch (error) {
      console.error("Failed to toggle habit:", error);
      sethabits(prev =>
        prev.map(h => h._id === targetHabit._id ? { ...h, completed: targetHabit.completed } : h)
      );
    }
  };

  // reset every day
  useEffect(() => {
  const reset = async () => {
    const currentHabits = habitsRef.current;

    if (!currentHabits || !Array.isArray(currentHabits) || currentHabits.length === 0) {
      return;
    }

    const now = new Date();

    // ✅ PRODUCTION MODE — resets at midnight
    const todayKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

    const userId = localStorage.getItem("userId") || "default";
    const lastResetKey = `lastHabitReset_${userId}`;
    const lastReset = localStorage.getItem(lastResetKey);

    if (lastReset !== todayKey) {
      console.log("🔄 Resetting habits at midnight");
      localStorage.setItem(lastResetKey, todayKey);
      sethabits(prev => prev.map(h => ({ ...h, completed: false })));
      try {
        await Promise.all(
          currentHabits.map(h => updateHabitApi(h._id, { completed: false }))
        );
        console.log("✅ Habits reset done");
      } catch (err) {
        console.error("Reset DB error:", err);
      }
    }
  };

  const interval = setInterval(reset, 60000); // checks every 1 minute
  return () => clearInterval(interval);
}, []);

  // load Timeicon
  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 16) setTimeicon("☀️");
      else if (hour >= 16 && hour < 20) setTimeicon("🌇");
      else setTimeicon("🌙");
    };
    checkTime();
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-purple-100 min-h-screen">
      <header className="flex justify-between items-center px-1 mt-0 pt-0">
        <img src={logo} alt="Logo" className="w-auto h-26" />
        <div>
          <button
            onClick={handleLogout}
            className="relative flex items-center gap-2 px-5 py-2 border-indigo-500 bg-linear-to-r from-indigo-500 to-purple-500 text-white font-mono font-semibold rounded-xl overflow-hidden hover:text-white transition-all duration-300 group"
          >
            <span className="absolute inset-0 bg-linear-to-r from-indigo-400 to-purple-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
            <span className="relative">Logout ✦</span>
          </button>
        </div>
      </header>

      <div className="h-0.5 mb-8 bg-linear-to-r from-transparent via-indigo-400 to-transparent" />

      <h1 className="sm:text-3xl text-3xl font-mono text-indigo-700 text-center mb-4">
        My Day {Timeicon}
      </h1>
      <p className="sm:text-xl text-xl font-mono text-indigo-700 text-center mb-8">
        Hey, {name}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 p-2 gap-5 max-w-4xl mx-auto">
        {habits.map((habit, index) => (
          <div
            key={index}
            className={`flex justify-between rounded-2xl shadow-md p-5 border-2 transition-all duration-300 ${
              habit.completed
                ? "bg-gray-200 border-gray-300 opacity-80"
                : "bg-white border-indigo-100"
            }`}
          >
            <div>
              <p className={`font-mono font-bold text-lg ${habit.completed ? "line-through text-gray-500" : "text-indigo-700"}`}>
                {habit.name}
              </p>
              <p className={`${habit.completed ? "text-gray-500" : "text-indigo-700"} text-sm font-mono mt-2`}>
                ⏰{habit.time}
              </p>
            </div>
            <div>
              <input
                type="checkbox"
                checked={habit.completed}
                onChange={() => handleToggle(index)}
                className="w-5 h-5 cursor-pointer appearance-none rounded-full border-2 border-gray-400 bg-white transition-all checked:bg-gray-500 checked:border-gray-500"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <button
          onClick={() => navigate('/lifestyleselection')}
          className="p-3 border-indigo-500 bg-linear-to-r from-indigo-500 to-purple-500 text-white font-mono font-semibold rounded-xl overflow-hidden hover:text-white transition-all duration-300 group"
        >
          ← Edit Habits
        </button>
      </div>
    </div>
  );
}

export default Myday;