(function($){
	var Beautifier =function(ele,opt){
		this._year=ele.fswyear;
		this._month=ele.fswmonth;
		this._day=ele.fswday;
		var day = new Date();
		this.defaults ={
			"startyear":1986,
			"longyear":100,
			"init_year":day.getFullYear(),
			"init_month":day.getMonth()+1,
			"init_day":day.getDate()
		};
		this.options=$.extend({},this.defaults,opt);
		console.log(this.options);
		
	};
	Beautifier.prototype = {
		inital:function(){
			var _startyear=this.options.startyear;
			var _longyear=this.options.longyear;
			var dayArray=new Array();
			var fsw_day=0;
			dayArray[0]=this.options.init_year;
			dayArray[1]=this.options.init_month;
			dayArray[2]=this.options.init_day;
			for(var i=_startyear;i<=_startyear+_longyear;i++){
			   this._year.append("<option value="+i+">"+i+"</option>");
			};
			for(var i=1;i<13;i++){
				this._month.append("<option value="+i+">"+i+"</option>");
			};
			fsw_day=this.getday(dayArray[0],dayArray[1]);
			for(var i=1;i<fsw_day+1;i++){
				this._day.append("<option value="+i+">"+i+"</option>")
			}
			this._year.val(dayArray[0]);
			this._month.val(dayArray[1]);
			this._day.val(dayArray[2]);
		},
		isorleap:function(year){
			var resut=((year%4==0)&&year%100!=0||year%400==0)?true:false;
			return resut;
		},
		getday:function(year,month){
			var i=0;
			var day=0;
			i=this.isorleap(year)?1:0;
			switch(month)
			{
				case 1: 
				case 3: 
				case 5: 
				case 7: 
				case 8:
				case 10: 
				case 12: day=31;break;
				case 2:  day=28+i;break;
				default: day=30;break;
			}
			return day;
		},
		setday:function(year,month){
			var day1=this.getday(year,month);
 			this._day.find("option").eq(0).siblings().remove();
			for(var i=1;i<day1+1;i++){
				this._day.append("<option value="+i+">"+i+"</option>")
			}
		}
	};
	$.fn.myPlugin=function(ele,opt){
		var myplugin=new Beautifier(ele,opt);
		myplugin.inital();
		$("#year",this).change(function(){
			var year=parseInt($(this).val()) ;
			var month=parseInt($("#month").val());
			myplugin.setday(year,month);
		})
		$("#month",this).change(function(){
			var year=parseInt($("#year").val());
			var month=parseInt($(this).val());
			myplugin.setday(year,month);
		})
	}
})(jQuery);
