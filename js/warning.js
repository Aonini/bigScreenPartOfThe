layui.use(['laydate', 'table', 'form', "layer"], function () {
    var laydate = layui.laydate,
        table = layui.table,
        $ = layui.$,
        layer = layui.layer,
        form = layui.form;
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var date = d.getDate();
    var day = d.getDay();
    var curDateTime = year;
    if (month > 9)
        curDateTime = curDateTime + "-" + month;
    else
        curDateTime = curDateTime + "-0" + month;
    if (date > 9)
        curDateTime = curDateTime + "-" + date;
    else
        curDateTime = curDateTime + "-0" + date;
    //日期范围
    laydate.render({
        elem: '#test-laydate-range-date',
        range: '~',
        trigger: "click",
        max: curDateTime,
        theme: '#2F4056' //设置主题颜色
    });

    function addTble(data) {
        var data1;
        if (data) {
            data1 = data
        } else {
            data1 = []
        }
        table.render({
            elem: '#person_tab',
            height: 620,
            page: true //开启分页
                ,
            data: data1,
            cols: [
                [ //表头
                    {
                        field: 'cjsbbh',
                        hide: true
                    }, {
                        field: 'bjsj',
                        // width: "10%",
                        title: '发生时间'
                    }, {
                        field: 'bjlx',
                        // width: "10%",
                        title: '报警类型'
                    }, {
                        field: 'jgxxGajgjgmc',
                        // width: "10%",
                        title: '识别点'
                    }, {
                        field: 'bjxxXm',
                        // width: "10%",
                        title: '姓名'
                    }, {
                        field: 'zjdm',
                        // width: "10%",
                        title: '证件类型'
                    }, {
                        field: 'bjxxCyzjZjhm',
                        // width: "10%",
                        title: '证件号'
                    }, {
                        field: 'ryfl',
                        // width: "10%",
                        title: '人员分类'
                    }, {
                        field: 'xb',
                        // width: "10%",
                        title: '性别'
                    }, {
                        field: 'gj',
                        // width: "10%",
                        title: '国籍'
                    }, {
                        field: 'mz',
                        // width: "10%",
                        title: '民族'
                    }, {
                        minWidth: 180,
                        align: 'center',
                        fixed: 'right',
                        toolbar: '#barDemo',
                        title: '操作'
                    }
                ]
            ]
        });
        table.render()
    }

    var d = {
        "data": {
            "sjsjStart": "", //开始时间，必填
            "sjsjEnd": "", //结束时间，必填
            "sfxxcjCyzjCyzjdm": "", //证件类型，必填
            "sfxxcjCyzjZjhm": "", //证件号码，必填
            "sfxxcjXm": "", //姓名，必填
            "sfxxcjXbdm": "", //性别，必填
            "sfxxcjRyfl": "", //人员分类，必填
            "sfxxcjGjdm": "", //国籍，必填
            "sfxxcjMzdm": "", //民族，必填
            "userJGDM": "120000000000"

        },
        "platform": "",
        "appversion": "1.0.3",
        "apiversion": "1.0.2",
        "mac": "12345678",
        "page": 1,
        "limit": 10,
        "userName": "hyy",
        "userId": "12",
        "ip": "10.10.1.66 ",
        "token": localStorage.getItem("token")
    }

    function getTableData(s) {
        $.ajax({
            url:alarmRecord,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(s),
            success: function (data) {
                addTble(data.data.data)
            },
            error: function (httpQueryste) {
                var status = httpQueryste.status
            }
        })
    }
    getTableData(d)
    table.render()
    form.render();
    form.on("submit(serch)", function (data) {
        var datas = data.field;
        var timeArr = datas.time.split("~")
        var startTime = timeArr[0]
        var endTime = timeArr[1]

        var datass = {
            xm: datas.xm ? datas.xm : "",
            startTime: startTime ? startTime : "",
            endTime: endTime ? endTime : "",
            zjlx: datas.zjlx ? datas.zjlx : "",
            zjhm: datas.zjhm ? datas.zjhm : "",
            xb: datas.xb ? datas.xb : "",
            rylb: datas.ryfl ? datas.ryfl : "",
            gj: datas.gj ? datas.gj : "",
            mz: datas.mz ? datas.mz : ""
        }
        var ds = {
            "data":{
                "sjsjStart":datass.startTime, //开始时间，必填
                "sjsjEnd":datass.endTime, //结束时间，必填
                "bjxxCyzjCyzjdm":datass.zjlx, //证件类型，必填
                "bjxxCyzjZjhm":datass.zjhm, //证件号码，必填
                "bjxxXm":datass.xm, //姓名，必填
                "bjxxXbdm":datass.xb, //性别，必填
                "bjxxRyfl": datass.rylb, //人员分类，必填
                "bjxxGjdm": datass.gj, //国籍，必填
                "bjxxMzdm":datass.mz, //民族，必填
                "userJGDM":"120000000000"
                
            },
            "platform":"",
            "appversion":"1.0.3",
            "apiversion":"1.0.2",
            "mac":"12345678",
            "page":1,
            "limit":10,
            "userName":"hyy",
            "userId":"12",
            "ip":"10.10.1.66 ",
            "token": localStorage.getItem("token")
            }
        getTableData(ds)
    })


    $("#person_reset_btn").click(function () {
        $("#person_form")[0].reset();
        layui.form.render();
    })

    table.on("tool(person_tab_filter)", function (obj) {
        var event = obj.event;
        var data = obj.data;
        if (event == "see") {
            var dd = {
                "data": {
                    "CJSBBH": data.cjsbbh   //报警记录采集编号
                },
                "platform": "",
                "appversion": "1.0.3",
                "apiversion": "1.0.2",
                "mac": "12345678",
                "page": 1,
                "limit": 10,
                "userName": "hyy",
                "userId": "12",
                "ip": "10.10.1.66 ",
                "token": localStorage.getItem("token")
            }
            $.ajax({
                url: alarmCompare,
                type: "POST",
                async: false,
                contentType: "application/json",
                data: JSON.stringify(dd),
                success: function (data) {
                    if(data.status){
                        var leftImg =  data.data[0].sfxxcjZpdz?"data:image/bmp;base64," +data.data[0].sfxxcjZpdz:"/icon/people.png",
                            rightImg =  data.data[1].bjxxZpdz?"data:image/bmp;base64," +data.data[1].bjxxZpdz:"/icon/people.png"
                                layer.open({
                                    type:1,
                                    title: `<span style="color:red; font-weight: bold">告警：</span>位置:${data.data[0].jgxxGajgjgmc}`,
                                    shade:0.3,
                                    area:["600px","315px"],
                                    btn:["确定"],
                                    content:`<div style='height:100%;width:100%;color:#fff;overflow:hidden;background:#000238'>
                                                    <div style="width: 49%;float:left">
                                                    <span  style="float:left;text-indent:5px;font-size:16px;font-weight:bold;margin-bottom:20px;width:100%">采集信息</span>  
                                                        <div class="layerSee  layerB">性别：${data.data[0].xb}</div>
                                                        <div class="layerSee  layerB">国籍：${data.data[0].gj}</div>
                                                        <div class="layerSee  layerB">民族：${data.data[0].mz}</div>
                                                        <div  class="layerSee   imgP"  }>
                                                            <img src="${leftImg}">
                                                        </div>
                                                        <div  class="layerSee ">时间：${data.data[0].cjsj}</div>
                                                        <div  class="layerSee ">地点：${data.data[0].jgxxGajgjgmc}</div>
                                                        <div  class="layerSee ">姓名：${data.data[0].sfxxcjXm}</div>
                                                        <div class="layerSee">证件类型：${data.data[0].zjdm}</div>
                                                        <div class="layerSee">证件号码：${data.data[0].sfxxcjCyzjZjhm}</div>
                                                        <div class="layerSee">人员类型：${data.data[0].ryfl}</div>
                                                </div> 
                                                <div style="width: 50%;float: right;">
                                                    <span  style="float:left;text-indent:5px;font-size:16px;font-weight:bold;margin-bottom:20px;width:100%">比中信息</span>
                                                        <div class="layerSee  layerB">性别：${data.data[1].xb}</div>
                                                        <div class="layerSee  layerB">国籍：${data.data[1].gj}</div>
                                                        <div class="layerSee  layerB">民族：${data.data[1].mz}</div>
                                                        <div  class="layerSee   imgP">
                                                        <img src="${rightImg}">
                                                        </div>
                                                        <div  class="layerSee ">时间：${data.data[1].bjsj}</div>
                                                        <div  class="layerSee ">地点：${data.data[1].jgxxGajgjgmc}</div>
                                                        <div  class="layerSee">姓名：${data.data[1].bjxxXm}</div>
                                                        <div class="layerSee">证件类型：${data.data[1].zjdm}</div>
                                                        <div class="layerSee">证件号码：${data.data[1].bjxxCyzjZjhm}</div>
                                                        <div class="layerSee">人员类型：${data.data[1].ryfl}</div>
                                                </div>
                                            </div>`
                                            ,success:function(){
                                                $(".layui-layer-btn").css("background","#07203E")
                                                $(".layerSee").each(function(i,item){
                                                    var thisText = $(this).text()
                                                    $(this).attr("title",thisText)
                                                })
                                                $(".layui-layer-title").css("text-align","left")

                                            }
                                })
                    }else{
                        layer.msg("数据查看请求失败")
                    }
                },
                error: function (httpQueryste) {
                    var status = httpQueryste.status
                    layer.msg("数据查看请求失败") 
                }
            })
        }
    })
});