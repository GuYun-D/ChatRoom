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
    // 隐藏登录窗口，隐藏聊天窗口
    $(".login_box").fadeOut()
    $(".container").fadeIn()

    // 设置个人信息
    $("#avatar_url").attr("src", data.avatar)
    $(".user-list .username").text(data.username)
})

// 监听新用户进入聊天室，广播事件
socket.on("addUser", data => {
    // 添加一条系统消息
    $(".box-bd").append(`
        <div class="system">
          <p class="message_system">
            <span class="content">${data.username}加入了群聊</span>
          </p>
        </div>
    `)
})

// 监听用户列表的消息
socket.on("userList", data => {
    console.log(data);
    // 防止用户列表重复渲染
    $(".user-list ul").html('')
    // 将数据动态渲染到列表中
    data.forEach(item => {
        $(".user-list ul").append(`
            <li class="user">
                <div class="avatar"><img src="${item.avatar}" /></div>
                <div class="name">${item.username}</div>
            </li>
        `)
    });
    $("#usercount").text(data.length)
})

// 监听用户离开的消息
socket.on("delUser", data => {
    // 添加一条系统消息
    $(".box-bd").append(`
        <div class="system">
          <p class="message_system">
            <span class="content">${data.username}离开了群聊天室</span>
          </p>
        </div>
    `)
})