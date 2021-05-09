const mongoose = require('mongoose');
const MShema =  mongoose.Schema;

const UserSchema = new MShema({
    name: String,
    age: Number,
    profession: String
})

module.exports = mongoose.model('User', UserSchema);