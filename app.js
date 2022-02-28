const express = require('express');
const mongoose = require('./db/db');
const bodyParser = require('body-parser');
session = require('express-session')
const app = express();
app.set('view engine', 'hbs');
var hbs = require('hbs');
const staff = require('./models/user');
app.use(bodyParser.urlencoded({ extended: true }));
// register path to partials
hbs.registerPartials(__dirname + '/views/partials/');
// hbs.registerHelper('dateFormat', require('handlebars-dateformat'));
app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
    res.render('index')
});
const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log('listening on port' + PORT);