import React, { Component, PropTypes, } from 'react';
import { AppRegistry, StyleSheet, Text, View, WebView, Image, Dimensions } from 'react-native';

import {jqueryJs} from './jsString/jqueryJs';
import {highChartJs} from './jsString/highCharts';
import {highStockJs} from './jsString/highStock';

const win = Dimensions.get('window');
const Highcharts='Highcharts';

class ChartWeb extends Component {
    constructor(props){
      super(props);
      let init;
      init = `
          <html>
             <style media="screen" type="text/css">
             #container {
                 width:100%;
                 height:100%;
                 top:0;
                 left:0;
                 right:0;
                 bottom:0;
                 position:absolute;
             }
             </style>
             <head>`;
      init += jqueryJs;
      if(this.props.highStockFlag){
        init += highStockJs;
      }else{
        init += highChartJs;
      }
      init += `<script>
                      $(function () {
                       var outerProps =
                         `;
      let outerPropsEnd ;
      if(this.props.highStockFlag){
        outerPropsEnd = `  ;
                    $('#container').highcharts('StockChart', `;
      }else{
        outerPropsEnd = `  ;
                    $('#container').highcharts( `;
      }

        this.state={
          init,
          outerPropsEnd,
          end:`         );
                        });
                        </script>
                    </head>
                    <body>
                        <div id="container">
                        </div>
                    </body>
                </html>`,
          Wlayout:{
                height:win.height,
                width:win.width
          }
        }
    }

    re_renderWebView(e) {//re_render is used to resize on orientation of display
        this.setState({
            Wlayout: {
                height: e.nativeEvent.layout.height,
                width: e.nativeEvent.layout.width,
            }
        })
    }

    render() {
        const config = JSON.parse(JSON.stringify(this.props.config, function (key, value) {
          //create string of json but if it detects function it uses toString()
          return (typeof value === 'function') ? value.toString() : value;
        }));
      let outerProps = {empty:true};
      if(this.props.outerProps){
        outerProps = this.props.outerProps;
      }
      const outerPropsHtml = JSON.parse(JSON.stringify(outerProps, function (key, value) {
        //create string of json but if it detects function it uses toString()
        return (typeof value === 'function') ? value.toString() : value;
      }));

        const concatHTML =this.state.init + flattenObject(outerPropsHtml) + this.state.outerPropsEnd + flattenObject(config) +  this.state.end;
        //console.log(concatHTML)
        return (
            <View style={this.props.style}>
                <WebView
                    onLayout={this.re_renderWebView}
                    style={styles.full}
                    source={{ html: concatHTML, baseUrl: 'web/' }}
                    javaScriptEnabled={true}
                />
            </View>
        );
    };
};


//highchart 修正
var flattenObject = function (obj, str='{') {
    Object.keys(obj).forEach(function(key) {
        str += `${key}: ${flattenText(obj[key])}, `
    })
    return `${str.slice(0, str.length - 2)}}`
};

var flattenText = function(item) {
    var str = ''
    if (item && typeof item === 'object' && item.length == undefined) {
        str += flattenObject(item)
    } else if (item && typeof item === 'object' && item.length !== undefined) {
        str += '['
        item.forEach(function(k2) {
            str += `${flattenText(k2)}, `
        })
        str = str.slice(0, str.length - 2)
        str += ']'
    } else if(typeof item === 'string' && item.slice(0, 8) === 'function') {
        str += `${item}`
    } else if(typeof item === 'string') {
        str += `\"${item.replace(/"/g, '\\"')}\"`
    } else {
        str += `${item}`
    }
    return str
};

var styles = StyleSheet.create({
    full: {
        flex: 1,
        backgroundColor:'transparent'
    }
});

module.exports = ChartWeb;
