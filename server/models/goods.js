// 引入
var mongoose = require("mongoose")
// new对象
var Schema = mongoose.Schema;
//定义模型
var produtSchema = new Schema({
    "productId":{type:String},
    "productName" : String,
    "salePrice" : Number,
    "checked":String,
    "productNum":Number,
    "productImage" : String
})
// 导出
module.exports = mongoose.model("Good",produtSchema)