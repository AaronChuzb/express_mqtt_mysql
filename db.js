var mysql = require('mysql');
var dbConfig = require('./db.config.js');

//数据库操作封装

//此工具类已经对错误做出了处理

module.exports = {

  //
  query: function (sql, params, callback) {
    //每次使用的时候需要创建链接，数据操作完成之后要关闭连接
    var connection = mysql.createConnection(dbConfig);
    connection.connect(function (err) {
      if (err) {
        console.log('数据库链接失败');
        throw err;
      }
      try{
        connection.query(sql, params, function (err, results, fields) {
          if (err) {
            console.log('数据操作失败');
            throw err;
          }
          callback && callback(results, fields);
          connection.end(function (err) {
            if (err) {
              console.log('关闭数据库连接失败！');
              throw err;
            }
          });
        });
      }
      catch(err){
        console.log(err)
      }
    });
  }
};