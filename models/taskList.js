const mongoose = require('mongoose');
const { Schema } = mongoose;

let TaskListSchema = new Schema({
    name: { type: String },
    description: { type: String},
    status: { type: String},
    dueDate: { type: Date, default: new Date()},
});

module.exports = mongoose.model('taskList', TaskListSchema);