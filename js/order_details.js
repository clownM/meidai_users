// 获取镜框
function setframe(len) {
    if (len == 'rectangle-s') {
        len = 'MFA717';
    }
    if (len == 'ellipse') {
        len = 'MFA101';
    }
    if (len == 'catseye') {
        len = 'MFA555';
    }
    if (len == 'circle') {
        len = 'MFA000';
    }
    return len;
}

/**
 * 设置镜框图片位置
 **/
function setframeimg(len) {
    var tmp_top;
    var tmp_left;
    if (len == 'rectangle-s') {
        len = 'MFA717';
    }
    if (len == 'ellipse') {
        len = 'MFA101';
    }
    if (len == 'catseye') {
        len = 'MFA555';
    }
    if (len == 'circle') {
        len = 'MFA000';
    }

    switch (len) {
        case "MFA101":
            tmp_top = 0;
            tmp_left = 0;
            break;
        case "MFA733":
            tmp_top = 0;
            tmp_left = -200;
            break;
        case "MFA753":
            tmp_top = 0;
            tmp_left = -400;
            break;
        case "MFA715":
            tmp_top = -115;
            tmp_left = 0;
            break;
        case "MFA735":
            tmp_top = -115;
            tmp_left = -200;
            break;
        case "MFA755":
            tmp_top = -115;
            tmp_left = -400;
            break;
        case "MFA717":
            tmp_top = -230;
            tmp_left = 0;
            break;
        case "MFA737":
            tmp_top = -230;
            tmp_left = -200;
            break;
        case "MFA757":
            tmp_top = -230;
            tmp_left = -400;
            break;
        case "MFA513":
            tmp_top = -345;
            tmp_left = 0;
            break;
        case "MFA530":
            tmp_top = -345;
            tmp_left = -200;
            break;
        case "MFA555":
            tmp_top = -345;
            tmp_left = -400;
            break;
        case "MFA515":
            tmp_top = -460;
            tmp_left = 0;
            break;
        case "MFA535":
            tmp_top = -460;
            tmp_left = -200;
            break;
        case "MFA557":
            tmp_top = -460;
            tmp_left = -400;
            break;
        case "MFA517":
            tmp_top = -575;
            tmp_left = 0;
            break;
        case "MFA537":
            tmp_top = -575;
            tmp_left = -200;
            break;
        case "MFA000":
            tmp_top = -575;
            tmp_left = -400;
            break;
        default:
            tmp_top = "";
            tmp_left = ""
    }
    var tmp_location = {};
    tmp_location.top = tmp_top;
    tmp_location.left = tmp_left;
    return tmp_location;
}

/**
 * 眼镜的颜色
 **/
function glass_color(color) {
    var tmp_material = '';
    if (color != undefined && color.slice(0, 4) == "0xff") {
        tmp_material = color.slice(8, 10) + color.slice(6, 8) + color.slice(4, 6);
    } else {
        tmp_material = '';
    }
    return tmp_material;
}
/**
 *得到色值
 * */
function get_color(parm1) {
    var _Hex = parm1.toString(16);
    _getHexarr = _Hex.match(/\w{2}/g);
    _getHexarr.splice(0, 1);
    var _getcolor = _getHexarr.reverse().join("");
    return _getcolor;
}

/**
 * 检测对象的key是否存在
 **/

/*
*
检测对象是否是空对象(不包含任何可读属性)。
*
方法只既检测对象本身的属性，不检测从原型继承的属性。
*/
function isOwnEmpty(obj, key) {
    var tmp_key = obj.hasOwnProperty(key) ? obj[key] : '';
    return tmp_key;
};

/**
 * 创建已扫描的数据
 * */

