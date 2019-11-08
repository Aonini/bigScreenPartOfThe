layui.use(["layer", "laydate", "extension"], function () {
    var layer = layui.layer,
        extension = layui.extension,
        laydate = layui.laydate;

    $(".red").text("无数据").css("fontSize", 14)
    $(".yellow").text("无数据").css("fontSize", 14)
    $("input[type=radio]").on("click", function () {
        extension.inputRadioState(this)
    })
    //     //  初始化获取数据
    //     var initData = [];
    //     // 全局数据
    var currentStartDate, currentEndDate, currentBearchBs;
    var timeItem = extension.serch()
    var currentDate = extension.fillDate(timeItem.searchBs, timeItem.statrDate, timeItem.endDate)
    var currentStartDate = currentDate.s,
        currentEndDate = currentDate.e,
        currentBearchBs = timeItem.searchBs;
    var initDate = extension.initDataGet(timeItem.searchBs, "1", localStorage.getItem("userJGDM"), currentDate.s, currentDate.e)
    var JGDMArr = [localStorage.getItem("userJGDM")], //点击返回按钮  根绝这个数组招商上一层ID传给后台
        markerArr = [],
        chartsGatherDatasArr = {},
        zhongxinobj = {},
        getIdentifyBingDatasArr,
        getGartherBingDatasArr,
        globalData,
        initDataList;
    $(".mapBtn").hide() //地图上面按钮最开始的状态
    if (initDate.length != 0) {
        initDataList = initDate.data.list;
    }
    globalData = initDataList
    extension.addMarker(markerArr, initDataList)
    setTimeout(function () {
        map.setView(extension.zhongxin(initDataList, zhongxinobj))
    }, 500)
    eCharts.addzhuD("zhu_charts", extension.getZhuDatas(initDataList, chartsGatherDatasArr, "1"), 0, 1, "采集量")
    eCharts.addBing("bing_charts", extension.getGartherBingDatas(initDataList, chartsGatherDatasArr, "1"), "", 0)
    $(".zhe_charts").hide() //折线图的默认状态
    $(".zhe_charts_return").hide() //charts表上面按钮的初始状 状态



    $("body").on("click", ".markersIcon", function (e) {
        // 记录当前ID
        var thisId = $(this).attr("ids")
        var reg = /[\u4e00-\u9fa5]/g;
        var thisTxet = $(this).attr("namesss").match(reg).join("");
        var initDates = JSON.stringify(extension.initDataGet(currentBearchBs, "1", thisId, currentStartDate, currentEndDate))
        var initDatess = JSON.parse(initDates)
        if (initDatess.message == "无下级机构") {
            layer.msg(initDates.message)
            return false
        }
        var mydata = []
        $.each(initDatess.data.list, function (i, item) {
            if (item.cjCount != 0) {
                mydata.push(item)
            }
        })
        if (mydata.length == 0) {
            layer.msg("下级机构没有数据")
            return false
        } else {
            globalData = mydata
            JGDMArr.push(thisId)
            extension.removeMarker(markerArr)
            extension.addMarker(markerArr, mydata)
            eCharts.addzhuD("zhu_charts", extension.getZhuDatas(mydata, chartsGatherDatasArr, "1"), 0, 1, "采集量")
            eCharts.addBing("bing_charts", extension.getGartherBingDatas(mydata, chartsGatherDatasArr, "1"), "", 0)
            $(".mapBtn").show()
            $(".left_nav_sub_title").append('<span class="ziji">>' + thisTxet + '</span>')
            extension.setZoom(parseInt(initDatess.data.orgLevel) + 1)
            setTimeout(function () {
                map.setView(extension.zhongxin(mydata, zhongxinobj))
            }, 500)
        }
    })

    //     //  点击返回
    $("#return").click(function () {
        // 获取要发送给后台的id

        var firstId = JGDMArr[JGDMArr.length - 2]
        JGDMArr = JGDMArr.splice(0, JGDMArr.length - 1)
        if (JGDMArr.length == 1) {
            $(".mapBtn").hide()
        }

        var initDates = JSON.stringify(extension.initDataGet(currentBearchBs, "1", firstId, currentStartDate, currentEndDate))
        var initDatess = JSON.parse(initDates)
        var mydata = []
        $.each(initDatess.data.list, function (i, item) {
            if (item.sbCount == 0 && item.cjCount == 0) {} else {
                mydata.push(item)
            }
        })
        globalData = mydata
        extension.removeMarker(markerArr)
        extension.addMarker(markerArr, mydata)
        extension.chartsState()
        eCharts.addzhuD("zhu_charts", extension.getZhuDatas(mydata, chartsGatherDatasArr, "1"), 0, 1, "采集量")
        eCharts.addBing("bing_charts", extension.getGartherBingDatas(mydata, chartsGatherDatasArr, "1"), "", 0)
        extension.setZoom(parseInt(initDatess.data.orgLevel) + 1)
        setTimeout(function () {
            map.setView(extension.zhongxin(mydata, zhongxinobj))
        }, 500)

        if ($(".left_nav_sub_title  span:last").text() !== "北京市") {
            $(".left_nav_sub_title  span:last").remove()
        }
    })
    //     // 柱状图点击
    myChartzhu.on('click', function (params) {
        //   循环对比出ID
        var searchOrgid;
        $(globalData).each(function (i, item) {
            if (params.name == item.jgmc) {
                searchOrgid = item.id
                return
            }
        })
        var d = {
            "platform": "1007",
            "appVersion": "1.0.3",
            "apiVersion": "1.0.2",
            "token": localStorage.getItem("token"),
            "data": {
                "dateType": currentBearchBs,
                "typeCode": "1",
                "dateBegin": currentStartDate,
                "dateEnd": currentEndDate,
                "fjjgdm": localStorage.getItem("userJGDM")
            }
        }

        $.ajax({
            url:orgDetailSummaryGraph,
            type: "post",
            dataType: "json",
            async: false,
            data: JSON.stringify(d),
            contentType: "application/json",
            success: function (datas) {
                if (datas.status == 200) {
                    data = datas.data;
                    // 出现返回按钮
                    $(".zhe_charts_return").show()
                    $(".zhu_charts").hide()
                    $(".bing_charts").hide()
                    $(".chartsbtn").hide()
                    $(".zhe_charts").show()
                    $(".tishi").text("数据增长趋势")
                    eCharts.addChartszhe("zhe_charts", extension.getZheDatas(data, chartsGatherDatasArr, "1"), "1")
                } else {
                    layer.msg("折线图数据请求失败")
                }
            },
            error: function (httpRequset) {
                layer.msg("折线图数据请求失败")
            }
        })
    });

    $(".serch").click(function () { //搜索
        var timeItems = extension.serch()
        if (!extension.validationTime(timeItems.statrDate, timeItems.endDate)) {
            return false
        }
        var currentDates = extension.fillDate(timeItems.searchBs, timeItems.statrDate, timeItems.endDate)
        currentStartDate = currentDates.s, currentEndDate = currentDates.e, currentBearchBs = timeItems.searchBs
        var initDatess = extension.initDataGet(currentBearchBs, "1", localStorage.getItem("userJGDM"), currentStartDate, currentEndDate)
        var mydatas = []
        if (initDatess.data == null || initDatess.data == undefined || initDatess.data.length == 0) {
            return false
        }
        $(".zhu_charts").show()
        $(".bing_charts").show()
        $(".zhe_charts").hide()
        $.each(initDatess.data.list, function (i, item) {
            if (item.cjCount != 0) {
                mydatas.push(item)
            }
        })
        if (mydatas.length == 0) {
            layer.msg("当前时间段没有数据")
            return false
        } else {
            globalData = mydatas
            extension.removeMarker(markerArr)
            extension.addMarker(markerArr, mydatas)
            eCharts.addzhuD("zhu_charts", extension.getZhuDatas(mydatas, chartsGatherDatasArr, "1"), 0, 1, "采集量")
            eCharts.addBing("bing_charts", extension.getGartherBingDatas(mydatas, chartsGatherDatasArr, "1"), "", 0)
            $(".mapBtn").hide()
            extension.setZoom(parseInt(initDatess.data.orgLevel) + 1)
            setTimeout(function () {
                map.setView(extension.zhongxin(mydatas, zhongxinobj))
            }, 500)

        }
    })

    $(".zhe_charts_return").click(function () {
        $(".zhe_charts_return").css("display", "none")
        $("#zhe_charts").css("display", "none")
        $("#zhu_charts").css("display", "block")
        $("#bing_charts").css("display", "block")
    })
    // 首页点击回到第一层
    $("#firstMap").click(function () {
        // 从新查一次
        $(".serch").click()
        $(".left_nav_sub_title").find(".ziji").remove()
    })

    //     // //    ------------------------------------------------------------------------------------------------------------------------左面完事  右面开始    
    var arr=[]
    extension.cysj(arr)
    var hengData = {
        name: ["一人多证（盛云）", "一证多人（盛云）", "一人多证（级部）", "一证多人（级部）"],
        value: arr
    }
    //最右面横向柱状图
    eCharts.addhengzhu("right_bottom_charts", hengData)



       var realTime = function (received_msg) { //实时数据  右侧最上
        $('#tedayGather').html(received_msg.todayGathercount);
        $('#ljGather').html(received_msg.totalGathercount);
         $(".zuori").html(received_msg.yestedayGathercount);
         $(".benzhou").html(received_msg.thisWeekGathercount);
         $(".shangzhou").html(received_msg.lastWeekGathercount); 
    }
    $(".realTime").click(function () {
        extension.WebSocket(realTime)
    })
    setTimeout(function(){
        $(".realTime").click()
    },5000)
})