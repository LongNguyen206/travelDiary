const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//use this for Flash messages:
const flash = require('connect-flash');
const googleMapsClient = require('@google/maps').createClient({
    key: process.env.GEOCODER_API_KEY,
    Promise: Promise
  });
//bring in the ensureAuthenticated helper:
const {ensureAuthenticated} = require('../helper/auth');

require('../models/Trip');
const Trip = mongoose.model('trips');
require('../models/User');
const User = mongoose.model('users');

//show all trips from db:
router.get('/', (req, res) => {
    Trip.find({ status: 'public'})
    .populate('user')
    .then(trips => {
        res.render('trips/index', {
            trips: trips,
            helpers: {
                formatDate: input => { 
                    return input.toString().substr(0,21);
                }
            }
        });
    })
    .catch(err => console.log(err));
});

//add form
router.get('/new', ensureAuthenticated, (req, res) => {
    res.render('trips/new');
});

router.post('/', (req, res) => {
    console.log(req.body);
    let allowComments;
    if (req.body.allowComments) {
        allowComments = true;
    } else {
        allowComments = false;
    }
    googleMapsClient.geocode({address: `${req.body.destination}`})
    .asPromise()
    .then(response => {
        let place = response.json.results[0];
        if (place == undefined) {
            req.flash('error_msg', 'Enter a valid location');
            res.redirect('trips/new');
        } else {
            let address = place.address_components;
            let index = address.findIndex(x => x.types[0] == "country");
            let newTrip = {
                title: req.body.title,
                destination: {
                    fullDestination: place.formatted_address,
                    countryShort: address[index].short_name,
                    countryLong: address[index].long_name,
                    lat: place.geometry.location.lat,
                    lng: place.geometry.location.lng
                },
                description: req.body.description,
                dateFrom: req.body.dateFrom,
                dateTo: req.body.dateTo,
                allowComments: allowComments,
                status: req.body.status,
                user: req.user
            }
        
            new Trip(newTrip).save() //returns a promise:
            .then(trip => {
                User.findById({
                    _id: trip.user.id
                })
                .then(user => {
                    // if(user.countriesShort.indexOf(trip.destination.countryShort) === -1) {
                        user.countriesShort.push(trip.destination.countryShort);
                        user.countriesLong.push(trip.destination.countryLong);
                    // };
                    user.save()
                    .then(() => res.redirect(`/trips/${trip.id}/show`));
                });
            });
        }
    })
    .catch((err) => console.log(err));
});

//show a particular Trip
router.get('/:id/show', (req, res) => {
    Trip.findById({
        _id: req.params.id
    })
    .populate('user')
    .then(trip => {
        res.render('trips/show', {
            trip: trip,
            helpers: {
                formatDate: input => { 
                    return input.toString().substr(0,21);
                }
            }
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
        trip.destination = req.body.destination,
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
            User.findById({
                _id: trip.user._id
            })
            .then(user => {
                console.log(user);
                let index = user.countriesShort.indexOf(trip.destination.countryShort);
                if (index > -1) {
                    user.countriesShort.splice(index, 1);
                    user.countriesLong.splice(index, 1);
                }
                user.save()
                .then(() => {
                    trip.remove()
                    .then(() => {
                    req.flash('success_msg', 'Trip successfully deleted');
                    res.redirect('/trips');
                    })
                });
            });
        };
    })
    .catch(err => console.log(err));
});

module.exports = router;