const express = require('express')
const db = require("./db.js");
const app = express()
const mqtt = require('mqtt')
const nodemailer = require('nodemailer');
const moment = require('moment')
const cors = require('cors')
app.use(cors())
const port = 4000



//邮件转发初始化
const mail = nodemailer.createTransport({
	// host: 'smtp.ethereal.email',
	service: 'qq', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
	port: 465, // SMTP 端口
	secureConnection: false, // 使用了 SSL
	auth: {
		user: '979565583@qq.com', //你的邮箱
		// 这里密码不是qq密码，是你设置的smtp授权码
		pass: 'lzxetsfdfpvsbcai',
	}
});


//初始接收邮件的地址
let emailAddress = '979565583@qq.com'

//mqtt客户端初始化
const client = mqtt.connect('mqtt://120.77.251.214:1883', {
  username: 'express',
  password: '123456',
  keepalive: 20
})



//接收邮件设置
let mailOptions = {
  from: '"室内检测" <979565583@qq.com>', // sender address
  to: emailAddress, // list of receivers
  subject: '警报', // Subject line
  // 发送text或者html格式
  html: '<b>警报警报，检测到火焰。</b>' // html body
};

var data = {}

//mqtt订阅
client.subscribe('data', {qos: 0})

//mqtt接收消息回调
client.on('message', (topic, message)=>{
  try{
    console.log('服务端连接到mqtt并接收到来自'+topic+'的消息：')
    if(data = JSON.parse(message)){
      console.log(data)
      let time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      // console.log(time)
      //插入实时数据存储表
      db.query("INSERT INTO realtimedata VALUE(?,?,?,?,?,?)",[data.name,data.fire,data.temp,data.hum,data.mq,moment(new Date()).format('YYYY-MM-DD HH:mm:ss')], (results, fields) => {
        //console.log(results)
      })
      let level = 0
      let hum = parseInt(data.hum)
      let temp = parseInt(data.temp)
      let mq = parseInt(data.mq)
      //对数据进行判断
      if(data.fire == '0'){
        level = '3' //设定警报等级
        //warming表插入
        db.query("INSERT INTO warming VALUE(?,?,?,?,?,?,?)",[data.name,moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),level,data.fire,data.temp,data.hum,data.mq,], (results, fields) => {
          console.log(results)
        })
        //火焰传感器，警报邮件发送
        mail.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('邮件已发送: %s', info.messageId);
      });
      }
      if(hum <= 40){
        level = '2'
        db.query("INSERT INTO warming VALUE(?,?,?,?,?,?,?)",[data.name,moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),level,data.fire,data.temp,data.hum,data.mq,], (results, fields) => {
          // console.log(results)
        })
      }
      if(temp > 30){
        level = '1'
        db.query("INSERT INTO warming VALUE(?,?,?,?,?,?,?)",[data.name,moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),level,data.fire,data.temp,data.hum,data.mq,], (results, fields) => {
          // console.log(results)
        })
      }
      if(mq > 500){
        level = '4'
        db.query("INSERT INTO warming VALUE(?,?,?,?,?,?,?)",[data.name,moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),level,data.fire,data.temp,data.hum,data.mq,], (results, fields) => {
          // console.log(results)
        })
      }
    } else {
      throw err
    }
  }catch(err){
    console.log(err)
  }
})

//express路由

//默认路径获取全部实时数据
app.get('/', (req, res) => {
   /* res.send('服务端正在运行')  */
  db.query("SELECT * FROM `realtimedata`",[], async (results, fields) => {
   // console.log(results)
   await res.send(results)
  })
})

//获取警报数据表的长度，前端数据分页作用。
app.get('/datalen', (req, res) => {
   /* res.send('服务端正在运行')  */
  db.query("SELECT TABLE_ROWS FROM information_schema.`TABLES` WHERE TABLE_SCHEMA='data'AND TABLE_NAME='warming'",[], async (results, fields) => {
   // console.log(results)
    let len = JSON.parse(JSON.stringify(results))
    // console.log(len)
   await res.send(len)
  })
})

//获取警报数据，根据请求的页面地址和页面数据量分页
app.get('/data', (req, res) => {
  // console.log(req.query)
  let pages = (parseInt(req.query.page, 10) - 1) * 10
  let pagesize = parseInt(req.query.pageSize, 10)
  db.query(`select * from warming order by date desc limit ${pages},${pagesize}`,[], async (results, fields) => {
   //console.log(results)
    let len = JSON.parse(JSON.stringify(results))
    // console.log(len)
   await res.send(len)
  })
})

//获取初始邮件地址
app.get('/getemail', (req, res) => {
  res.send(emailAddress)
})

//更新接收警报的邮箱地址
app.post('/updateemail', (req, res) => {
  emailAddress = req.query.email
  // console.log(emailAddress)
  res.send('更新成功')
})



app.listen(port, () => {
  console.log("服务端开始运行，请不要关闭此窗口。")
  console.log(`后台运行在：http://localhost:${port}`)
  console.log("可在浏览器打开此网址查看")
})