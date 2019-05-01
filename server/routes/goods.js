// 引入依赖文件
var express = require('express');
var router = express.Router();
var mongoose = require("mongoose")
var Goods = require("../models/goods")

// 连接数据库
var DB_URL = 'mongodb://127.0.0.1:27017/vueDataBase';

/**
 * 连接
 */
mongoose.connect(DB_URL);

/**
  * 连接成功
  */
mongoose.connection.on('connected', function () {    
    console.log('Mongoose connection open to ' + DB_URL);  
});    

/**
 * 连接异常
 */
mongoose.connection.on('error',function (err) {    
    console.log('Mongoose connection error: ' + err);  
});    
 
/**
 * 连接断开
 */
mongoose.connection.on('disconnected', function () {    
    console.log('Mongoose connection disconnected');  
});   

/* GET users listing. */
router.get('/', function(req, res, next) {
    Goods.find({},(err,doc)=>{
        if (err) {
            res.json({
                status:"1",
                msg:err.message
            })
        }else{
            res.json({
                status:"0",
                msg:'',
                result:{
                    count:doc.length,
                    list:doc
                }
            })
        }
    })
  });

  module.exports = router;