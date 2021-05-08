const express = require('express')
const db = require("./db.js");
const app = express()
const port = 4000

app.get('/', (req, res) => {
  db.query("SELECT * FROM datas",[], async (results, fields) => {
   console.log(results)
   await res.send(results)
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})