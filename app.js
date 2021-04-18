/**
 * 启动聊天服务端程序
 */
var app = require("express")()
var server = require('http').Server(app)
var io = require("socket.io")(server)

// 记录所有已经登陆上的用户
const users = []


// 监听3000端口
server.listen(3000, () => {
    console.log("服务器已启动");
})


// 开放静态资源
app.use(require("express").static("public"))

app.get('/', function (req, res) {
    res.redirect('./index.html')
})

io.on('connection', function (socket) {
    console.log("新用户上线");
    // 注册登录事件
    socket.on('login', data => {
        // 判断该用户是否已经存在了
        const user = users.find(item => item.username === data.username)
        console.log("user:" + user);
        // 判断用户是否存在
        if (user) {
            // 用户已存在，服务器响应
            socket.emit("loginError", { msg: "登陆失败" })
            console.log("登录失败");
        } else {
            // 登录成功
            // 将用户存入列表
            users.push(data)
            // 触发成功事件
            socket.emit("loginSuccess", data)
            console.log("登录成功");

            // 告诉所有人，有人进入聊天室
            // 使用io.emit,表示广播事件
            // socket.emit,表示当前个人的事件
            io.emit("addUser", data)

            // 告诉所有的用户，聊天室一共有多少人
            io.emit("userList", users)
        }
    })
});