module.exports = getText = (args) => {
    const schema = args.charAt(0).toUpperCase() + args.slice(1)+'Schema';
    const model = args.charAt(0).toUpperCase() + args.slice(1);
    const text = `const mongoose = require('mongoose');
const { Schema } = mongoose;
const uniqueValidator = require('mongoose-unique-validator');

const ${schema} = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    dueDate: { type: Date, default: new Date(), required: true},
    status: { type: String, required: true, enum: ["In progress", "Done", "To Do"]},
    notes: { type : String }
});

${schema}.plugin(uniqueValidator);
module.exports = mongoose.model('${model}', ${schema});
`;
    return text;
};