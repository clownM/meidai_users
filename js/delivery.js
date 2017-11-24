$(function () {
    new Vue({
        el: "#vueapp",
        data: {},
        methods: {
            get_info: function () {
                var infoarr = [];
                if (getCookie("uuid") != "") {
                    var delivery_company = sessionStorage.getItem("delivery_company"),
                        delivery_postid = sessionStorage.getItem("delivery_postid");
                    if (delivery_company && delivery_postid) {
                        console.log(delivery_company,delivery_postid);
                        /* 快递查询 */
                        var deliveryobj = {
                            "action": "query",
                            "postid": delivery_postid,
                            "company": delivery_company
                        }
                        $.ajax({
                            url: "/express",
                            type: "post",
                            data: deliveryobj,
                            dataType: "json",
                            async: false,
                            success: function (data) {
                                var express = JSON.parse(data.express);
                                console.log(express);
                                var delivery_state;
                                switch (express.state) {
                                    case '0':
                                        delivery_state = '运输中';
                                        break;
                                    case '1':
                                        delivery_state = '揽件中';
                                        break;
                                    case '2':
                                        delivery_state = '疑难';
                                        break;
                                    case '3':
                                        delivery_state = '已签收';
                                        break;
                                    case '4':
                                        delivery_state = '退签';
                                        break;
                                    case '5':
                                        delivery_state = '派件中';
                                        break;
                                    default:
                                        delivery_state = '没有快递信息';
                                }
                                var expressdata = express.data;
                                console.log(expressdata);
                                for(var x in expressdata){
                                    infoarr.push({
                                        "date":expressdata[x].time,
                                        "context":expressdata[x].context
                                    })
                                }
                            },
                            error: function () {
                                console.log("请查看网络");
                            }
                        })
                    } else {
                        window.location.href = "/order_list.html";
                    }
                } else {
                    window.location.href = "/login.html";
                }
                return infoarr;
            }
        }
    })



})