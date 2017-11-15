// tabs切换
function tabsToggle() {
    $("ul.tabs-ul li").click(function() {
        var index = $("ul.tabs-ul li").index(this);
        $("ul.tabs-ul li a").removeClass("active");
        $("ul.tabs-ul li a:eq(" + index + ")").addClass("active");
        $("div.tabs-contents").removeClass("active");
        $("div.tabs-contents:eq(" + index + ")").addClass("active");
    });
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
        default:
            _status = "未知";
    }
    return _status;
}

$(function() {

    //将订单的uuid全部放入数组中
    var order_uuid_arr = [];

    var vm = new Vue({
        el: '#content',
        data: {
            ordersArray: []
        },
        mounted: function() {
            this.get_order_info();
            // DOM经过Vue渲染之后
            this.$nextTick(() => {
                tabsToggle();
                $(".to_order_details").click(function() {
                    var index = $(".to_order_details").index(this);
                    console.log(index);
                    // console.log(order_uuid_arr[index]);
                    setCookie("orderuuid", order_uuid_arr[index], 1);
                    // console.log(getCookie("orderuuid"));
                    window.location.href = "order_details.html";
                });
            })
        },
        methods: {
            get_order_info: function() {
                var ordersArray = [];
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
                                /* console.log(userData.orders.length == 0);
                                console.log(userData.orders === 0); */
                                if (!(userData.orders == 0)) {
                                    var order_data = {
                                        "action": "query",
                                        "uuid": JSON.stringify(userData.orders),
                                        "createdate": "",
                                        "head": "",
                                        "config": "",
                                        "genobj": "",
                                        "deals": "",
                                        "station": "",
                                        "appointmentdate": "",
                                        "scandate": "",
                                        "pinfo": "",
                                        "status": "",
                                        "preconfig": "",
                                        "collecteddata": ""
                                    }
                                    $.ajax({
                                        url: "/order",
                                        type: "post",
                                        data: order_data,
                                        dataType: "json",
                                        async: false,
                                        success: function(orderData) {
                                            /* console.log(userData.orders);
                                            console.log(orderData); */
                                            var orderuuidarr = userData.orders;
                                            for (var i = 0; i < orderuuidarr.length; i++) {
                                                var orderobj = orderData[orderuuidarr[i]];
                                                var orderUuid = orderuuidarr[i]; //订单uuid
                                                var thedate = create_time(orderobj.createdate);
                                                var orderCreateDate = thedate._year + "年" + thedate._month + "月" + thedate._day + "日 " + thedate._hour + ":" + thedate._minute; //订单创建日期
                                                var station = orderobj.station; //用户选择的扫描站点
                                                var appointmentdate = orderobj.appointmentdate; //用户预约的扫描时间
                                                var scandate = orderobj.scandate; //实际的扫描时间
                                                var status = orderobj.status; //订单的状态
                                                ordersArray.push({ "orderuuid": orderUuid, "createdate": orderCreateDate, "station": station, "appointmentdate": appointmentdate, "scandate": scandate, "status": status });
                                                order_uuid_arr.push(orderUuid);
                                            }
                                        },
                                        error: function() {

                                        }
                                    });
                                } else {
                                    $(".tabs").empty();
                                    $(".tabs").text("当前没有订单！");
                                    $(".tabs").css({
                                        "width": "100%",
                                        "font-size": "40px",
                                        "text-align": "center",
                                        "padding-top": "40px"
                                    });
                                }
                            }
                        },
                        error: function(re) {

                        }
                    }); 
                    this.ordersArray = ordersArray;
                } else {
                    // $('.login').html('<a href="login.html"><span class="glyphicon glyphicon-user"></span>登录/注册</a>');
                    console.log("cookie不存在！");
                    $(".tabs").empty();
                    $(".tabs").text("请前往登录！");
                    $(".tabs").css({
                        "width": "100%",
                        "font-size": "40px",
                        "text-align": "center",
                        "padding-top": "40px"
                    });
                }
            },
        }
    })
})