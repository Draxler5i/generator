const mongoose = require('mongoose');
const { Schema } = mongoose;
const Task = require('../taskList/taskListModel');
const uniqueValidator = require('mongoose-unique-validator');

const PersonSchema = new Schema({
    name: { type: String, required: true, unique: true },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task'}
});

PersonSchema.plugin(uniqueValidator);
const model = mongoose.model('Person', PersonSchema);
module.exports = model;