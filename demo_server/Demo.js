let user = require('./User');
console.log(`userName:${user.userName}`);
console.log(`userName:${user.sayHello()}`);

let http = require('http')
let url = require('url')
let util =require('util')
let server=http.createServer((req,res)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain;charset=utf-8')
    
    res.end('hello, node.js')
    res.end(url.parse(req.url))
    res.end(util.inspect(url.parse(req.url)))

})
server.listen(3001,'127.0.0.1',()=>{
console.log('服务器已经允许，请打开127.0.0.1:3000');
})