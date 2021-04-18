/**
 * 聊天室功能
 */

// 链接socket io服务
var socket = io('http://localhost:3000')

// 定义全局变量，保存当前用户信息
var username = null
var avatar = null

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

  username = data.username
  avatar = data.avatar
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

  scrollIntoBottom()
})

// 聊天功能
$(".btn-send").on("click", () => {
  // 获取要发送的消息
  var content = $("#content").html()
  $("#content").html("")
  if (!content) {
    return alert("请输入内容")
  }
  // 如果输入了内容，给服务器发送消息
  socket.emit("sendMessage", {
    username: username,
    avatar: avatar,
    msg: content
  })
})

// 监听聊天的消息
socket.on("receiveMessage", function (data) {
  console.log(data);
  // 将聊天消息放到聊天框里
  // 判断该消息是谁的
  if (data.username === username) {
    // 自己的消息
    $(".box-bd").append(`
            <div class="message-box">
              <div class="my message">
                <img class="avatar" src="${data.avatar}" alt="" />
                <div class="content">
                  <div class="bubble">

                    <div class="bubble_cont">${data.msg}</div>
                  </div>
                </div>
              </div>
            </div>`)
  } else {
    // 别人的消息
    $(".box-bd").append(`
            <div class="message-box">
              <div class="other message">
                <img class="avatar" src="${data.avatar}" alt="" />
                <div class="content">
                    <div class="nickname">${data.username}</div>

                    <div class="bubble">

                    <div class="bubble_cont">${data.msg}</div>
                  </div>
                </div>
              </div>
            </div>`)
  }
  scrollIntoBottom()
})

function scrollIntoBottom() {
  // 当前元素的底部要滚动到可视区
  $(".box-bd").children(':last').get(0).scrollIntoView(false)
}

// 发送图片功能
$("#file").on("change", function () {
  var file = this.files[0]
  // 把文件发送到服务器，借助于fileReader
  var fr = new FileReader()
  fr.readAsDataURL(file)
  fr.onload = function () {
    console.log(fr.result);
    socket.emit("sendImage", {
      username: username,
      avatar: avatar,
      img: fr.result
    })
  }
})

// 接受图片
socket.on("receiveImage", function (data) {
  console.log(data);
  // 将聊天消息放到聊天框里
  // 判断该消息是谁的
  if (data.username === username) {
    // 自己的消息
    $(".box-bd").append(`
            <div class="message-box">
              <div class="my message">
                <img class="avatar" src="${data.avatar}" alt="" />
                <div class="content">
                  <div class="bubble">

                    <div class="bubble_cont">
                      <img src="${data.img}">
                    </div>
                  </div>
                </div>
              </div>
            </div>`)
  } else {
    // 别人的消息
    $(".box-bd").append(`
            <div class="message-box">
              <div class="other message">
                <img class="avatar" src="${data.avatar}" alt="" />
                <div class="content">
                    <div class="nickname">${data.username}</div>

                    <div class="bubble">

                    <div class="bubble_cont"><img src="${data.img}"></div>
                  </div>
                </div>
              </div>
            </div>`)
  }

  // 等待图片加载完成，再滚动到底部
  $(".box-bd img:last").on("load", function () {
    scrollIntoBottom()
  })
  
})