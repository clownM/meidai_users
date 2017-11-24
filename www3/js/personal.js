$(function(){
	/**
	 * 月，年，所有订单切换
	 * */
	$("#content .article .articleheader ul>li").click(function(){
		var _index=$(this).index();
		var _moveleft=_index*100;
		$(this).addClass("selected").siblings().removeClass("selected");
		$("#content .article .articleheader .movebox").animate({
			left:_moveleft+'px',
		},500);
		//订单详情页切换
		var _orderbar=$("#content .article .yy .articlecontent").children();
		_orderbar.eq(_index+1).addClass("orderbar").siblings().removeClass("orderbar");
		//分页器选择
		var _pageselect=$("#content .article ._page").children();
		_pageselect.eq(_index).addClass("_pageselect").siblings().removeClass("_pageselect");
	});
	var recently_one_day = '[[['+'"createdate"'+',">=","'+(new Date(Date.parse(new Date().toDateString())).toUTCString().replace(/GMT/,'-0000'))+'"]]]';
	// console.log(recently_one_day)
    init_infor();
    // init_infor(recently_one_day);
	/**
	 * 初始化信息
	 * */
	// function init_infor(condition_) {
	function init_infor() {
		var _allordernumber=0;  //所有订单
		var _orderonemonthagonumber=0; //一个月内订单
		var _orderoneyearagonumber=0; //一个年内订单
		var _uuid=getCookie("uuid");
		var init_data = {
			"action": "query",
			"uuid": _uuid,
			"phone": "",
			"username": "",
			"gender": "",
			"birthday": "",
			"orders": "",
			"lastorder": "",
		};
		// console.log(init_data)
		$.ajax({
			type: "post",
			data: init_data,
			dataType: "json",
			url: "/user",
			success: function(data) {	
				// console.log(data)
				if(data.result == 'true'){
					query_batchorder(data.orders,data.orders.reverse())
				}else{
					// $('#userdata_error p').eq(0).css('display','block');
					$("#content .article .yy .orderonemonthago").append("<h1 id='remind'>登录错误请重新登录</h1>");
				}
//				for(var i = 0; i < data.orders.length; i++) {
//					var _hashorder = hashCode(data.orders[i]);
//					query_order(data.orders[i], _hashorder);
//				}
				
			},
			error: function(er){
				console.log(er);
				// $('#userdata_error p').eq(1).css('display','block');
				$("#content .article .yy .orderonemonthago").append("<h1 id='remind'>网络错误请重新登录</h1>");
			}
		});
		
	}
	// init_infor();
	
	/**
	 * 订单批量查询
	 * */
	function query_batchorder(orderuuids,param2){
		var order_data = {
			"action": "query",
			"uuid": JSON.stringify(orderuuids),
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
			"collecteddata": "",
			"scanphoto": "",
			"params":""
		};
		$.ajax({
			type: "post",
			data: order_data,
			dataType: "json",
			url: "/order",
			success: function(data) {
				console.log(data)
				for(var i=0;i<param2.length;i++){
					var _batchorder=hashCode(param2[i]);
					console.log(data[param2[i]])
					alreadyscan(data[param2[i]],_batchorder);
				}

			},
			error:function(erro) {
				console.log(erro);
				// $('#userdata_error p').eq(1).css('display','block');
				$("#content .article .yy .orderonemonthago").append("<h1 id='remind'>网络错误请重新登录</h1>")
			},
			complete:function(){
				// setTimeout(
				// function asd(){
				_allordernumber=$("#content .yy .allorders").find(".articlecontent").length;
				// console.log(_allordernumber)
				// console.log($("#content .yy .allorders"))
				// console.log($("#content .yy .allorders").find(".articlecontent"))
				_orderonemonthagonumber=$("#content .yy .orderonemonthago").find(".articlecontent").length;
				_orderoneyearagonumber=$("#content .yy .orderoneyearago").find(".articlecontent").length;
				if(_allordernumber==0){
					$("#content .article .yy .allorders").append("<h1 id='remind'>当前没有订单</h1>")
				}else if(_allordernumber > 1){
					$("#pagingdevice1").mypagunation($("#pagingdevice1"),$("#content .yy .allorders"),{"_pagenumber":_allordernumber>0?_allordernumber:1});
				}
				if(_orderonemonthagonumber==0){
					$("#content .article .yy .orderonemonthago").append("<h1 id='remind'>当前没有订单</h1>")
				}else if(_orderonemonthagonumber > 1){
					$("#pagingdevice2").mypagunation($("#pagingdevice2"),$("#content .yy .orderonemonthago"),{"_pagenumber":_orderonemonthagonumber>0?_orderonemonthagonumber:1});
				}
				if(_orderoneyearagonumber==0){
					$("#content .article .yy .orderoneyearago").append("<h1 id='remind'>当前没有订单</h1>")
				}else if(_orderoneyearagonumber > 1){
					$("#pagingdevice3").mypagunation($("#pagingdevice3"),$("#content .yy .orderoneyearago"),{"_pagenumber":_orderoneyearagonumber>0?_orderoneyearagonumber:1});
				}
				$("#content .article .yy .allorders").find(".articlecontent").eq(0).css({"display":"block"})
				.siblings().css({"display":"none"});
				
				$("#content .article .yy .orderonemonthago").find(".articlecontent").eq(0).css({"display":"block"})
				.siblings().css({"display":"none"});
				
				$("#content .article .yy .orderoneyearago").find(".articlecontent").eq(0).css({"display":"block"})
				.siblings().css({"display":"none"});
				// },300)
			}
		});
	}
	/**
	 *查询订单
	 * */
	function query_order(orderuuid, parm2) {
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
			"collecteddata": "",

		};
		$.ajax({
			type: "post",
			data: order_data,
			dataType: "json",
			async: false,
			url: "/order",
			success: function(data) {
				alreadyscan(data,parm2);
			},
			error: function() {

			}
		});
	}
	
	/**
	 * 创建已扫描的数据
	 * */
	function alreadyscan(param1,param2){
		
        /****** 所有的眼镜的数据 ******/	
        glass_collecteddata_data = {};
        glass_params_data = {};
        load_collecteddata_data();
        function load_collecteddata_data(){
        	
            var tmp_collecteddata = param1.collecteddata;
            console.log(tmp_collecteddata)
            if( tmp_collecteddata != ''){
                tmp_collecteddata = tmp_collecteddata;
                for(var i in tmp_collecteddata){
                    glass_collecteddata_data[i] = tmp_collecteddata[i];
                }
            }                    

        }


        glass_config_data = {};
        if(!glass_config_data.PupilDistance){         //瞳距
        }else{
            // glass_config_data.PupilDistance = glass_collecteddata_data.pupil_dist;
            glass_config_data.PupilDistance = glass_collecteddata_data.PupilDistance;
        }

        /****** 把config 按照config_literal -> config -> preconfig 整合成一个新的config******/
        load_preconfig_data();
		function load_preconfig_data(){

            var tmp_preconfig = param1.preconfig;
            if( tmp_preconfig != ''){
                // tmp_preconfig = JSON.parse(tmp_preconfig);
                tmp_preconfig = tmp_preconfig;
                for( var i in tmp_preconfig){
                    glass_config_data[i] = tmp_preconfig[i];
                }
            }
            load_oldConfig_data();	

		}
        function load_oldConfig_data(){
            var config_uuid = param1.config[0];  
        	console.log(config_uuid)

            var post_data = {
                'action' : 'download',
                'type' : 'config',
                "Chunk":"0",
            };
            if(config_uuid != ''){
                post_data['uuid'] = config_uuid;
            }
            $.ajax({

                type: 'post',
                data: post_data,
                async: false,
                // dataType: 'text',
                url: "/data",
                success:function(dt){
                    if(dt.result != 'false' && dt != ''){
                        var config_in_json = Config2Json(dt);
                        for(var  i in config_in_json){
                            glass_config_data[i] = config_in_json[i];
                        }
                        // load_config_data();
                        load_params_data();   
                    }
                    
                },
                error: function(){
                }
            })              
        }

        // function load_config_data(){
        //     tmp_config = param1.config_literal;
        //     for( var i in tmp_config){
        //         glass_config_data[i] = tmp_config[i];
        //     }

        //      load_params_data();   
        // }


        function load_params_data(){
    		var post_data = {
        		'action' : 'download',
        		'type' : 'params',
        	};
            if(param1.params != ''){
                post_data['uuid'] = param1.params;
            }
        	$.ajax({
        		type: 'post',
        		data: post_data,
        		async: false,
        		// dataType: 'json',
        		url: "/data",
        		success:function(dte){
                    // console.log(dte)
        			if (JSON.parse(dte) && JSON.parse(dte).result != 'false' && dte != '') {
        				var tmp_params = JSON.parse(dte);
	        			for(var i in tmp_params){
	        				glass_params_data[i] = tmp_params[i];
	        			}

        			}
        		},
        		error: function(){
        		}
        	})
        	disposal_data()
        }

    	function disposal_data(){
    		
	        // console.log(glass_params_data)
	        // console.log(glass_collecteddata_data)
	        // console.log(glass_config_data)

			var tmp_collecteddata = isOwnEmpty(glass_collecteddata_data,'sdf');
			// var tmp_sdf = glass_collecteddata_data.hasOwnProperty('sdf')? glass_collecteddata_data.sdf : '';
			// console.log(tmp_sdf)


			var _lastOrdernumber = param2;
			var create_ordertime = create_time(param1.createdate);
			var _orderstatus=get_status(param1.status);
			var _userordertext={};
			/**
			 * 订单编号 
			**/
			_userordertext.ordertimetxt = create_ordertime._year + "." + create_ordertime._month + "." + create_ordertime._day;
			_userordertext.ordernumbertxt = "" + create_ordertime._year + create_ordertime._month + create_ordertime._day + _lastOrdernumber;
			_userordertext.orderstatus=_orderstatus;
			
			// console.log(_userordertext);

			/**
			 * 验光参数 
			**/
			_userordertext.left_degrees = isOwnEmpty(glass_collecteddata_data,'left_degrees');
			_userordertext.left_cyl = isOwnEmpty(glass_collecteddata_data,'left_cyl');
			_userordertext.left_axis = isOwnEmpty(glass_collecteddata_data,'left_axis');

			_userordertext.right_degrees = isOwnEmpty(glass_collecteddata_data,'right_degrees');
			_userordertext.right_cyl = isOwnEmpty(glass_collecteddata_data,'right_cyl');
			_userordertext.right_axis = isOwnEmpty(glass_collecteddata_data,'right_axis');
			_userordertext.PupilDistance = isOwnEmpty(glass_config_data,'PupilDistance');

			/**
			 * 镜框参数
			**/
			_userordertext.WidthScale = isOwnEmpty(glass_config_data,'WidthScale');
			_userordertext.HeightScale = isOwnEmpty(glass_config_data,'HeightScale');
			_userordertext.BridgeSpanRatio = isOwnEmpty(glass_config_data,'BridgeSpanRatio');

			/**
			 * 眼镜的框镜型
			**/
			// console.log(glass_config_data.LensProfileFile)
			if(!glass_config_data.LensProfileFile){
				var tmp_lensprofilefile_img = '{"top":"100","left":"100"}';
				_userordertext.lensprofilefile = '';
			    _userordertext.lensprofilefile_img  = JSON.parse('{"top":"100","left":"100"}');
            }else{
                var tmp_lensprofilefile = glass_config_data.LensProfileFile.slice(15,-8);
                _userordertext.lensprofilefile = setframe(tmp_lensprofilefile)
                _userordertext.lensprofilefile_img = setframeimg(tmp_lensprofilefile);
            }

			/**
			 *眼镜镜腿镜型
			**/
			if(!glass_config_data.LegProfile){
                _userordertext.LegProfile = 'c3';
            }else{
				_userordertext.LegProfile = glass_config_data.LegProfile;
            }	
            /**
			 *眼镜镜腿颜色
			**/
			if(!glass_config_data.LegColor){
                _userordertext.LegColor = '#282828';
            }else {
				_userordertext.LegColor = glass_color(glass_config_data.LegColor);
            }


            /**
			 *眼镜镜框颜色
			**/
			if(!glass_config_data.FrameColor){
                _userordertext.FrameColor = '#282828';
            }else{
				_userordertext.FrameColor = glass_color(isOwnEmpty(glass_config_data.FrameColor));
            }


            /**
             *刻字
            **/
            /****** 镜框 ******/
            _userordertext.SlotMessage = isOwnEmpty(glass_config_data,'SlotMessage');
            /****** 镜腿 ******/
            _userordertext.LegMessage = isOwnEmpty(glass_config_data,'LegMessage');

			// console.log(_userordertext)


			/**
			 * 所有的订单
			 * */
			create_orderhtml($("#content .article .yy .allorders"),_userordertext);

			var _danqiandate=new Date();
			var _danqianyear=_danqiandate.getFullYear();
			var _danqianmonth=_danqiandate.getMonth();
			/**
			 * 一个月内订单
			* */

			if(new Date(_danqianyear,_danqianmonth,1).getTime()<new Date(param1.createdate).getTime()){
				
				create_orderhtml($("#content .article .yy .orderonemonthago"),_userordertext);
			}
			/**
			 * 一个年内订单
			 * */
			if(new Date(_danqianyear,0,1).getTime()<new Date(param1.createdate).getTime()){
				create_orderhtml($("#content .article .yy .orderoneyearago"),_userordertext);
			}
    	}    
	}


	/*
	 *创建订单详情
	 * */
	function create_orderhtml($parm1,parm2){
		// console.log(parm2)
		var SlotMessage1;
		var SlotMessage2;
		if(parm2.SlotMessage == ''){
                SlotMessage1 = '';
                SlotMessage2 = '';
            }else if(parm2.SlotMessage.length >= 4){
                SlotMessage1 = parm2.SlotMessage[0];
                SlotMessage2 = parm2.SlotMessage[2];
            }else if(parm2.SlotMessage.length == 1 || parm2.SlotMessage.length == 2){
                SlotMessage1 = parm2.SlotMessage[0];
                SlotMessage2 = '';
            }else if(parm2.SlotMessage.length == 3){
                SlotMessage1 = parm2.SlotMessage[0];
                SlotMessage2 = parm2.SlotMessage[1];
            }

            var LegMessage1;
            var LegMessage2;
            var LegMessage3;
            if(!parm2.LegMessage){
                LegMessage1 = '';
                LegMessage2 = '';
                LegMessage3 = '';
            }else{
                if(parm2.LegMessage.length == 2){
                    LegMessage1 = parm2.LegMessage[0];
                    LegMessage2 = parm2.LegMessage[1];
                    LegMessage3 = '';
                }else{
                    LegMessage1 = parm2.LegMessage[0];
                    LegMessage2 = parm2.LegMessage[1];
                    LegMessage3 = parm2.LegMessage[2];
                }
            }


		$parm1.append('<div class="articlecontent">'
							+'<div class="articlecontentheader">'
								+'<span class="ordertime">'+parm2.ordertimetxt+'</span>'
								+'<span>订单编号:'
									+'<span class="ordernumber">'+parm2.ordernumbertxt+'</span>'
								+'</span>'
								+'<span class="orderstatus">'+parm2.orderstatus+'</span>'
							+'</div>'
							+'<div class="articlecontentbody">'
								+'<div class="eyeinformation">'
									+'<h3>验光参数</h3>'
									+'<div class="eyeinformation_left" >'
										+'<div class="container">'
											+'<div class="row">'
												+'<div class="col-sm-2 eyeinformation_left_div1">'
													+'<span>(R)</span>'
													+'<span>右眼</span>'
													+'<span>:</span>'
												+'</div>'
												+'<div class="col-sm-3 eyeinformation_left_div">'
													+'S<span>(球镜)</span>'
													+'<label class="labelstyl">'+parm2.right_degrees+'</label>'
												+'</div>'
												+'<div class="col-sm-3 eyeinformation_left_div">'
													+'C<span>(柱镜)</span>'
													+'<label class="labelstyl">'+parm2.right_cyl+'</label>'	
												+'</div>'
												+'<div class="col-sm-3 eyeinformation_left_div">'
													+'A<span>(轴向)</span>'
													+'<label class="labelstyl">'+parm2.right_axis+'</label>'
												+'</div>'
											+'</div>'
										+'</div>'
									+'</div>'
									+'<div class="eyeinformation_left" >'
										+'<div class="container">'
											+'<div class="row">'
												+'<div class="col-sm-2 eyeinformation_left_div1">'
													+'<span>(L)</span>'
													+'<span>左眼</span>'
													+'<span>:</span>'
												+'</div>'
												+'<div class="col-sm-3 eyeinformation_left_div">'
													+'S<span>(球镜)</span>'
													+'<label class="labelstyl">'+parm2.left_degrees+'</label>'
												+'</div>'
												+'<div class="col-sm-3 eyeinformation_left_div">'
													+'C<span>(柱镜)</span>'
													+'<label class="labelstyl">'+parm2.left_cyl+'</label>'	
												+'</div>'
												+'<div class="col-sm-3 eyeinformation_left_div">'
													+'A<span>(轴向)</span>'
													+'<label class="labelstyl">'+parm2.left_axis+'</label>'
												+'</div>'
											+'</div>'
										+'</div>'
									+'</div>'
									+'<div class="eyeinformation_left" >'
										+'<div class="container">'
											+'<div class="row">'
												+'<div class="col-sm-5 eyeinformation_left_div" style="padding: 0px;">'
													+'<span>(PD)</span>'
													+'<span style="vertical-align: middle;">瞳距</span>:'
													+'<label class="labelstyl">'+parm2.PupilDistance+'</label>'
												+'</div>'
											+'</div>'
										+'</div>'
									+'</div>'
								+'</div>'
								+'<div class="glassesinformation">'
									+'<h3>镜框参数</h3>'
									+'<div class="glassesinformationcontent">'
										+'<div class="container">'
											+'<div class="row">'
												+'<div class="col-sm-3">'
													+'<span>镜框比:</span>'
													+'<label class="labelstyl">'+parm2.WidthScale+'</label>'
												+'</div>'
												+'<div class="col-sm-3">'
													+'<span>鼻中位:</span>'
													+'<label class="labelstyl">'+parm2.HeightScale+'</label>'
												+'</div>'
												+'<div class="col-sm-3">'
													+'<span>鼻中宽:</span>'
													+'<label class="labelstyl">'+parm2.BridgeSpanRatio+'</label>'
												+'</div>'
											+'</div>'
										+'</div>'
									+'</div>'
								+'</div>'

								+'<div class="glass-lettering">'
			                        +'<h3>刻字</h3>'
			                        +'<div class="frame_lettering">'
			                            +'<label>镜框左</label>'
			                            +'<input type="text" name="" value="'+SlotMessage1+'" maxlength="2" readonly>'
			                            +'<label></label>'
			                            +'<label>镜框右</label>'
			                            +'<input type="text" name="" value="'+SlotMessage2+'" maxlength="2" readonly>'
			                            +'<label></label>'
			                        +'</div>'
			                        +'<div class="leg_lettering">'
			                            +'<label> &nbsp;&nbsp;&nbsp; 镜腿</label>'
			                            +'<input type="text" name="" value="'+LegMessage1+'" maxlength="2" readonly>'
			                            +'<input type="text" name="" value="'+LegMessage2+'" maxlength="2" readonly>'
			                            +'<input type="text" name="" value="'+LegMessage3+'" maxlength="2" readonly>' 
			                            +'<label class="error_leg_lettering"></label>'
			                            +'<!-- <input type="text" name="" maxlength="1">  -->'
			                        +'</div>'     
			                    +'</div>'

								+'<div class="glassesphone">'
									+'<div class="container">'
										+'<div class="row">'
											+'<div class="col-sm-6">'
												+'<span id="glass_frame_type">'+parm2.lensprofilefile+'</span>'
												+'<div id="glass_frame">'
													+'<img src="images/frame18.png" style="top:'+parm2.lensprofilefile_img.top+'px;left:'+parm2.lensprofilefile_img.left+'px">'
												+'</div>'
												+'<div class="glassescolor" >'
													+'<span class="glassestext">'+parm2.FrameColor+'</span>'
													+'<span class="glassescolorstyle" style="background-color:'+parm2.FrameColor+'"></span>'
												+'</div>'
											+'</div>'
											+'<div class="col-sm-6" >'
												+'<span>'+parm2.LegProfile+'</span>'
												+'<div id="glass_leg">'
													+'<img src="images/tui/'+parm2.LegProfile+'.png">'
												+'</div>'
												+'<div class="glassescolor">'
													+'<span class="glassestext">'+parm2.LegColor+'</span>'
													+'<span class="glassescolorstyle" style="background-color:'+parm2.LegColor+'"></span>'
												+'</div>'
											+'</div>'
										+'</div>'
									+'</div>'
								+'</div>'
							+'</div>'
						+'</div>');
		
	}
	
})

