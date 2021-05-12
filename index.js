const express = require('express')
const db = require("./db.js");
const app = express()
const mqtt = require('mqtt')
const port = 4000


const client = mqtt.connect('mqtt://120.77.251.214:1883', {
  username: 'express',
  password: '123456',
  keepalive: 20
})

var data = {}
client.subscribe('data', {qos: 0})
client.on('message', (topic, message)=>{
  console.log('服务端连接到mqtt并接收到来自'+topic+'的消息：')
  data = JSON.parse(message)
  console.log(data)
})
app.get('/', (req, res) => {
   /* res.send('服务端正在运行')  */
  db.query("SELECT * FROM `realtimedata`",[], async (results, fields) => {
   console.log(results)
   await res.send(results)
  })
})

app.get('/update', (req, res) => {
  db.query("INSERT INTO realtimedata VALUE(?,?,?,?,?,?,?)",[4,'插入测试',0,25,65,120,new Date().toJSON().slice(0, 19).replace('/T.*/', ' ')], async (results, fields) => {
   console.log(results)
   await res.send(results)
  })
})

app.listen(port, () => {
  console.log("服务端开始运行，请不要关闭此窗口。")
  console.log(`后台运行在：http://localhost:${port}`)
  console.log("可在浏览器打开此网址查看")
})