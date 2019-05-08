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
router.get("checkLogin", (req, res, next) => {
  if (req.cookies.userId) {
    res.json({
      status: "0",
      msg: "",
      result: req.cookies.userName||''
    })
  } else {
    res.json({
      status: "0",
      msg: "",
      result: ''
    })
  }
})

module.exports = router;
