/**
 * Created by Chen Haowen on 2017/12/7.
 */
'use strict';
import React, {Component, PropTypes} from 'react';
import {AppRegistry, StyleSheet, Text, View, WebView, Image, Dimensions, PixelRatio, Platform} from 'react-native';

import {jqueryJs} from './jsString/jqueryJs';
import {highChartJs} from './jsString/highCharts';
import {highStockJs} from './jsString/highStock';

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
const DesignWidth = 750;
const DesignHeight = 1334;
const PxScale = DesignWidth / DeviceWidth;
const PxScaleY = DesignHeight / DeviceHeight;
const win = Dimensions.get('window');
const Highcharts = 'Highcharts';
const platform = Platform.OS;

function getAdjustPx(px) {
    return PixelRatio.roundToNearestPixel(px) / PxScale;
}

function getYAdjustPx(px) {
    return PixelRatio.roundToNearestPixel(px) / PxScaleY;
}

export default class ChartWeb extends Component {
    constructor(props) {
        super(props);
        let init;
        init = `
          <!DOCTYPE html>
          <html>
             <style media="screen" type="text/css">
             .container {
               padding: ${getAdjustPx(30)}px ${getAdjustPx(25)}px 0;
               overflow-y:hidden;
               overflow-x:hidden;
               position: relative;
             }
             .container.seperate {
               border-bottom: ${getAdjustPx(20)}px solid rgb(236,237,238);
             }
             .tab-title {
               margin-bottom: ${getAdjustPx(50)}px;
               height: ${getAdjustPx(30)}px;
               line-height: ${getAdjustPx(30)}px;
               overflow: hidden;
             }
             .tab-border {
               display: inline-block;
               background-color: #0085ff;
               width: ${getAdjustPx(8)}px;
               height: 100%;
               margin-right: ${getAdjustPx(8)}px;
               float: left;
             }
             .tab-text {
               display: inline-block;
               height: 100%;
               font-size: ${getAdjustPx(30)}px;
               clear: left;
             }
             .text-center {
               text-align: center;
             }
             .title {
               font-size: ${getAdjustPx(30)}px;
               height: ${getAdjustPx(30)}px;
               margin-bottom: ${getAdjustPx(15)}px;
             }
             .title-number {
               color: #0085ff;
               margin-left: ${getAdjustPx(10)}px;
             }
             .sub-title {
               font-size: ${getAdjustPx(20)}px;
             }
             .legend {
               margin-bottom: ${getAdjustPx(15)}px;
               font-size: ${getAdjustPx(20)}px;
               height: ${getAdjustPx(20)}px;
               color: #888;
               text-align: center;
             }
             .legend-label {
               margin-right: ${getAdjustPx(10)}px;
               display: inline-block;
               border: ${getAdjustPx(10)}px solid;
               border-radius: 50%;
             }
             .legend-label.green {
               border-color: #45d6ac;
               box-shadow: 0 0 10px rgba(69,214,172,0.5);
             }
             .legend-label.blue {
               border-color: #0085ff;
               box-shadow: 0 0 10px rgba(0,133,255,0.5);
             }
             .legend-label.deepBlue {
               border-color: #004a98;
               box-shadow: 0 0 10px rgba(0,74,152,0.5);
             }
             .legend-label.purple {
               border-color: #9b5eed;
               box-shadow: 0 0 10px rgba(155,94,237,0.5);
             }
             .legend-name~.legend-label {
               margin-left: ${getAdjustPx(30)}px;
             }
             .chart {
               width: 100%;
               height: ${getAdjustPx(480)}px;
               margin-bottom: ${getAdjustPx(20)}px;
             }
             .loading {
               position: absolute;
               top: 0;
               bottom: 0;
               left: 0;
               right: 0;
               background-color: #fff;
               z-index: 1;
             }
             .loading:before {
               content: '加载中';
               display: block;
               position: absolute;
               left: 50%;
               top: 50%;
               width: 50%;
               transform: translateY(-50%);
               margin-left: -25%;
               color: #999;
             }
             body{
                overflow-x:hidden;
                margin: 0;
                padding: 0;
             }
             </style>
             <head>
             <meta charset="utf-8">
             <meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
             `;
        init += jqueryJs;
        if (this.props.highStockFlag) {
            init += highStockJs;
        } else {
            init += highChartJs;
        }
        init += `<script>
                      $(function () {
                        window.location.hash = 1;
                        document.title = document.body.scrollHeight;

               function awaitPostMessage() {//修复postmessage
                 var isReactNativePostMessageReady = !!window.originalPostMessage;
                 var queue = [];
                 var currentPostMessageFn = function store(message) {
                   if (queue.length > 100) queue.shift();
                   queue.push(message);
                 };

                 if (!isReactNativePostMessageReady) {
                   var originalPostMessage = window.postMessage;
                   Object.defineProperty(window, 'postMessage', {
                     configurable: true,
                     enumerable: true,
                     get: function () {
                       return currentPostMessageFn;
                     },
                     set: function (fn) {
                       currentPostMessageFn = fn;
                       isReactNativePostMessageReady = true;
                       setTimeout(sendQueue, 0);
                     }
                   });
                   window.postMessage.toString = function () {
                     return String(originalPostMessage);
                   };
                 }

                 function sendQueue() {
                   while (queue.length > 0) window.postMessage(queue.shift());
                 }
               };
                awaitPostMessage(); //修复postmessage

                window.postMessage(document.body.clientHeight.toString());


//                window.location.hash = '#myHeight#' + document.body.clientHeight;

                var outerProps =
            `;
        let outerPropsEnd = ';';

        let chartEnd = ` );`;
        this.state = {
            height: this.props.height ? this.props.height : DeviceHeight,
            init,
            outerPropsEnd,
            chartEnd,
            headEnd: `
                        });
                        </script>
                    </head>
                    <body>
               `,
            end: `
                    </body>
                </html>
              `,
            Wlayout: {
                height: win.height,
                width: win.width
            }
        }
        this.outerProps = {empty: true}
    }

