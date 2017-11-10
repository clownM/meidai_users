$(document).ready(function(){
    // 引入顶部导航
    $('.user_nav_content').load("usernavbar.html .user_nav", function(){
    	$('#navleft').load("usernavbar.html .homepage", function(){	
    		/****** 设置头像和用户名 ******/
    		// console.log(getCookie("uuid"))

            if(getCookie("uuid") != ''){

                var fsw_obj = {
                    'action': "query",
                    'uuid': getCookie("uuid"),
                    'username':'',
                    "orders": "",
                };
                // console.log(fsw_obj)
                $.ajax({
                    url: "/user",
                    type: 'POST',
                    dataType: "json",
                    data: fsw_obj,
                    success: function(re) {
                        // console.log(re)
                        if(re.result == 'true'){
                            // var userName = JSON.parse(re).username;
                            var userName = re.username;
                            // console.log(userName)
                            $('.username a b').text(userName);
                            query_scanphoto(re.orders[0])


                            /****** 退出功能按钮 ******/
                            // $('.logout').click(function(){
                            //     delCookie('uuid'); 
                            //     window.location.reload();
                            // })
                        }
                    },
                    error: function(er) {
                        console.log(er)
                    }
                }); 
                

                function query_scanphoto(orderuuid) {
                    var order_data = {
                        "action": "query",
                        "uuid": orderuuid,
                        "scanphoto": "",

                    };
                    $.ajax({
                        type: "post",
                        data: order_data,
                        dataType: "json",
                        url: "/order",
                        success: function(data) {
                            // console.log(data)
                            if(data.result == 'true'){
                                /****** 获取用户头像 ******/    
                                var scanphoto_uuid = data.scanphoto;      
                                if(!scanphoto_uuid){        
                                    $('.nav-user-portrait').attr('src','images/touxiang.png');
                                }else{
                                    $('.nav-user-portrait').attr('src','/data?action=download&type=scanphoto&uuid='+scanphoto_uuid);
                                }
                                /****** 获取用户头像END ******/
                            }
                        },
                        error: function(er) {
                            console.log(er)
                        }
                    });
                }   
            }else{
                $('.username a b').text('未登录');
                $('.username').click(function(){
                    window.location.href="login.html";
                    delCookie('uuid'); 
                    setCookie("isgoto","false");
                    setCookie("checkbox","false");
                })
            }

            /**
             * 关闭窗口
            * */
            $(".logout").click(function(){
                window.location.href="login.html";
                delCookie('uuid'); 
                setCookie("isgoto","false");
                setCookie("checkbox","false");
            });
    	})
    })
})


;(function($){
    $.fn.extend({
        "setword":function(options){
            
            var regex=/\W/;
            var _word=this.val();
            this.val(_word.replace(regex,""));
        },
//      "Verification":function(){
//          var regex=/[^A-Za-z0-9]{8,}/
//          var _data=this.val();
//          return this.val(_data.replace(regex,""));
//      },
        "inputpassword_err":function(options){
            var _true=options.errtrue;
            var _docoment1=options.docoment1;
            var _str=options.stl;
            this[_true?"addClass":"removeClass"]("fws_input_danger");
            _docoment1.html(_str);
        },
        "phonetest":function(){
            var regex=/^1[3|4|5|7|8][0-9]\d{8}$/;
            var _result=this.val();
            return regex.test(_result);
        },
        "inputphone_err":function(options){
            var _true=options.errtrue;
            var _docoment1=options.docoment1;
            var _str=options.stl;
            this[_true?"addClass":"removeClass"]("fws_input_danger");
            _docoment1.html(_str);
        }
        
    });
})(jQuery);