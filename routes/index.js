const express = require('express');
const router = express.Router();
//bring in the ensureAuthenticated helper:
const {ensureAuthenticated, ensureGuest} = require('../helper/auth');

router.get('/', ensureGuest, (req, res) => {
    res.render('index/welcome');
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('index/dashboard');
});

router.get('/mymap', ensureAuthenticated, (req, res) => {
    res.render('index/map', {layout: 'nocontainer'});
});

module.exports = router;