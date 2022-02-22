$.ajaxPrefilter(function(options){
    // 在发起ajax请求之前拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url
})