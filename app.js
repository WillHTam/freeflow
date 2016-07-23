const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const app = express()

app.use(logger('dev'))
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, User-Email, Auth-Token, Authorization')
    next()
})

app.use(express.static('public'))

// app.get('/map', (req, res) => {
//   res.render('public/map.ejs')
// })

app.listen(3000)
