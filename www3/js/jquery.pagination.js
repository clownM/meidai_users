;(function($){
	var pagination=function($element,opt){
		this.$docment=$element
		this.nowpage=1;
		this.defaults={
			"_pagenumber":1,
			"normalpagenumber":5
		}
		this.options=$.extend({},this.defaults,opt);
	};
	pagination.prototype={
		initpagin:function(){
			 if(this.options._pagenumber<=this.options.normalpagenumber){
			 	this.normalpage(this.options._pagenumber);
			 }
			 else{
			 	this.longpage(this.options._pagenumber);
			 }
			 this.$docment.find("ul li").eq(1).addClass("_pageindexselcted").siblings().removeClass("_pageindexselcted");
		},
		normalpage:function(parm1){
			this.$docment.append('<ul id="fsw_wdf">'
									+'<li class="pre"><a><i class="glyphicon glyphicon-play iconleft"></i></a></li>'
									+'<li class="next"><a><i class="glyphicon glyphicon-play iconright"></i></a></li>'
								+'</ul>');
			for(var x=0;x<parm1;x++){
				this.$docment.find("ul .next").before('<li><a>'+(x+1)+'</a></li>');
			}
		},
		longpage:function(param){
				this.$docment.append('<ul id="fsw_wdf">'
										+'<li  class="pre"><a><i class="glyphicon glyphicon-play iconleft"></i></a></li>'
										+'<li class=""><a>1</a></li>'
										+'<li><a>2</a></li>'
										+'<li class="ellipsisstyle spot1">...</li>'
										+'<li id="borderleft"><a>3</a></li>'
										+'<li><a>4</a></li>'
										+'<li class="ellipsisstyle ">...</li>'
										+'<li id="borderleft" ><a>'+param+'</a></li>'
										+'<li class="next"><a><i class="glyphicon glyphicon-play iconright"></i></a></li>'	
									+'</ul>');  
			
		},
		preclick:function(parma1){
			var that=parma1;
			var _prepage=this.nowpage;
			if(this.options._pagenumber<=this.options.normalpagenumber){
				if(_prepage>1){
					this.nowpage--;
				}
				else return ;
				that.parent().find("li a").filter(":contains("+this.nowpage+")").eq(0).parent().addClass("_pageindexselcted")
				.siblings().removeClass("_pageindexselcted");
			}
			else{
				if(_prepage>1){
					this.nowpage--;
				}
				else return that.addClass("notdisabled");
				if(this.nowpage==this.options._pagenumber-1){
					that.parent().find("li").eq(3).removeClass("spot1");
					that.parent().find("li").eq(4).children().text(this.nowpage-1);
					that.parent().find("li").eq(5).children().text(this.nowpage);
				}
				if(!that.parent().find("li").eq(3).is(".spot1")){
					if(_prepage!=this.options._pagenumber){
						that.parent().find("li").eq(4).children().text(this.nowpage);
						that.parent().find("li").eq(5).children().text(_prepage);
					}
				}
				if(this.nowpage==3){
					this.deletespot(that);
				}
				that.parent().find("li a").filter(":contains("+this.nowpage+")").eq(0).parent().addClass("_pageindexselcted")
				.siblings().removeClass("_pageindexselcted");
			}
			
		},
		nextclick:function(parma1){
			var that=parma1;
			var _prepage=this.nowpage;
			if(this.options._pagenumber<=this.options.normalpagenumber){
				if(_prepage<this.options._pagenumber){
					this.nowpage++;
				}
				else return;
				that.parent().find("li a").filter(":contains("+this.nowpage+")").eq(0).parent().addClass("_pageindexselcted")
				.siblings().removeClass("_pageindexselcted");
			}
			else{
				if(_prepage<this.options._pagenumber){
					this.nowpage++;
				}
				else return;				
				if(this.nowpage==5){
					that.parent().find("li").eq(3).removeClass("spot1");
				}
				if(!that.parent().find("li").eq(3).is(".spot1")){
					if(this.nowpage!=this.options._pagenumber){
						that.parent().find("li").eq(4).children().text(_prepage);
						that.parent().find("li").eq(5).children().text(this.nowpage);
					}	
				}
				that.parent().find("li a").filter(":contains("+this.nowpage+")").eq(0).parent().addClass("_pageindexselcted")
				.siblings().removeClass("_pageindexselcted");
			}
			
		},
		othersclick:function(parma){
			var that=parma;
			var _prepage=this.nowpage;
			this.nowpage=parseInt(that.find("a").text());
		  	if(this.options._pagenumber<=this.options.normalpagenumber){
		  		that.addClass("_pageindexselcted").siblings().removeClass("_pageindexselcted");
		  	}
		  	else{
		  		that.addClass("_pageindexselcted").siblings().removeClass("_pageindexselcted");
				if(this.nowpage<=2){
					this.deletespot(that);
				};
		  	}
			
		},
		deletespot:function(parma){
			parma.parent().find("li").eq(3).addClass("spot1");
			parma.parent().find("li").eq(4).children().text(3);
			parma.parent().find("li").eq(5).children().text(4);
		}	
		
	};
	$.fn.mypagunation=function(ele,ele1,opt){
		
		var mypagination=new pagination(ele,opt);
		mypagination.initpagin();
		var $fswdispaly=ele1.children();
		ele.find('ul li').click(function(){
			if($(this).is(".pre")){
				 mypagination.preclick($(this));
			}
			else if($(this).is(".next")){
				 mypagination.nextclick($(this));
			}
			else{
				mypagination.othersclick($(this));
			}
			$fswdispaly.eq(mypagination.nowpage-1).css({"display":"block"}).siblings().css({"display":"none"});
		})
	}
})(jQuery);