function alreadyscan(param1, param2) {
    /****** 所有的眼镜的数据 ******/
    var orderobj;
    var glass_collecteddata_data = {};
    var glass_params_data = {};
    load_collecteddata_data();

    function load_collecteddata_data() {
        var tmp_collecteddata = param1.collecteddata;
        // console.log(tmp_collecteddata)
        if (tmp_collecteddata != '') {
            tmp_collecteddata = tmp_collecteddata;
            for (var i in tmp_collecteddata) {
                glass_collecteddata_data[i] = tmp_collecteddata[i];
            }
        }
    }

    glass_config_data = {};
    if (!glass_config_data.PupilDistance) {} else {
        glass_config_data.PupilDistance = glass_collecteddata_data.PupilDistance;
    }

    /****** 把config 按照config_literal -> config -> preconfig 整合成一个新的config******/
    load_preconfig_data();

    function load_preconfig_data() {
        var tmp_preconfig = param1.preconfig;
        if (tmp_preconfig != '') {
            // tmp_preconfig = JSON.parse(tmp_preconfig);
            tmp_preconfig = tmp_preconfig;
            for (var i in tmp_preconfig) {
                glass_config_data[i] = tmp_preconfig[i];
            }
        }
        load_oldConfig_data();
    }

    function load_oldConfig_data() {
        var config_uuid = param1.config[0];
        // console.log(config_uuid)
        var post_data = {
            'action': 'download',
            'type': 'config',
            "Chunk": "0",
        };
        if (config_uuid != '') {
            post_data['uuid'] = config_uuid;
        }
        $.ajax({
            type: 'post',
            data: post_data,
            async: false,
            // dataType: 'text',
            url: "/data",
            success: function (dt) {
                if (dt.result != 'false' && dt != '') {
                    var config_in_json = Config2Json(dt);
                    for (var i in config_in_json) {
                        glass_config_data[i] = config_in_json[i];
                    }
                    // load_config_data();
                    load_params_data();
                }
            },
            error: function () {}
        })
    }

    function load_params_data() {
        var post_data = {
            'action': 'download',
            'type': 'params',
        };
        if (param1.params != '') {
            post_data['uuid'] = param1.params;
        }
        $.ajax({
            type: 'post',
            data: post_data,
            async: false,
            // dataType: 'json',
            url: "/data",
            success: function (dte) {
                // console.log(dte)
                if (JSON.parse(dte) && JSON.parse(dte).result != 'false' && dte != '') {
                    var tmp_params = JSON.parse(dte);
                    for (var i in tmp_params) {
                        glass_params_data[i] = tmp_params[i];
                    }
                }
            },
            error: function () {}
        })
        disposal_data()
    }

    function disposal_data() {
        var tmp_collecteddata = isOwnEmpty(glass_collecteddata_data, 'sdf');
        var _lastOrdernumber = param2;
        var create_ordertime = create_time(param1.createdate);
        var _orderstatus = get_status(param1.status);
        var _userordertext = {};
        /**
         * 订单编号 
         **/
        _userordertext.ordertimetxt = create_ordertime._year + "年" + create_ordertime._month + "月" + create_ordertime._day + "日 " + create_ordertime._hour + ":" + create_ordertime._minute + ":" + create_ordertime._second;
        _userordertext.ordernumbertxt = "" + create_ordertime._year + create_ordertime._month + create_ordertime._day + _lastOrdernumber;
        _userordertext.orderstatus = _orderstatus;
        /**
         * 验光参数 
         **/
        _userordertext.left_degrees = isOwnEmpty(glass_collecteddata_data, 'left_degrees');
        _userordertext.left_cyl = isOwnEmpty(glass_collecteddata_data, 'left_cyl');
        _userordertext.left_axis = isOwnEmpty(glass_collecteddata_data, 'left_axis');

        _userordertext.right_degrees = isOwnEmpty(glass_collecteddata_data, 'right_degrees');
        _userordertext.right_cyl = isOwnEmpty(glass_collecteddata_data, 'right_cyl');
        _userordertext.right_axis = isOwnEmpty(glass_collecteddata_data, 'right_axis');
        _userordertext.pupilDistance = isOwnEmpty(glass_config_data, 'PupilDistance');

        /**
         * 镜框参数
         **/
        _userordertext.widthScale = isOwnEmpty(glass_config_data, 'WidthScale');
        _userordertext.heightScale = isOwnEmpty(glass_config_data, 'HeightScale');
        _userordertext.bridgeSpanRatio = isOwnEmpty(glass_config_data, 'BridgeSpanRatio');

        /**
         * 眼镜的框镜型
         **/
        // console.log(glass_config_data.LensProfileFile)
        if (!glass_config_data.LensProfileFile) {
            var tmp_lensprofilefile_img = '{"top":"100","left":"100"}';
            _userordertext.lensprofilefile = '';
            _userordertext.lensprofilefile_img = JSON.parse('{"top":"100","left":"100"}');
        } else {
            var tmp_lensprofilefile = glass_config_data.LensProfileFile.slice(15, -8);
            _userordertext.lensprofilefile = setframe(tmp_lensprofilefile)
            _userordertext.lensprofilefile_img = setframeimg(tmp_lensprofilefile);
        }

        /**
         *眼镜镜腿镜型
         **/
        if (typeof (glass_config_data.LegProfile) == "undefined") {
            _userordertext.legProfile = 'c3';
        } else {
            _userordertext.legProfile = glass_config_data.LegProfile;
        }
        /**
         *眼镜镜腿颜色
         **/
        if (!glass_config_data.LegColor) {
            _userordertext.legColor = '#282828';
        } else {
            _userordertext.legColor = glass_color(glass_config_data.LegColor);
        }

        /**
         *眼镜镜框颜色
         **/
        if (!glass_config_data.FrameColor) {
            _userordertext.frameColor = '#282828';
        } else {
            _userordertext.frameColor = glass_color(isOwnEmpty(glass_config_data.FrameColor));
        }

        /**
         *刻字
         **/
        /****** 镜框 ******/
        _userordertext.slotMessage = isOwnEmpty(glass_config_data, 'SlotMessage');
        /****** 镜腿 ******/
        _userordertext.legMessage = isOwnEmpty(glass_config_data, 'LegMessage');

        // console.log(_userordertext)
        orderobj = _userordertext;
    }
    return orderobj;
}

