define([ 'services/services' ], function(services) {
	'use strict';
	services.factory('demoService', [
			'$http',
			'$rootScope',
			'serviceProxy',
			'$q',
			function($http, $rootScope, serviceProxy, $q) {
				var serviceName = 'demoService';
				var factory = {
					loginPath : '/login',
					user : {
						isAuthenticated : false,
						roles : null
					},
					result : {}
				};

				factory.login = function(account, password) {
					serviceProxy.get(serviceName, 'login',
							[ account, password ], function(result) {
								if (result != null && result != ""
										&& result.code == 0 && result.data) {
									var Days = 1; // 此 cookie 将被保存 30 天
									var exp = new Date(); // new
															// Date("December
															// 31, 9998");
									exp.setTime(exp.getTime() + Days * 24 * 60
											* 60 * 1000);
									document.cookie = "name=admin;expires="
											+ exp.toGMTString();
									// document.cookie =
									// "name=value;expires=date";
									factory.user.userName = result.data;
									factory.user.isAuthenticated = true;
									changeAuth(true);
								} else {
									factory.result = result;
									changeAuth(false);
								}
							});
				};

				factory.logout = function() {
					serviceProxy.get(serviceName, 'logout', null,
							function(result) {
								if (result != null && result != ""
										&& result.code == 0) {
									var exp = new Date();
									exp.setTime(exp.getTime() - 1);
									document.cookie = "name=admin;expires="
											+ exp.toGMTString();
									// document.cookie = "";
									factory.user = {};
									factory.user.isAuthenticated = false;
									changeAuth(false);
								}
							});
				};
				factory.getMessages = function(callBack) {
					serviceProxy.get(serviceName, "getMessages", [], callBack);
				};

				factory.getConfig = function(callBack) {
					serviceProxy.get(serviceName, "getConfig", [], callBack);
				};

				factory.getSysParameter= function(callBack) {
					serviceProxy.get(serviceName, "getSysParameter", [], callBack);
				};
				
				factory.saveConfig = function(formdata, callBack) {
					serviceProxy.get(serviceName, 'saveConfig', [ formdata ],
							callBack);
				};
				
				factory.upateNGDeviceTime = function(nowtime, callBack) {
					serviceProxy.get(serviceName, 'upateNGDeviceTime', [ nowtime ],
							callBack);
				};
				factory.updatepwd = function(oldpwd, newpwd,callBack) {
					serviceProxy.get(serviceName, 'updatepwd', [oldpwd , newpwd],
							callBack);
				};
				factory.saveSerialPort = function(nodeId,qiandaofuNum, qiandaofu,startNum,startByte,datatype,callBack) {
					serviceProxy.get(serviceName, 'saveSerialPort', [nodeId,qiandaofuNum , qiandaofu,startNum,startByte,datatype],
							callBack);
				};
				factory.saveModBus = function(nodeId,address, funcCode,startAddr,readNum,datatype,suanfa,callBack) {
					serviceProxy.get(serviceName, 'saveModBus', [nodeId,address , funcCode,startAddr,readNum,datatype,suanfa],
							callBack);
				};
				factory.updateModBus = function(sensorid,nodeId,address, funcCode,startAddr,readNum,datatype,callBack) {
					serviceProxy.get(serviceName, 'updateModBus', [sensorid,nodeId,address , funcCode,startAddr,readNum,datatype],
							callBack);
				};
				factory.delModBus = function(sensorid,nodeId,callBack) {
					serviceProxy.get(serviceName, 'delModBus', [sensorid,nodeId],
							callBack);
				};
				factory.saveIoFunc = function(nodeId,iovalue, funcvalue,datatype,callBack) {
					serviceProxy.get(serviceName, 'saveIoFunc', [nodeId,iovalue , funcvalue,datatype],
							callBack);
				};
				factory.getModBusList = function(nodeId,callBack) {
					serviceProxy.get(serviceName, "getModBusList", [nodeId], callBack);
				};
				factory.getNodeAllConfig = function(nodeId,callBack) {
					serviceProxy.get(serviceName, "getNodeAllConfig", [nodeId], callBack);
				};
				function changeAuth(loggedIn) {
					factory.user.auth = {};
					factory.user.isAuthenticated = loggedIn;
					$rootScope.$broadcast('loginStatusChanged', loggedIn);
				}
				return factory;
			} ]);
});