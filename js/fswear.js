// 通过外边框来控制图片的大小可以跟着浏览器窗口变化而变化
function set_banner_resizer(rim, img, ratio) {
    function adjust_banner() {
        var viewport_height = rim.width() * ratio;
        rim.height(viewport_height);
        var img_height = img.height();
        // console.log(rim.height (viewport_height))
        var offset = rim.offset().top - (img_height - viewport_height) / 2;
        img.offset({ top: offset });
    }

    adjust_banner();
    $(window).resize(adjust_banner);
}

// 通过点击按钮返回顶部的功能
function return_top(event) {
    $(window).scroll(function() {
        if ($(window).scrollTop() > 100) {
            event.fadeIn(1000);
        } else {
            event.fadeOut(1000);
        }
    });
    event.click(function() {
        $('body,html').animate({ scrollTop: 0 }, 500);
        return false;
    });
}

//设置Cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
};

//获得Cookie
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++)  { 
        var c = ca[i].trim(); 
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

// 删除Cookie
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

//检测登录状态
function checklogin(check_success, check_fail) {
    var _data = {};
    var _user = getCookie("userName");
    var _uuid = getCookie("uuid");
    if (_uuid != "") {
        var fsw_obj = {
            action: "query",
            userData: _user,
            uuid: _uuid
        };
        _data = fsw_obj;
        $.ajax({
            url: "/user",
            type: 'POST',
            data: _data,
            success: function(re) {
                var re_parsed = JSON.parse(re);
                if (re_parsed.result == "true") {
                    check_success(re);
                    console.log(re)
                } else {
                    check_fail(re);
                }
            },
            error: function(re) {
                check_fail(re);
            }
        }); 
    } else check_fail();
};

/* config 的文本转换成JSON格式 */
function Config2Json(config) {
    if (!(typeof config === "string")) {
        console.log("Config2Json needs input in string type.");
        return;
    }

    config = config.split(/\r?\n/);
    var key;
    var value;
    var config_json = {};
    for (var pair in config) {
        pair = config[pair].trim();
        if ("" == pair)
            continue;

        var pair_ = pair.split(" ");
        key = pair_[0].trim();
        if (pair_.length > 1)
            value = pair_[1].trim();
        else
            value = "";

        if ("" == key)
            continue;

        config_json[key] = value;
    }

    return config_json;
}

/**
 * 哈希
 * */
function hashCode(str) {
    var hash = 5381;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash << 5) + hash) + char; /* hash * 33 + c */
    }
    return Math.abs(hash);
}

//将格式RFC2822时间转化时间格式
function joinzero(num){
    if(num < 10){
        return "0"+num;
    }else{
        return ""+num;
    }
}
function create_time(ordertime) {
    if(!(ordertime == "")){
        var _ordertime = ordertime.replace(/-\w*/g, '');
        var _date = new Date(_ordertime);
        var order_date = {};
        order_date._year = joinzero(_date.getFullYear()) ;
        order_date._month =joinzero( _date.getMonth() + 1);
        order_date._day = joinzero(_date.getDate());
        order_date._hour =joinzero( _date.getHours() + 8);
        order_date._minute =joinzero(_date.getMinutes());
        order_date._second = joinzero(_date.getSeconds());
        return order_date;
    }else{
        return "暂无信息";
    }
}

// 获取订单状态
function get_status(parm1) {
    var _status;
    switch (parm1) {
        case "toconfirm":
            _status = "扫描未检查";
            break;
        case "toscan":
            _status = "等待扫描";
            break;
        case "todeal":
            _status = "确认";
            break;
        case "cancelled":
            _status = "已取消";
            break;
        case "topay":
            _status = "待支付";
            break;
        case "printing":
            _status = "生产中";
            break;
        case "delivering":
            _status = "已发货";
            break;  
        case "done":
            _status = "交易完成";
            break;  
        default:
            _status = "未知";
    }
    return _status;
}


// 判定移动端与PC
function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}
$(document).ready(function() {

    $(".go-back").click(function(){
        history.back();
    });

    if (IsPC()) {
        $('.navbar-pc').load("navbar.html .user_nav", function() {
            
            $(".content").css({"width":"70%","margin":"0 auto"});
            $(".top-fixed").css("display","none");

            /****** 设置头像和用户名 ******/
            // console.log(getCookie("uuid"))
            if (getCookie("uuid") != '') {
                var fsw_obj = {
                    'action': "query",
                    'uuid': getCookie("uuid"),
                    'username': '',
                    "orders": "",
                };
                // console.log(fsw_obj)
                $.ajax({
                    url: "/user",
                    type: 'POST',
                    data: fsw_obj,
                    dataType: "json",
                    // aysnc: false,
                    success: function(re) {
                        // console.log(re)
                        if (re.result == 'true') {
                            // var userName = JSON.parse(re).username;
                            var userName = re.username;
                            // console.log(userName)
                            $('#username').text(userName);
                            query_scanphoto(re.orders[0])


                            /****** 退出功能按钮 ******/
                            $('#logout').click(function() {
                                delCookie('uuid');
                                window.location.reload();
                            })
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
                        url: "/order",
                        type: "post",
                        data: order_data,
                        dataType: "json",
                        aysnc: false,
                        success: function(data) {
                            if (data.result == 'true') {
                                /****** 获取用户头像 ******/
                                var scanphoto_uuid = data.scanphoto;
                                if (!scanphoto_uuid) {
                                    $('.nav-user-portrait').attr('src', 'images/touxiang.png');
                                } else {
                                    $('.nav-user-portrait').attr('src', '/data?action=download&type=scanphoto&uuid=' + scanphoto_uuid);
                                }
                                /****** 获取用户头像END ******/
                            }
                        },
                        error: function(er) {
                            console.log(er)
                        }
                    });
                }
            } else {
                $('#username').text('请登录');
                $('#username').css("color", "rgb(85,85,85)");
                $(".dropdown-toggle").attr("data-toggle", "");
                $("span.caret").css("display", "none");
                $('#username').click(function() {
                    window.location.href = "login.html";
                    delCookie('uuid');
                    setCookie("isgoto", "false");
                    setCookie("checkbox", "false");
                })
            }

            /**
             * 关闭窗口
             * */
            // $("#logout").click(function() {
            //     window.location.href = "login.html";
            //     delCookie('uuid');
            //     setCookie("isgoto", "false");
            //     setCookie("checkbox", "false");
            // });
        })
    }else{
        $('.tabs-mobile').load("/navbar.html .user_tabs", function() {
            $("head").append("<link>");
            var link = $("head").children(":last");
            link.attr({
                rel:"stylesheet",
                type:"text/css",
                href:"/css/app.css"
            });
        })
    }
});