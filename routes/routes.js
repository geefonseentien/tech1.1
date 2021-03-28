const express = require('express')
const session = require('express-session')
const fs = require('fs');
const ejs = require('ejs');
const router = express.Router()

const bodyParser = require('body-parser')
const multer = require('multer')

const nodemailer = require('nodemailer')
const { google, redis_v1 } = require('googleapis')

const bcrypt = require('bcrypt')
const { MongoClient } = require('mongodb')
const { userInfo } = require('os')
require('dotenv').config()
const url = process.env.MONGODB_URL
const client = new MongoClient(url, { useUnifiedTopology: true })
const ObjectID = require('mongodb').ObjectID

// Database
const dbName = process.env.DB_NAME

const run = async () => {
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



// Opslaan voor afbeeldingen in de upload map
const storage = multer.diskStorage({
    // Locatie aanwijzen
    destination: (req, file, callback) => {
        callback(null, './static/public/uploads/images')
    },
    // Naam van de file opmaken
    filename: (req, file, callback) => {
        callback(null, Date.now() + '-' + file.originalname)
    }
  })
   
const upload = multer({ 
    storage: storage,
    limits:{
        fieldSize:1024*1024*3
    }
})



// Session logica
router.use(
    session({
        secret: process.env.SESSION_SECRET,
        name: process.env.SESSION_NAME,
        resave: false,
        saveUninitialized: false,
        cookie: {
            originalmaxAge: process.env.SESSION_LIFETIME,
            samesite: true,
            secure: false
        }
}),
)

const redirectToLogin = (req, res, next) => {
    if(!req.session.userID) {
        res.redirect('/login')
    } else {
        next()
    }
}

const redirectToLike = (req, res, next) => {
    if(req.session.userID) {
        res.redirect('/dashboard')
    } else {
        next()
    }
}

// home pagina

router.get('/', (req, res) => {

    const db = client.db(dbName)

    // het vinden van alle gebruikers in de collectie users, deze worden op de homepagina gerenderd
    db.collection('users').find().toArray( (err, users) => {
        res.render('pages/index', { users: users })
    })
})

// register pagina


// renderen van pagina register
router.get('/register', urlencodedParser, (req, res) => {
    res.render('pages/register')
})

// Data naar de database inserten
router.post('/account', urlencodedParser, async (req, res) => {
    const hash = bcrypt.hashSync(req.body.password, 10)
    let passwordPost = req.body.password
    const userInfo = {
        userID: ObjectID().toString(), // maakt een nieuw ObjectID aan en zet deze om in een string (voor het vinden van de gebruiker bij update)
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
        password: hash,
        liked: []
    }

    const db = client.db(dbName)

    try{
        await db.collection('users').findOne({
            email: req.body.email
        }, async (err, user) => {
            if (!user) {
                db.collection('users').insertOne(userInfo, async () => {
                    console.log(userInfo.name, 'toegevoegd')
                })
                res.render('pages/account', { userInfo: userInfo })
            } else{
                console.log('e-mailadres al in gebruik')
                err_msg = "e-mailadres al in gebruik."
                return res.render('pages/register', { err_msg: err_msg } )
            }
        })
    } catch(err){
        console.error(err)
        res.render('pages/502')
    }
})


// login pagina
router.get('/login', redirectToLike, async (req, res) => {
    res.render('pages/login')
})

router.post('/login', urlencodedParser, async (req, res) => {
    const db = client.db(dbName)
    let emailadres = req.body.email
    let passwordPost = req.body.password
    if (emailadres && passwordPost) {
        try {
            const user = await db.collection('users').findOne({
                email: emailadres
            }, async (err, user) => {
                if (!user) {
                    console.log('Geen gebruiker gevonden met dit e-mailadres')
                    err_msg = "Geen gebruiker gevonden met dit e-mailadres"
                    return res.render('pages/login', { err_msg: err_msg } )
                } else {
                    await bcrypt.compare(passwordPost, user.password, (err, result) => {
                        if (result) {
                            console.log('gebruiker is ingelogd')
                            req.session.userID = user.userID
                            return res.redirect('/dashboard')
                          } else {
                            console.log('Wachtwoord komt niet overeen met het e-mailadres.')
                            err_msg = "Wachtwoord komt niet overeen met het e-mailadres."
                            return res.render('pages/login', { err_msg: err_msg } )
                          }
                    })
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
})

//logout

router.get('/logout', redirectToLogin, (req, res) =>{
    res.render('pages/dashboard')
})

router.post('/logout', async (req, res) => {
    req.session.destroy(error => {
        if (error) {
            return res.redirect('/dashboard')
        }
        res.clearCookie(process.env.SESSION_NAME)
        res.redirect('/')
    })
})

// update route
router.post('/account/update', upload.single('picture'), urlencodedParser, (req, res) => {
    const userInfo = {
        userID: req.body.userID,
        name: req.body.name,
        email: req.body.email,
        img: req.file && req.file.filename,
        age: req.body.age,
        area: req.body.area,
        date: req.body.date,
        myGender: req.body.myGender,
        searchGender: req.body.searchGender
    }
    

    const db = client.db(dbName)

    // update de gebruiker met het aangemakkte userID
    try{
        db.collection('users').updateOne({ 'userID': req.body.userID }, { $set: userInfo }, async () => {
            console.log(userInfo.name, 'geupdate')
        })
        res.render('pages/account', { userInfo: userInfo })
    } catch(err){
        console.error(err)
        res.render('pages/502')
    }
})



// delete route
router.post('/account/delete', urlencodedParser, (req, res) => {
    const userInfo = {
        userID: req.body.userID
    }

    const db = client.db(dbName)

    // verwijder de gerbuiker met het aangemaakte userID
    db.collection('users').deleteOne({ 'userID': req.body.userID }, () => {
        console.log(userInfo.userID, 'deleted')
        res.render('pages/delete-succes', { userInfo: userInfo })
    })
})


// dashboard pagina
router.get('/dashboard', redirectToLogin, async (req, res) => {

    const db = client.db(dbName)

    db.collection('users').find({ userID: {$ne: req.session.userID}}).toArray( (err, users) => {
        res.render('pages/dashboard', { users: users, userID: req.session.userID })
    })
})

router.post('/like', urlencodedParser, (req, res) => {
    const userInfo = {
        liked: req.body.userID
    }

    const db = client.db(dbName)

    db.collection('users').updateOne({ userID: req.session.userID }, { $push: {'liked': userInfo.liked}}, (error, succes) => {
        if (succes) {
            //console.log(succes)
        } else {
            console.log(error)
        }
        console.log('toegevoegd')
    })
    res.redirect('/dashboard')
})



// geliked pagina
router.get('/geliked', redirectToLogin, (req, res) => {

    const db = client.db(dbName)


    db.collection('users').findOne({userID: req.session.userID}, (err, doc) => {
        let likedArray = []
        for (i=0; i<doc.liked.length; i++) {
            likedArray.push(doc.liked[i])
        }
        db.collection('users').aggregate([{$match: {userID: {$in: likedArray}}}]).toArray ((err, doc2) => {
            if(doc){
                res.render('pages/geliked', { users: doc2, loggedUser: doc, userID: req.session.userID})
                //console.log(doc)
            }else {
                console.log(err)
            }
        })
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
    const db = client.db(dbName)

    let emailHtml

    let compiled = ejs.compile(fs.readFileSync(__dirname + '/../views/pages/email.ejs', 'utf8'))
    db.collection('users').findOne({ userID: req.session.userID }, async (err, doc) => {
       emailHtml = await compiled({ user: doc, message: personalMsg })
    })

    var fromMail = req.body.fromMail
    var toMail = req.body.toMail
    var personalMsg = req.body.personalMsg

    if(fromMail && toMail && personalMsg) {

        async function sendMail() {
            try{
                
                let accessToken = await oAuth2Client.getAccessToken()

                let transport = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        type: 'OAuth2',
                        user: 'supahkeil.dating@gmail.com',
                        clientId: clientId,
                        clientSecret: clientSecret,
                        refreshToken: refreshToken,
                        accessToken: accessToken
                    }
                })

                let mailOptions = {
                    form: fromMail,
                    to: toMail,
                    subject: 'Je hebt een nieuw bericht',
                    text: personalMsg,
                    html: emailHtml,
                }

                const result = await transport.sendMail(mailOptions)

                return result

            }catch(error) {
                return error
            }
        }

        sendMail().then(result => res.res.sendStatus(200)).catch(error => res.send(error))
    }else{
        res.sendStatus(500)
    }
})


// 404 page
router.get('*', (req, res) => {
    res.render('pages/404')
})

// export de module zodat we hem weer kunnen gebruiker in server.js
module.exports = router
