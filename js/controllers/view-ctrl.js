define(
		[ 'controllers/controllers', 'bootstrap-dialog', 'services/services' ],
		function(controllers, BootstrapDialog) {
			'use strict';
			controllers
					.controller(
							'ViewForceCtrl',
							[
									'$scope',
									'$rootScope',
									'$routeParams',
									'$timeout',
									'SwSocket',
									'demoService',
									function($scope, $rootScope, $routeParams,
											$timeout, SwSocket, demoService) {
										// 获取pc端的时间
										var pc_time = new Date();
										function add0(m) {
											return m < 10 ? '0' + m : m
										}
										function format(shijianchuo) {
											// shijianchuo是整数，否则要parseInt转换
											var time = new Date(shijianchuo);
											var y = time.getFullYear();
											var m = time.getMonth() + 1;
											var d = time.getDate() + 1;
											var h = time.getHours();
											var mm = time.getMinutes() + 1;
											var s = time.getSeconds() + 1;
											return y + '-' + add0(m) + '-'
													+ add0(d) + ' ' + add0(h)
													+ ':' + add0(mm) + ':'
													+ add0(s);
										}
										function checkIP(netip) {
											var exp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
											var reg = netip.match(exp);
											if (reg == null) {
												return false;
											} else {
												return true;
											}
										}
										$scope.pc_time = format(pc_time);
										// 时间设置中是否显示
										$scope.isshow = false;
										$scope.isshowtime = function() {
											console.log($scope.isshow);
											$scope.isshow = !$scope.isshow;
										};
										// 修改密码
										$scope.updatepwd = function() {
											// console.log($scope.nowpwd);
											if ($scope.nowpwd == undefined
													|| $scope.newpwd == undefined
													|| $scope.confirmpwd == undefined) {
												BootstrapDialog.show({
													title : '通知消息',
													message : '请务必填写相关字段!'
												});
												return;
											}
											if ($scope.newpwd != $scope.confirmpwd) {
												BootstrapDialog.show({
													title : '通知消息',
													message : '新密码与确认密码不一致'
												});
												return;
											} else {
												// 后台取修改密码
												demoService
														.updatepwd(
																$scope.nowpwd,
																$scope.newpwd,
																function(
																		returnObj) {
																	// console.log(returnObj.data);
																	if (returnObj.data == 'success') {
																		BootstrapDialog
																				.show({
																					title : '通知消息',
																					closable : false,
																					message : '密码设置成功,请重新登陆',
																					buttons : [ {
																						label : '关闭',
																						action : function(
																								dialogRef) {
																							dialogRef
																									.close();
																							demoService
																									.logout();
																						}
																					} ]
																				});

																	} else if (returnObj.data == 'valid') {
																		BootstrapDialog
																				.show({
																					title : '通知消息',
																					message : '原密码输入错误!'
																				});
																	} else {
																		BootstrapDialog
																				.show({
																					title : '通知消息',
																					message : '密码设置失败!'
																				});
																	}
																});
											}
										}
										// 设置网络
										$scope.setnetwork = function() {
											// console.log($scope.netip);
											// 判断是否是ip，否则返回错误
											if ($scope.netip == undefined
													|| $scope.netyanma == undefined
													|| $scope.netgateway == undefined) {
												BootstrapDialog.show({
													title : '通知消息',
													message : '请务必填写相关字段!'
												});
												return;
											}
											var isip = checkIP($scope.netip);
											var isziwang = checkIP($scope.netyanma);
											var netgateway = checkIP($scope.netgateway);
											if (!isip) {
												BootstrapDialog
														.show({
															title : '通知消息',
															message : '请输入正确IP或子网掩码或网关地址'
														});
											} else if (!isziwang) {
												BootstrapDialog
														.show({
															title : '通知消息',
															message : '请输入正确IP或子网掩码或网关地址'
														});
											} else if (!netgateway) {
												BootstrapDialog
														.show({
															title : '通知消息',
															message : '请输入正确IP或子网掩码或网关地址'
														});
											} else {
												// 成功
											}
										};
										$scope.setTime = function() {
											// 判断是否是与pc相同设置时间
											if (!$scope.isshow) {
												var tongbu_time = new Date();
												// var nw_time =
												// format(pc_time);
												demoService
														.upateNGDeviceTime(
																tongbu_time,
																function(
																		returnObj) {
																	// console.log(returnObj.data);
																	if (returnObj.data == 'success') {
																		BootstrapDialog
																				.show({
																					title : '通知消息',
																					message : '时间设置成功!'
																				});
																	} else {
																		BootstrapDialog
																				.show({
																					title : '通知消息',
																					message : '时间设置失败!'
																				});
																	}
																});
											} else {
												// 选中手动输入的时候，要判断是否填入了值
												// console.log($scope.ymd);
												console.log($scope.sfen);
												if ($scope.ymd == undefined
														|| $scope.sfen == undefined) {
													BootstrapDialog.show({
														title : '错误消息',
														message : '请认真填写时间!'
													});
													return;
												}
												var in_date = new Date(
														$scope.ymd).getTime();
												var in_time_h = new Date(
														$scope.sfen).getHours();
												var in_time_f = new Date(
														$scope.sfen)
														.getMinutes();
												var nw_time = in_date
														+ (in_time_h * 60 + in_time_f)
														* 60 * 1000;
												var nw_set = new Date();
												nw_set.setTime(nw_time);
												demoService
														.upateNGDeviceTime(
																nw_set,
																function(
																		returnObj) {
																	// console.log(returnObj.data);
																	if (returnObj.data == 'success') {
																		BootstrapDialog
																				.show({
																					title : '通知消息',
																					message : '时间设置成功!'
																				});
																	} else {
																		BootstrapDialog
																				.show({
																					title : '通知消息',
																					message : '时间设置失败!'
																				});
																	}
																});
											}
										};
										// 获取系统的cpu，内存，磁盘空间
										demoService.getSysParameter(function(
												returnObj) {
											console.log(returnObj.data);
											$scope.sysParameter = eval("("
													+ returnObj.data + ")");
										});
										demoService
												.getConfig(function(returnObj) {
													console.log(returnObj);
													// $scope.vm.items =
													// returnObj.data;
													$scope.datavalue = eval("("
															+ returnObj.data
															+ ")");
													$scope.tatalNode = $scope.datavalue.length;
													console
															.log($scope.tatalNode);

													console.info("切换到力导向图");
													console.log("user:"
															+ $scope.slide);
													// $scope.tatalNode = 30;
													// 获取到多少个设备
													// 设备列表
													$scope.columns = [ {
														label : '设备ID',
														name : 'deviceId',
														type : 'string'
													}, {
														label : '返回值',
														name : 'devicetag',
														type : 'string'
													}, {
														label : '返回时间',
														name : 'devicetime',
														type : 'string'
													} ];

													// 列表
													$scope.nodecolumns = [ {
														label : '长地址',
														name : 'longaddress',
														type : 'string'
													}, {
														label : '短地址',
														name : 'shortaddress',
														type : 'string'
													}, {
														label : '设备类型',
														name : 'devicetype',
														type : 'string'
													}, {
														label : '状态',
														name : 'devicetime',
														type : 'string'
													}, {
														label : '上线时间',
														name : 'devicetime',
														type : 'string'
													} ];

													var uuid;
													$rootScope.tagList = [];
													$rootScope.onlineTotal = 0;
													$rootScope.offlineTotal = $scope.tatalNode;
													var categoriesDic = {}; // 类目字典
													var getOption = function() {
														var graph = {
															nodes : [],
															links : []
														};
														var categories = [];
														var i = 0;
														for ( var categorie in categoriesDic) {
															categories[i] = categoriesDic[categorie];
															i++;
														}
														$rootScope.onlineTotal = $rootScope.pointList.length;

														console
																.log("total:"
																		+ $rootScope.onlineTotal);

														$rootScope.offlineTotal = $scope.tatalNode
																- $rootScope.onlineTotal;
														console
																.log("total node:"
																		+ $scope.tatalNode);
														$rootScope.pointList
																.forEach(function(
																		node) {

																	if (node.status == "active") {
																		// $rootScope.onlineTotal++;
																		if (node.deviceType == 'gateway'
																				|| (node.neighborList && node.neighborList.length > 0)) {
																			node.id = node.nickName;
																			if (node.data) {
																				node.name = node.nickName
																						+ ":"
																						+ node.data;
																			} else {
																				node.name = node.nickName;
																			}

																			node.itemStyle = null;
																			node.symbolSize = 30;
																			node.symbol = categoriesDic[node.deviceType].symbol;
																			node.value = $scope.onlineTotal;
																			node.category = categoriesDic[node.deviceType].index;
																			// Use
																			// random
																			// x, y
																			node.x = node.y = null;
																			node.draggable = true;
																			graph.nodes
																					.push(node);
																			node.neighborList
																					.forEach(function(
																							nickName) {
																						graph.links
																								.push({
																									source : node.nickName,
																									target : nickName
																								})
																					});
																		}
																	}
																});

														var option = {
															title : {
																text : '',
																subtext : '',
																top : 'bottom',
																left : 'right'
															},
															tooltip : {},

															legend : [ {
																// selectedMode:
																// 'single',
																x : 'right',
																data : categories
																		.map(function(
																				a) {
																			return a.name;
																		})
															} ],
															animation : false,
															series : [ {
																type : 'graph',
																layout : 'force',
																nodes : graph.nodes,
																links : graph.links,
																minRadius : 15,
																maxRadius : 25,
																categories : categories,
																roam : true,
																label : {
																	normal : {
																		show : true,
																		position : 'inside',
																		formatter : '{b}'
																	}
																},
																force : {
																	repulsion : 1000
																},
																lineStyle : {
																	normal : {
																		color : "blue"
																	}
																}
															} ]
														};
														$scope
																.$broadcast(
																		Event.ECHARTINFOSINIT,
																		{
																			"option" : option
																		});

													}

													var websocketHandle = function(
															evendata) {
														if (evendata
																&& (evendata.data.msgType == 207 || evendata.data.msgType == 208)) {
															if (!evendata.data.status)
																evendata.data.status = "active";
															pointsHandler([ evendata.data ])
															$rootScope.$apply();
														} else if (evendata
																&& evendata.data.msgType == 301) {
															var islook = false;
															var look_index = 0;
															for (var i = 0; i < $rootScope.tagList.length; i++) {
																var tag_b = $rootScope.tagList[i];
																if (evendata.data.uniqueId == tag_b.deviceId) {
																	islook = true;
																	look_index = i;
																	break;
																}
															}
															if (islook) {
																var o = new Object();
																o.deviceId = evendata.data.uniqueId;
																o.devicetag = evendata.data.data;
																o.devicetime = evendata.data.timestamp;
																$rootScope.tagList[i] = o;
															} else {
																var o = new Object();
																o.deviceId = evendata.data.uniqueId;
																o.devicetag = evendata.data.data;
																o.devicetime = evendata.data.timestamp;
																$rootScope.tagList
																		.push(o);
															}
															if ($rootScope.tagList.length == 0) {
																var o = new Object();
																o.deviceId = evendata.data.uniqueId;
																o.devicetag = evendata.data.data;
																o.devicetime = evendata.data.timestamp;
																$rootScope.tagList
																		.push(o);
															}
															if ($rootScope.tagList.length >= 100) {
																$rootScope.tagList = [];
															}
															// 处理所有设备的指令
															$rootScope.$apply();
														}
													}
													var startWebsocket = function(
															callback) {
														var param = {};
														var operation = "register";
														// 考虑极端情况，一个页面有多个模块监听同一个方法
														// 但展示在页面的数据需对接收的实时监听的数据做不同处理
														SwSocket.register(uuid,
																operation,
																callback);

														// websocket发送请求
														SwSocket.send(uuid,
																operation,
																'kpi', param);
													}
													var pointsHandler = function(
															points) {
														for ( var i in points) {
															for ( var j in $rootScope.pointList) {
																if ($rootScope.pointList[j].nickName == points[i].nickName) {
																	$rootScope.pointList
																			.splice(
																					j,
																					1);
																	break;
																}
															}
														}
														for ( var i in points) {
															if (points[i].deviceType == 'gateway') {
																categoriesDic['gateway'] = {
																	name : "网关",
																	index : 0,
																	symbol : "circle"
																};
																points[i].icon = "glyphicon-hdd"
															} else if (points[i].deviceType == 'ap') {
																categoriesDic['ap'] = {
																	name : "AP",
																	index : 1,
																	symbol : "rect"
																};
																points[i].icon = "glyphicon-stats"
															} else if (points[i].deviceType == 'fielddevice') {
																categoriesDic['fielddevice'] = {
																	name : "设备",
																	index : 2,
																	symbol : "roundRect"
																};
																points[i].icon = "glyphicon-tasks"
															} else {
																if (points[i].status == "active") {
																	categoriesDic[points[i].deviceType] = {
																		name : "其他",
																		index : 3,
																		symbol : "pin"
																	};
																	points[i].icon = "glyphicon-alert"
																}
															}
															// 如果是下线的设备则不添加了
															if (points[i].status == "active") {
																$rootScope.pointList
																		.push(points[i]);
															}
														}
														getOption();
													}
													var getNetPoints = function() {
														uuid = "sss";
														categoriesDic = {};
														$rootScope.pointList = [];
														demoService
																.getMessages(function(
																		returnObj) {
																	if (returnObj.code == 0) {
																		pointsHandler(returnObj.data);
																		startWebsocket(websocketHandle);
																	}
																});
													}
													/**
													 * 注销scope时注销方法heartBeat，回调函数callback
													 */
													$scope
															.$on(
																	"$destroy",
																	function() {
																		console
																				.log("on-destroy");
																		SwSocket
																				.unregister(uuid);
																	});

													$scope
															.$on(
																	'loginStatusChanged',
																	function(
																			evt,
																			d) {
																		if (demoService.user.isAuthenticated) {
																			getNetPoints();
																		}
																	});

													if (demoService.user.isAuthenticated) {
														getNetPoints();
													}

												});

									} ]);
		});