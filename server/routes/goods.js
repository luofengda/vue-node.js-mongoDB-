// 引入依赖文件
var express = require('express');
var router = express.Router();
var mongoose = require("mongoose")
var Goods = require("../models/goods")
var User = require("../models/userModel")
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
mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});

/**
 * 连接断开
 */
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose connection disconnected');
});

/* 查询商品列表 */
router.get('/list', function (req, res, next) {
    let params = {}
    // get的请求，可以通过param获取浏览器的参数
    // 分页
    let page = parseInt(req.param("page"))
    let pageSize = parseInt(req.param("pageSize"))
    // 价格过滤
    let priceLevel = req.param("priceLevel")
    let skip = parseInt((page - 1) * pageSize)

    var priceGt = "", priceLte = ""
    if (priceLevel != 'all') {
        switch (priceLevel) {
            case "0":
                priceGt = 0;
                priceLte = 100
                break;
            case "1":
                priceGt = 100;
                priceLte = 500
                break;
            case "2":
                priceGt = 500;
                priceLte = 1000
                break;
            case "3":
                priceGt = 1000;
                priceLte = 2000
                break;
            default:
                break;
        }
        params = {
            salePrice: {
                $gt: priceGt,
                $lte: priceLte
            }
        }
    }


    let sort = req.param("sort")

    // 每个条件都是个{}对象，
    // 获取返回数据模型
    let GoodsModel = Goods.find(params).skip(skip).limit(pageSize)
    // 排序的时候，需要指定排序的字段 升序：1 ，降序：-1
    GoodsModel.sort({ 'salePrice': sort })
    GoodsModel.exec((err, doc) => {
        if (err) {
            res.json({
                status: "1",
                msg: err.message
            })
        } else {
            res.json({
                status: "0",
                msg: '',
                result: {
                    count: doc.length,
                    list: doc
                }
            })
        }
    })
});

// 加入购物车
router.post("/addCart",(req, res, next)=>{
    let userId="100000077", productId=req.body.productId, goodsItem="";
    User.findOne({userId:userId},(err,userDoc)=>{
        if (err) {
            res.json({
                status: "1",
                msg: err.message
            })
        } else {
            if(userDoc){
                // 如果表中已经包含了同样的商品就++
                userDoc.cartList.forEach((item)=>{
                    if(item.productId==productId){
                        goodsItem=item;
                        item.productNum ++;
                    }
                })
               
                if(goodsItem){
                    userDoc.save((err2,doc2)=>{
                        if(err2){
                         res.json({
                             status: "1",
                             msg: err2.message
                         })
                        }else {
                         res.json({
                             status: "0",
                             msg: "",
                             result:"suc"
                         })
                        }
                     })
                }else{

                Goods.findOne({productId:productId},(err1,doc)=>{
                    if (err1) {
                        res.json({
                            status: "1",
                            msg: err1.message
                        })
                    } else {
                       if(doc){
                        doc.productNum=1
                        doc.checked=1
                        userDoc.cartList.push(doc)
                        userDoc.save((err2,doc2)=>{
                           if(err2){
                            res.json({
                                status: "1",
                                msg: err2.message
                            })
                           }else {
                            res.json({
                                status: "0",
                                msg: "",
                                result:"suc"
                            })
                           }
                        })
                       }
                    }
                })
            }
            }
        }
    })
})


module.exports = router;