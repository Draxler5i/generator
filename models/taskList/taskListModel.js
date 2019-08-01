const mongoose = require('mongoose');
const { Schema } = mongoose;
const uniqueValidator = require('mongoose-unique-validator');

const TaskListSchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    dueDate: { type: Date, default: new Date(), required: true},
    status: { type: String, required: true, enum: ["In progress", "Done", "To Do"]},
    notes: { type : String }
});

TaskListSchema.plugin(uniqueValidator);
module.exports = mongoose.model('TaskList', TaskListSchema);