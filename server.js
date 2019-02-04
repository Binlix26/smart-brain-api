const express = require('express');
const app = express();
const PORT = process.env.PORT;
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
// Controllers
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
// tools
const utility = require('./tools/tools').utility;

const db = require('knex')({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'binlix26',
        password: '',
        database: 'smart-brain'
    }
});

// middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

// controller
app.get('/', (req, res) => {
    db(utility.TABLE_USERS).select().then(users => {
        res.json(users);
    });
});
app.post('/signin', signin.handleSignin(db, bcrypt, utility));
app.post('/register', register.handleRegister(db, bcrypt, utility));
app.get('/profile/:id', profile.handleProfile(db, utility));
app.put('/image', image.handleImage(db, utility));

app.listen(PORT || 3000, () => {
    console.log(`app is running on port ${PORT}`);
});