const express = require('express')
const db = require("./db.js");
const app = express()
const port = 4000

/* //连接数据库
var db = mysql.createConnection({ 
  host: "rm-7xv3h4rryx3sa9uo37o.mysql.rds.aliyuncs.com",
  port: "3306",
  user: "root",
  password: "19030125cC",
  database: "data"
}); */



app.get('/', (req, res) => {
  db.query("SELECT * FROM datas",[], (results, fields) => {
   console.log(results)
   res.send(results)
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})