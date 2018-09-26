const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//use this for Flash messages:
const flash = require('connect-flash');
//bring in the ensureAuthenticated helper:
const {ensureAuthenticated} = require('../helper/auth');
//require the trip model (no need for extention)
require('../models/Trip');
//create a Trip model
const Trip = mongoose.model('trips');

//add form
router.get('/new', ensureAuthenticated, (req, res) => {
    res.render('trips/new');
})

router.post('/', (req, res) => {
    //server-side validations:
    let errors = [];
    if (!req.body.country) {
        errors.push({text: "Add a Country!"});
    }
    if (!req.body.description) {
        errors.push({text: "Add a Description!"});
    }
    if (errors.length > 0) {
        //if there are any errors, re-render the form instead of submitting it
        res.render('trips/new', {
            errors: errors,
            country: req.body.country,
            description: req.body.description
        });
    } else {
        let newTrip = {
            country: req.body.country,
            description: req.body.description,
            user: req.user
        }
        new Trip(newTrip).save() //returns a promise:
        .then(trips => {
            res.redirect('/trips');
        })
        .catch(err => console.log(err));
    }
});

//show all trips from db:
router.get('/', (req, res) => {
    Trip.find()
    .then(trips => {
        res.render('trips/index', {
            trips: trips
        });
    })
    .catch(err => console.log(err));
});

//show a particular Trip
router.get('/:id/show', (req, res) => {
    Trip.findById({
        _id: req.params.id
    })
    .then(trip => {
        res.render('trips/show', {
            trip: trip
        });
    })
    .catch(err => console.log(err));
});

//edit a particular Trip
router.get('/:id/edit', ensureAuthenticated, (req, res) => {
    Trip.findById({
        _id: req.params.id
    })
    .then(trip => {
        if (trip.user._id != req.user.id) {
            req.flash('error_msg', 'Cannot edit this Trip');
            res.redirect('/trips');
        } else {
            res.render('trips/edit', {
                trip: trip
            });
        };
    })
    .catch(err => console.log(err));
});

router.put('/:id', (req, res) => {
    Trip.findById({
        _id: req.params.id
    })
    .then(trip => {
        //update the trip with the values from the form
        trip.country = req.body.country,
        trip.description = req.body.description,
        //save it
        trip.save()
        .then(() => res.redirect('/trips'));
    })
    .catch(err => console.log(err));
});

//delete the Trip
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Trip.findById({
        _id: req.params.id
    })
    .then(trip => {
        if (trip.user._id != req.user.id) {
            req.flash('error_msg', 'Cannot delete this trip');
            res.redirect('/trips');
        } else {
            trip.remove()
            .then(() => {
                req.flash('success_msg', 'Trip successfully deleted');
                res.redirect('/trips');
            })
        };
    })
    .catch(err => console.log(err));
});

module.exports = router;