    // 启动 highCharts
    getChartStart(i) {
        let chartStart;

        if (this.props.highStockFlag) {
            chartStart = `  ;
                    $('#chartContainer${(i === 0 || i) ? i.toString() : ''}').highcharts('StockChart', `;
        } else {
            chartStart = `  ;
                    $('#chartContainer${(i === 0 || i) ? i.toString() : ''}').highcharts( `;
        }
        return chartStart
    }

    // 拼接一个 highCharts 单元
    getOneChartsBody(config, index) {
        let containerHtml = `<div class='container ${config.containerMarginBottom ? 'seperate' : ''}'>`
        // tabTitle
        if (config.tabTitle) {
            containerHtml += `
        <div class="tab-title">
          <span style="${config.tabTitle.borderColor ? 'background-color:' + config.tabTitle.borderColor + ';' : ''}" class="tab-border"></span>
          <span class="tab-text">${config.tabTitle.text}</span>
        </div>
      `;
        }
        // chart-wrapper
        containerHtml += `<div class="chart-wrapper text-center">`;
        // title
        if (config.title) {
            containerHtml += `
        <div class="title">${config.title.text}
      `;
            if (config.title.subTitle) {
                containerHtml += `
        <span class="sub-title">${config.title.subTitle}</span>
      `;
            }
            if (config.title.titleNum) {
                containerHtml += `
        <span class="title-number">${config.title.titleNum}</span>
      `;
            }
            containerHtml += '</div>';
        }
        // legends
        if (config.legend) {
            containerHtml += `<div class="legend">`;

            config.legend.forEach(item => {
                containerHtml += `
          <span class="legend-label ${item.legendColor ? item.legendColor : ''}"></span>
          <span class="legend-name">${item.text}</span>
        `;
            })
            containerHtml += `</div>`;
        }
        // highCharts
        containerHtml += `
      <div style="position: relative;">
        <div id="loading${index}" class="loading"></div>
        <div id="chartContainer${index}" class="chart" style="${config.chart ? 'height:' + getAdjustPx(config.chart.height) + 'px' : ''}"></div>
      </div>
      `;
        // chart-footer
        if (config.footer) {
            containerHtml += `<div class="chart-footer"></div>`;
        }
        // end chart-wrapper and container tag
        containerHtml += `</div></div>`;

        return containerHtml;
    }

    configToAddLoading(config, index) {
        if (!config.chart) {
            config.chart = {};
        }
        if (!config.chart.events) {
            config.chart.events = {nothing: null};//防止出现空对象，正则会出问题
        }
        if (config.chart.events.load) {
            this.outerProps[`originLoadFunc${index}`] = config.chart.events.load

            eval(`config.chart.events.load = function () {
        $('#loading${index.toString()}').css('display', 'none');
        return (outerProps.originLoadFunc${index.toString()}.bind(this))(...arguments);
      }`)
        } else {
            eval(`config.chart.events.load = function () {
        $('#loading${index.toString()}').css('display', 'none');
      }`)
        }
        return config;
    }

