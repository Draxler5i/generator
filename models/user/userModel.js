const mongoose = require('mongoose');
const { Schema } = mongoose;
const uniqueValidator = require('mongoose-unique-validator');

let schemaOptions = {
    timestamps: {}
}
const rolesEnum = ["Admin", "User"];

let UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    roles: { type: String, enum: rolesEnum, default: "User" }
}, schemaOptions);

UserSchema.plugin(uniqueValidator);
let User = mongoose.model('User', UserSchema);
module.exports = User;