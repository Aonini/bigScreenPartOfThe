//   下面主要是图表的生成
var myChartzhu,myChartbing,myChartheng,myChartzhe;
var eCharts = {
    addzhu: function (id, data, gatherAoFirst) {
        // gatherAoFirst参数判断是哪个页面调用这个方法   0  1形式
        if (gatherAoFirst) {
            $(".bing_charts").css("display", "none")
        } else {
            $(".bing_charts").css("display", "block")
        }
        $(".zhe_charts").css("display", "none")
        $(".zhu_charts").css("display", "block")
        var gather = data.gather?data.gather:0,identify=data.identify?data.identify:0;
        myChartzhu = echarts.init(document.getElementById(id));
        var optionzhu = {
            color: ["#147BD9", "#28A54D"],
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: '5%',
                right: '5%',
                top: "12%",
                containLabel: true,
                height: "60%",
                tooltip: {
                    borderColor: "#DD5145"
                }
            },
            legend: {
                data: ['识别量', '采集量'],
                textStyle: {
                    color: "#fff",
                    fontSize: "12px"
                }
            },
            calculable: true,
            xAxis: [{
                type: 'category',
                data: data.name,
                axisLabel: {
                    rotate: 10,
                    textStyle: {
                        color: "#fff",
                        fontSize: "10px"
                    }
                }
            }],
            yAxis: [{
                type: 'value',
                axisLabel: {
                    textStyle: {
                        color: "#fff",
                        fontSize: "10px"
                    }
                }
            }],
            series: [{
                    name: '采集量',
                    type: 'bar',
                    data: gather,
                    markLine: {
                        data: [
                            // {type : 'average', name: '平均值'}
                        ]
                    }
                },
                {
                    name: '识别量',
                    type: 'bar',
                    data: identify,
                    markLine: {
                        data: [
                            // {type : 'average', name : '平均值'}
                        ]
                    }
                }
            ],
            dataZoom: [{
                type: 'slider',
                startValue: 0, //数据窗口范围的起始数值 
                endValue: 9, //数据窗口范围的结束数值。 
                top: "75%"
            }]
        };
        myChartzhu.setOption(optionzhu);
    },
    addzhuD: function (id, data, gatherAoFirst, type, name) {
        //  识别和采集页面的单个柱状图
        // gatherAoFirst参数判断是哪个页面调用这个方法   0  1形式   type参数判断是识别还是采集页面调用   
        var color;
        if (type == "1") {
            color = "#147BD9"
            dataVal = data.gather
        }
        if (type == "2") {
            color = "#28A54D"
            dataVal = data.identify
        }
        //单独的柱状图
        if (gatherAoFirst) {
            $(".bing_charts").css("display", "none")
        } else {
            $(".bing_charts").css("display", "block")
        }
        $(".zhe_charts").css("display", "none")
        $(".zhu_charts").css("display", "block")

        myChartzhu = echarts.init(document.getElementById(id));
        var optionzhu = {
            color: color,
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: '5%',
                right: '5%',
                top: "7%",
                containLabel: true,
                height: "65%",
                tooltip: {
                    borderColor: "#DD5145"
                }
            },
            calculable: true,
            xAxis: [{
                type: 'category',
                data: data.name,
                axisLabel: {
                    rotate: 10
                },
                axisLabel: {
                    rotate: 10,
                    textStyle: {
                        color: "#fff",
                        fontSize: "10px"
                    }
                }
            }],
            yAxis: [{
                type: 'value',
                axisLabel: {
                    textStyle: {
                        color: "#fff",
                        fontSize: "10px"
                    }
                }
            }],
            series: [{
                name: name,
                type: 'bar',
                data: dataVal,
                markLine: {
                    data: [
                        // {type : 'average', name: '平均值'}
                    ]
                }
            }],
            dataZoom: [{
                type: 'slider',
                startValue: 0, //数据窗口范围的起始数值 
                endValue: 9, //数据窗口范围的结束数值。 
                top: "75%"
            }]
        };
        myChartzhu.setOption(optionzhu);
    },
    addBing: function (id, data, title, gatherAoFirst) {
        // 根据传的参数是 0 或1  来判断  是第一个页面还是之后的页面掉方法
        var optionbing
        if (gatherAoFirst) {
            $(".zhu_charts").css("display", "none")
        } else {
            $(".zhu_charts").css("display", "block")
        }
        $(".zhe_charts").css("display", "none")
        $(".bing_charts").css("display", "block")
        //   现在数组的长度  减去 之前记录数组的长度的数据   返回新数组  是饼图的数据          
        myChartbing = echarts.init(document.getElementById(id));
        myChartbing.clear()
        if (data.length == 0) {
            // 无数据时处理
            optionbing = {
                title: {
                    text: title + "暂无数据",
                    textStyle: {
                        color: "#fff"
                    },
                    top: "0",
                    left: "45%"
                }
            };
        } else {
            $(".zwsj").remove()
            optionbing = {
                color: ['#147BD9', '#28A54D', '#626BC4', '#B65BAC', '#1D2B62', '#C4804E', ],
                title: {
                    text: title,
                    textStyle: {
                        color: "#fff"
                    },
                    top: "0",
                    left: "45%"
                },
                radius: '50%',
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                grid: {
                    left: '20%',
                    right: '4%',
                    top: "0%",
                    containLabel: true,
                },
                series: [{
                        name: '数据来源',
                        type: 'pie',
                        avoidLabelOverlap: true,
                        radius: ['50%', '60%'],
                        label: {
                            normal: {
                                formatter: function (name) {
                                    var names = name.name
                                    if (!names) return '';
                                    if (names.length > 10) {
                                        return name.name = names.slice(0, 10) + '...';
                                    }

                                },
                                textStyle: {
                                    fontWeight: 'normal',
                                    fontSize: 12,
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                length: 10,
                                length2: 30,
                                lineStyle: {
                                    color: '#333'
                                }

                            }
                        },
                        data: data
                    }

                ],
            };

        }
        myChartbing.setOption(optionbing);
        // 指定图表的配置项和数据   
    },
    addhengzhu: function (id, data) {
         myChartheng = echarts.init(document.getElementById(id));
        // 指定图表的配置项和数据
        var optionheng = {
            color: ['#3398DB'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                top: "0",
                containLabel: true
            },
            xAxis: {
                type: 'value',
                minInterval: 1,
                axisLabel: {
                    textStyle: {
                        color: "#fff",
                        fontSize: "10px" 
                    }
                }
            },
            yAxis: {
                type: 'category',
                data: data.name,
                axisLabel: {
                    textStyle: {
                        color: "#fff",
                        fontSize: "10px"
                    }
                }
            },
            series: [{
                name: '数据条数',
                type: 'bar',
                data: data.value
            }]
        };
        myChartheng.setOption(optionheng);
    },
    addChartszhe: function (id, data, type) {
        //   type判断哪个页面调用这个方法   1主页面双折线  其他两个页面单折现0   
        myChartzhe = echarts.init(document.getElementById(id));
        var color, dataVal;

        if (type == "2") {
            color = "#28A54D"
            dataVal = data.identify
        }
        if (type == "1") {
            color = "#147BD9"

            dataVal = data.gather
        }
        if (type == "0") {
            //    第一个页面
            optionzhe = {
                color: ["#147BD9", "#28A54D"],
                legend: {
                    data: ['采集量', '识别量']
                },
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: data.ywfssj,
                    axisLabel: {
                        rotate: 10,
                        textStyle: {
                            color: "#fff",
                            fontSize: "10px"
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        textStyle: {
                            color: "#fff",
                            fontSize: "10px"
                        }
                    }
                },
                series: [{
                        name: '采集量',
                        type: 'line',
                        data: data.gather
                    },
                    {
                        name: '识别量',
                        type: 'line',
                        data: data.identify
                    }
                ]
            };
        } else {
            optionzhe = {
                color: color,
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: data.ywfssj,
                    axisLabel: {
                        rotate: 10,
                        textStyle: {
                            color: "#fff",
                            fontSize: "10px"
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        textStyle: {
                            color: "#fff",
                            fontSize: "10px"
                        }
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    top: '5%',
                    containLabel: true,
                    height: "80%"
                },
                series: [{
                    data: dataVal,
                    type: 'line'
                }]
            };
        }
        myChartzhe.setOption(optionzhe);
    }
}
window.onresize = function () {
    if( myChartzhu != undefined && myChartzhu != null ){
        myChartzhu.resize();    
    }
    if( myChartbing != undefined && myChartbing != null ){
        myChartbing.resize();   
    }
    if( myChartheng != undefined && myChartheng != null ){
        myChartheng.resize();    
    }
    if( myChartzhe != undefined && myChartzhe != null ){
        myChartzhe.resize();    
    }
}






















// {
//     "platform": "1007",
//     "appVersion": "1.0.3",
//     "apiVersion": "1.0.2",
//     "token": "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxMTExIiwic3ViIjoidG9rZW4iLCJpc3MiOiJ1c2VyIiwiaWF0IjoxNTcxMjk2NjY5LCJleHAiOjE1NzEzODMwNjl9.QDdKAmSK0GhsxzcwzCQ9vG4O-6cFi0uGUT-ZfZfnQ1g", 
//     "data": {
//         "dateType": "day",
//         "typeCode": "3",
//         "dateBegin": "2018-10-07 00:00:00",
//         "dateEnd": "2019-10-13 23:59:59",
//         "fjjgdm": "0"//机构代码
//     }
// }
// "datetime": null,//时间
// "jgdm": "540000000000",//圆点上机构代码
// "jgmc": "西藏自治区公安厅",//名称
// "cjCount": "0",//  采集数量
// "sbCount": "0",// 识别数量
// "orgLevel": "1"//机构等级
