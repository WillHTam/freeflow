const express = require('express')

const logger = require('morgan')

const port = process.env.PORT || 3000

const app = express()


app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, email, auth_token, id')
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE')
  next()
})

app.use(express.static('public'))

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
