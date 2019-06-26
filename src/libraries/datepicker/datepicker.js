/* eslint-disable */
// 日期选择控件
import 'lib/DateRangePicker/moment.js'
(function (window, $) {
    var html = '<div class="datepicker zoomIn {3}" id="{0}" name="datepicker" style="{2}">' +
        ' {1}' +
        '</div>';
    var date_html = '<div id={0} class="datepicker_item fadeIn" style="display:inline-block;float:left;{2}">' +
        ' <div class="header" style="line-height:20px;">' +
        '   <div class="day" name="week_info">星期天</div>' +
        '   <div class="month"><div class="container"><i class="fa fa-chevron-left" name="month_left"></i><span name="month_info">六月</span><i class="fa fa-chevron-right" name="month_right"></i></div></div>' +
        '   <div class="date" name="date_info">03</div>' +
        '   <div class="year"><div class="container"><i class="fa fa-chevron-left" name="year_left"></i><span name="year_info">2106</span><i class="fa fa-chevron-right" name="year_right"></i></div></div>' +
        ' </div>' +
        ' <div class="days">' +
        '   <div class="title" name="year_month"><i class="fa fa-angle-double-left" name="year_left"></i><i class="fa fa-angle-left" name="month_left" style="width:15px;"></i><span name="info" class="no-user-select">2016 六月</span><i name="month_right" class="fa fa-angle-right" style="width:15px;"></i><i class="fa fa-angle-double-right" name="year_right"></i></div>' +
        '   <div name="days_content_container">' +
        '     <ul class="day_title clearfix" style="{3}"><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li><li>七</li></ul>' +
        '     <div class="datepicker_content" style="min-height: 192px;"></div>' +
        '   </div>' +
        '   <div class="optionBar clearfix">' +
        '     <div name="range_content_container" class="range_content">' +
        '       <div class="rangeItem"><input type="text" maxlength="2" name="h_val"  data-kind="h"/><div class="optionbar"><i class="fa fa-caret-up" name="up" data-kind="h"></i><i class="fa fa-caret-down" name="down"  data-kind="h"></i></div></div> :' +
        '       <div class="rangeItem"><input type="text" maxlength="2"  name="m_val"  data-kind="m"/><div class="optionbar"><i class="fa fa-caret-up" name="up"  data-kind="m"></i><i class="fa fa-caret-down" name="down"  data-kind="m"></i></div></div> :' +
        '       <div class="rangeItem"><input type="text" maxlength="2"  name="s_val"  data-kind="s"/><div class="optionbar"><i class="fa fa-caret-up" name="up"  data-kind="s"></i><i class="fa fa-caret-down" name="down"  data-kind="s"></i></div></div>' +
        '     </div>' +
        '     <div name="minute_content_container" style="margin-bottom:10px;">' +
        '       <div style="width:120px;">' +
        '         <div class="input-group clockpicker">' +
        '             <input name="clockpicker_input" type="text" class="form-control" >' +
        '             <span class="input-group-addon">' +
        '                 <span class="fa fa-clock-o"></span>' +
        '             </span>' +
        '         </div>' +
        '       </div>' +
        '     </div>' +
        '     <div style="padding:0px 10px;{1}"><div class="btn" name="btn_ok" style="font-size:12px;">完成</div><div class="btn" name="btn_cancel" style="font-size:12px;">取消</div></div>' +
        '   </div>' +
        ' </div>' +
        '</div>';

    //GUID
    var guid = function () {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    };

    // add by jyj 根据当前窗口计算弹出方向，避免被遮盖
    var calcTopLeft = function ($tip, $ipt, type, isRight) {
        try {
            var h = $tip.height(),
                w = $tip.width(),
                iptH = $ipt.height(),
                iptOT = $ipt.offset().top,
                iptOL = $ipt.offset().left,
                allowHeight = $(window).height() - iptOT - iptH;
            if (allowHeight < h) {
                // 向上弹出
                $tip.css({top: -1 * (h - allowHeight + 10)});
            } else {
                // 向下弹出
                $tip.css({top: ''});
            }
            if (type === 1) {
                if (!isRight) {
                    $ipt.css('postion', '');
                    $tip.css({'postion': 'absolute', 'right': ''});
                }
            }
            if ($(window).width() - iptOL < w) {
                // 设置为right
                $ipt.css('postion', 'relative');
                $tip.css({'postion': 'absolute', 'right': '0px'});
            }
        } catch (e) {
        }
    }

    //字符串格式化
    var format = function (format) {
        var formatRe = /\{(\d+)\}/ig;

        var args = new Array();
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }

        return format.replace(formatRe, function (m, i) {
            return args[i];
        });
    };

    var validateDate=function (sourceDate,compareDate) {
        try{
            var sourceInt=parseInt(sourceDate);
            var compareInt=parseInt(compareDate);
            return (sourceInt-compareInt)>=0;
        }catch(e){
            return false;
        }
    };

    var month_map = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    var day_map = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

    $.fn.extend({
        'datepicker': function (config) {
            //配置项
            var option = {};
            var id = 0, pre_id = 0, after_id = 0;
            var blnRang = false; //是否范围选取
            var curDate = null; //当前选中日期
            var preDate = null;
            var afterDate = null;
            var curDays = 0;    //当前月份下的天数
            var firstDay = -1;  //当月第一天星期几(0为星期天,1为星期一)
            var self = this;
            var contain=$('body');
            var blnHide = true;
            var blnLeave = false;
            var datePicker=null;
            var option = {
                maxDay: 99999999,// 默认最大允许选择多少天
                maxMonth: 99999999,// 默认最大允许选择月
                //cutOffMaxDate:'',//可选截止日期 2017-1-1、2012/1/1、2012,1,1
                defDate: '',//默认日期
                mini: true,//是否为小巧版
                range: false,//是否为范围选择
                rangeMini: true,//是否显示范围时分秒控件(不显示则用时钟来显示)
                dateLimit:null,//外部提供的日期选择限制方法
                /*
                *edit by xyl 2017-06-29
                * 自定义按钮配置数组对象中新增 beginDateAdd和endDateAdd配置项
                * beginDateAdd：对开始时间进行加减
                * endDateAdd：对结束时间进行加减
                * */
                defRange:[] //[{name: '一天', value: 1}, {name: '一周', value: 7}, {name: '一月', type: 'month', value: 1}],//默认范围
            };
            id = guid(), pre_id = guid(), after_id = guid();

            option = $.extend(option, config || {});
            var cutOffMinDateObj=null;//可选起始日期对象
            if(option.cutOffMinDate){
                cutOffMinDateObj=new XDate(option.cutOffMinDate);
            }
            var cutOffMaxDateObj=null;//可选截止日期对象
            if(option.cutOffMaxDate){
                cutOffMaxDateObj=new XDate(option.cutOffMaxDate);
            }
            var result = '';
            // 解决复制日期到输入框不调用change的问题
            this.find("input").on("input propertychange", function () {
                var that = this;
                if (!/^(\d{4}-\d{2}(-\d{2})?( \d{2}:\d{2}(:\d{2})?)?)(~\d{4}-\d{2}(-\d{2})?( \d{2}:\d{2}(:\d{2})?)?)?$/.test($(that).val()) && $(that).val() !== "")return;
                setTimeout(function () {
                    if (option.change) {
                        if ($(that).val() === "") {
                            option.change("", "");
                        } else {
                            var val = $(that).val().split('~');
                            if (val.length > 1)
                                option.change(val[0], val[1]);
                            else
                                option.change(val[0]);
                        }
                    }
                }, 50)
            })
            //删除已经存在的元素
            contain.find(`div[id="${id}"]`).remove();

            //插件初始化
            var init = function (date, id_val, type) {
                curDate = date || new XDate();
                if (type == 0) {
                    curDate = preDate = date || new XDate();
                } else if (type == 1) {
                    curDate = afterDate = date || new XDate();
                }
                curDays = XDate.getDaysInMonth(curDate.getFullYear(), curDate.getMonth());
                var firstDayDate = new XDate(curDate.getFullYear(), curDate.getMonth(), curDate.getDate()).setDate(1);
                firstDay = firstDayDate.getDay() == 0 ? 7 : firstDayDate.getDay();
                createDayTable(id_val, type);

                //设置相关显示内容
                var EI = $('#' + (id_val || id));
                EI.find('span[name="year_info"]').html(curDate.getFullYear());
                var txtInfo = month_map[curDate.getMonth()];
                if (curDate.getMonth() < 10)txtInfo = "&nbsp;&nbsp;&nbsp;" + txtInfo;
                EI.find('span[name="month_info"]').html(txtInfo);

                var dateItem=EI.find('div[class*="date_item"][data-value="' + curDate.getDate() + '"]');
                if(dateItem.length>0){
                    dateItem.click();
                }else {
                    var txtInfo = month_map[curDate.getMonth()];
                    if (curDate.getMonth() < 10)txtInfo = "&nbsp;&nbsp;&nbsp;" + txtInfo;
                    $('#' + (id_val || id)).find('div[name="year_month"]>span[name="info"]').html(format('{0}&nbsp;&nbsp;{1}', curDate.getFullYear(), txtInfo));
                }
                //设置日期选中
                //EI.find('div[class*="date_item"][data-value="' + curDate.getDate() + '"]').click();
            };

            //初始化时间插件
            var initTimer = function (time, id_val, type) {
                if (type == 0) {
                    curDate = preDate;
                } else if (type == 1) {
                    curDate = afterDate;
                }

                if (option.rangeMini) {
                    $('#' + (id_val || id)).find('div[name="minute_content_container"]').hide();
                    //初始化日期范围控件单击事件
                    var blnKeyUp = true;
                    var selector = 'div[class="optionbar"] > i[class*="fa-caret-up"],div[class="optionbar"] > i[class*="fa-caret-down"]';
                    $('#' + (id_val || id)).off('mousedown', selector);
                    $('#' + (id_val || id)).on('mousedown', selector, function () {
                        var blnAdd = $(this).attr('name') == 'up';
                        var kind = $(this).attr('data-kind');//范围框类h:时,m:分
                        var infoEl = $(this).parents('div[class="rangeItem"]').find('input');
                        blnKeyUp = false;

                        var setVal = function (el, blnAdd, kind) {
                            setTimeout(function () {
                                var number = el.val();
                                if (isNaN(number)) {
                                    number = '0';
                                }
                                number = Number(number);
                                var addNumber = number;
                                var delNumber = number;
                                var limitNumber = kind == 'h' ? 23 : 59;
                                addNumber = ++addNumber > limitNumber ? 0 : addNumber;
                                delNumber = --delNumber < 0 ? limitNumber : delNumber;
                                if (blnAdd) {
                                    el.val(addNumber);
                                } else {
                                    el.val(delNumber);
                                }
                                if (blnKeyUp) {
                                    return;
                                }
                                setVal(el, blnAdd, kind);
                            }, 100);
                        };

                        setVal(infoEl, blnAdd, kind);
                    });

                    $('#' + (id_val || id)).off('mouseup', selector);
                    $('#' + (id_val || id)).on('mouseup', selector, function () {
                        blnKeyUp = true;
                        if (type == 0) {
                            curDate = preDate;
                        } else if (type == 1) {
                            curDate = afterDate;
                        }
                        // 发现mouseup之后，获取的是上次的值，因此延迟200毫秒，以便获取最新的值
                        setTimeout(function () {
                            var h_El = $('#' + (id_val || id)).find('input[name="h_val"]')
                                , m_El = $('#' + (id_val || id)).find('input[name="m_val"]')
                                , s_El = $('#' + (id_val || id)).find('input[name="s_val"]');
                            curDate.setHours(h_El.val());
                            curDate.setMinutes(m_El.val());
                            curDate.setSeconds(s_El.val());
                        }, 200)
                    });

                    //设置默认值
                    var h_El = $('#' + (id_val || id)).find('input[name="h_val"]')
                        , m_El = $('#' + (id_val || id)).find('input[name="m_val"]')
                        , s_El = $('#' + (id_val || id)).find('input[name="s_val"]');
                    var calcInputNumber=function(){
                        var dataKind = $(this).attr("data-kind");
                        var limitNumber = dataKind == 'h' ? 23 : 59;
                        if(/^\d+$/.test($(this).val())){
                            var input = parseInt($(this).val());
                            if(input<0 || input > limitNumber)
                                $(this).val(0);
                        }else{
                            $(this).val(0);
                        }
                        if (type == 0) {
                            curDate = preDate;
                        } else if (type == 1) {
                            curDate = afterDate;
                        }
                        if(dataKind=='h')curDate.setHours($(this).val());
                        if(dataKind=='m')curDate.setMinutes($(this).val());
                        if(dataKind=='s')curDate.setSeconds($(this).val());
                    }
                    h_El.off("blur").on("blur",calcInputNumber);
                    m_El.off("blur").on("blur",calcInputNumber);
                    s_El.off("blur").on("blur",calcInputNumber);
                    if (!time) {
                        h_El.val('0');
                        m_El.val('0');
                        s_El.val('0');
                        return;
                    }
                    var hours = parseInt(time.split(':')[0]);
                    var minutes = parseInt(time.split(':')[1]);
                    var seconds = parseInt(time.split(':')[2]);
                    h_El.val(hours);
                    m_El.val(minutes);
                    s_El.val(seconds)
                    return;
                } else {
                    $('#' + (id_val || id)).find('div[name="range_content_container"]').hide();
                }


                //$('#' + (id_val || id)).find('.clockpicker').clockpicker({
                //    placement: 'top',
                //    align: 'left',
                //    donetext: '完成',
                //    default: time || curDate.getHours() + ':' + curDate.getMinutes() < 10
                //}).find('input').change(function () {
                //    if (this.value == '') {
                //        return;
                //    }
                //    if (type == 0) {
                //        curDate = preDate;
                //    } else if (type == 1) {
                //        curDate = afterDate;
                //    }
                //    var hours = parseInt(this.value.split(':')[0]);
                //    var minutes = parseInt(this.value.split(':')[1]);
                //    curDate.setHours(hours);
                //    curDate.setMinutes(minutes);
                //});

                //$('#' + (id_val || id)).find('input[name="clockpicker_input"]').val(time || (curDate.getHours() + ':' + curDate.getMinutes()+':'+curDate.getSeconds()));
                if (!time) {
                    return;
                }
                var hours = parseInt(time.split(':')[0]);
                var minutes = parseInt(time.split(':')[1]);
                var seconds = parseInt(time.split(':')[2]);
                curDate.setHours(hours);
                curDate.setMinutes(minutes);
                curDate.setSeconds(seconds);
            };

            //初始化事件
            var eventInit = function (id_val, type) {
                $('#' + (id_val || id)).find('i[name="month_left"],i[name="month_right"],i[name="year_left"],i[name="year_right"]').click(function () {
                    var ei = $(this), flag = ei.attr('name');
                    var innerDate = curDate;
                    if (type == 0) {
                        innerDate = preDate;
                    } else if (type == 1) {
                        innerDate = afterDate;
                    }
                    switch (flag) {
                        case 'month_left':
                            var year = innerDate.getMonth() - 1 < 0 ? innerDate.getFullYear() - 1 : innerDate.getFullYear();
                            var month = innerDate.getMonth() - 1 < 0 ? 11 : innerDate.getMonth() - 1;
                            var date = innerDate.getDate();
                            var newDate = new XDate(year, month, date);
                            init(newDate, id_val, type);
                            break;
                        case 'month_right':
                            var year = innerDate.getMonth() + 1 > 11 ? innerDate.getFullYear() + 1 : innerDate.getFullYear();
                            var month = innerDate.getMonth() + 1 > 11 ? 0 : innerDate.getMonth() + 1;
                            var date = innerDate.getDate();
                            var newDate = new XDate(year, month, date);
                            init(newDate, id_val, type);
                            break;
                        case 'year_left':
                            var year = innerDate.getFullYear() - 1;
                            ;
                            var month = innerDate.getMonth();
                            var date = innerDate.getDate();
                            var newDate = new XDate(year, month, date);
                            init(newDate, id_val, type);
                            break;
                        case 'year_right':
                            var year = innerDate.getFullYear() + 1;
                            var month = innerDate.getMonth();
                            var date = innerDate.getDate();
                            var newDate = new XDate(year, month, date);
                            init(newDate, id_val, type);
                            break;
                    }

                    setRangeHeight();
                });

                //日期项单击事件
                $('#' + (id_val || id)).on('click', '.date_item', function (e) {
                    e = e || window.event;
                    if (e.stopPropagation) { //W3C阻止冒泡方法
                        e.stopPropagation();
                    } else {
                        e.cancelBubble = true; //IE阻止冒泡方法
                    }
                    var value = $(this).attr('data-value');
                    if (type == 0) {
                        curDate = preDate;
                    } else if (type == 1) {
                        curDate = afterDate;
                    }
                    curDate.setDate(value);
                    $('#' + (id_val || id)).find('div[name="date_info"]').html(value < 10 ? '0' + value : value);
                    $('#' + (id_val || id)).find('div[name="week_info"]').html(day_map[curDate.getDay()]);
                    var txtInfo = month_map[curDate.getMonth()];
                    if (curDate.getMonth() < 10)txtInfo = "&nbsp;&nbsp;&nbsp;" + txtInfo;
                    $('#' + (id_val || id)).find('div[name="year_month"]>span[name="info"]').html(format('{0}&nbsp;&nbsp;{1}', curDate.getFullYear(), txtInfo));

                    $('#' + (id_val || id)).find('.date_item').removeClass('item_sel');
                    $(this).addClass('item_sel');

                });
            };

            //设置范围选择时两边日期控件保持高度一致
            var setRangeHeight = function () {
                var preEl = $('#' + pre_id).find('.datepicker_content'), afterEl = $('#' + after_id).find('.datepicker_content');
                preEl.css('height', 'auto');
                afterEl.css('height', 'auto');
                var maxHeight = preEl.height() > afterEl.height() ? preEl.height() : afterEl.height();
         
                preEl.height(maxHeight);
                afterEl.height(maxHeight);
            };

            //创建时期表
            var createDayTable = function (id_val, type) {
                var row_html = "<div class='row clearfix'>{0}</div>";
                var item_html = "<div class='item fadeIn {1}' data-value='{2}'>{0}</div>";
                var firstNum = firstDay;
                var curDays = XDate.getDaysInMonth(curDate.getFullYear(), curDate.getMonth());
                var cutOffMinDays=-1,cutOffMaxDays=999;

                var result = '';
                var row_reuslt = '';
                if (type == 0) {
                    curDate = preDate;
                    curDays = XDate.getDaysInMonth(curDate.getFullYear(), curDate.getMonth());
                } else if (type == 1) {
                    curDate = afterDate;
                    curDays = XDate.getDaysInMonth(curDate.getFullYear(), curDate.getMonth());
                }
           
                var curMonth=curDate.getMonth()+1,curYear=curDate.getFullYear();//当前月份值、年份值
                curMonth=curMonth<10?("0"+curMonth):(""+curMonth);
                var yearMonthPart=curYear+curMonth;
                var yearMonthPartBias=curYear+'-'+curMonth;

                for (var i = 1; i < curDays + firstNum; i++) {
                    var itemVal=i - firstNum+1;//日期项 值
                    if (itemVal <= 0) {
                        row_reuslt += format(item_html, '', 'empty');
                    } else {
                        var itemShowVal=itemVal < 10 ? ('0' +itemVal) : (''+itemVal);//日期项 显示值
                        //是否通过 可选起始日期 验证 如果不设置cutOffMinDate 默认为true
                        var cutOffMinValidate=true;
                        //是否通过 可选截止日期 验证 如果不设置cutOffMaxDate 默认为true
                        var cutOffMaxValidate=true;
                        //验证日期
                        var curValidateDate=yearMonthPart+itemShowVal;
                        var curValidateDateBias=yearMonthPartBias+'-'+itemShowVal;
 
                        //设置了 可选起始日期
                        if(option.cutOffMinDate){
                            cutOffMinValidate=validateDate(curValidateDate,option.cutOffMinDate.replace(/[-| |:]/gi, "").substr(0,8));
                        }
                        //设置了限制方法 可选截止日期
                        if(option.dateLimit){
                            cutOffMinValidate = !option.dateLimit(new Date(curValidateDateBias));
                        }

                        //设置了 可选截止日期
                        if(option.cutOffMaxDate){
                            cutOffMaxValidate=validateDate(option.cutOffMaxDate.replace(/[-| |:]/gi, "").substr(0,8),curValidateDate);
                        }
                        if(cutOffMinValidate && cutOffMaxValidate){
                            row_reuslt += format(item_html, itemShowVal, 'date_item', itemVal);
                        }else {
                            row_reuslt += format(item_html, itemShowVal, 'empty item_no_sel', itemVal);
                        }
                    }

                    if (i % 7 == 0 || i == (curDays + firstNum - 1)) {
                        result += format(row_html, row_reuslt);
                        row_reuslt = '';
                    }
                }

                $('#' + (id_val || id)).find('.datepicker_content').html('');
                $('#' + (id_val || id)).find('.datepicker_content').append(result);

            };

            
            //关闭自定义时间范围时需要做的处理
            var closeCustonDate = function () {
                if (option.defRange.length <= 0) {
                    return;
                }
                $('#' + id).css('width', 'auto');
                $('#' + pre_id).css({'display': 'none'});
                $('#' + after_id).css({'display': 'none'});
            };

            
            if (!option.range) {
                result = format(html, id, date_html, '', 'datepick_mini');
                contain.append(result);
                datePicker=contain.find(`div[id="${id}"]`);
            
                if (option.right) {
                    contain.css('postion', 'relative');
                    datePicker.css({'postion': 'absolute', 'right': '0px'});
                }
                if (option.kind == 'day') {
                    datePicker.find('div[name="minute_content_container"],div[name="range_content_container"]').hide();
                } else if (option.kind == 'month') {
                    datePicker.find('div[name="datepicker"]').css('min-height', '210px');
                    datePicker.find('div[name="datepicker"]').find('div[class="days"]').css('min-height', '50px');
                    datePicker.find('div[name="days_content_container"]').hide();
                    datePicker.find('div[name="minute_content_container"],div[name="range_content_container"]').hide();
                }

                setTimeout(function () {
                    eventInit();
                    init();
                    initTimer();
                }, 10);
            } else {
                //判断是否存在自定义标签
                if (option.defRange.length > 0) {
                    var pre_html = format(date_html, pre_id, "visibility:hidden;", "display:none;", "border-left:none !important;");
                    var after_html = format(date_html, after_id, "", "display:none;");
                    var customHtml = '<ul class="customLabel">{0}<li><button name="customDateBtn" type="button" class="btn btn-warning btn-lg btn-block">自定义</button></li></ul>';
                    var customItem = '<li><button name="defCustomDateBtn" type="button" data-value="{1}" data-type="{2}" data-zero="{3}" data-after=\'{4}\' data-before=\'{5}\'  class="btn btn-primary btn-lg btn-block">{0}</button></li>';
                    var itemsHtml = '';

                    for (var i = 0; i < option.defRange.length; i++) {
                        var currentBeginDateAdd=option.defRange[i].beginDateAdd || 0;
                        if(typeof currentBeginDateAdd ==="object"){
                            currentBeginDateAdd=JSON.stringify(currentBeginDateAdd)
                        }
                        var currentEndDateAdd=option.defRange[i].endDateAdd || 0;
                        if(typeof currentEndDateAdd ==="object"){
                            currentEndDateAdd=JSON.stringify(currentEndDateAdd)
                        }
                        itemsHtml += format(customItem, option.defRange[i].name, option.defRange[i].value, option.defRange[i].type || 'day',option.defRange[i].fromZeroClock || 'false',currentEndDateAdd,currentBeginDateAdd);
                    }
                    customHtml = format(customHtml, itemsHtml);
                    result = format(html, id, customHtml + pre_html + after_html, '', 'datepick_mini');
                } else {
                    var pre_html = format(date_html, pre_id, "display:none;", "", "border-left:none !important;");
                    var after_html = format(date_html, after_id, "", "");
                    result = format(html, id, pre_html + after_html, 'width:500px;', 'datepick_mini');
                }
                
                contain.append(result);
                datePicker=contain.find(`div[id="${id}"]`);

                if (option.right) {
                    contain.css('postion', 'relative');
                    datePicker.css({'postion': 'absolute', 'right': '0px'});
                }
                if (option.kind == 'day') {
                    datePicker.find('div[name="minute_content_container"],div[name="range_content_container"]').hide();
                } else if (option.kind == 'month') {
                    //$(this).find('div[name="datepicker"]').css('min-height','210px');
                    datePicker.find('div[name="datepicker"]').find('div[class="days"]').css('min-height', '50px');
                    datePicker.find('div[name="days_content_container"]').hide();
                    datePicker.find('div[name="minute_content_container"],div[name="range_content_container"]').hide();
                }

                var dateAddFunc=function (dateStr,dateOperator) {
                    var dateType="day",dateAdd=0;
                    if(dateStr){
                        var dateObj=eval("("+dateStr+")");
                        if(typeof dateObj==="object"){
                            dateType=dateObj.type;
                            dateAdd=dateObj.value;
                        }else if(typeof dateObj==="number"){
                            dateAdd=dateObj;
                        }
                    }
                    switch (dateType){
                        case "day":
                            dateOperator.addDays(dateAdd);
                            break;
                        case "month":
                            dateOperator.addMonths(dateAdd);
                            break
                    }
                };

                setTimeout(function () {
                    eventInit(pre_id, 0);
                    eventInit(after_id, 1);
                    init('', pre_id, 0);
                    init('', after_id, 1);
                    initTimer('', pre_id, 0);
                    initTimer('', after_id, 1);
                    //注册自定义选择日期按钮单击事件
                    $('#' + id).find('button[name="customDateBtn"]').click(function () {
                        $('#' + id).width('620px');
                        $('#' + pre_id).css({'display': 'inline-block', 'border-left': '1px solid rgb(231, 234, 236)'});
                        //$('#'+pre_id).find('.day_title').css('border-left','none');
                        $('#' + after_id).css({'display': 'inline-block'});
                        setRangeHeight();

                        // add by jyj 计算弹出方向
                        calcTopLeft($('#' + id), $(self), 2, option.right);

                        //console.log($('#'+id))
                        //var h = $('#'+id).height(),
                        //    w=$('#'+id).width(),
                        //    iptH = $(self).height(),
                        //    iptW=$(self).width(),
                        //    iptOT =  $(self).offset().top,
                        //    iptOL =  $(self).offset().left;
                        //if($(window).width()-iptOL < w){
                        //  // 左移动弹出
                        //  $(self).css('postion','relative');
                        //  $('#'+id).css({'postion':'absolute','right':'0px'});
                        //}
                        //if($(window).height()-iptOT-iptH < h){
                        //  // 向上弹出
                        //  $('#'+id).css({top:-1*h-5});
                        //}else{
                        //  $('#'+id).css({top:''});
                        //}
                        //console.log($(window).width(),iptOL , w);
                    });

                    //注册自定义日期项单击事件
                    $('#' + id).find('button[name="defCustomDateBtn"]').click(function () {
                        //edit by xyl 2017-03-01
                        var days = parseInt($(this).attr('data-value')), beforDate, afterDate,
                            dayZero=$(this).attr('data-zero'),
                            type = $(this).attr('data-type');

                        //add by xyl 2017.07.27 新增一种 清空日期数据 的类型
                        if(type=="none" && option.change){
                            option.change("","");
                            $('#' + id).hide();
                            return ;
                        }
                        if (days >= 0) {
                            switch (type) {
                                case "day":
                                    beforDate = new XDate().addDays('-' + days);
                                    break;
                                case "month":
                                    beforDate = new XDate().addMonths('-' + days);
                                    if (days == "0") {
                                        beforDate.setDate(1).setHours(0).setMinutes(0).setSeconds(0);
                                    }
                                    break;
                            }
                            if(dayZero!=='false'){
                                beforDate.setHours(0).setMinutes(0).setSeconds(0);
                            }
                            afterDate = new XDate();
                        } else {
                            switch (type) {
                                case "day":
                                    afterDate = new XDate().addDays(Math.abs(days));
                                    break;
                                case "month":
                                    afterDate = new XDate().addMonths(Math.abs(days));
                                    break;
                            }
                            if(dayZero!=='false'){
                                afterDate.setHours(0).setMinutes(0).setSeconds(0);
                            }
                            beforDate = new XDate();
                        }

                        var dateAfter=$(this).attr('data-after'),
                            dateBefore=$(this).attr('data-before');
                        dateAddFunc(dateAfter,afterDate);
                        dateAddFunc(dateBefore,beforDate);

                        // afterDate.addDays(afterDateAdd);
                        // beforDate.addDays(beforeDateAdd);
                        //if(option.afterDateAdd){
                        //    afterDate.addDays(option.afterDateAdd);
                        //}
                        //if(option.beforDateAdd){
                        //    beforDate.addDays(option.beforDateAdd);
                        //}
                        init(beforDate, pre_id, 0);
                        init(afterDate, after_id, 1);
                        //    if(type=='day'){
                        //      beforDate=new XDate().addDays('-'+days);
                        //    }
                        //    if(type=='month'){
                        //      beforDate=new XDate().addMonths('-'+days);
                        //      if(days=="0"){
                        //        beforDate.setDate(1).setHours(0).setMinutes(0).setSeconds(0) ;
                        //      }
                        //    }
                        //
                        //init(beforDate,pre_id,0);
                        //init(new XDate(),after_id,1);
                        $('#' + id).find('div[name="btn_ok"]').click();
                    });

                }, 10);
            }

            //打开日期控件函数
            var openDatePicker=function(){
                if(!$('#' + id).is(':hidden')){return;}
                blnHide = false;
                $('#' + id).show();

                var wSize={w:$(window).width(),h:$(window).height()};
                var offset=$(self).offset(); 
                var sSize={w:$('#' + id).width(),h:$('#' + id).height()};
           
                datePicker.css({
                    position:'absolute',
                    top:(sSize.h+offset.top)>wSize.h?wSize.h-sSize.h:offset.top,
                    left:(sSize.w+offset.left)>wSize.w?wSize.w-sSize.w:offset.left
                });

                
                var cur_date = new XDate();
                var default_val = $(self).find('input[type="text"]').val();
                if (default_val != '') {
                    cur_date = new XDate(default_val);
                }
                if (!option.range) {
                    init(cur_date);
                    initTimer(cur_date.getHours() + ':' + cur_date.getMinutes()+':'+cur_date.getSeconds());
                } else {
                    var pre_date = default_val == '' ? new XDate() : new XDate(default_val.split('~')[0]);
                    var after_date = default_val == '' ? new XDate() : new XDate(default_val.split('~')[1]);
                    init(pre_date, pre_id, 0);
                    init(after_date, after_id, 1);
                    initTimer(pre_date.getHours() + ':' + pre_date.getMinutes()+':'+pre_date.getSeconds(), pre_id, 0);
                    initTimer(after_date.getHours() + ':' + after_date.getMinutes()+':'+after_date.getSeconds(), after_id, 1);
                }
                // add by jyj 计算弹出方向
                //calcTopLeft($('#' + id), $(self), 1, option.right);
               setTimeout(()=>{blnHide=true;},100);
            };

            //关闭日期控件函数
            var closeDatePicker=function(){
                if (!blnHide && blnLeave == true) {
                    return;
                }
                $('#' + id).hide();
                blnHide = false;
                blnLeave = false;
                closeCustonDate();
            };

            setTimeout(function () {
                //注册元素获取焦点事件
                $(self).children('input[type="text"]').focus(openDatePicker);

                $(self).children('input[type="text"]').blur(closeDatePicker);

                $('#' + id).mouseenter(function () {
                    blnHide = false;
                    blnLeave = true;
                });
                $('#' + id).mouseleave(function () {
                    blnHide = true;
                });

                $('body').on('mouseenter', '.clockpicker-popover', function () {
                    blnHide = false;
                });

                $('body').click(function () {
                    if (!blnHide) {
                        return;
                    }
                    $('#' + id).hide();
                    blnHide = false;
                    blnLeave = false;
                    closeCustonDate();
                });

                //注册取消按钮单击事件
                $('#' + id).find('div[name="btn_cancel"]').click(function () {
                    blnHide = false;
                    blnLeave = false;
                    $('#' + id).hide();
                    closeCustonDate();
                });

                //注册完成按钮单击事件
                $('#' + id).find('div[name="btn_ok"]').click(function () {
                    blnHide = false;
                    blnLeave = false;
                    $(self).find('input[type="text"]').removeClass('empty');
                    if (!option.range) {
                        var result = curDate.toString('yyyy-MM-dd HH:mm:ss');
                        if (option.kind == 'day') {
                            result = curDate.toString('yyyy-MM-dd');
                        } else if (option.kind == 'month') {
                            result = curDate.toString('yyyy-MM');
                        }

                        $(self).find('input[type="text"]').val(result);
                        if (option.change) {
                            option.change(result);
                        }
                    } else {
                        if(cutOffMaxDateObj!=null){
                            if(preDate.valueOf()>cutOffMaxDateObj.valueOf() || afterDate.valueOf()>cutOffMaxDateObj.valueOf()){
                                _t.tipFailure('设置超出最大允许时间');
                                return;
                            }
                        }
                        if (preDate.valueOf() > afterDate.valueOf()) {
                            _t.tipFailure('开始日期不能大于结束日期!');
                            return;
                        }
                        if (option.maxDay && moment.duration(moment(afterDate.valueOf())-moment(preDate.valueOf())).asDays() > option.maxDay) {
                            _t.tipFailure("最大允许选择" + option.maxDay + "天");
                            return;
                        }
                        //var year = (afterDate.getFullYear() - preDate.getFullYear()) - 1,
                        //    month = 0;
                        //if (year < 0) {
                        //    year = 0;
                        //    month = ((afterDate.getMonth() + 1) - (preDate.getMonth() + 1)) + 1;
                        //}
                        //else {
                        //    month = afterDate.getMonth() + 1 + (12 - (preDate.getMonth()));
                        //}
                        if (option.maxMonth && moment.duration(moment(afterDate.valueOf())-moment(preDate.valueOf())).asMonths() > option.maxMonth) {
                            _t.tipFailure("最大允许选择" + option.maxMonth + "个月");
                            return;
                        }
                        // if (option.maxMonth && _commonSer.compareMonthIsBiggerCount(preDate.toString('yyyyMMdd'),afterDate.toString('yyyyMMdd'),option.maxMonth)) {
                        //     _commonSer.msg("最大允许选择" + option.maxMonth + "个月");
                        //     return;
                        // }

                        var pre_date_str = preDate.toString('yyyy-MM-dd HH:mm:ss');
                        var after_date_str = afterDate.toString('yyyy-MM-dd HH:mm:ss');
                        if (option.kind == 'day') {
                            pre_date_str = preDate.toString('yyyy-MM-dd');
                            after_date_str = afterDate.toString('yyyy-MM-dd');
                        } else if (option.kind == 'month') {
                            pre_date_str = preDate.toString('yyyy-MM');
                            after_date_str = afterDate.toString('yyyy-MM');
                        }
                        $(self).find('input[type="text"]').val(format('{0}~{1}', pre_date_str, after_date_str));
                        if (option.change) {
                            option.change(pre_date_str, after_date_str);
                        }
                    }

                    $('#' + id).hide();
                    closeCustonDate();
                });
            }, 10);

            return {openDatePicker,
                    closeDatePicker,
                    clear:()=>{
                        $(self).find('input[type="text"]').val('');
                    },
                    val:(pre,next)=>{
                        $(self).find('input[type="text"]').val(`${pre}~${next}`);
                    },
                    destroy:()=>{
                        contain.find(`div[id="${id}"]`).remove();
                    }
                }
        }
    });


})(window, $)