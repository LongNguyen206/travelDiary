const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    googleID: { type: String },
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String },
    image: { type: String },
    countriesShort: { type: Array },
    countriesLong: { type: Array },
    date: { type: Date, default: Date.now() }
});

//first parameter is pluralized file name
mongoose.model('users', UserSchema);