let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ServiceLogSchema = new Schema({
    user: { type: String, default: "user.test@niceincontact.com" },
    username: { type: String, required: true },
    category: { type: String, required: true },
    action: { type: String, required: true },
    message: { type: String, required: true },
    success: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ServiceLog', ServiceLogSchema);