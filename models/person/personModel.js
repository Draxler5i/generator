const mongoose = require('mongoose');
const { Schema } = mongoose;
const TaskList = require('../taskList/taskListModel');
const uniqueValidator = require('mongoose-unique-validator');

const PersonSchema = new Schema({
    name: { type: String, required: true, unique: true },
    task: { type: Schema.ObjectId, ref: 'TaskList'}
});

PersonSchema.plugin(uniqueValidator);
const PersonModel = mongoose.model('Person', PersonSchema);
module.exports = PersonModel;