$(function () {
    var layer = layui.layer
    var form = layui.form

    infoArticle()

    // 1. 初始化图片裁剪器
    var $image = $('#image')
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 根据 Id 获取文章详情
    function infoArticle(){
        $.ajax({
            mathod: 'GET',
            url: '/my/article/' + sessionStorage.getItem("artId"),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章失败！')
                }
                console.log(res);
                //给表单赋值
                form.val("form-edit", {
                    Id: sessionStorage.getItem("artId"),
                    title: res.data.title,
                    content: res.data.content
                })
                
                $('[name=cate_id] option').each(function (index) {
                    if ($(this).attr('value') == res.data.cate_id) {
                        $(this).attr('selected', '')
                        form.render()
                    }
                })

                function getImageBlob(url, cb) {
                    var xhr          = new XMLHttpRequest();
                    xhr.open("get", url, true);
                    xhr.responseType = "blob";
                    xhr.onload       = function() {
                        if (this.status == 200) {
                            if(cb) cb(this.response);
                        }
                    };
                    xhr.send();
                }
    
                // 根据选择的文件，创建一个对应的 URL 地址：
                var newImgURL = getImageBlob('http://www.liulongbin.top:3007' + res.data.cover_img)
                console.log(newImgURL);
                // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
                $image
                    .cropper('destroy')      // 销毁旧的裁剪区域
                    .attr('src', newImgURL)  // 重新设置图片路径
                    .cropper(options)        // 重新初始化裁剪区域
            }
   
        })
    }

    

    // 定义文章的发布状态
    var art_state = '已发布'

    // 为表单绑定提交事件
    $('#form-edit').on('submit', function (e) {
        e.preventDefault()
        // 基于表单快速创建一个FormData对象
        var fd = new FormData($(this)[0])
        // 将文章发布状态存到fd中
        fd.append('state', art_state)
        // 将裁减后的图片输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
            })
        // 发起修改文章的请求
        editArticle(fd)
    })

     // 定义修改文章请求的函数
     function editArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: fd,
            // 向服务器提 交FormData 格式的数据， 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改文章失败！')
                }
                layer.msg('修改文章成功！')
                
                // 手动调用父页面id为 art_list 元素的点击事件
                // window.parent.document.getElementById("art_list").click()   //原生js写法
            }
        })
    }

})