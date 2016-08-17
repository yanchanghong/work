define(['services/services'], function(services) {
	'use strict';
  services.service('SwSocket', ['$timeout','growl',
    function($timeout,growl) {
      var self = this;
      var callbackPool = []; //onMessage分类处理函数  
      var delayPool = []; //延迟处理请求  
      var registerPool = []; //已注册的方法  
      var data = {};
      var ws = null;

      function newWebSocket() {
//        var wsURL = "ws://123.56.150.95:48080/websocket/message";
//        var wsURL = "ws://180.76.180.132:80/websocket/message";
//        var wsURL = "ws://182.92.172.119:48080/websocket/message";
        var wsURL = "ws://123.56.150.95:18080/JettyHost/websocket/message"
        var protocol="ws:";
        if(window.location.protocol=="https:"){
          protocol="wss:"
        }
        if (window.location.host) {
            wsURL = protocol+"//"+window.location.host+"/JettyHost/websocket/message" //如果本地测试请注销
        }
        
        var wsTmp = new WebSocket(wsURL);
        wsTmp.onopen = function(evnt) {
          onOpen(evnt)
        };
        wsTmp.onmessage = function(evnt) {
          onMessage(evnt)
        };
        wsTmp.onclose = function(evnt) {
          onclose(evnt)
        };
        wsTmp.onerror = function(evnt) {
          onError(evnt)
        };
        return wsTmp;
      }
      ws = newWebSocket();
      function onOpen() {
        //缓存池中存在请求  
        while (delayPool.length > 0) {

          var popData = delayPool.shift();
          if (popData.isReg == 1) {
            self.register(popData.uuid, popData.operation, popData.callbackFuns);
          } else if (popData.isReg == 0) {
            self.unRegister(popData.uuid);
          } else {
            self.send(popData.uuid, popData.operation, popData.type,popData.param);
          }
        }
      }

      function onclose() {
        console.info(ws.state);
		console.info("websocket已经关闭");
        growl.success("websocket已经关闭",{})
        /*是否重新链接*/
        $timeout(function() {
          newWebSocket();
        },10000);
        
      }

      function onMessage(evnt) {
        //这里处理接收数据  
        var evenData = JSON.parse(evnt.data);
        angular.forEach(callbackPool, function(value) {
          if (value.uuid === evenData.uuid) {
            value.callback(evenData);
          }
        });
      }

      function onError(evnt) {
        console.info(ws.state);
        /*是否重新链接
        $timeout(function() {
          newWebSocket();
        }, 3000);
        */
      }

      //注册方法
      //注册成功后会一直监听后端推送的相应部分的数据  
      //直到注销此方法  
      self.register = function(uuid, operation, callbackFuns) {
        var webSocketRe = {};
        webSocketRe.operation = 'register';
        webSocketRe.uuid = 'register';
        webSocketRe.param = {
          uuid: uuid,
          operation: operation
        };

        if (ws.readyState != true) { //websocket服务未打开  
          webSocketRe.isReg = 1; //register  
          webSocketRe.operation = operation;
          webSocketRe.uuid = uuid;
          webSocketRe.callbackFuns = callbackFuns;
          delayPool.push(webSocketRe);
          return "sending is delay.";
        } else {
          callbackPool.push({
            uuid: uuid,
            operation: operation,
            callback: callbackFuns
          });
        }
      }

      //注销方法  
      //通知后端不再推送相应数据  
      self.unregister = function(uuid) {

        var webSocketRe = {};
        webSocketRe.operation = 'unRegister';
        webSocketRe.uuid = uuid;

        //websocket服务未开启  
        if (ws.readyState != true) {
          delayPool.push(webSocketRe); //  

          return "unregister is delay.";
        } else {

          var num = 0;

          //循环检查回调函数池  
          angular.forEach(callbackPool, function(value, key) {
            if (value.uuid === uuid) {
              num += 1;
              delete callbackPool[key];
              num -= 1;
            }
          });

          //回调函数池中已经不存在此方法才真正发送websocket请求  
          //通知后端不再推送相应数据  
          if (num === 0) {
            doSend(webSocketRe);
          }
        }
      }

      //实际发送websocket请求  
      function doSend(webSocketVo) {
        return ws.send(JSON.stringify(webSocketVo));
      }

      self.send = function(uuid, operation, type, param) {
        var webSocketVo = {};
        webSocketVo.operation = operation;
        webSocketVo.uuid = uuid;
        webSocketVo.type = type;
        webSocketVo.param = param;
        if (ws.readyState == 0) {
          // webSocketVo.isReg = false;//不需要注册  
          delayPool.push(webSocketVo);
          return "sending is delay.";
        } else {
          return doSend(webSocketVo);
        }
      }
      return self;
    }
  ]);
});