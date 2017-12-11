/**
 * Created by Chen Haowen on 2017/12/7.
 */
'use strict';
import React, {Component, PropTypes} from 'react';
import {AppRegistry, StyleSheet, Text, View, WebView, Image, Dimensions ,PixelRatio, Platform} from 'react-native';

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
             }
             .container.seperate {
               border-bottom: ${getAdjustPx(20)}px solid rgb(236,237,238);
             }
             .tab-title {
               border-left: ${getAdjustPx(8)}px solid #0085ff;
               padding-left: ${getAdjustPx(10)}px;
               margin-bottom: ${getAdjustPx(50)}px;
               font-size: ${getAdjustPx(30)}px;
               height: ${getAdjustPx(30)}px;
             }
             .tab-title > span {
               display: inline-block;
               line-height: ${getAdjustPx(30)}px;
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
             .legend-img {
               width: ${getAdjustPx(20)}px;
               height: ${getAdjustPx(20)}px;
               margin-right: ${getAdjustPx(10)}px;
               display: inline-block;
             }
             .legend-name~.legend-img {
               margin-left: ${getAdjustPx(30)}px;
             }
             .chart {
               width: 100%;
               height: ${getAdjustPx(480)}px;
               margin-bottom: ${getAdjustPx(20)}px;
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

                        var outerProps =
                         `;
    let outerPropsEnd = ';';

    let chartEnd = ` );`;
    this.state = {
      height: DeviceHeight,
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
        <div class="tab-title" style="${config.tabTitle.borderColor?'border-left-color:'+config.tabTitle.borderColor+';':''}">
          <span>${config.tabTitle.text}</span>
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
          <img class="legend-img" src="${item.imgSrc}" />
          <span class="legend-name">${item.text}</span>
        `;
      })
      containerHtml += `</div>`;
    }
    // highCharts
    containerHtml += `<div id="chartContainer${index}" class="chart" style="${config.chart?'height:'+getAdjustPx(config.chart.height)+'px':''}"></div>`;
    // chart-footer
    if (config.footer) {
      containerHtml += `<div class="chart-footer"></div>`;
    }
    // end chart-wrapper and container tag
    containerHtml += `</div></div>`;

    return containerHtml;
  }

  re_renderWebView(e) {//re_render is used to resize on orientation of display
    /*this.setState({
     Wlayout: {
     height: e.nativeEvent.layout.height,
     width: e.nativeEvent.layout.width,
     }
     })*/
  }

  // highCharts loading
  // configToAddLoading(config) {
  //   if (this.props.loading) {
  //     if (!config.chart) {
  //       config.chart = {};
  //     }
  //     if (!config.chart.events) {
  //       config.chart.events = {nothing: null};//防止出现空对象，正则会出问题
  //     }
  //     if (config.chart.events.load) {
  //       let temp = config.chart.events.load;
  //       config.chart.events.load = function () {
  //         $('.container').css('visibility', 'visible');
  //         return (temp.bind(this))(...arguments);
  //       }
  //       return config;
  //     } else {
  //       config.chart.events.load = function () {
  //         $('.container').css('visibility', 'visible');
  //       }
  //       return config;
  //     }
  //   } else {
  //     return config;
  //   }
  // }

  render() {

    // highCharts 启动函数字符串拼接
    let chartHtml = '';
    let configArray = this.props.config;
    if (!isArray(this.props.config)) {
      configArray = [this.props.config];
    }
    configArray.forEach((k, i)=> {
      //for loading
      let configCheckEmptyObject = checkEmptyObject(k.highChartsConfig);
      const config = JSON.parse(JSON.stringify(configCheckEmptyObject, function (key, value) {
        //create string of json but if it detects function it uses toString()
        return (typeof value === 'function') ? value.toString() : value;
      }));
      chartHtml += this.getChartStart(i) + flattenObject(config) + this.state.chartEnd;
    });

    // outerProps 字符串拼接
    let outerProps = {empty: true};
    if (this.props.outerProps) {
      outerProps = this.props.outerProps;
    }
    const outerPropsHtml = JSON.parse(JSON.stringify(outerProps, function (key, value) {
      //create string of json but if it detects function it uses toString()
      return (typeof value === 'function') ? value.toString() : value;
    }));

    // html body 主题字符串拼接
    let htmlBody = '';
    configArray.forEach((k, i) => {
      htmlBody += this.getOneChartsBody(k.customConfig, i);
    })

    // webView html content
    const concatHTML = this.state.init + flattenObject(outerPropsHtml) + this.state.outerPropsEnd + chartHtml +
      this.state.headEnd + htmlBody + this.state.end;

    if (this.props.debug) {
      console.log(1233, concatHTML)
    }

    return (
      <View style={{height:Math.max(this.state.height, DeviceHeight)}}>
        <WebView
          bounces={false}
          automaticallyAdjustContentInsets={false}
          onLayout={this.re_renderWebView}
          style={styles.full}
          onNavigationStateChange={(title)=>{
            if(title.title && !isNaN(title.title)) {
              this.setState({
                height:(parseInt(title.title))
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
var checkEmptyObject = (config)=> {
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
