const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TripSchema = new Schema({
    title: { type: String, required: true },
    destination: {
        fullDestination: { type: String, required: true },
        countryShort: { type: String },
        countryLong: { type: String },
        lat: { type: String, required: true },
        lng: { type: String, required: true }
    },
    dateFrom: { type: Date },
    dateTo: { type: Date },
    description: { type: String },
    status: { type: String, default: 'public'},
    allowComments: { type: Boolean, default: true },
    comments: [{
        commentBody: { type: String },
        commentDate: { type: Date, default: Date.now() },
        commentUser: { type: Schema.Types.ObjectId, ref: 'users' }
    }],
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    date: { type: Date, default: Date.now() }
});

//first parameter is pluralized file name
mongoose.model('trips', TripSchema);