$(function () {
    new Vue({
        el: "#content",
        data: {
            ordertimetxt: "", //订单创建时间
            ordernumbertxt: "", //order编号
            orderstatus: "", //订单状态
            station: "", //扫描预约门店
            right_degrees: "", //右眼度数
            right_cyl: "", //右眼散光
            right_axis: "", //右眼轴距
            left_degrees: "", //左眼度数   
            left_cyl: "", //左眼散光
            left_axis: "", //左眼轴距
            pupilDistancs: "", //瞳距
            widthScale: "", //镜框比
            heightScale: "", //鼻中位
            bridgeSpanRatio: "", //鼻中宽   
            slotMessage1: "", //镜框刻字
            slotMessage2: "",
            legMessage1: "", //镜腿刻字
            legMessage2: "",
            legMessage3: "",
            lensProfileFile: "",
            lensProfileFile_img: {},
            frameColor: "", //镜框颜色
            legProfile: "", //镜框图片
            legColor: "", //镜腿颜色

            company: "",    //快递公司
            postid: ""      //快递单号

        },
        mounted: function () {
            this.get_order_details();
            this.$nextTick(() => {
                //移动端顶部返回
                $(".go-back").on("click", function () {
                    // window.location.href="/order_list.html";
                    history.back();
                });
            })
        },
        methods: {
            get_order_details: function () {
                var resultobj;
                if (getCookie("uuid") != "" && getCookie("orderuuid") != "") {
                    var orderuuid = getCookie("orderuuid");
                    // var orderuuid = "d92ff0da7a139028f372c2cab5b18a48";
                    console.log("useruuid:" + getCookie("uuid"));
                    console.log("orderuuid:" + orderuuid);
                    var orderuuid_hash = hashCode(orderuuid);
                    var order_data = {
                        "action": "query",
                        "uuid": orderuuid,
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
                        success: function (orderData) {
                            var station = orderData.station;
                            resultobj = alreadyscan(orderData, orderuuid_hash);
                            resultobj.station = station;

                            var dealobj = {
                                "action": "query",
                                "uuid": dealuuid,
                                "createdate": "",
                                "price": "",
                                "status": "",
                                "owneruuid": "",
                                "config_literal": "",
                                "printdate": "",
                                "delivery": "",
                                "deliverydate": "",
                                "acceptdate": "",
                                'params': '',
                                "config": "",
                                'paymentstatus': '',
                                "discount": '',
                                "genprint": '',
                            };
                            $.ajax({
                                type: "post",
                                data: dealobj,
                                dataType: "json",
                                async: false,
                                url: "/deal",
                                success: function (dt) {
                                    var price = dt.price;
                                    resultobj.price = price;

                                    var delivery = dt.delivery;
                                    if (delivery == "") {
                                        //没有快递信息
                                    } else {
                                        delivery = JSON.parse(delivery);
                                        if (delivery.postprocessing_delivery == undefined) {
                                            var courier_company = delivery.production_delivery.courier_company;
                                            var courier_number = delivery.production_delivery.courier_number;
                                            resultobj.company = courier_company;
                                            resultobj.postid = courier_number;
                                        } else {
                                            var courier_company = delivery.postprocessing_delivery.courier_company;
                                            var courier_number = delivery.postprocessing_delivery.courier_number;
                                            resultobj.company = courier_company;
                                            resultobj.postid = courier_number;
                                        }
                                    }
                                },
                                error: function (er) {

                                }
                            });
                        },
                        error: function () {

                        }
                    });
                    this.ordertimetxt = resultobj.ordertimetxt;
                    this.ordernumbertxt = resultobj.ordernumbertxt;
                    this.orderstatus = resultobj.orderstatus;
                    this.station = resultobj.station;
                    this.right_degrees = resultobj.right_degrees;
                    this.right_cyl = resultobj.right_cyl;
                    this.right_axis = resultobj.right_axis;
                    this.left_degrees = resultobj.left_degrees;
                    this.left_cyl = resultobj.left_cyl;
                    this.left_axis = resultobj.left_axis;
                    this.pupilDistancs = resultobj.pupilDistancs;
                    this.widthScale = resultobj.widthScale;
                    this.heightScale = resultobj.heightScale;
                    this.bridgeSpanRatio = resultobj.bridgeSpanRatio;
                    this.slotMessage1 = resultobj.slotMessage1;
                    this.slotMessage2 = resultobj.slotMessage2;
                    this.legMessage1 = resultobj.legMessage1;
                    this.legMessage2 = resultobj.legMessage2;
                    this.legMessage3 = resultobj.legMessage3;

                    this.lensProfileFile_img.top = "-" + resultobj.lensprofilefile_img.top;
                    this.lensProfileFile_img.left = "-" + resultobj.lensprofilefile_img.left;
                    this.frameColor = resultobj.frameColor;

                    this.legProfile = "/images/tui/" + resultobj.legProfile + ".png";
                    this.legColor = resultobj.legColor;

                    this.company = resultobj,company;
                    this.postid = resultobj.postid;
                } else {
                    window.location.href = "";
                }
            },
            // 快递查询
            express_check: function (company, postid) {
                var expressobj;
                var obj = {
                    "action": "query",
                    "postid": postid,
                    "company": company
                }
                $.ajax({
                    url: "/express",
                    type: "post",
                    data: obj,
                    success: function (data) {
                        var data = JSON.parse(data)
                        var msg = JSON.parse(data.express)
                        var express_state;
                        switch (msg.state) {
                            case '0':
                                express_state = '运输中';
                                break;
                            case '1':
                                express_state = '揽件中';
                                break;
                            case '2':
                                express_state = '疑难';
                                break;
                            case '3':
                                express_state = '已签收';
                                break;
                            case '4':
                                express_state = '退签';
                                break;
                            case '5':
                                express_state = '派件中';
                                break;
                            default:
                                express_state = '没有快递信息';
                        }
                        var length = msg.data.length;
                        expressobj.date = msg.data[length-1].time;
                        express.context = msg.data[length-1].context;
                    },
                    error: function () {
                        console.log("请查看网络");
                    }
                })
                return expressobj;
            }
        }
    });
})