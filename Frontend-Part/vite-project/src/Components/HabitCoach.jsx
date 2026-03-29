import React, { useState, useRef, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
        HC
      </div>
      <div className="flex gap-1 items-center px-4 py-3 bg-white border border-gray-100 rounded-2xl rounded-bl-sm shadow-sm">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function HabitCard({ habitObj, onAddHabit }) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (!added) {
      setAdded(true);
      onAddHabit(habitObj);
    }
  };

  return (
    <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 gap-3">
      <div>
        <p className="text-sm font-semibold text-gray-800">{habitObj.habit}</p>
        <p className="text-xs text-gray-400">{habitObj.time}</p>
      </div>
      <button
        onClick={handleAdd}
        className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-all duration-200 whitespace-nowrap shrink-0 ${
          added
            ? "bg-emerald-600 border-emerald-600 text-white cursor-default"
            : "border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white"
        }`}
      >
        {added ? "✓ Added" : "+ Add"}
      </button>
    </div>
  );
}

function BotMessage({ content, habitList, onAddHabit }) {
  return (
    <div className="flex items-end gap-2 max-w-[85%] sm:max-w-sm">
      <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
        HC
      </div>
      <div className="px-4 py-3 bg-white border border-gray-100 rounded-2xl rounded-bl-sm shadow-sm text-sm text-gray-800 leading-relaxed">
        {content}
        {habitList && habitList.length > 0 && (
          <div className="flex flex-col gap-2 mt-3">
            {habitList.map((h, i) => (
              <HabitCard key={i} habitObj={h} onAddHabit={onAddHabit} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function UserMessage({ content }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] sm:max-w-xs px-4 py-3 bg-violet-600 text-white rounded-2xl rounded-br-sm text-sm leading-relaxed shadow-sm">
        {content}
      </div>
    </div>
  );
}

function HabitCoach({ onAddHabit }) {
  const [age, setAge] = useState("");
  const [goal, setGoal] = useState("");
  const [profession, setProfession] = useState("");

  const [messages, setMessages] = useState([
    {
      type: "bot",
      content:
        "Hey! 👋 I'm your personal Habit Coach. Tell me about yourself and I'll generate a custom daily routine just for you.",
    },
  ]);
  const [typing, setTyping] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const delay = (ms) => new Promise((r) => setTimeout(r, ms));

  const generateAI = async () => {
    if (!age || !goal || !profession) {
      setError("Please fill in all fields before sending.");
      setFormOpen(true);
      return;
    }
    setError("");
    setSubmitted(true);
    setFormOpen(false);

    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        content: `Age: ${age} | Goal: ${goal} | Profession: ${profession}`,
      },
    ]);

    await delay(400);
    setTyping(true);
    await delay(1200);
    setTyping(false);

    setMessages((prev) => [
      ...prev,
      { type: "bot", content: "Got it! ✨ Generating your personalized routine..." },
    ]);

    try {
      const res = await fetch(`${API}/api/ai/generate-routine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ age, goal, profession }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();

      await delay(600);
      setTyping(true);
      await delay(1200);
      setTyping(false);

      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: "Here's your custom routine! Add the ones you like 👇",
          habitList: data.habits,
        },
      ]);
    } catch (err) {
      console.error("Fetch Error:", err);
      setTyping(false);
      setSubmitted(false);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: "⚠️ Something went wrong. Please try again.",
        },
      ]);
    }
  };

  return (
    <div className="w-full flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 bg-white shrink-0">
        <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
          HC
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">Habit Coach AI</p>
          <span className="text-xs text-emerald-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            online
          </span>
        </div>
        <span className="text-xl shrink-0">🌱</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.map((msg, i) =>
          msg.type === "bot" ? (
            <BotMessage
              key={i}
              content={msg.content}
              habitList={msg.habitList}
              onAddHabit={onAddHabit}
            />
          ) : (
            <UserMessage key={i} content={msg.content} />
          )
        )}
        {typing && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-100 px-4 pt-3 pb-4 bg-white shrink-0">
        {formOpen && (
          <div className="mb-3 bg-violet-50 border border-violet-100 rounded-2xl p-3 flex flex-col gap-2.5">
            {error && (
              <p className="text-xs text-red-500 font-medium px-1">{error}</p>
            )}
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500 w-20 shrink-0">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 22"
                className="flex-1 px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white outline-none focus:border-violet-500 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500 w-20 shrink-0">Goal</label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. lose weight, study better"
                className="flex-1 px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white outline-none focus:border-violet-500 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500 w-20 shrink-0">Profession</label>
              <input
                type="text"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="e.g. student, developer"
                className="flex-1 px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>
        )}

        <div className="flex gap-2 items-center">
          <button
            onClick={() => {
              if (!submitted) setFormOpen((prev) => !prev);
            }}
            disabled={submitted}
            className={`flex-1 text-left px-4 py-2.5 rounded-full text-sm border transition-all duration-200 outline-none ${
              submitted
                ? "bg-gray-50 text-gray-400 border-gray-100 cursor-default"
                : formOpen
                ? "bg-white border-violet-400 text-gray-700"
                : "bg-gray-50 border-gray-200 text-gray-400 hover:border-violet-300 cursor-pointer"
            }`}
          >
            {submitted
              ? "✅ Routine generated!"
              : formOpen
              ? "Fill in your details above, then hit send →"
              : "Click here to fill your details..."}
          </button>
          <button
            onClick={generateAI}
            disabled={submitted}
            className="w-10 h-10 rounded-full bg-violet-600 hover:bg-violet-700 disabled:bg-gray-200 flex items-center justify-center shrink-0 transition-colors duration-200 shadow-sm"
          >
            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
              <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default HabitCoach;