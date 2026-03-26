const BASE = `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/habits`;
const getToken = ()=> localStorage.getItem("token");
const headers =()=>({
    "Content-Type":"application/json",
    Authorization: `Bearer ${getToken()}`
});

// Get all habits
export const fetchHabits =async()=>{
    const res = await fetch(BASE,{headers:headers()});
    const data = await res.json();
    return data.habits || [];
};

// Post add new habit 
export const addHabitApi = async (habit)=>{
    const res = await fetch(BASE,{
        method:"POST",
        headers:headers(),
        body:JSON.stringify(habit)
    });
    const data = await res.json();
    return data.habit;
};
// PUT update habit (toggle or edit)
export const updateHabitApi = async(id, updates)=>{
    const res = await fetch (`${BASE}/${id}`,{
        method:"PUT",
        headers:headers(),
        body:JSON.stringify(updates)
    });
    const data = await res.json();
    return data.habit;
}
// Delete habit
export const deleteHabitApi =async(id)=>{
    await fetch(`${BASE}/${id}`,{
        method:"DELETE",
        headers: headers()
    });
};