/**
 * 设置镜框
**/
function setframe(len){
	if(len == 'rectangle-s'){
        len = 'MFA717';
    }
    if(len == 'ellipse'){
        len = 'MFA101';
    }
    if(len == 'catseye'){
        len = 'MFA555';
    }
    if(len == 'circle'){
        len = 'MFA000';
    }
    return len;
}

/**
 * 设置镜框的位置
**/
function setframeimg(len){
	var tmp_top;
	var tmp_left;
	if(len == 'rectangle-s'){
        len = 'MFA717';
    }
    if(len == 'ellipse'){
        len = 'MFA101';
    }
    if(len == 'catseye'){
        len = 'MFA555';
    }
    if(len == 'circle'){
        len = 'MFA000';
    }

    switch(len){
		case "MFA101":  tmp_top = 0;tmp_left = 0;break;
		case "MFA733":  tmp_top = 0;tmp_left = -200;break;
		case "MFA753":  tmp_top = 0;tmp_left = -400;break;
		case "MFA715":  tmp_top = -115;tmp_left = 0;break;
		case "MFA735":  tmp_top = -115;tmp_left = -200;break;
		case "MFA755":  tmp_top = -115;tmp_left = -400;break;
		case "MFA717":  tmp_top = -230;tmp_left = 0;break;
		case "MFA737":  tmp_top = -230;tmp_left = -200;break;
		case "MFA757":  tmp_top = -230;tmp_left = -400;break;
		case "MFA513":  tmp_top = -345;tmp_left = 0;break;
		case "MFA530":  tmp_top = -345;tmp_left = -200;break;
		case "MFA555":  tmp_top = -345;tmp_left = -400;break;
		case "MFA515":  tmp_top = -460;tmp_left = 0;break;
		case "MFA535":  tmp_top = -460;tmp_left = -200;break;
		case "MFA557":  tmp_top = -460;tmp_left = -400;break;
		case "MFA517":  tmp_top = -575;tmp_left = 0;break;
		case "MFA537":  tmp_top = -575;tmp_left = -200;break;
		case "MFA000":  tmp_top = -575;tmp_left = -400;break;
		default : 
			tmp_top="";
	}
	var tmp_location = {};
		tmp_location.top = tmp_top; 
		tmp_location.left = tmp_left; 
	return tmp_location;
}


