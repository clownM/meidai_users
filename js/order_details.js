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
 * 眼镜的颜色 END
 **/


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
 * 得到订单状态
 * */
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
        // glass_config_data.PupilDistance = glass_collecteddata_data.pupil_dist;
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
            success: function(dt) {
                if (dt.result != 'false' && dt != '') {
                    var config_in_json = Config2Json(dt);
                    for (var i in config_in_json) {
                        glass_config_data[i] = config_in_json[i];
                    }
                    // load_config_data();
                    load_params_data();
                }
            },
            error: function() {}
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
            success: function(dte) {
                // console.log(dte)
                if (JSON.parse(dte) && JSON.parse(dte).result != 'false' && dte != '') {
                    var tmp_params = JSON.parse(dte);
                    for (var i in tmp_params) {
                        glass_params_data[i] = tmp_params[i];
                    }
                }
            },
            error: function() {}
        })
        disposal_data()
    }

    function disposal_data() {

        var tmp_collecteddata = isOwnEmpty(glass_collecteddata_data, 'sdf');
        // var tmp_sdf = glass_collecteddata_data.hasOwnProperty('sdf')? glass_collecteddata_data.sdf : '';
        // console.log(tmp_sdf)


        var _lastOrdernumber = param2;
        var create_ordertime = create_time(param1.createdate);
        var _orderstatus = get_status(param1.status);
        var _userordertext = {};
        /**
         * 订单编号 
         **/
        _userordertext.ordertimetxt = create_ordertime._year + "." + create_ordertime._month + "." + create_ordertime._day;
        _userordertext.ordernumbertxt = "" + create_ordertime._year + create_ordertime._month + create_ordertime._day + _lastOrdernumber;
        _userordertext.orderstatus = _orderstatus;

        // console.log(_userordertext);

        /**
         * 验光参数 
         **/
        _userordertext.left_degrees = isOwnEmpty(glass_collecteddata_data, 'left_degrees');
        _userordertext.left_cyl = isOwnEmpty(glass_collecteddata_data, 'left_cyl');
        _userordertext.left_axis = isOwnEmpty(glass_collecteddata_data, 'left_axis');

        _userordertext.right_degrees = isOwnEmpty(glass_collecteddata_data, 'right_degrees');
        _userordertext.right_cyl = isOwnEmpty(glass_collecteddata_data, 'right_cyl');
        _userordertext.right_axis = isOwnEmpty(glass_collecteddata_data, 'right_axis');
        _userordertext.PupilDistance = isOwnEmpty(glass_config_data, 'PupilDistance');

        /**
         * 镜框参数
         **/
        _userordertext.WidthScale = isOwnEmpty(glass_config_data, 'WidthScale');
        _userordertext.HeightScale = isOwnEmpty(glass_config_data, 'HeightScale');
        _userordertext.BridgeSpanRatio = isOwnEmpty(glass_config_data, 'BridgeSpanRatio');

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
        if (!glass_config_data.LegProfile) {
            _userordertext.LegProfile = 'c3';
        } else {
            _userordertext.LegProfile = glass_config_data.LegProfile;
        }
        /**
         *眼镜镜腿颜色
         **/
        if (!glass_config_data.LegColor) {
            _userordertext.LegColor = '#282828';
        } else {
            _userordertext.LegColor = glass_color(glass_config_data.LegColor);
        }


        /**
         *眼镜镜框颜色
         **/
        if (!glass_config_data.FrameColor) {
            _userordertext.FrameColor = '#282828';
        } else {
            _userordertext.FrameColor = glass_color(isOwnEmpty(glass_config_data.FrameColor));
        }


        /**
         *刻字
         **/
        /****** 镜框 ******/
        _userordertext.SlotMessage = isOwnEmpty(glass_config_data, 'SlotMessage');
        /****** 镜腿 ******/
        _userordertext.LegMessage = isOwnEmpty(glass_config_data, 'LegMessage');

        console.log(_userordertext)
        orderobj = _userordertext;
    }
    return orderobj;
}

$(function() {
    new Vue({
        el: "#content",
        data: {
            ordertimetxt: "",
            ordernumbertxt: "",
            orderstatus: "",
            station: "",
            right_degrees: "",
            right_cyl: "",
            right_axis: "",
            left_degrees: "",
            left_cyl: "",
            left_axis: "",
            pupilDistancs: "",
            widthScale: "",
            heightScale: "",
            bridgeSpanRatio: "",
            slotMessage1: "",
            slotMessage2: "",
            legMessage1: "",
            legMessage2: "",
            legMessage3: "",
        },
        mounted: function() {
            this.get_order_details();
        },
        methods: {
            get_order_details: function() {
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
                        success: function(orderData) {
                            console.log();
                            var station = orderData.station;
                            resultobj = alreadyscan(orderData, orderuuid_hash);
                            resultobj.station = station;
                            // console.log(resultobj.orderstatus);
                        },
                        error: function() {

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
                } else {
                    window.location.href = "";
                }
            }
        }
    });
})