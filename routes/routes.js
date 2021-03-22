const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const { MongoClient } = require('mongodb')
require('dotenv').config()
const url = process.env.MONGODB_URL
const client = new MongoClient(url, { useUnifiedTopology: true })
const ObjectID = require('mongodb').ObjectID


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
        res.render('pages/account', { userInfo: userInfo })
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


//google api keys en tokens
const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET
const redirectUrl = process.env.REDIRECT_URI
const refreshToken = process.env.REFRESH_TOKEN

//oauth2 authenticatie
const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUrl)

oAuth2Client.setCredentials({refresh_token: refreshToken})

//email verzenden met parameters
router.post('/sendMail', urlencodedParser, function (req, res) {

    var fromMail = req.body.fromMail
    var toMail = req.body.toMail
    var personalMsg = req.body.personalMsg

    if(fromMail && toMail && personalMsg) {

        async function sendMail() {
            try{
                const accessToken = await oAuth2Client.getAccessToken()

                const transport = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        type: 'OAuth2',
                        user: 'chrisalza28@gmail.com',
                        clientId: clientId,
                        clientSecret: clientSecret,
                        refreshToken: refreshToken,
                        accessToken: accessToken
                    }
                })

                const mailOptions = {
                    form: fromMail,
                    to: toMail,
                    subject: 'Hallo vanaf gmail',
                    text: personalMsg,
                    html: '<h1>' + personalMsg + '</h1>',
                }

                const result = await transport.sendMail(mailOptions)

                return result

            }catch(error){
                return error
            }
        }

        sendMail().then(result => res.send(result)).catch(error => res.send(error))
    }else{
        res.send({
            error: 'Niet genoeg parameters om te voltooien.'
        })
    }
})


// 404 page
router.get('*', function (req, res) {
    res.render('pages/404')
});


// export de module zodat we hem weer kunnen gebruiker in server.js
module.exports = router;