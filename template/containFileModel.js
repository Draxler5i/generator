module.exports = getText = (args) => {
    const schema = args.charAt(0).toUpperCase() + args.slice(1)+'Schema';
    const model = args.charAt(0).toUpperCase() + args.slice(1);
    const text = `const mongoose = require('mongoose');
const { Schema } = mongoose;

const ${schema} = new Schema({
    name: { type: String }
});

module.exports = mongoose.model('${model}', ${schema});
`;
    return text;
};