const express = require('express')
const app = express()
const port = 8080

app.set('view engine', 'pug')

app.get('/', (req, res) => {
  // res.send('Hello World!')
  res.render('index')
})

app.get('/bundle.js', (req, res) => {
  res.sendFile('/var/app/dist/bundle.js')
})

app.get('/global.css', (req, res) => {
  res.sendFile('/var/app/css/global.css')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})