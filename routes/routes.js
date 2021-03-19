const express = require('express')
const session = require('express-session')
const router = express.Router()
const bodyParser = require('body-parser')
const { MongoClient } = require('mongodb')
require('dotenv').config()
const url = process.env.MONGODB_URL
const client = new MongoClient(url, { useUnifiedTopology: true })
const ObjectID = require('mongodb').ObjectID

router.use(
    session({
        secret: process.env.SESSION_SECRET,
        name: process.env.SESSION_NAME,
        resave: false,
        saveUninitialized: true,
}),
)

// const gaNaarLogin = (req, res, next) => {
//     if(!req.session.userID) {
//         res.redirect('pages/login')
//     } else {
//         next()
//     }
// }

// const gaNaarDashboard = (req, res, next) => {
//     if(req.session.userID) {
//         res.redirect('pages/dashboard')
//     } else {
//         next()
//     }
// }

// Database
const dbName = process.env.DB_NAME

async function run() {
    try {
        await client.connect()
        console.log('Connected correctly to server')
        const db = client.db(dbName)
    } catch (err) {
        console.error(err.stack)
    }
    return client
}
run().catch(console.dir)



// urlencodedParser variabele, middleware
const urlencodedParser = bodyParser.urlencoded({ extended: false })



// home pagina

router.get('/', function (req, res) {

    const db = client.db(dbName)

    // het vinden van alle gebruikers in de collectie users, deze worden op de homepagina gerenderd
    db.collection('users').find().toArray(function (err, users) {
        res.render('pages/index', { users: users })
    })
})


// register pagina


// renderen van pagina register
router.get('/register', urlencodedParser, function (req, res) {
    res.render('pages/register')
})

// Data naar de database inserten
router.post('/account', urlencodedParser, function (req, res) {
    const userInfo = {
        userID: ObjectID().toString(), // maakt een nieuw ObjectID aan en zet deze om in een string (voor het vinden van de gebruiker bij update)
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
        password: req.body.password
    }

    const db = client.db(dbName)

    db.collection('users').insertOne(userInfo, function () {
        console.log(userInfo.name, 'toegevoegd')
    })
    res.render('pages/account', { userInfo: userInfo })
})


// login pagina


router.get('/login', function (req, res) {
    res.render('pages/login')
})

router.post('/login', urlencodedParser, async (req, res) => {
    const db = client.db(dbName)
    let emailadres = req.body.email
    let passwordPost = req.body.password
    try {
        const user = await db.collection('users').findOne({email: emailadres})
        console.log(user)
        if(user.password == passwordPost) {
            console.log("wachtwoord klopt")
        } else {
            console.log("wachtwoord klopt niet")
        }
    } catch (error) {
        console.log(error)
    }
})


// update route
router.post('/account/update', urlencodedParser, function (req, res) {
    const userInfo = {
        userID: req.body.userID,
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
        password: req.body.password,
        area: req.body.area,
        date: req.body.date,
        myGender: req.body.myGender,
        searchGender: req.body.searchGender
    }

    const db = client.db(dbName)

    // update de gebruiker met het aangemakkte userID
    db.collection('users').updateOne({ 'userID': req.body.userID }, { $set: userInfo }, function () {
        console.log(userInfo.name, 'geupdate')
        res.render('pages/like')
    })
})



// delete route
router.post('/account/delete', urlencodedParser, function (req, res) {
    const userInfo = {
        userID: req.body.userID
    }

    const db = client.db(dbName)

    // verwijder de gerbuiker met het aangemaakte userID
    db.collection('users').deleteOne({ 'userID': req.body.userID }, function () {
        console.log(userInfo.userID, 'deleted')
        res.render('pages/delete-succes', { userInfo: userInfo })
    })
})



// 404 page
router.get('*', function (req, res) {
    res.render('pages/404')
});


// export de module zodat we hem weer kunnen gebruiker in server.js
module.exports = router;