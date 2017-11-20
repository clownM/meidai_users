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

        case "cancelled":
            _status = "已取消";
            break;
        default:
            _status = "未知";
    }
    return _status;
}
function get_orderno(parm,parm2){
    if(!(parm == "暂无信息")){
        //订单编号
        return ""+parm._year+parm._month+parm._day+hashCode(parm2);
    }else{
        return "wrong";
    }
}

function get_createdate(parm){
    if(!(parm == "暂无信息")){
        //订单创建日期
        return parm._year + "-" + parm._month + "-" + parm._day + " " + parm._hour + ":" + parm._minute+ ":" + parm._second
    }else{
        return "wrong"
    }
}

$(function() {
    //将订单的uuid全部放入数组中
    var order_uuid_arr = [];
    var cancelOrder_uuid_arr = [];
    var vm = new Vue({
        el: '#content',
        data: {
            ordersArray: [],
            toscan_array: []
        },
        mounted: function() {
            this.get_order_info();
            // this.get_all_orders();
            // DOM经过Vue渲染之后
            this.$nextTick(() => {
                tabsToggle();
                // 跳转至订单详情
                $(".to_order_details").click(function() {
                    var index = $(".to_order_details").index(this);
                    console.log(index);
                    // console.log(order_uuid_arr[index]);
                    setCookie("orderuuid", order_uuid_arr[index], 1);
                    // console.log(getCookie("orderuuid"));
                    window.location.href = "order_details.html";
                });

                //取消订单
                $(".cancelOrder").click(function(){
                    var index = $(".cancelOrder").index(this);
                    console.log(cancelOrder_uuid_arr[index]);

                    var cancelobj = {
                        "action" : "cancel",
                        "uuid" : cancelOrder_uuid_arr[index]
                    };
                    $.ajax({
                        url: "/order",
                        type: "post",
                        data: cancelobj,
                        dataType: "json",
                        async: false,
                        success: function(result){

                        },
                        error: function(er){

                        }
                    });
                });
                
                //移动端顶部返回
                $(".go-back").on("click",function(){
                    // window.location.href="/mymeidai.html";
                    history.back();
                });
            })
        },
        methods: {
            get_order_info: function() {
                var ordersArray = [];
                var toscan_array = [];
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
                                            var orderuuidarr = userData.orders;
                                            for (var i = 0; i < orderuuidarr.length; i++) {
                                                var orderobj = orderData[orderuuidarr[i]];
                                                // console.log(orderobj.scandate);
                                                var orderUuid = orderuuidarr[i]; //订单uuid
                                                var thecreatedate = create_time(orderobj.createdate);
                                                //订单编号
                                                var orderno = get_orderno(thecreatedate,orderUuid);
                                                //order生成日期
                                                var orderCreateDate = get_createdate(thecreatedate);
                                                // get_no_and_createdate(thecreatedate,orderUuid);

                                                //用户选择的扫描站点
                                                var station = orderobj.station;
                                                if(station == ""){
                                                    station = "暂无信息"
                                                }
                                                //用户预约的扫描时间
                                                var appointmentdate= create_time(orderobj.appointmentdate);
                                                if(!(appointmentdate == "暂无信息")){
                                                    appointmentdate =  appointmentdate._year + "-" + appointmentdate._month + "-" + appointmentdate._day + " " + 
                                                    appointmentdate._hour + ":" + appointmentdate._minute+ ":" + appointmentdate._second
                                                }
                                               //实际的扫描时间
                                                var scandate= create_time(orderobj.scandate);
                                                if(!(scandate == "暂无信息")){
                                                    scandate = scandate._year + "-" + scandate._month + "-" + scandate._day + " " + scandate._hour + ":" + scandate._minute+ ":" + scandate._second
                                                }
                                                //订单的状态
                                                var status = get_status(orderobj.status); 
                                                //deals
                                                var deals = orderobj.deals;
                                                //待扫描
                                                if(orderobj.status == "toscan"){
                                                    cancelOrder_uuid_arr.push(orderUuid);
                                                    toscan_array.push({"orderno": orderno, "createdate": orderCreateDate, "station": station, "appointmentdate": appointmentdate, "scandate": scandate, "status": "等待扫描"});
                                                }else{
                                                    if(deals.length != 0){
                                                        for(var j = 0;j < deals.length;j++){
                                                            var dealuuid = deals[i]; 
                                                            var dealobj = {
                                                                "action": "query",
                                                                "uuid": dealuuid,
                                                                "createdate": "",
                                                                "price":"",
                                                                "status":"",
                                                                "owneruuid":"",
                                                                "config_literal":"",
                                                                "payment":"",
                                                                "printdate":"",
                                                                "manufactur": "",
                                                                "delivery": "",
                                                                "deliverydate": "",
                                                                "acceptdate": "",
                                                                'params':'',
                                                                "config":"",
                                                                'paymentstatus' :'',
                                                                "discount" : '',
                                                                "genprint" : '',
                                                            };
                                                            $.ajax({
                                                                type: "post",
                                                                data: dealobj,
                                                                dataType: "json",
                                                                async: false,
                                                                url: "/deal",
                                                                success: function(dt) {
                                                                    // if( dt.result != 'false'){
                                                                    //      console.log(dt)
                                                                    //     for(var i in dt){
                                                                    //         all_deal_data[i] = dt[i] 
                                                                    //     }
                                                                    //     if(current_page_list < current_page){
                                                                    //         current_page_list = current_page_list+1;
                                                                    //         load_deal_data();
                                                                    //     }else{
                                                                    //         load_order_data();
                                                                    //     }
                                                                    // }else{
                                                                    //    $('.dataTables_empty').text('没有数据'); 
                                                                    // }                	
                                                                },
                                                                error: function(er) {
                                                                    console.log('deal query');
                                                                    console.log(er)
                                                                    $('.dataTables_empty').text('没有网络');
                                                                }
                                                            });
                                                        }
                                                    }
                                                }   
                                                ordersArray.push({ "orderno": orderno, "createdate": orderCreateDate, "station": station, "appointmentdate": appointmentdate, "scandate": scandate, "status": status, "deals":deals });
                                                order_uuid_arr.push(orderUuid);

                                                
                                            }
                                        },
                                        error: function() {

                                        }
                                    });
                                } else {
                                    
                                    // $(".content").empty();
                                    // $(".content").text("当前没有订单！");
                                    // $(".content").css({
                                    //     "width": "100%",
                                    //     "font-size": "40px",
                                    //     "text-align": "center",
                                    //     "padding-top": "40px"
                                    // });
                                }
                            }
                        },
                        error: function(re) {

                        }
                    }); 
                    this.ordersArray = ordersArray;
                    this.toscan_array = toscan_array;
                } else {
                    window.location.href = "/login.html";
                    // $('.login').html('<a href="login.html"><span class="glyphicon glyphicon-user"></span>登录/注册</a>');
                    // console.log("cookie不存在！");
                    // $(".content").empty();
                    // $(".content").text("请前往登录！");
                    // $(".content").css({
                    //     "width": "100%",
                    //     "font-size": "40px",
                    //     "text-align": "center",
                    //     "padding-top": "40px"
                    // });
                }
            },
        }
    })
})