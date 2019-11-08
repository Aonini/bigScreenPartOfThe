layui.use(["laydate","layer", "extension"], function () {
    var layer = layui.layer,
        extension = layui.extension,
        laydate = layui.laydate;
    // $(".red").text("无数据").css("fontSize",14)
    $(".yellow").text("无数据").css("fontSize", 14)
    $("input[type=radio]").on("click", function () {
        extension.inputRadioState(this)
    })
    var currentStartDate, currentEndDate, currentBearchBs;
    var timeItem = extension.serch()
    var currentDate = extension.fillDate(timeItem.searchBs, timeItem.statrDate, timeItem.endDate)
    var currentStartDate = currentDate.s,
        currentEndDate = currentDate.e,
        currentBearchBs = timeItem.searchBs;
    var initDate = extension.initDataGet(timeItem.searchBs, "3", localStorage.getItem("userJGDM"), currentDate.s, currentDate.e)
    var JGDMArr = [localStorage.getItem("userJGDM")], //点击返回按钮  根绝这个数组招商上一层ID传给后台
        markerArr = [],
        chartsGatherDatasArr = {},
        zhongxinobj = {},
        getIdentifyBingDatasArr,
        getGartherBingDatasArr,
        globalData,
        initDataList = [];
    $(".mapBtn").hide() //地图上面按钮最开始的状态

    if (initDate.length != 0) {
        initDataList = initDate.data.list;
    }
    globalData = initDataList
    extension.addMarker(markerArr, initDataList)
    setTimeout(function () {
        if (initDataList.length != 0) {
            map.setView(extension.zhongxin(initDataList, zhongxinobj))
        }
    }, 500)
    eCharts.addzhu("zhu_charts", extension.getZhuDatas(initDataList, chartsGatherDatasArr, "0"), 1)
    $(".zhe_charts").hide() //折线图的默认状态
    $(".zhe_charts_return").hide() //charts表上面按钮的初始状 状态

    // 点击查询
    $(".serch").click(function () {
        var timeItems = extension.serch()
        if (!extension.validationTime(timeItems.statrDate, timeItems.endDate)) {
            return false
        }
        var currentDates = extension.fillDate(timeItems.searchBs, timeItems.statrDate, timeItems.endDate)
        currentStartDate = currentDates.s, currentEndDate = currentDates.e, currentBearchBs = timeItems.searchBs
        var initDatess = extension.initDataGet(currentBearchBs, "3", localStorage.getItem("userJGDM"), currentStartDate, currentEndDate)
        var mydatas = []
        if (initDatess.data == null || initDatess.data == undefined || initDatess.data.length == 0) {
            return false
        }
        $(".zhu_charts").show()
        $(".bing_charts").show()
        $(".zhe_charts").hide()
        $.each(initDatess.data.list, function (i, item) {
            if (item.sbCount == 0 && item.cjCount == 0) {} else {
                mydatas.push(item)
            }
        })
        if (mydatas.length == 0) {
            layer.msg("当前时间段没有数据")
            return false
        } else {
            globalData = mydatas
            $(".zhuBtn").addClass("thisbtn")
            $(".bingBtn").removeClass("thisbtn")
            extension.chartsState()
            extension.removeMarker(markerArr)
            extension.addMarker(markerArr, mydatas)
            eCharts.addzhu("zhu_charts", extension.getZhuDatas(mydatas, chartsGatherDatasArr, "0"), 1)
            $(".mapBtn").hide()
            extension.setZoom(parseInt(initDatess.data.orgLevel) + 1)
            setTimeout(function () {
                map.setView(extension.zhongxin(mydatas, zhongxinobj))
            }, 500)

        }
    })

    $("body").on("click", ".markersIcon", function (e) {
        // 记录当前ID
        var thisId = $(this).attr("ids")
        var reg = /[\u4e00-\u9fa5]/g;
        var thisTxet = $(this).attr("namesss").match(reg).join("");
        var initDates = JSON.stringify(extension.initDataGet(currentBearchBs, "3", thisId, currentStartDate, currentEndDate))
        var initDatess = JSON.parse(initDates)
        if (initDatess.message == "无下级机构") {
            layer.msg(initDates.message)
            return false
        }
        var mydata = []
        $.each(initDatess.data.list, function (i, item) {
            if (item.sbCount == 0 && item.cjCount == 0) {} else {
                mydata.push(item)
            }
        })
        if (mydata.length == 0) {
            layer.msg("下级机构没有数据")
            return false
        } else {
            globalData = mydata
            JGDMArr.push(thisId)
            $(".zhuBtn").addClass("thisbtn")
            $(".bingBtn").removeClass("thisbtn")
            extension.chartsState()
            extension.removeMarker(markerArr)
            extension.addMarker(markerArr, mydata)
            eCharts.addzhu("zhu_charts", extension.getZhuDatas(mydata, chartsGatherDatasArr, "0"), 1)
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

        var initDates = JSON.stringify(extension.initDataGet(currentBearchBs, "3", firstId, currentStartDate, currentEndDate))
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
        $(".zhuBtn").addClass("thisbtn")
        $(".bingBtn").removeClass("thisbtn")
        extension.chartsState()
        eCharts.addzhu("zhu_charts", extension.getZhuDatas(mydata, chartsGatherDatasArr, "0"), 1)
        extension.setZoom(parseInt(initDatess.data.orgLevel) + 1)
        setTimeout(function () {
            map.setView(extension.zhongxin(mydata, zhongxinobj))
        }, 500)

        if ($(".left_nav_sub_title  span:last").text() !== "北京市") {
            $(".left_nav_sub_title  span:last").remove()
        }
    })



    //     // //点击来回切换柱状图和饼图
    $(".zhuBtn").click(function () {
        // 柱状图切换
        $(this).addClass("thisbtn")
        $(".bingBtn").removeClass("thisbtn")
        eCharts.addzhu("zhu_charts", extension.getZhuDatas(globalData, chartsGatherDatasArr, "0"), 1)
    })

    $(".bingBtn").click(function () {
        // 饼图切换
        $(this).addClass("thisbtn")
        $(".zhuBtn").removeClass("thisbtn")
        eCharts.addBing("bing_identiy_charts", extension.getIdentfyBingDatas(globalData, getIdentifyBingDatasArr, "0"), "识别量", 1)
        eCharts.addBing("bing_gather_charts", extension.getGartherBingDatas(globalData, getGartherBingDatasArr, "0"), "采集量", 1)
    })


    //     // 柱状图点击
    myChartzhu.on('click', function (params) {
        //   循环对比出ID
        var indexl = layer.load(1, {
            shade: 0.3
        }) 
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
                "typeCode": "3",
                "dateBegin": currentStartDate,
                "dateEnd": currentEndDate,
                "fjjgdm": localStorage.getItem("userJGDM")
            }
        }
        $.ajax({
            url: orgDetailSummaryGraph,
            type: "post",
            dataType: "json",
            async: false,
            data: JSON.stringify(d),
            contentType: "application/json",
            success: function (datas) {
                layer.close(indexl)
                if (datas.status == 200) {
                    data = datas.data;
                    // 出现返回按钮
                    $(".zhe_charts_return").show()
                    $(".zhu_charts").hide()
                    $(".bing_charts").hide()
                    $(".chartsbtn").hide()
                    $(".zhe_charts").show()
                    $(".tishi").text("数据增长趋势")
                    eCharts.addChartszhe("zhe_charts", extension.getZheDatas(data, chartsGatherDatasArr, "0"), "0")

                } else {
                    layer.msg("折线图数据请求失败")
                }
            },
            error: function (httpRequset) {
                layer.msg("折线图数据请求失败")
            }
        })
    });
    //     //折线图上面的返回按钮点击
    $(".zhe_charts_return").click(function () {
        extension.chartsState()
    })

    //     // 首页点击回到第一层
    $("#firstMap").click(function () {
        // 从新查一次
        $(".serch").click()
        $(".left_nav_sub_title").find(".ziji").remove()
    })


    //     // //    ------------------------------------------------------------------------------------------------------------------------左面完事  右面开始    
//存疑数据统计 
  
    function cysj(arr){
        $.ajax({
            url: "http://10.2.1.35:9098/bigScreen/getSuspiciousType",
            type: "post",
            dataType: "json",
            contentType: "application/json",
            success: function (datas) {
                if (datas.status == 200) {
                    var arr=[]
                    var  bjdr= datas.data.bjdr,bjdz = datas.data.bjdz ,sydr = datas.data.sydr,sydz = datas.data.sydz;
                    arr.push(sydz)
                    arr.push(sydr)
                    arr.push(bjdz)
                    arr.push(bjdr)
                    cysj(arr)
                    var hengData = {
                        name: ["一人多证（盛云）", "一证多人（盛云）", "一人多证（级部）", "一证多人（级部）"],
                        value: arr
                    }
                    //最右面横向柱状图
                    eCharts.addhengzhu("right_bottom_charts", hengData)
                } else {
                    layer.msg("存疑数据请求失败")
                }
            },
            error: function (httpRequset) {
                layer.msg("存疑数据请求失败")
            }
        })
    }
  
    cysj()
    //     //   右侧图片滚动
    //     // 声明变量   时间变量
    var yerHtml = "";
    // 设置滚动 
    var topzhi = 0;

    function getHtml(data) {
        // console.log(data.)
        var yerHtml = '',
            zHmzpZyPath, yHmzpZyPath;
        var imgSrc = "data:image/bmp;base64,";
        $.each(data, function (i, item) {
            // 有可能会有缺失图片的情
            // yHmzpZyPath = item.yHmzpZyPath ? item.yHmzpZyPath : item.zHmzpZyPath
            var itemzSfzh = Array.from(item.zSfzh)
            ySfzh = item.ySfzh.substr(0, 4) + "****" + item.ySfzh.substr(itemzSfzh.length - 4, itemzSfzh.length)
            zSfzh = item.zSfzh.substr(0, 4) + "****" + item.zSfzh.substr(itemzSfzh.length - 4, itemzSfzh.length)
            yerHtml += `
                            <ul  class="yer_list">
                            <li  class="yer_list_item">
                                    <ul class="yer_list_item_list">
                                        <li class="yer_list_item_list_item">
                                            <span>${item.czlxType}：${item.zYwfssj}</span>
                                            <div  class="cjd  cjd1"> 
                                                <strong>采集点：</strong>
                                                <span  class="addTitle">${item.zCjd}</span>  
                                            </div>
                                            <div>
                                                    <img  src=${imgSrc+item.zHmzp}>
                                                    <span  class="addTitle">${item.hmzpType}</span>
                                            </div>
                                            <ul class="yer_list_item_list_item_data ">
                                                <li>
                                                    <strong>姓名：</strong>
                                                    <span  class="addTitle">${item.zXm}</span>   
                                                </li>
                                                <li>
                                                    <strong>证件类型：</strong>
                                                    <span  class="addTitle">${item.zZjlx}</span>   
                                                </li>
                                                <li>
                                                    <strong>证件编号：</strong>
                                                    <span  class="addTitle">${zSfzh}</span>   
                                                </li>
                                            </ul>
                                        </li>
                                         <span class="pingfen">${item.score}</span>
                                        <li class="yer_list_item_list_item   yer_list_item_list_right">
                                            <span  id="bzxxspan">${item.yYwfssj}:比中信息</span>
                                            <div  class="cjd"> 
                                                <strong>:采集点</strong>
                                                <span  class="addTitle">${item.yCjd}</span>  

                                            </div>
                                            <ul class="yer_list_item_list_item_data">
                                                <li>
                                                    <strong>:姓名</strong>
                                                    <span class="addTitle">${item.yXm}</span>   
                                                </li>
                                                <li>
                                                    <strong>:证件类型</strong> 
                                                    <span  class="addTitle">${item.yZjlx}</span>  
                                                </li>
                                                <li>
                                                    <strong>:证件编号</strong>
                                                    <span  class="addTitle">${ySfzh}</span> 
                                                </li>
                                            </ul>
                                            <div>
                                                    <img src=${imgSrc+item.yHmzp}>
                                                    <span>${item.hmzpType}</span>
                                            </div>
                                        </li>
                                    </ul>

                                </li>
                        </ul> `
        })
        return yerHtml;
    }
    //     // // 设置滚动
    var windowBottom = parseInt($(".yer_list_parent_window").offset().top) + parseFloat($(".yer_list_parent_window").css("height"))
    //   滚动数据 设置top值
    function setTop() {
        var lenss = $(".yer_list").length
        if(lenss <= 2){
            return false
        }

        topzhi++
        var ulB = parseInt($(".yer_list_parent").offset().top) + parseFloat($(".yer_list_parent").css("height"))
        if (ulB < windowBottom) {
            topzhi = 0
            transitionTime = 0
        } else {
            transitionTime = 4000
        }
        $(".yer_list_parent").css("top", -(topzhi * 180))
        $(".yer_list_parent").css("transition", 'top  ' + transitionTime + 'ms')
    }
    var setTopTime = setInterval(setTop, 4000)
    //鼠标上移入停止滚动  清除定时器  停止请求
    $(".yer_list_parent").hover(function () {
        window.clearTimeout(setTopTime);
        // window.clearTimeout(getHTmlTime); 
    }, function () {
        setTopTime = setInterval(setTop, 4000)
    })
    $(document).on("hover", ".addTitle", function () {
        var thisText = $(this).text()
        $(this).attr("title", thisText)
    })
    // 监听切换浏览器  避免滚动出现问题 清除定时器  停止请求
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            window.clearTimeout(setTopTime);
            // window.location.reload()
        } else {
            setTopTime = setInterval(setTop, 4000)
        }
    })
    // -----------------------------------------------------------------------------------------------实时报警弹窗
    var g = 10
    var windowW = $(window).width() / 2 - 250
    var windowH = $(window).height() / 2 - 300

    function addWarnig(data) {
        var zXb, zMz, zGj, zRylb, zZjlx, yXb, yMz, yGj, yRylb, yZjlx;
        $("#xb").find("option").each(function (i, item) {
            if ($(item).val() == data.zXb) {
                zXb = $(item).text()
            }
            if ($(item).val() == data.yXb) {
                yXb = $(item).text()
            }
        })
        $("#mz").find("option").each(function (i, item) {
            if ($(item).val() == data.zMz) {
                zMz = $(item).text()
            }
            if ($(item).val() == data.yMz) {
                yMz = $(item).text()
            }
        })
        $("#gj").find("option").each(function (i, item) {
            if ($(item).val() == data.zGj) {
                zGj = $(item).text()
            }
            if ($(item).val() == data.yGj) {
                yGj = $(item).text()
            }
        })
        $("#ryfl").find("option").each(function (i, item) {
            if ($(item).val() == data.zRylb) {
                zRylb = $(item).text()
            }
            if ($(item).val() == data.yRylb) {
                yRylb = $(item).text()
            }
        })
        $("#zjlx").find("option").each(function (i, item) {
            if ($(item).val() == data.zZjlx) {
                zZjlx = $(item).text()
            }
            if ($(item).val() == data.yZjlx) {
                yZjlx = $(item).text()
            }
        })
        g = g + 20
        var leftImg = data.zZjzp ? "data:image/bmp;base64," + data.zZjzp : "/icon/people.png",
            rightImg = data.yZjzp ? "data:image/bmp;base64," + data.yZjzp : "/icon/people.png"
        layer.open({
            type: 1,
            title: `<span style="color:red; font-weight: bold">告警：</span>位置:${data.yCjdwmc}`,
            area: ["600px", "315px"],
            offset: [windowH + g, windowW + g],
            zIndex: layer.zIndex, //重点1
            shade: false,
            btn: ["关闭全部", "关闭"],
            content: `<div style='height:100%;width:100%;color:#fff;overflow:hidden;background:#000238'>
                            <div style="width: 49%;float:left">
                            <span  style="float:left;text-indent:5px;font-size:16px;font-weight:bold;margin-bottom:20px;width:100%;text-align:left">采集信息</span>  
                                <div class="layerSee  layerB">性别：${yXb}</div>
                                <div class="layerSee  layerB">国籍：${yGj}</div>
                                <div class="layerSee  layerB">民族：${yMz}</div>
                                <div  class="layerSee   imgP"  }>
                                    <img src="${rightImg}">
                                </div>
                                <div  class="layerSee ">时间：${data.yYwfssj}</div>
                                <div  class="layerSee ">地点：${data.yCjdwmc}</div>
                                <div  class="layerSee">姓名：${data.yXm}</div>
                                <div class="layerSee">证件类型：${yZjlx}</div>
                                <div class="layerSee">证件号码：${data.yZjhm}</div>
                                <div class="layerSee">人员类型：${yRylb}</div>
                        </div> 
                        <div style="width: 50%;float: right;">
                            <span  style="float:left;text-indent:5px;font-size:16px;font-weight:bold;margin-bottom:20px;width:100%;text-align:left">比中信息</span>
                                <div class="layerSee  layerB">性别：${zXb}</div>
                                    <div class="layerSee  layerB">国籍：${zGj}</div>
                                    <div class="layerSee  layerB">民族：${zMz}</div>
                                    <div  class="layerSee   imgP"  }>
                                    <img src="${leftImg}">
                                </div>    
                                <div  class="layerSee ">时间：${data.zYwfssj}</div>
                                <div  class="layerSee ">地点：${data.zCjdwmc}</div>
                                <div  class="layerSee">姓名：${data.zXm}</div>
                                <div class="layerSee">证件类型：${zZjlx}</div>
                                <div class="layerSee">证件号码：${data.zZjhm}</div>
                                <div class="layerSee">人员类型：${zRylb}</div>
                        </div>
                    </div>`,
            btn1: function (index, o) {
                layer.closeAll()

            },
            btn2: function (index, layero) {
                layer.close(index)
            },
            success: function (layero) {
                layer.setTop(layero); //重点2
                $(".layui-layer-title").css("text-align", "left")
            }
        })
    }


    // socket实时连接数据
    var setRIghtHtml = function (ll) { //右侧滚动数据
        $(".yer_list_parent").html(getHtml(ll))
    }

    function warnig(received_msg) { //报警实时弹窗
        $(received_msg).each(function (i, item) { //不是空数据  弹报警弹窗
            addWarnig(item)
        })
    }
    var realTime = function (received_msg) { //实时数据  右侧最上
        $('#tedayGather').html(received_msg.todayGathercount);
        $('#ljGathers').html(received_msg.totalGathercount);
        $('#tedayIdentify').html(received_msg.todayIdentifycount);
        $('#ljIdentify').html(received_msg.totalIdentifycount);
        $('.jrbj').html(received_msg.alarmCount);
        $("#jrrkl").html(received_msg.todayPersonCount);
        $("#ljrkl").html(received_msg.totalPersonCount);
    }

    //     // 右侧实时滚动数据 
    $(".rightSSBZ").click(function () {
        extension.WebSocket(realTime, setRIghtHtml, warnig)
    })
    $(".rightSSBZ").click()
})