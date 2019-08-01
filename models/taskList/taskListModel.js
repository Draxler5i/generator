const mongoose = require('mongoose');
const { Schema } = mongoose;

const TaskListSchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    dueDate: { type: Date, default: new Date(), required: true},
    status: { type: String, required: true, enum: ["In progress", "Done", "To Do"]},
    notes: { type : String }
});

module.exports = mongoose.model('TaskList', TaskListSchema);
