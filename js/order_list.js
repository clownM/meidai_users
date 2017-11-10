function tabsToggle() {
    $("ul.tabs-ul li").click(function() {
        var index = $("ul.tabs-ul li").index(this);
        $("ul.tabs-ul li a").removeClass("active");
        $("ul.tabs-ul li a:eq(" + index + ")").addClass("active");
        $("div.tabs-contents").removeClass("active");
        $("div.tabs-contents:eq(" + index + ")").addClass("active");
    });
}
$(document).ready(function() {

    tabsToggle();
    if (getCookie("uuid") != '') {
        // console.log("cookie-uuid:" + getCookie("uuid"));
        var fsw_obj = {
            'action': "query",
            'uuid': getCookie("uuid"),
            'username': '',
        };
        console.log(fsw_obj);
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
            success: function(data) {
                if (data.result == 'true') {

                    console.log("data.orders:" + data.orders);

                    // query_batchorder(data.orders,data.orders.reverse())
                    // var order_list = {
                    //     "action": "list",
                    //     "page": "",
                    //     "condition": "",
                    // };
                    // $.ajax({
                    //     url: "/order",
                    //     type: "post",
                    //     data: order_data,
                    //     dataType: "json",
                    //     async: false,
                    //     success: function(data2) {
                    //         if (data2.result) {
                    //             console.log("totalpage:" + data2.totalpage + ";resultedlist:" + data2.resultdlist);
                    //         }
                    //     },
                    //     error: function(erro) {
                    //         console.log(erro);
                    //         // $('#userdata_error p').eq(1).css('display','block');
                    //         // $("#content .article .yy .orderonemonthago").append("<h1 id='remind'>网络错误请重新登录</h1>")
                    //     },
                    // });
                }
            },
            error: function(re) {
                console.log(er);
            }
        }); 

    } else {
        // $('.login').html('<a href="login.html"><span class="glyphicon glyphicon-user"></span>登录/注册</a>');
        console.log("cookie不存在！");
    }

    function hashCode(str) {
        var hash = 5381;
        for (i = 0; i < str.length; i++) {
            char = str.charCodeAt(i);
            hash = ((hash << 5) + hash) + char; /* hash * 33 + c */
        }
        return Math.abs(hash);
    }

});