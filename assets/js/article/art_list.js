$(function () {
    var layer = layui.layer
    var form = layui.form

    // 格式化时间
    template.defaults.imports.dataFormat = function (data) {
        const dt = new Date(data)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    var q = {
        pagenum: 1,
        pagesize: 5,
        cate_id: '',
        state: ''
    }

    initTable()
    initCate()

    // 获取文章列表
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用渲染分页
                renderPage(res.total)
            }
        })
    }

    // 获取文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败！')
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 重新渲染表单结构
                form.render()
            }
        })
    }

    // 监听文章筛选按钮
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        q.cate_id = $('[name=cate_id]').val()
        q.state = $('[name=state]').val()
        initTable()
    })

    // 渲染文章分页
    function renderPage(total) {
        var laypage = layui.laypage
        //执行一个laypage实例
        laypage.render({
            elem: 'pegeBox',        // 注意，这里是 ID，不用加 # 号
            count: total,           // 数据总数，从服务端得到
            limit: q.pagesize,      // 每页显示数据
            curr: q.pagenum,         // 默认选中分页
            limits: [5, 8, 10],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function (obj, first) {
                q.pagenum = obj.curr    // 得到当前页
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 通过代理方式：为文章删除按钮添加监听事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    // 数据删除完成后判断当前页是否还有数据
                    if($('.btn-delete').length === 1){
                        q.pagenu === 1 ? null : q.pagenum--
                    }
                    initTable()
                    layer.close(index)
                }
            })
        })
    })

    // 通过代理的方式：为文章编辑按钮添加监听事件
    $('tbody').on('click', '.btn-edit', function(e){
        sessionStorage.setItem("artId", $(this).attr('data-id'))
        location.href = '/article/art_edit.html'
    })

})