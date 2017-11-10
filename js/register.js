$(document).ready(function() {

    //-----------------------------
    //注册界面电话/邮箱输入报错信息
    //-----------------------------
    function register_input_phone_infor(parma1, parma2) {
        var _fswx = $("#form_register .phone_number");
        var _fswy = $("#form_register .fsw_juerr .phone_number_error");
        _fswx[parma1 ? "addClass" : "removeClass"]("fws_input_danger");
        _fswy.html(parma2);
    }
    //-----------------------------
    //注册界面密码输入报错信息
    //-----------------------------
    function register_input_password_infor(parma1, parma2) {
        var _fswx = $("#form_register .register_password");
        var _fswy = $("#form_register .fsw_juerr .password_error");
        _fswx[parma1 ? "addClass" : "removeClass"]("fws_input_danger");
        _fswy.html(parma2);
    }

    //-----------------------------
    //注册界面验证密码输入报错信息
    //-----------------------------
    function register_input_confirm_password_infor(parma1, parma2) {
        var _fswx = $("#form_register .register_confirm_password");
        var _fswy = $("#form_register .fsw_juerr .confirm_password_error");
        _fswx[parma1 ? "addClass" : "removeClass"]("fws_input_danger");
        _fswy.html(parma2);
    }

    //-----------------------------
    // 注册界面全局报错信息框
    //-----------------------------
    function register_fsw_querr_infor(parma1, parma2) {
        var _fswx = $(" #form_register .fsw_querr");
        var _fswy = $("#form_register .fsw_querr .fsw_querr_infor");
        parma1 ? _fswx.css({ "display": "block" }) : _fswx.css({ "display": "none" });
        _fswy.text(parma2);
    }
    //-----------------------------
    // 注册界面全局成功信息框
    //-----------------------------
    function register_fsw_success_infor(parma1, parma2) {
        var _fswx = $("#form_register .registration_success");
        var _fswy = $("#form_register .registration_success .registration_success_infor");
        parma1 ? _fswx.css({ "display": "block" }) : _fswx.css({ "display": "none" });
        _fswy.text(parma2);
    }

    //注册页面邮箱输入框
    $("#form_register .phone_number").on("blur", function() {
        register_input_phone_infor(false, "");
        $(this)[0].placeholder = "请输入手机号";
        var $phoneValue = $(this).val();
        if ($(this).val() !== "" && /1[34578]\d{9}$/.test($(this).val())) {} else {
            if ($(this).val() !== "") {
                $(this)[0].placeholder = "";
            }
            if ($(this)[0].placeholder == "") {
                register_input_phone_infor(true, "请输入正确的手机号")
            }
        }
    }).on("focus", function() {
        register_fsw_success_infor(false, "");
        register_fsw_querr_infor(false, "");
        register_input_phone_infor(false, "");
        $(this)[0].placeholder = "";

    });

    //注册页面密码框
    $("#form_register .register_password").on("blur", function() {
        $(this)[0].placeholder = "请输入密码";
        register_input_password_infor(false, "");
        if ($(this).val() !== "") {
            this.placeholder = "";
        }
        if (this.placeholder == "" && $(this).val().length < 8) {
            register_input_password_infor(true, "输入密码必须大于等于8位字符");
        }
    }).on("focus", function() {
        register_fsw_success_infor(false, "");
        register_fsw_querr_infor(false, "");
        register_input_password_infor(false, "");
        $(this)[0].placeholder = "";
    });


    // 注册页面确认密码输入框
    $("#form_register .register_confirm_password").on("blur", function() {
        $(this)[0].placeholder = "请确认密码";
        register_input_confirm_password_infor(false, "");
        if ($(this).val() !== "") {
            this.placeholder = "";
        }
        if (this.placeholder == "" && $(this).val() !== $("#form_register .register_password").val()) {
            register_input_confirm_password_infor(true, "两次密码输入不一致");
        }
    }).on("focus", function() {
        register_fsw_success_infor(false, "");
        register_fsw_querr_infor(false, "");
        register_input_confirm_password_infor(false, "");
        $(this)[0].placeholder = "";
    });



    //提交注册
    $("#form_register").on("submit", function(event) {
        register_fsw_success_infor(false, "");
        register_fsw_querr_infor(false, "");
        event.preventDefault();
        var data = {};
        var $phoneValue = $("#form_register .phone_number:eq(0)").val();
        var $passwordValue = $("#form_register .register_password:eq(0)").val();
        var $confirmPasswordValue = $("#form_register .register_confirm_password:eq(0)").val();
        console.log("手机号：" + $phoneValue);
        console.log("密码：" + $passwordValue);
        console.log("确认密码：" + $confirmPasswordValue);
        if ($phoneValue == "") {
            register_input_phone_infor(true, "手机号不能为空");
        } else if ($passwordValue == "") {
            register_input_password_infor(true, "密码不能为空");
        } else if ($confirmPasswordValue == '') {
            register_input_confirm_password_infor(true, "两次密码输入不一致")
        } else {
            var fsw_obj = {
                action: "create",
                // username: _registrationUserNameValue,
                // userData: $phoneValue,
                password: $passwordValue
            };

            fsw_obj['phone'] = $phoneValue;

            // data=get_input_data(fsw_obj);
            data = fsw_obj;
            var _iserro = $(".fsw_juerr").children();
            for (var _indexErr = 0; _indexErr < _iserro.length; _indexErr++) {
                if (_iserro[_indexErr].innerText != "") {
                    return;
                }
            }
            // console.log("data:",data);
            $.ajax({
                url: "/user",
                type: 'POST',
                data: data,
                success: function(re) {
                    // console.log("data="+data);
                    var re = JSON.parse(re);
                    // console.log(re);
                    if (re.result == "true") {
                        register_fsw_success_infor(true, "注册成功");
                        setTimeout(function() {
                            register_fsw_success_infor(false, "");
                        }, 4000);
                        // window.setTimeout("window.location='login.html'",30000);
                        return;
                    } else {
                        if (re.errorno == "E01021") {
                            $("#fsw_bj").css("display", 'block');
                            $user_registration.css('display', 'block');
                            create_registration_jiemian(re.reasons);
                        } else {
                            createUser(re.errorno);
                        }
                    }

                },
                error: function() {
                    console.log("Registration：error");
                    console.log("data=" + data);
                    registration_fsw_querr_infor(true, "当前网络错误，请重新连接");
                }
            });
        }
    });

});