const express = require('express')
const session = require('express-session')
const app = express()
const path = require('path')
const port = process.env.PORT || 2997
const router = require('./routes/routes.js')

// ejs view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// static files
app.use(express.static(path.join(__dirname, 'static/public')))

// router files, hier gebruiken we de router functie van express
app.use('/', router)

app.listen(port, (req, res) => {
    console.log(`Matching-application listening at http://localhost:${port}`)
})
