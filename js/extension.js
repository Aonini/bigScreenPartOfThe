BM.Config.HTTP_URL = 'http://localhost:9000';
var map = BM.map('map', 'bigemap.7hp28cq8', {
    crs: BM.CRS.Baidu,
    zoom: 9,
    minZoom: 10,
    maxZoom: 15,
    zoomControl: true,
    inertia: false
});
map.setMaxBounds([
    [39.25919095287123, 114.69060734498522],
    [40.82880964728086, 118.17228696991349]
]);

//layui扩展模块  还没有写
layui.define(["table", "laydate"], function (exports) {
    var table = layui.table,
        laydate = layui.laydate;
    var active = {
        errorInOpen: function () {
            layer.open({
                type: 0,
                title: "<div style='font-weight:bold;color:red'>提示</div>",
                btn: ["确定"],
                resize: false,
                area: ["450px", "210px"],
                content: "<div  style='font-size:14px;color:black;text-indent:10px;line-height:70px'><span class='layui-icon layui-icon-face-cry' style='color:orangered;font-size:30px;margin-left:5px'></span><span style='margin-left:5px;line-height:66px'>账号已过期，请重新登录</span></div>",
                btn1: function (index) {
                    // 点击退出
                    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                    parent.layer.close(index); //再执行关闭 
                },
                cancel: function () {
                    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                    parent.layer.close(index); //再执行关闭 
                }
            })
        },
        setZoom: function (currentLeve) {
            // 判断第几层改变  地图层级
            if (currentLeve == 2) {
                // $(".mapBtn").hide()
                map.setZoom(9)
            } else if (currentLeve == 3) {
                map.setZoom(12)
            }
        },
        addDisable: function (indexl) {
            // 是周的时候点击强制除了周一和周日不允许点击
            $("tr").each(function (i, item) {
                var tds = $(item).find("td")
                $(tds).each(function (ii, itemm) {
                    if ($(itemm).index() != indexl) {
                        $(itemm).addClass("laydate-disabled")
                    }
                })
            })
        },
        removeMarker: function (markerArr) {
            // 传进来的当前这一层所有的点的数组 删掉
            for (var i = 0; i < markerArr.length; i++) {
                //   markerArr[i].closeTooltip()
                markerArr[i].remove()
            }

        },
        addMarker: function (markerArr, dataArr) {
            if (dataArr.length == 0 || dataArr == undefined || dataArr == null) return false
            var p = 0;
            for (var i = 0; i < dataArr.length; i++) {
                var identify = dataArr[i].sbCount ? '识别量:' + dataArr[i].sbCount : "";
                var gather = dataArr[i].cjCount ? '采集量:' + dataArr[i].cjCount : "";
                if (!identify && !gather) {} else {
                    // 识别量调用的时候不显示采集量的字段
                    var marker = BM.marker({
                            lat: dataArr[i].orgWd,
                            lng: dataArr[i].orgJd
                        }, {
                            icon: BM.divIcon({
                                className: "my_tip_blue",
                                html: '<div  class="markersIcon" namesss=' + dataArr[i].jgmc + '   ids=' + dataArr[i].jgdm + '><span>' + dataArr[i].jgmc +
                                    '</span><span>' + gather + '</span><span>' + identify + '</span></div>'
                            })
                        })
                        .addTo(map).on("mouseover", function (i) {
                            // 设置hover上去的时候  当前的icon层级最高
                            $(i.target._icon).css({
                                "z-index": 1000 + (p++)
                            })
                        })
                    // 点击事件  点击方法在下面

                    markerArr.push(marker)
                }
            }
            return markerArr;
        },
        getZhuDatas: function (data, chartsdata, type) { //   生成的是图表要用到的数组 采集柱状图
            //   type  判断哪个页面调用     返回出去的数据类型 是不一样的   是一层过滤数据 
            var name = [],
                gather = [],
                identify = []
            if (data.length == 0) {
                return false
            }
            for (var i = 0; i < data.length; i++) {
                if (data[i].cjCount == 0 && data[i].sbCount == 0) {} else {
                    if (type == "0") {
                        name.push(data[i].jgmc)
                        gather.push(data[i].cjCount)
                        identify.push(data[i].sbCount)
                    }
                    if (type == "1") {
                        name.push(data[i].jgmc)
                        gather.push(data[i].cjCount)
                    }
                    if (type == "2") {
                        name.push(data[i].jgmc)
                        identify.push(data[i].sbCount)
                    }
                }
            }
            if (gather.length != 0 || identify.length != 0) {
                chartsdata.name = name
                chartsdata.gather = gather
                chartsdata.identify = identify
            } else {
                chartsdata = []
            }
            //   数据拿出去
            return chartsdata
        },
        getZheDatas: function (data, chartsdata, type) {
            //   折线图数据获取   判断哪个页面调用页面调用   
            var ywfssj = [],
                gather = [],
                identify = []
            for (var i = 0; i < data.length; i++) {
                if (type == "0") {
                    ywfssj.push(data[i].datetime)
                    gather.push(data[i].cjCount)
                    identify.push(data[i].sbCount)
                }
                if (type == "1") {
                    ywfssj.push(data[i].datetime)
                    gather.push(data[i].cjCount)
                }
                if (type == "2") {
                    ywfssj.push(data[i].datetime)
                    identify.push(data[i].sbCount)
                }
            }
            chartsdata.ywfssj = ywfssj
            chartsdata.gather = gather
            chartsdata.identify = identify
            //   数据拿出去
            return chartsdata
        },
        getIdentfyBingDatas: function (data, chartsdata, type) {
            //   生成的是图表要用到的数组  识别饼图    
            //   拼凑一个数组出来    前面要最大的十条数据   后面   后面所有的数据放一个数组里面叫其他 
            chartsdata = []
            var Arr = [];
            var other = []
            var ArrVal = []
            var sortArrP = []
            // 如果数据量大于10 
            if (type == "0") {
                if (data.length > 10) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].sbCount != 0) {
                            Arr.push({
                                value: data[i].sbCount,
                                name: data[i].jgmc
                            })
                            ArrVal.push(parseInt(data[i].sbCount))
                        }
                    }
                    var sortArr = ArrVal.sort(function (a, b) {
                        return b - a
                    })

                    for (var i = 0; i < sortArr.length; i++) {
                        for (var j = 0; j < Arr.length; j++) {
                            if (sortArr[i] == Arr[j].value) {
                                sortArrP.push({
                                    value: Arr[j].value,
                                    name: Arr[j].jgmc
                                })
                            }
                        }
                    }
                    // 前面的10个数组
                    for (var i = 0; i < 10; i++) {
                        other.push(sortArrP[i])
                    }
                    // 数据如果多余十条     数组里面拼接上其他
                    var newArr = sortArrP.slice(10)
                    var otherData = 0;
                    // 最后数组的和
                    for (var i = 0; i < newArr.length; i++) {
                        otherData += parseInt(newArr[i].value)
                    }
                    var lastObj = {
                        value: otherData,
                        name: "其他"
                    }
                    other.push(lastObj)
                    chartsdata = other
                } else {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].sbCount != 0) {
                            chartsdata.push({
                                value: data[i].sbCount,
                                name: data[i].jgmc
                            })
                        }
                    }
                }
            }
            // 只过滤属性实identify  的数据的identify
            if (type == "1") {
                if (data.length > 10) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].sbCount != 0) {
                            Arr.push({
                                value: data[i].sbCount,
                                name: data[i].jgmc
                            })
                            ArrVal.push(parseInt(data[i].sbCount))
                        }
                    }
                    var sortArr = ArrVal.sort(function (a, b) {
                        return b - a
                    })

                    for (var i = 0; i < sortArr.length; i++) {
                        for (var j = 0; j < Arr.length; j++) {
                            if (sortArr[i] == Arr[j].value) {
                                sortArrP.push({
                                    value: Arr[j].value,
                                    name: Arr[j].jgmc
                                })
                            }
                        }
                    }
                    // 前面的10个数组
                    for (var i = 0; i < 10; i++) {
                        other.push(sortArrP[i])
                    }
                    // 数据如果多余十条     数组里面拼接上其他
                    var newArr = sortArrP.slice(10)
                    var otherData = 0;
                    // 最后数组的和
                    for (var i = 0; i < newArr.length; i++) {
                        otherData += parseInt(newArr[i].value)
                    }
                    var lastObj = {
                        value: otherData,
                        name: "其他"
                    }
                    other.push(lastObj)
                    chartsdata = other
                } else {
                    for (var i = 0; i < data.length; i++) {
                        //   锅炉数据类型
                        // 过滤为空的数据
                        if (data[i].sbCount != 0) {
                            chartsdata.push({
                                value: data[i].sbCount,
                                name: data[i].jgmc
                            })
                        }
                    }
                }
            }
            return chartsdata
        },
        getGartherBingDatas: function (data, chartsdata, type) {
            //   生成的是图表要用到的数组   采集饼图 type参数判断哪个页面调用  0主页面  1是采集页面
            chartsdata = []
            var Arr = [];
            var other = []
            var ArrVal = []
            var sortArrP = []
            // 如果数据量大于10 
            if (type == "0") {
                if (data.length > 10) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].cjCount != 0) {
                            Arr.push({
                                value: data[i].cjCount,
                                name: data[i].jgmc
                            })
                            ArrVal.push(parseInt(data[i].cjCount))
                        }
                    }
                    var sortArr = ArrVal.sort(function (a, b) {
                        return b - a
                    })

                    for (var i = 0; i < sortArr.length; i++) {
                        for (var j = 0; j < Arr.length; j++) {
                            if (sortArr[i] == Arr[j].value) {
                                sortArrP.push({
                                    value: Arr[j].value,
                                    name: Arr[j].jgmc
                                })
                            }
                        }
                    }
                    // 前面的10个数组
                    for (var i = 0; i < 10; i++) {
                        other.push(sortArrP[i])
                    }
                    // 数据如果多余十条     数组里面拼接上其他
                    var newArr = sortArrP.slice(10)
                    var otherData = 0;
                    // 最后数组的和
                    for (var i = 0; i < newArr.length; i++) {
                        otherData += parseInt(newArr[i].value)
                    }
                    var lastObj = {
                        value: otherData,
                        name: "其他"
                    }
                    other.push(lastObj)
                    chartsdata = other
                } else {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].cjCount != 0) {
                            chartsdata.push({
                                value: data[i].cjCount,
                                name: data[i].jgmc
                            })
                        }
                    }
                }
            }
            // 只过滤属性实gather  的数据的gather
            if (type == "1") {
                if (data.length > 10) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].cjCount != 0) {
                            Arr.push({
                                value: data[i].cjCount,
                                name: data[i].jgmc
                            })
                            ArrVal.push(parseInt(data[i].cjCount))
                        }
                    }
                    var sortArr = ArrVal.sort(function (a, b) {
                        return b - a
                    })

                    for (var i = 0; i < sortArr.length; i++) {
                        for (var j = 0; j < Arr.length; j++) {
                            if (sortArr[i] == Arr[j].value) {
                                sortArrP.push({
                                    value: Arr[j].value,
                                    name: Arr[j].jgmc
                                })
                            }
                        }
                    }
                    // 前面的10个数组
                    for (var i = 0; i < 10; i++) {
                        other.push(sortArrP[i])
                    }
                    // 数据如果多余十条     数组里面拼接上其他
                    var newArr = sortArrP.slice(10)
                    var otherData = 0;
                    // 最后数组的和
                    for (var i = 0; i < newArr.length; i++) {
                        otherData += parseInt(newArr[i].value)
                    }
                    var lastObj = {
                        value: otherData,
                        name: "其他"
                    }
                    other.push(lastObj)
                    chartsdata = other
                } else {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].cjCount != 0) {
                            chartsdata.push({
                                value: data[i].cjCount,
                                name: data[i].jgmc
                            })
                        }
                    }
                }
            }
            return chartsdata
        },
        validationTime: function (val1, val2) {
            // 判断上面事件的比较岂止时间大小
            // 判断为空
            if (val1 == "" || val1 == undefined) {
                layer.msg("开始时间不能为空!", {
                    time: 2000,
                    shade: 0.4
                })
                return false
            } else if (val2 == "" || val2 == undefined) {
                layer.msg("结束时间不能为空!", {
                    time: 2000,
                    shade: 0.4
                })

                return false
            }
            //   截取字符比较开始时间和家属时间
            var statrval = parseInt(val1.split("-").join(""))
            var endval = parseInt(val2.split("-").join(""))
            if (endval < statrval) {
                layer.msg("开始时间不能大于结束时间!", {
                    time: 2000,
                    shade: 0.4
                })
                return false
            } else {
                return true
            }

        },
        zhongxin: function (data, obj) {
            // 理想状态传入数据分别筛选出y轴和x轴最大最小   设置找到当前中心点   
            var minData = {}
            var XArr = [],
                YArr = []
            if (!data) {
                return false
            } else if (data.length == 1) {
                for (var i = 0; i < data.length; i++) {
                    obj = {
                        lat: data[0].orgWd,
                        lng: data[0].orgJd
                    }
                }
            } else {
                for (var i = 0; i < data.length; i++) {
                    XArr.push(parseFloat(data[i].orgWd))
                    YArr.push(parseFloat(data[i].orgJd))
                }
                var maxX, minX, minY, maxY;
                maxX = Math.max.apply(null, XArr)
                minX = Math.min.apply(null, XArr)
                maxY = Math.max.apply(null, YArr)
                minY = Math.min.apply(null, YArr)

                var zonxinx = (maxX + minX) / 2
                var zonxinY = (maxY + minY) / 2


                var minlat = [],
                    minlaty = [];
                $.each(data, function (i, item) {
                    minlat.push(Math.abs(item.orgWd - zonxinx))
                })
                $.each(data, function (i, item) {
                    minlaty.push(Math.abs(item.orgJd - zonxinY))
                })

                var minlatsx = minlat.sort(function (a, b) {
                    return a - b
                })
                var minlatsy = minlaty.sort(function (a, b) {
                    return a - b
                })
                var minlatssx = minlatsx[0]
                var minlatssy = minlatsy[0]
                $.each(data, function (i, item) {
                    if (Math.abs(item.orgJd - zonxinY) == minlatssy) {
                        minData = data[i]
                    }
                })
                obj = {
                    lat: parseFloat(minData.orgWd),
                    lng: parseFloat(minData.orgJd)
                }

            }
            return obj
        },
        serch: function () {
            //     这个函数  获取当前点击时候的现在的时间  返回  三个数  开始时间  结束时间  还有一个   类型标识
            var statrDate, endDate;
            var checval = $("input[type=radio]:checked").val()
            // 改变采集和识别按钮状态
            if (checval == "1") {
                // 月
                searchBs = "month"
                statrDate = yuestart
                endDate = yueend
            } else if (checval == "2") {
                searchBs = "week"
                statrDate = zhoustart
                endDate = zhouend
            } else if (checval == "3") {
                statrDate = ristart
                endDate = riend
                searchBs = "day"
            }
            //   比较一下起始时间
            var obj = {
                searchBs: searchBs,
                statrDate: statrDate,
                endDate: endDate
            }
            return obj;

        },
        add0: function (mm) {
            //timestamp是整数，否则要parseInt转换,不会出现少个0的情况
            return mm < 10 ? '0' + mm : mm
        },
        timeFormat: function (timestamp) {
            //  采集时间日期时间戳转成日期格式
            var time = new Date(timestamp);
            var year = time.getFullYear();
            var month = time.getMonth() + 1;
            var date = time.getDate();
            var hours = time.getHours();
            var minutes = time.getMinutes();
            var seconds = time.getSeconds();
            return year + '-' + active.add0(month) + '-' + active.add0(date) + ' ' + active.add0(hours) + ':' + active.add0(minutes) + ':' + active.add0(seconds);
        },
        chartsState: function () {
            //   图表的显示状态  柱状图  饼图
            setTimeout(function () {
                $(".zhu_charts").show()
                $(".zhuBtn").show()
                $(".bingBtn").show()
                $(".zhe_charts_return").hide()
                myChartzhu.resize();
            }, 200)

        },
        inputRadioState: function (thst) {
            //    上面日期切换点击
            if ($(thst).val() == "1") {
                $(".dateSpan").hide()
                $(".mothSpan").show()
                $(".zhouSpan").hide()
            }
            if ($(thst).val() == "2") {
                $(".dateSpan").hide()
                $(".mothSpan").hide()
                $(".zhouSpan").show()
            }

            if ($(thst).val() == "3") {
                $(".dateSpan").show()
                $(".mothSpan").hide()
                $(".zhouSpan").hide()
            }
        },
        initDataGet: function (dateType, type, JGDM, dateBegin, dateEnd) {
            // dateType : 按天查询 day,按周查询 week， 按月查询 month
            var data;
            var d = {
                "platform": "1007",
                "appVersion": "1.0.3",
                "apiVersion": "1.0.2",
                "token": localStorage.getItem("token"),
                "data": {
                    "dateType": dateType,
                    "typeCode": type, //1采集2识别3概览
                    "dateBegin": dateBegin,
                    "dateEnd": dateEnd,
                    "fjjgdm": JGDM
                }
            }
            $.ajax({
                url: nextOrgSummaryGraph,
                type: "post",
                dataType: "json",
                async: false,
                data: JSON.stringify(d),
                contentType: "application/json",
                success: function (datas) {
                    if (datas.status == 200) {
                        data = datas;
                    } else {
                        data = [];
                        layer.msg("地图数据请求失败,请从新登陆")
                    }
                },
                error: function (httpRequset) {
                    data = [];
                    layer.msg("地图数据请求失败,请从新登陆")
                    window.top.parent.location.href = "/index.html"
                }
            })
            return data
        },
        fillDate: function (type, s, e) {
            var date;
            if (type == "month") { //如果是按月的  补全日期格式
                s = s + "-01";
                var ee = e.split("-")
                var entTime = new Date(ee[0], ee[1], 0) + ""
                e = e + "-" + entTime.substring(7, 10).trim()
            } else {
                s = s;
                e = e;
            }
            date = {
                "s": s,
                "e": e
            }
            return date
        },
        WebSocket: function (ritime="", setRIghtHtml = "", warnig = "") { //实时比中数据   //  右侧滚动数据回调
            if ("WebSocket" in window) {
                // 打开一个 web socket
                var ws = new WebSocket(socketUrl);
                ws.onopen = function () {
                    ws.send("前台请求连接"); //不需要发送数据
                }
                ws.onmessage = function (evt) { //后=后台实时推送过来数据
                    var data = JSON.parse(evt.data)
                    if (data.token == "1001") { //右侧最上面数字
                        if (!data.data) {
                            return false
                        } else {
                            console.log(data.data)
                            ritime(data.data)
                        }
                    }
                    if (data.token == "1002" && setRIghtHtml != "") { //右侧滚动数据
                        if (!data.data) {
                            return false
                        } else {
                            setRIghtHtml(data.data)
                        }
                    }
                    if (data.token == "1003" && warnig != "") { //报警数据
                        if (!data.data) {
                            return false
                        } else {
                            warnig(data.data)
                        }
                    }
                }
                ws.onclose = function () {
                    layer.msg("实时比中信息链接异常")
                };
            } else {
                // 浏览器不支持 WebSocket
                layer.msg("您的浏览器不支持实时获取数据请使用谷歌浏览器")
            }
        }
        
    }

    //   时间插件 限制最大时间最小时间
    function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
            " " + date.getHours() + seperator2 + date.getMinutes() +
            seperator2 + date.getSeconds();
        return currentdate;
    }


    // 上面检索时间默认状态
    $(".dateSpan").hide()
    $(".zhouSpan").hide()
    //   月周日的起止时间变量
    // 按月
    var yuestart, yueend, ristart, riend, zhoustart, zhouend;
    var currentdate = new Date();
    var currentyear = currentdate.getFullYear()
    var currentmoth = currentdate.getMonth()

    // 默认检索的月
    yuestart = '' + parseInt(currentyear) + '-01'

    yueend = parseInt(currentyear) + '-' + active.add0((parseInt(currentmoth) + 1))

    laydate.render({
        elem: '#date',
        trigger: "click",
        type: "month",
        max: getNowFormatDate(),
        btns: ['clear', 'confirm'],
        value: +currentyear + '-' + "01",
        theme: '#2F4056' //设置主题颜色
            ,
        done: function (val) {
            yuestart = val
        }
    });
    laydate.render({
        elem: '#date2',
        trigger: "click",
        type: "month",
        btns: ['clear', 'confirm'],
        value: currentyear + '-' + active.add0((parseInt(currentmoth) + 1)),
        max: getNowFormatDate(),
        theme: '#2F4056' //设置主题颜色
            ,
        done: function (val) {
            yueend = val
        }
    });
    // 按天
    laydate.render({
        elem: '#date3',
        trigger: "click",
        type: "date",
        btns: ['clear', 'confirm'],
        max: getNowFormatDate(),
        theme: '#2F4056' //设置主题颜色
            ,
        done: function (val) {
            ristart = val
        }
    });
    laydate.render({
        elem: '#date4',
        trigger: "click",
        max: getNowFormatDate(),
        type: "date",
        btns: ['clear', 'confirm'],
        theme: '#2F4056' //设置主题颜色
            ,
        done: function (val) {
            riend = val
        }
    });
    // 按周   按周的需求是只能选周一个周日  其他的不行  点击成功之后的回调里面强制加上一个calss
    laydate.render({
        elem: '#date5',
        trigger: "click",
        max: getNowFormatDate(),
        type: "date",
        btns: ['clear', 'confirm'],
        theme: '#2F4056' //设置主题颜色
            ,
        ready: function () {
            // 给除了周一之外的所有元素加加上不可点击
            active.addDisable('1')
            $(".layui-laydate-header").on("click", "i", function () {
                active.addDisable('1')
            })

        },
        done: function (val) {
            zhoustart = val
        }
    });
    laydate.render({
        elem: '#date6',
        trigger: "click",
        max: getNowFormatDate(),
        type: "date",
        btns: ['clear', 'confirm'],
        theme: '#2F4056' //设置主题颜色
            ,
        ready: function () {
            // 给除了周一之外的所有元素加加上不可点击
            active.addDisable('0')
            $(".layui-laydate-header").on("click", "i", function () {
                active.addDisable('0')
            })
        },
        done: function (val) {
            zhouend = val
        }
    });




    exports('extension', active);
});