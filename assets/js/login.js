$(function(){
    // 点击“去注册账户”连接
    $('#link-reg').on('click', function(){
        $('.login-box').hide();
        $('.reg-box').show();
    })

    //点击“去登录”连接
    $('#link-login').on('click', function(){
        $('.reg-box').hide();
        $('.login-box').show();
    })

    // 获取layui的内置对象
    var form = layui.form
    var layer = layui.layer
    // 自定义校验规则    
    form.verify({
        // 密码格式校验
        'pwd': [
            /^[\S]{6,12}$/ ,'密码必须6到12位，且不能出现空格'
        ],
        // 确认密码一致校验
        'repwd': function(value){
            var pwd = $('.reg-box [name=password]').val()
            if(pwd !== value){
                return '两次密码不一致！'
            }
        }
    })

    // 监听注册提交表单
    $('#form_reg').on('submit', function(e){
        var data = {username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val()}
        e.preventDefault()
        $.post('/api/reguser', data, function(res){
            if(res.status !== 0){
                return layer.msg(res.message)
            }
            layer.msg('注册成功,请登录!')
            $('#link-login').click()
        })
    })

    // 监听登录提交表单
    $('#form_login').on('submit', function(e){
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST', 
            data: $(this).serialize(),
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('登陆失败！')
                }
                layer.msg('登陆成功！')
                localStorage.setItem('token', res.token)
                location.href = '/index.html'
            }
     })
    })
})