define(['directives/directives', 'echarts', 'bmap', 'macarons'], function(directives, echarts, bmap, macarons) {
  'use strict';
  directives.directive('echarts3Dom', function($timeout) {
    return {
      restrict: 'AE',
      controller: ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
          var myChart;
          var domMain = $element[0];
          var curTheme = 'macarons';
          var option = "";

          function initEcharts() {
            if (!myChart)
              myChart = echarts.init(domMain, curTheme);
		      /* myChart.on('click', function (params) {
                  console.info("click:" +params.name);
				  var name = params.name.substr(0,4);
				  window.location.href="#/showpoint/"+name;
				});*/
            myChart.setOption(option);
            $(window).resize(function(){
              myChart.resize();    
            });  
          }
          /**
           * 监听Echart数据初始化
           */
          $scope.$on(Event.ECHARTINFOSINIT, function(event, args) {
            if (args.name == $attrs.name) {
              option = args.option;
              initEcharts();
            }
          });
          /**
           * 监听Echart数据变化
           */
          $scope.$on('OptionStatusChange', function(event, args) {
            console.info("接收数据显示");
          });

        }
      ]
    }
  });
  directives.directive('slimScroll', function($timeout, $parse) {
    return {
      restrict: 'A',
      link: function(scope, iElem, iAttr) {
        $timeout(function() {
          iElem.slimScroll({
            height: iAttr.height ? iAttr.height : '100%', //可滚动区域高度
          });
        })
      }
    };
  });
});