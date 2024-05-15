const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema({
    email: { type: String, unique: false, required: true },
    good: {type: Boolean, unique: false, required: true},
    habit: { type: String, unique: false, required: true },
    dailyQuestion: { type: String, unique: false, required: true },
    frequency: { type: Number, required: true },
});

const Habit = mongoose.model('Habit', habitSchema);

module.exports = Habit;
