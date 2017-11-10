$(document).ready(function() {
    // 引入顶部导航
    $('.nav_content').load("navbar.html .navbar", function() {
        // 引入底部导航  
        $('.footer_content').load("navbar.html .footer", function() {

            // console.log(getCookie("uuid"))

            // if (getCookie("uuid") != '') {

            //     var fsw_obj = {
            //         'action': "query",
            //         'uuid': getCookie("uuid"),
            //         'username': '',
            //     };
            // console.log(fsw_obj)
            // $.ajax({
            //     url: "/user",
            //     type: 'POST',
            //     data: fsw_obj,
            //     success: function(re) {
            //         var userName = JSON.parse(re).username;
            //         console.log(userName)
            //         $('.login').html('<a href="personal.html">' + userName + '</a><a href="##" id="delCookie">退出</a>');


            //         $('#delCookie').click(function() {
            //             delCookie('uuid');
            //             window.location.reload();
            //         })
            //     },
            //     error: function(re) {

            //     }
            // }); 

            // } else {
            $('.login').html('<a href="login.html"><span class="glyphicon glyphicon-user"></span>登录/注册</a>');
            // }




            // 底部导航动画
            $('.footer-bottom-div h4').toggle(function() {
                $(this).next().show(500);
                $(this).siblings('span').eq(0).fadeOut(500);
                $(this).siblings('span').eq(1).fadeIn(500);
            }, function() {
                $(this).next().hide(500);
                $(this).siblings('span').eq(0).fadeIn(500);
                $(this).siblings('span').eq(1).fadeOut(500);
            })

            /****** 微信 ******/
            $('.footer_right .wechat').click(function() {
                $('.wechat_dialog').show();
            })

            $('.wechat_dialog').click(function(event) {
                $('.wechat_dialog').hide();
                event.stopPropagation();
            })

            // $('.wechat,.wechat-dialog').mouseout(function(){
            //     $('.wechat-dialog').hide();
            // })
            // console.log($('.dialog').not('#asad'))
            // $('.dialog').not('#asad').click(function(event){
            //     $('.dialog').hide();
            //     // return false
            //     event.stopPropagation();
            // })


            /****** 微博  ******/
            $('#app-store img').click(function() {
                $('#app_dialog').show();
            })

            $('#app_dialog').click(function(event) {
                $('#app_dialog').hide();
                // return false
                event.stopPropagation();
            })
        })
    })
})