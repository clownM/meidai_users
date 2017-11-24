$(document).ready(function(){

    //对电话号码进行验证
    $('#message_phone').blur(function(){
        var phone = $('#message_phone').val()
        if( phone && /^1[3578]\d{9}$/.test(phone)){
            $('#message_phone').css('borderColor','#0BE3FD');
            $('#fault_content').css('display','none');
            return true;
        }else{
            $('#message_phone').css('borderColor','#ff4f4f');
            $('#fault_content').append('输入的电话格式有误');
        }
    })
    //点击提交按钮之后向后台发送数据
    $('#message_submit').click(function(){
        var tmp_content = {
            'message_name' : $('#message_name').val(),
            'message_addr' : $('#message_addr').val(),
            'message_phone' : $('#message_phone').val(),
            'message_content' : $('#message_content').val(),
        };
        // console.log(JSON.stringify(tmp_content))
        var message_obj = new Object(); 
        message_obj.type = "message"; 
        message_obj.action = "create"; 
        message_obj.dataform = "text"; 
        message_obj.description = "{}"; 
        message_obj.count = "1"; 
        message_obj.content = JSON.stringify(tmp_content);
        // message_obj.content ="{"+'"message_name"'+':"'+$('#message_name').val()+'",'+'"message_addr"'+':"'+$('#message_addr').val()+'",'+'"message_phone"'+':"'+$('#message_phone').val()+'",'+'"message_content"'+':"'+$('#message_content').val()+'"'+"}";
        $.ajax({
            type: "POST",
            url: "/common",
            data: message_obj,
            success: function(re){
               // console.log(re) 
                $("#message_submit").click(function(){
                    refresh();
                });
                function refresh(){
                    window.location.reload(); 
                }
                $('input').val("");
                $('textarea').val("");
                $('.message-bounced').fadeIn()
            },

            error:function(){
                // console.log('ajax')
            }
        })
    })
    // 向后台发送成功之后弹框
    $('.message-bounced span').click(function(){
        $('.message-bounced').fadeOut();
    })
})
