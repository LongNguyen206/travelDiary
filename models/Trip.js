const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TripSchema = new Schema({
    country: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    user: {
        type: Object,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

//first parameter is pluralized file name
mongoose.model('trips', TripSchema);