/**
 * 眼镜的颜色
**/
function glass_color(color){
    var tmp_material = '';
    if(color != undefined && color.slice(0,4) == "0xff"){
        tmp_material = color.slice(8,10) + color.slice(6,8) + color.slice(4,6);
    }else{
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
function get_color(parm1){
	var _Hex=parm1.toString(16);
		_getHexarr=_Hex.match(/\w{2}/g);
		_getHexarr.splice(0,1);
	var _getcolor=_getHexarr.reverse().join("");
	return _getcolor;
}
/**
* 得到订单状态
* */
function get_status(parm1){
	var _status;
	switch(parm1){
		case "toconfirm": _status="扫描未检查";break;
		case "toscan":    _status="等待扫描";break;
		case "todeal":    _status="确认";break;
		default : _status="未知";
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
function isOwnEmpty(obj,key){
	var tmp_key = obj.hasOwnProperty(key)? obj[key] : '';
	return tmp_key;
};


/**
 * 哈希
 * */
function hashCode(str) {
	var hash = 5381;
	for(i = 0; i < str.length; i++) {
		char = str.charCodeAt(i);
		hash = ((hash << 5) + hash) + char; /* hash * 33 + c */
	}
	return Math.abs(hash);
}
/**
 * 将格式MFC2822时间转化时间格式
 * */
function create_time(ordertime) {
	var _ordertime=ordertime.replace(/-\w*/g,'');
	var _date = new Date(_ordertime);
	var order_date = {};
	order_date._year = _date.getFullYear();
	order_date._month = _date.getMonth()+1;
	order_date._day = _date.getDate();
	order_date._hour = _date.getHours();
	order_date._minute =_date.getMinutes();
	return order_date;
}