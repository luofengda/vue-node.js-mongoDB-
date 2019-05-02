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

/* 查询数据 */
router.get('/', function(req, res, next) {
    // get的请求，可以通过param获取浏览器的参数
    // 分页
    let page = parseInt(req.param("page")) 
    let pageSize = parseInt(req.param("pageSize"))
    let skip =parseInt((page - 1)*pageSize)


    let sort = req.param("sort")
    let params = {}
    // 每个条件都是个{}对象，
    // 获取返回数据模型
    let GoodsModel = Goods.find(params).skip(skip).limit(pageSize)
    // 排序的时候，需要指定排序的字段 升序：1 ，降序：-1
    GoodsModel.sort({'salePrice':sort})
    GoodsModel.exec((err,doc)=>{
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