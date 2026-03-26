const express = require("express");
const router = express.Router();
const ensureAuthenticated = require("../Middlewares/Auth");
const {getHabits, addHabit, updateHabit, deleteHabit}= require("../Controllers/HabitController")
router.get("/",ensureAuthenticated, getHabits);
router.post("/",ensureAuthenticated, addHabit);
router.put("/:id",ensureAuthenticated, updateHabit);
router.delete("/:id",ensureAuthenticated, deleteHabit);

module.exports= router;
