/** 图形基础类 **/

import echarts from 'echarts'

class Chart{
    constructor(id){
        this.chart=echarts.init(document.getElementById(id)) 
    }
    resize(){
        this.chart.resize();
    }

    //增加柱状图
    addBar(data={}){
        let x=_.map(_.keys(data),d=>d.substr(0,2)),y=_.values(data);
        this.chart.setOption({
            title: {
                text: '',
                subtext: ''
            },
            grid:{
                left:50,
                right:10,
                bottom:30,
                top:20
            },
            tooltip: {},
            xAxis: {
                data: x,
                axisLabel: {
                    textStyle: {
                        color: '#fff'
                    }
                },
            },
            yAxis: {
                splitLine:{
                    show:false  
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: '#999'
                    }
                }
            },
            series: [
                {
                    type: 'bar',
                    barGap:'40%',
                    barCategoryGap:'40%',
                    barWidth:20,
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color: '#2e6da4'},
                                    {offset: 0.5, color: '#1777db'},
                                    {offset: 1, color: '#1777db'}
                                ]
                            )
                        },
                        emphasis: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color: '#2378f7'},
                                    {offset: 0.7, color: '#2378f7'},
                                    {offset: 1, color: '#83bff6'}
                                ]
                            )
                        }
                    },
                    data: y
                }
            ]
        },true)
    }

    //数据采集/采集趋势/趋势分析
    trendLine(data={}){
        this.chart.setOption({                           
            tooltip: {trigger: 'axis',},
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data:data.dates || [],
                axisLine: {
                    lineStyle: {
                        color: "#fff",
                    }
                }
                
            },
            grid:{	//设置图标上面和下面的距离
                left: 60,
                right: 40,
                y:40,
                bottom:40,
            },
            yAxis: {
                type: 'value',                    
                xisLabel: {
                    formatter: '{value} W'
                },
                axisPointer: {
                    snap: true
                },
                axisLine: {
                    lineStyle: {
                        color: "#fff",
                    }
                }
            },
            series: [{
                name:"采集数",
                data: data.datas || [],
                type: 'line',
            }]
        },true);
    }

    //数据采集/采集趋势/数据详情/历史采集
    historyColloct(d={x:{},y:[]}){
        this.chart.setOption({      
            title: {
                text: '历史采集详情',
                textStyle: {  
                    fontSize: 15,
                    fontWeight:700,
                    color:'white'
                }, 
            },                       
            tooltip: {
                trigger: 'axis',
                formatter:function(param){
                    let str='';
                    _.each(param,p=>{
                        str+=`${p.seriesName}:${p.data}<br>`
                    });
                    return str;
                },
                textStyle:{color:'white'}
            },
            legend: {
                orient : 'horizontal',  
                y:20,
                textStyle: {  
                    fontSize: 13,
                    color:'white',
                }, 
                data:_.keys(d.x)
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data:d.y,
                axisLine: {
                    lineStyle: {
                        color: "#fff",
                    }
                }
            },
            grid:{	//设置图标上面和下面的距离
                left: 60,
                right: 40,
                y:75
            },
            yAxis: {
                type: 'value',     
                //name: '历史采集详情',               
                xisLabel: {
                    formatter: '{value}'
                },
                axisLabel: {
                    formatter: '{value} '
                },
                axisPointer: {
                    snap: true
                },
                axisLine: {
                    lineStyle: {
                        color: "#fff",
                    }
                }
            },
            series:_.map(d.x,(c,key)=>{
                return {
                        name: key,
                        type: 'line',
                        data: c,
                        itemStyle: {
                            normal: {
                                label: {
                                    formatter: '{c}%'
                                }
                            }
                        }                
                    }
                })
        },true);
    }
    //数据采集/采集趋势/数据详情/昨日详情
    lastColloct(d={x:[],y:[]}){
        this.chart.setOption({
            title: {
                text: '昨日采集详情',
                x : 20, 
                y :5, 
                textStyle: {  
                    fontSize: 15,
                    fontWeight:700,
                    color:'white',
                }, 
            },                                    
            tooltip: {
                trigger: 'axis',                 
            },
            grid:{	//设置图标距离
                left: 60,
                right: 40,
                y:45
            },            
            xAxis: {
                type: 'category',
                data: d.y,
                axisLine: {
                    lineStyle: {
                        color: "#fff",
                    }
                }
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    lineStyle: {
                        color: "#fff",
                    }
                }
            },
            series: [{
                name:"采集数",
                itemStyle: {
                    normal: {
                        color:'#42ABDF'
                    }
                },
                data: d.x,
                type: 'bar'
              },
            ]
        },true);
    }

    //数据质量/有效率
    dataMassEffect(data={days:[],firms:[]}){
        let yHeader=_.map(data.firms,f=>f.name);
        this.chart.setOption({
            tooltip: {
                trigger: 'axis',
                formatter:function(param){
                    let str='';
                    _.each(param,p=>{
                        str+=`${p.seriesName}:${p.data}%<br>`
                    });
                    return str;
                }
            },
            grid:{
                top:120,
                bottom:50,
            },
            legend: {
                data:yHeader,
                textStyle:{  
                    color:'#fff' 
                }  
            },
            xAxis:  {
                type: 'category',
                boundaryGap: false,
                data: data.days,
                axisLabel:{  
                    interval:0,  
                    rotate:45,//倾斜度 -90 至 90 默认为0  
                    margin:2,  
                    textStyle:{  
                        color:'#fff' 
                    }  
                },    
            },
            yAxis: {
                type: 'value',
                name: '有效率',
                axisLabel: {
                    formatter: '{value} %',
                    color:'#fff' 
                }
            },
            series:_.map(data.firms,f=>{
                return {
                    name:f.name,
                    type:'line',
                    data:f.data
                }
            })
        },true)
    }

    //首页关注标签图表
    focusTagsChart(data=[]){
        this.chart.setOption({
            color:['#1777db','rgba(6, 32, 55, 0.8)'],
            series: [
                {
                    name:'',
                    type:'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    stillShowZeroSum:false,
                    hoverOffset:0,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: false,
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:[
                        {value:data[0] || 0, name:'涉毒'},
                        {value:data[1] || 0, name:'未涉毒'},
                    ]
                }
            ]
        },true)
    }
}



export default Chart;