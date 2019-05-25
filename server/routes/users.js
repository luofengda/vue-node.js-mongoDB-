const express = require('express');
const router = express.Router();
const User = require('../models/userModel')
require('../util/util')
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

/**
 * 设置默认地址
 */
router.post('/setDefault', (req, res, next) => {
  let userId = req.cookies.userId, addressId = req.body.addressId
  if (!addressId) {
    res.json({
      status: "1003",
      msg: '地址id为空'
    })
    return
  }
  User.findOne({ userId: userId }, (err, doc) => {
    if (err) {
      res.json({
        status: "1",
        msg: err.message
      })
    } else {
      if (doc) {
        let addressList = doc.addressList
        addressList.forEach((item) => {
          if (item.addressId == addressId) {
            item.isDefault = true
          } else {
            item.isDefault = false
          }
        })
      }
      doc.save((err1, doc1) => {
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
  })

})


/**
 * 删除地址
 */

router.post('/delAddress', (req, res, next) => {
  let userId = req.cookies.userId, addressId = req.body.addressId
  User.update({ userId: userId }, { $pull: { 'addressList': { 'addressId': addressId } } }, (err, doc) => {
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
 * 支付订单
 */
router.post('/payMent', (req, res, next) => {
  let userId = req.cookies.userId, orderTotal = req.body.orderTotal, addressId = req.body.addressId
  User.findOne({ userId: userId }, (err, doc) => {
    if (err) {
      res.json({
        status: "1",
        msg: err.message
      })
    } else {
      if (doc) {

        var address = "", goodsList = []
        // 获取当前用户的地址信息
        doc.addressList.forEach((item) => {
          if (addressId == item.addressId) {
            address = item
          }
        })
        //获取用户购物车的购买商品
        doc.cartList.filter((item) => {
          if (item.checked == "1") {
            goodsList.push(item)
          }
        })
        const paltform = '9527'
        const r1 = Math.floor(Math.random() * 10)
        const r2 = Math.floor(Math.random() * 10)
        const sysData = new Date().Format('yyyyMMddhhmmss')
        const createDate = new Date().Format('yyyy-MM-dd hh:mm:ss')
        const orderId = paltform + r1 + sysData + r2
        const order = {
          orderId: orderId,
          orderTotal: orderTotal,
          addressInfo: address,
          goodsList: goodsList,
          orderStatus: '1',
          creatDate: createDate
        }
        doc.orderList.push(order)
        doc.save((err1, doc1) => {
          if (err) {
            res.json({
              status: "1",
              msg: err.message
            })
          } else {
            res.json({
              status: "0",
              msg: "",
              result: {
                orderId: order.orderId,
                orderTotal: order.orderTotal
              }
            })
          }
        })
      }
    }
  })
})


/**
 * 订单提交成功页面
 */
router.get('/orderDetail', (req, res, next) => {
  let userId = req.cookies.userId, orderId = req.param('orderId')
  User.findOne({ userId: userId }, (err, userInfo) => {
    if (err) {
      res.json({
        status: "1",
        msg: err.message
      })
    } else {
      if (userInfo) {
        // console.log(userInfo);
        let orderList = userInfo.orderList
        console.log('*******************1');
        console.log(orderList)
        console.log('*******************1');
        if (orderList.length > 0) {
          let orderTotals = 0
          orderList.forEach((item) => {
            if (item.orderId == orderId) {
              orderTotals = item.orderTotal
            }
          })
          if (orderTotals > 0) {
            res.json({
              status: "0",
              msg: "",
              result: {
                orderId: orderId,
                orderTotals: orderTotals
              }
            })
          } else {
            res.json({
              status: "120002",
              msg: "没有该订单",
              result: ''
            })
          }
        } else {
          res.json({
            status: "120001",
            msg: "当前用户没有订单信息",
            result: ''
          })
        }
      }
    }
  })
})



module.exports = router;
