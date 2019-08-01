const mongoose = require('mongoose');
const { Schema } = mongoose;
const uniqueValidator = require('mongoose-unique-validator');

const GithubSchema = new Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, unique: true }
});

GithubSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Github', GithubSchema);