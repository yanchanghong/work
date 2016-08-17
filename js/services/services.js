define(['angular'], function(angular) {
	'use strict';
	var services = angular.module('services', ['ngResource']);
	var injectParams = ['$http', '$rootScope', '$location','growl'];

	var authFactory = function($http, $rootScope, $location,growl) {
		var params = getUrlParams();
		var token = params["token"];
		var version = params["version"]?params["version"]:"V2";
    var serviceBaseV7 = 'http://123.56.150.95:18080/';
//		var serviceBase =serviceBaseV7; //95测试用
		var serviceBase = '/';//部署用

		var	factory = {version:version};
		factory.get = function(service, method, param, callBack, err, urmp) {
			if (!angular.isString(param)) {
				param = angular.copy(param);
				convertDateToString(param);
				param = JSON.stringify(param);
			}
			var route = "JettyHost/api/rest/post/";
			
			var url =  serviceBase + route + service + "/" + method;

			if (token != null) {
				url += "?token=" + token;
			}
			var callToken = $http.post(url, param);
//			if (callBack != null) {
//
//				callToken.success(callBack);
//			}
			callToken.success(function(e) {
				if (callBack != null) {
					if (e.code == 0) {
						callBack(e);
					}	
					else {
						callBack(e);
						if (e.message.search("需要用户登录才能使用") >-1) {
							location.href = e.data;
						} else if (e.code > 9999){
							growl.info(e.message, {});
						} else {
							growl.error("错误编码"+e.code+":"+e.message, {});
						}
					}
				}
			});
			callToken.error(function(data, status, headers, config) { 	
				var err = "";
				if (status == -1)
					err = "(HTTP status:"+status+")互联网连接已中断";
				else 
					err = "网络链接异常，请刷新界面再试";
				growl.error(err, {});	
			});
			return callToken;
		};
		var d = new Date();
		var gmtMilliseconds = d.getTimezoneOffset() * 60 * 1000;

		function convertDateToString(input) {
			// Ignore things that aren't objects.
			if (typeof input !== "object") return input;

			for (var key in input) {
				if (!input.hasOwnProperty(key)) continue;

				var value = input[key];

				if (angular.isDate(value)) {
					value.setMilliseconds(value.getMilliseconds() - gmtMilliseconds);
					input[key] = value.toJSON();
				} else if (typeof value === "object") {
					convertDateToString(value);
				}

			}
		}

		function getUrlParams() {
			var url = location.search; //获取url中"?"符后的字串
			var theRequest = new Object();
			if (url.indexOf("?") != -1) {
				var str = url.substr(1);
				var strs = str.split("&");
				for (var i = 0; i < strs.length; i++) {
					theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
				}
			}
			return theRequest;
		}
		return factory;
	};

	authFactory.$inject = injectParams;

	services.factory('serviceProxy', authFactory);

	return services;
});