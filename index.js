const express = require('express')
const db = require("./db.js");
const app = express()
const port = 4000

app.get('/', (req, res) => {
  res.send('服务端正在运行')
  /* db.query("SELECT * FROM datas",[], async (results, fields) => {
   console.log(results)
   await res.send(results)
  }) */
})

app.listen(port, () => {
  console.log("服务端开始运行，请不要关闭此窗口。")
  console.log(`后台运行在：http://localhost:${port}`)
  console.log("可在浏览器打开此网址查看")
})