$(document).ready(function () {
    $(".mainiframe").eq(0).css("display", "block")
    $(".leftItem").find("li").eq(0).addClass("clicks")
    $(".leftItem").find("li").eq(0).find("i").css("display", "block")
    // 右侧对应左侧内容
    $(".leftIframeItem").on("click", function () {
        $(".leftItem li").removeClass("clicks")
        $(".leftItem i").css("display", "none")
        $(this).addClass("clicks")
        $(".mainiframe").css("display", "none")
        if ($(this).hasClass("clicks")) {
            var index = $(this).index()
            $(this).find("i").css("display", "block")
            $(".mainiframe").eq(index).css("display", "block")
        }
    })


    $(".tuichu").click(function () {
        layer.open({
            title: "退出登录",
            type: 1,
            area: ["500px", "200px"],
            btn: ["确定", "关闭"],
            shade: 0.3,
            content: `<div style="height:100%;width:100%;text-indent:100px;">
                        <div style="height:40px;font-size:22px;color:#212121;" class="close">退出系统确认</div>
                        <div   style="height:40px;font-size:16px;color:#212121">确定要退出登录吗？</div>
                        </div>` //这里content是一个普通的String
                ,
            btn1: function () {
                window.location.href = "/index.html"
            }
        });
    })
})