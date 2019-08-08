const mongoose = require('mongoose');
const { Schema } = mongoose;
const uniqueValidator = require('mongoose-unique-validator');

const TaskListSchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    dueDate: { type: Date,
        //  default: new Date('2019-08-08T12:30:00'),
        },
    priority: { type: String, default: "Low" },
    status: { type: String, required: true, enum: ["In progress", "Done", "To Do"] },
    notes: { type: String }
});

TaskListSchema.plugin(uniqueValidator);
const model = mongoose.model('TaskList', TaskListSchema);

// TaskListSchema.post('save', function (error, doc, next) {
//     model.schema.paths.map(path => {
//         if (error[path] && error[path] === 'MongoError' && error.code === 11000) {
//             next(new Error(`${path} must be unique`));
//         } else {
//             next(error);
//         }
//     })
// });

module.exports = model;