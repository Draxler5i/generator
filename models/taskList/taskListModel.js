const mongoose = require('mongoose');
const { Schema } = mongoose;
const uniqueValidator = require('mongoose-unique-validator');

const TaskListSchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    dueDate: { type: Date },
    priority: { type: String, default: "Low" },
    status: { type: String, required: true, enum: ["In progress", "Done", "To Do"] },
    notes: { type: String }
});

TaskListSchema.plugin(uniqueValidator);
const model = mongoose.model('TaskList', TaskListSchema);
module.exports = model;