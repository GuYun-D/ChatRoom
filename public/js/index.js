/**
 * 聊天室功能
 */

// 链接socket io服务
var socket = io('http://localhost:3000')

/**
 * 登录功能
 */
// 选择头像
$(".login_box .avatar li").on("click", function () {
    $(this).addClass("now").siblings().removeClass("now")
})

// 点击登录按钮
$("#loginBtn").on("click", function () {
    // 获取用户名
    var username = $("#username").val().trim()
    if (!username) {
        alert("请输入用户名")
        return
    }

    // 获取用户选择的头像
    var avatar = $("#login_avatar li.now img").attr("src")
    console.log(username, avatar);

    // 告诉socket服务，登录
    socket.emit("login", {
        username: username,
        avatar: avatar
    })
})


// 监听登录失败的请求
socket.on("loginError", data => {
    alert("登陆失败了")
})

// 监听登录成功的请求
socket.on("loginSuccess", data => {
    alert("登陆成功了")
})