    re_renderWebView(e) {//re_render is used to resize on orientation of display
        /*this.setState({
         Wlayout: {
         height: e.nativeEvent.layout.height,
         width: e.nativeEvent.layout.width,
         }
         })*/
    }

    render() {
        let chartHtml = '';
        let configArray = JSON.parse(JSON.stringify(this.props.config, function (key, value) {
            //create string of json but if it detects function it uses toString()
            return (typeof value === 'function') ? value.toString() : value;
        }));
        if (!isArray(configArray)) {
            configArray = [configArray];
        }

        // html body 主题字符串拼接
        let htmlBody = '';
        configArray.forEach((k, i) => {
            htmlBody += this.getOneChartsBody(k.customConfig, i);
        })

        // outerProps 字符串拼接
        if (this.props.outerProps) {
            this.outerProps = JSON.parse(JSON.stringify(this.props.outerProps, function (key, value) {
                //create string of json but if it detects function it uses toString()
                return (typeof value === 'function') ? value.toString() : value;
            }));
        }

        // highCharts 启动函数字符串拼接
        configArray.forEach((k, i) => {
            //for loading
            let configToAddLoading = this.configToAddLoading(k.highChartsConfig, i)

            let configCheckEmptyObject = checkEmptyObject(configToAddLoading);
            let config = JSON.parse(JSON.stringify(configCheckEmptyObject, function (key, value) {
                //create string of json but if it detects function it uses toString()
                return (typeof value === 'function') ? value.toString() : value;
            }));
            chartHtml += this.getChartStart(i) + flattenObject(config) + this.state.chartEnd;
        });

        const outerPropsHtml = JSON.parse(JSON.stringify(this.outerProps, function (key, value) {
            //create string of json but if it detects function it uses toString()
            return (typeof value === 'function') ? value.toString() : value;
        }));

        // webView html content
        const concatHTML = this.state.init + flattenObject(outerPropsHtml) + this.state.outerPropsEnd + chartHtml +
            this.state.headEnd + htmlBody + this.state.end;

        if (this.props.debug) {
            console.log(1233, concatHTML)
        }

        return (
            <View style={{height: Math.max(this.state.height, DeviceHeight)}}>
                <WebView
                    bounces={false}
                    automaticallyAdjustContentInsets={false}
                    onLayout={this.re_renderWebView}
                    style={styles.full}
                    onMessage={(e) => {
                        if (!this.props.height) {
                            let height = e.nativeEvent.data / 1 + 10;
                            this.setState({
                                height: height
                            });
                        }
                    }}
                    source={{html: concatHTML, baseUrl: 'web/'}}
                    javaScriptEnabled={true}
                />
            </View>
        );
    };
}

var isArray = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

// highCharts 修正
var flattenObject = function (obj, str = '{') {
    Object.keys(obj).forEach(function (key) {
        str += `${key}: ${flattenText(obj[key])}, `
    })
    return `${str.slice(0, str.length - 2)}}`
};

var flattenText = function (item) {
    var str = ''
    if (item && typeof item === 'object' && item.length == undefined) {
        str += flattenObject(item)
    } else if (item && typeof item === 'object' && item.length !== undefined) {
        str += '['
        item.forEach(function (k2) {
            str += `${flattenText(k2)}, `
        })
        str = str.slice(0, str.length - 2)
        str += ']'
    } else if (typeof item === 'string' && item.slice(0, 8) === 'function') {
        str += `${item}`
    } else if (typeof item === 'string') {
        str += `\"${item.replace(/"/g, '\\"')}\"`
    } else {
        str += `${item}`
    }
    return str
};
//防止出现空对象，正则会出问题
var checkEmptyObject = (config) => {
    for (let i in config) {
        if (Object.prototype.toString.call(config[i]) === '[object Object]') {
            let flag = false;
            for (let ii in config[i]) {
                flag = true;
                config[i] = checkEmptyObject(config[i]);
                break;
            }
            if (!flag) {
                config[i] = {nothing: null};
            }
        }
    }
    return config;
};

var styles = StyleSheet.create({
    full: {
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent'
    },
    backLoading: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    backLoadingWrapper: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgb(246,246,246)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    loadingImage: {
        resizeMode: 'contain',
        width: 100,
        height: 100,
    }
});

module.exports = ChartWeb;
