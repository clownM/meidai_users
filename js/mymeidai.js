$(function(){
    if (getCookie("uuid") != '') {
        console.log("cookie-uuid:" + getCookie("uuid"));
        var fsw_obj = {
            'action': "query",
            'uuid': getCookie("uuid"),
            'username': '',
        };
        //console.log(fsw_obj);
        var init_data = {
            "action": "query",
            "uuid": fsw_obj.uuid,
            "phone": "",
            "username": "",
            "gender": "",
            "birthday": "",
            "orders": "",
            "lastorder": "",
        };
        $.ajax({
            url: "/user",
            type: 'POST',
            data: init_data,
            dataType: "json",
            async: false,
            success: function(userData) {
                if (userData.result == 'true') {
                    $("#username").text(userData.username);
                    $("#phone").text(userData.phone);
                }
            }
        })
        $("#userinfo").click(function(){
            window.location.href = "/userinfo.html";
        })
    }else{
        $("#username").text("未登录");
        $("#phone").text("点击前往登录！");
        $("#userinfo").click(function(){
            window.location.href = "/login.html";
        })
    }
});