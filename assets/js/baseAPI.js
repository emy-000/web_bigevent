$.ajaxPrefilter(function(options){
    // 在发起ajax请求之前拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url
    
    // 为有权限的接口设置 headers 请求头
    if(options.url.indexOf('/my/') !== -1){
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局挂载 complete 回调函数
    options.complete = function (res) {
        // 如果用户未登录跳转至登录页
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            localStorage.removeItem('token')
            location.href = '/login.html'
        }
    }
})