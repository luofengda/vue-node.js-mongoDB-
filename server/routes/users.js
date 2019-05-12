const express = require('express');
const router = express.Router();
const User = require('../models/userModel')
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource，进入路由了');
});

/**
 * 登录
 */
router.post('/login', (req, res, next) => {
  let param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  User.findOne(param, (err, doc) => {
    if (err) {
      res.json({
        status: "1",
        msg: err.message
      })
    } else {
      if (doc) {
        res.cookie("userId", doc.userId, {
          path: '/',
          maxAge: 1000 * 60 * 60
        })
        res.cookie("userName", doc.userName, {
          path: '/',
          maxAge: 1000 * 60 * 60
        })
        // req.session.user = doc
        res.json({
          status: "0",
          msg: '',
          result: {
            userName: doc.userName
          }
        })
      }
    }
  })
})
/**
 * 退出
 */
router.post("/logout", (req, res, next) => {
  res.cookie("userId", "", {
    path: '/',
    maxAge: "-1"
  })
  res.json({
    status: "0",
    msg: "",
    result: ''
  })
})

/**
 * 校验用户信息
 */
router.get("/checkLogin", (req, res, next) => {
  if (req.cookies.userId) {
    res.json({
      status: "0",
      msg: "",
      result: req.cookies.userName || ''
    })
  } else {
    res.json({
      status: "0",
      msg: "",
      result: ''
    })
  }
})


/**
 * 查询当前用户的购物车数据
 */
router.get('/cartList', (req, res, next) => {
  let userId = req.cookies.userId;
  User.findOne({ userId: userId }, (err, doc) => {
    if (err) {
      res.json({
        status: "1",
        msg: err.message
      })
    } else {
      if (doc) {
        res.json({
          status: "0",
          msg: "",
          result: doc.cartList
        })
      }
    }
  })
})

/**
 * 购物车删除
 */
router.post('/cartDel', (req, res, next) => {
  let userId = req.cookies.userId, productId = req.body.productId
  User.update({ userId: userId }, { $pull: { 'cartList': { 'productId': productId } } }, (err, doc) => {
    if (err) {
      res.json({
        status: "1",
        msg: err.message
      })
    } else {
      if (doc) {
        res.json({
          status: "0",
          msg: "",
          result: '删除成功'
        })
      }
    }
  })
})

/**
 * 编辑购物车商品数量
 */

router.post('/cartEdit', (req, res, next) => {
  let userId = req.cookies.userId, productId = req.body.productId, productNum = req.body.productNum, checked = req.body.checked
  User.update({ userId: userId, "cartList.productId": productId }, { "cartList.$.productNum": productNum, "cartList.$.checked": checked }, (err, doc) => {
    if (err) {
      res.json({
        status: "1",
        msg: err.message
      })
    } else {
      if (doc) {
        res.json({
          status: "0",
          msg: "",
          result: ''
        })
      }
    }
  })
})

// 商品全选或反选
router.post('/editCheckAll', (req, res, next) => {
  let userId = req.cookies.userId, checkAll = req.body.checkAll ? '1' : '0'
  User.findOne({ userId: userId }, (err, user) => {
    if (err) {
      res.json({
        status: "1",
        msg: err.message
      })
    } else {
      if (user) {
        user.cartList.forEach(item => {
          item.checked = checkAll
        });
        user.save((err1, doc) => {
          if (err1) {
            res.json({
              status: "1",
              msg: err1.message
            })
          } else {
            res.json({
              status: "0",
              msg: "",
              result: ''
            })
          }
        })
      }
    }
  })
})

/**
 * 查询当前用户的地址列表
 */
router.get('/addressList', (req, res, next) => {
  let userId = req.cookies.userId;
  User.findOne({ userId: userId }, (err, doc) => {
    if (err) {
      res.json({
        status: "1",
        msg: err.message
      })
    } else {
      if (doc) {
        res.json({
          status: "0",
          msg: "",
          result: doc.addressList
        })
      }
    }
  })
})
module.exports = router;
