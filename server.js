const express = require('express');
const hbs = require('hbs');
const fs = require('fs');


const port = process.env.PORT || 3000;

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');



//middleware - app.use is how you register middleware
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);

    fs.appendFile('server.log', log + '\n', (err) => {
        if(err) {
            console.log('Unable to append to server.log')
        }
    });
    next();
});

// app.use((req, res, next) => {
//     res.render('maintenance.hbs', {
//         docTitle: 'Maintenance Page',
//         welcomeMessage: 'So Sorry... :(  Be back Soon!!!'
//     })
//     next();
// });


//middleware to take absolute path to the folder that you want to serve up
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('getCopyright', () => {
    return `Copyright ${new Date().getFullYear()}.`
})

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
})

app.get('/', (req, res) => {
    // res.send('<h1>Hello Express</h1>');
    res.render('home.hbs', {
        docTitle: 'Home Page',
        user: require("os").userInfo().username,
        welcomeMessage: 'Welcome to your home page!',


    })
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        docTitle: 'About Page',
    });
});


app.get('/bad', (req, res) => {
    res.send({
        errorMessage: "Something bad happened here..."
    });
});


app.listen(port, () => {
    console.log(`server running on port ${port}`)
});