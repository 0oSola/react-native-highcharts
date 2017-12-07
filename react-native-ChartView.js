import React, { Component, PropTypes, } from 'react';
import { AppRegistry, StyleSheet, Text, View, WebView, Image, Dimensions } from 'react-native';

import {jqueryJs} from './jsString/jqueryJs';
import {highChartJs} from './jsString/highCharts';
import {highStockJs} from './jsString/highStock';

import MultiChart from './MultiChart';

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
                 overflow-y:hidden;
                 overflow-x:hidden;
                 ${this.props.loading?'visibility:hidden;':''}
             }
             html{
                overflow-y:hidden;
                overflow-x:hidden;
             }
             body{
                overflow-y:hidden;
                overflow-x:hidden;
             }
             </style>
             <head>
             <meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
             `;
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
        /*this.setState({
            Wlayout: {
                height: e.nativeEvent.layout.height,
                width: e.nativeEvent.layout.width,
            }
        })*/
    }

  configToAddLoading(config){
    if(this.props.loading){
      if(!config.chart){
        config.chart={};
      }
      if(!config.chart.events){
        config.chart.events = {nothing:null};//防止出现空对象，正则会出问题
      }
      if(config.chart.events.load){
        let temp = config.chart.events.load;
        config.chart.events.load = function(){
          $('#container').css('visibility','visible');
          return (temp.bind(this))(...arguments);
        }
        return config;
      }else{
        config.chart.events.load = function(){
          $('#container').css('visibility','visible');
        }
        return config;
      }
    }else{
      return config;
    }
  }

    render() {
      //for loading
      let configToAddLoading = this.configToAddLoading(this.props.config);
      let configCheckEmptyObject = checkEmptyObject(configToAddLoading);
      const config = JSON.parse(JSON.stringify(configCheckEmptyObject, function (key, value) {
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
      if(this.props.debug){
        console.log(1233,concatHTML)
      }
        return (
            <View style={this.props.style}>
              {(()=>{
                if(this.props.loading){
                  return(
                    <View style={styles.backLoading}>
                      <View style={this.props.loadingWrapperStyle?[styles.backLoadingWrapper,this.props.loadingWrapperStyle]: styles.backLoadingWrapper}>
                        <Image style={styles.loadingImage} source={require('./public/loadingData.png')} />
                      </View>
                    </View>
                  )
                }
              })()}
                <WebView
                    onLayout={this.re_renderWebView}
                    style={styles.full}
                    source={{ html: concatHTML, baseUrl: 'web/' }}
                    javaScriptEnabled={true}
                    bounces={false}
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
//防止出现空对象，正则会出问题
var checkEmptyObject=(config)=>{
  for(let i in config){
    if(Object.prototype.toString.call(config[i])=== '[object Object]'){
      let flag = false;
      for(let ii in config[i]){
        flag = true;
        config[i] = checkEmptyObject(config[i]);
        break;
      }
      if(!flag){
        config[i] = {nothing:null};
      }
    }
  }
  return config;
};

var styles = StyleSheet.create({
  full: {
    width:'100%',
    height:'100%',
    backgroundColor:'transparent'
  },
  backLoading:{
    position:'absolute',
    left:0,
    top:0,
    width:'100%',
    height:'100%',
    alignItems:'center',
    justifyContent:'center'
  },
  backLoadingWrapper:{
    width:'100%',
    height:'100%',
    backgroundColor:'rgb(246,246,246)',
    alignItems:'center',
    justifyContent:'center'
  },
  loadingImage:{
    resizeMode:'contain',
    width:100,
    height:100,
  }
});
ChartWeb.MultiChart = MultiChart;

module.exports = ChartWeb;
