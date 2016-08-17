define(
		[ 'controllers/controllers', 'bootstrap-dialog' ],
		function(controllers, BootstrapDialog) {
			'use strict';
			controllers
					.controller(
							'sendConfigCtrl',
							[
									'$scope',
									'$rootScope',
									'$routeParams',
									'$timeout',
									'$http',
									'SwSocket',
									'growl',
									'demoService',
									function($scope, $rootScope, $routeParams,
											$timeout, $http, SwSocket, growl,
											demoService) {
										console.info("sendConfigCtrl被触发");
										var uuid = '';
										var operation = "register";
										$scope.formData = {};
										$scope.modbusList = {};
										var vm = $scope.vm = {};
										$scope.showserialport = true;
										$scope.showmodbus = false;
										$scope.showother = false;
										$scope.addmodbus = false;
										var nodeId = $routeParams.nodeId;
										$scope.kpiconfig = "";
										$scope.mdatatypevalue = [];
										vm.page = {
											size : 5,
											index : 1
										};
										$scope.checkkpilist={};
										// 构建模拟数据
										vm.columns = [ {
											label : '设备类型   ',
											name : 'deviceType',
											type : 'string',
											width : '15%'
										}, {
											label : '设备ID',
											name : 'deviceId',
											type : 'string'
										}, {
											label : '加入序列号',
											name : 'joinKey',
											type : 'string'
										}, {
											label : '设备标识',
											name : 'deviceTag',
											type : 'string'
										} ];

										// 用户点击添加modbus按钮的时候
										$scope.showaddmodbus = function() {
											$scope.addmodbus = true;
											$scope.addr = undefined;
											$scope.funcCode = undefined;
											$scope.startAddr = undefined;
											$scope.readNum = undefined;
											$scope.sensorid = undefined;
											$scope.mdatatypevalue = [];
											$scope.checkkpilist={};
										};
										// 选中modbus的数据
										$scope.change = function(value) {
											// console.log(value);
											if (value == "1") {
												// console.log("ssss");
												$scope.showserialport = true;
												$scope.showmodbus = false;
												$scope.showother = false;
												$scope.addmodbus = false;
											} else if (value == "2") {
												// console.log("modbus");
												$scope.showserialport = false;
												$scope.showmodbus = true;
												$scope.showother = false;
											} else {
												// console.log("other");
												$scope.showserialport = false;
												$scope.showmodbus = false;
												$scope.showother = true;
												$scope.addmodbus = false;
											}
										};
										// 删除modbus
										$scope.delModBus = function(sensorId) {
											console.log(sensorId);
											demoService
													.delModBus(
															sensorId,
															$scope.selectedGateitem.uniqueId,
															function(returnObj) {
																if (returnObj.data == 'success') {
																	BootstrapDialog
																			.show({
																				title : '通知消息',
																				message : '删除成功!5秒后自动刷新'
																			});
																	/*demoService
																			.getNodeAllConfig(
																					$scope.selectedGateitem.uniqueId,
																					function(
																							returnObj) {
																						if (returnObj.code == 0) {
																							$scope.kpiconfig = returnObj.data;
																						}
																					});*/
																	setTimeout(mainVoid,5000); 
																} else {
																	BootstrapDialog
																			.show({
																				title : '通知消息',
																				message : '删除失败!'
																			});
																}
															});
										};
										// 编辑modbus
										$scope.editModBus = function(sensorId) {
											console.log(sensorId);
											for (var i = 0; i < $scope.modbusList.length; i++) {
												if ($scope.modbusList[i].sensorId == sensorId) {
													// 找出来之后
													$scope.addmodbus = true;
													$scope.addr = $scope.modbusList[i].addr;
													$scope.funcCode = $scope.modbusList[i].funcCode;
													$scope.startAddr = $scope.modbusList[i].startAddr;
													$scope.readNum = $scope.modbusList[i].readNum;
													$scope.sensorid = $scope.modbusList[i].sensorId;
													$scope.mdatatypearray = undefined;
													$scope.mdatatypevalue = [];
													var kpilist = $scope.modbusList[i].kpiList;
													for (var j = 0; j < kpilist.length; j++) {
														var obj = new Object();
														//obj.startkpinum= "0x";
														//obj.endkpinum= "0x";
														//obj.saunfanvalue= "1";
														//json[i] = value[i];
														//var index = value[i];
														
														if (kpilist[j] === "temp") {
															
															$scope.mdatatypevalue
																	.push("1");
															obj.startkpinum= $scope.modbusList[i].canshuMap.temp.startkpinum;
															obj.endkpinum= $scope.modbusList[i].canshuMap.temp.endkpinum;
															obj.saunfanvalue= $scope.modbusList[i].canshuMap.temp.saunfanvalue;
														} else if (kpilist[j] === "humidity") {
															$scope.mdatatypevalue
																	.push("2");
															obj.startkpinum= $scope.modbusList[i].canshuMap.humidity.startkpinum;
															obj.endkpinum= $scope.modbusList[i].canshuMap.humidity.endkpinum;
															obj.saunfanvalue= $scope.modbusList[i].canshuMap.humidity.saunfanvalue;
														} else if (kpilist[j] === "airpressure") {
															$scope.mdatatypevalue
																	.push("3");
															obj.startkpinum= $scope.modbusList[i].canshuMap.airpressure.startkpinum;
															obj.endkpinum= $scope.modbusList[i].canshuMap.airpressure.endkpinum;
															obj.saunfanvalue= $scope.modbusList[i].canshuMap.airpressure.saunfanvalue;
														}
														$scope.checkkpilist[j] = obj;
													}
													break;
												}
											}
										};
										$scope.validqiandaofuNum = function(
												qiandaofuNum) {
											console.log($scope)
											console.log(qiandaofuNum);
											var shi = parseInt(qiandaofuNum, 16);
											if (shi > 5) {
												BootstrapDialog
														.show({
															title : '通知消息',
															message : '前导符个数不能大于5，请重新填写'
														});
											}
										};
										// 保存串口透传的配置
										function mainVoid(){
										     //所有你要阻塞的代码写这里面
											window.location.reload();
										 };
										$scope.saveSerisble = function() {
											console.log($scope.sdatatypearray);
											if ($scope.qiandaofuNum == undefined
													|| $scope.qiandaofu == undefined
													|| $scope.startNum == undefined
													|| $scope.startByte == undefined
													|| $scope.sdatatypearray == undefined) {
												BootstrapDialog.show({
													title : '通知消息',
													message : '请务必填写每一个字段信息'
												});
											} else {
												// 将页面获取到的信息保存到配置文件中，调用接口
												demoService
														.saveSerialPort(
																$scope.selectedGateitem.uniqueId,
																$scope.qiandaofuNum,
																$scope.qiandaofu,
																$scope.startNum,
																$scope.startByte,
																$scope.sdatatypearray,
																function(
																		returnObj) {
																	if (returnObj.data == 'success') {
																		BootstrapDialog
																				.show({
																					title : '通知消息',
																					message : '保存串口透传配置成功!5秒后自动刷新'
																				});
																		setTimeout(mainVoid,5000); 
																	} else {
																		BootstrapDialog
																				.show({
																					title : '通知消息',
																					message : '保存串口配置透传失败!'
																				});
																	}
																});
											}
										};
										// 保存modbus
										$scope.saveModBus = function() {
											console.log($scope.checkkpilist);
											if ($scope.addr == undefined
													|| $scope.funcCode == undefined
													|| $scope.startAddr == undefined
													|| $scope.readNum == undefined) {
												BootstrapDialog.show({
													title : '通知消息',
													message : '请务必填写每一个字段信息'
												});
												return;
											} else if ($scope.sensorid != undefined) {
												console.log("edit");
												// 将页面获取到的信息保存到配置文件中，调用接口
												if ($scope.mdatatypearray == undefined) {
													if ($scope.mdatatypevalue != undefined) {
														var json = {};
														if ($scope.mdatatypevalue.length != 0) {
															for (var i = 0; i < $scope.mdatatypevalue.length; i++) {
																json[i] = $scope.mdatatypevalue[i];
															}
															$scope.mdatatypearray = JSON
																	.stringify(json);
														}
													} else {
														BootstrapDialog
																.show({
																	title : '通知消息',
																	message : '请务必填写每一个字段信息'
																});
														return;
													}
												}
												demoService
														.updateModBus(
																$scope.sensorid,
																$scope.selectedGateitem.uniqueId,
																$scope.addr,
																$scope.funcCode,
																$scope.startAddr,
																$scope.readNum,
																$scope.mdatatypearray,
																function(
																		returnObj) {
																	if (returnObj.data == 'success') {
																		BootstrapDialog
																				.show({
																					title : '通知消息',
																					message : '修改ModBus配置成功!5秒后自动刷新'
																				});
																		$scope.addmodbus = false;
																		// 重新从配置文件中读取文件
																		// 获取该节点的配置
																		/*demoService
																				.getNodeAllConfig(
																						$scope.selectedGateitem.uniqueId,
																						function(
																								returnObj) {
																							if (returnObj.code == 0) {
																								$scope.kpiconfig = returnObj.data;
																								//$scope.$apply();
																							}
																						});*/
																		setTimeout(mainVoid,5000); 
																	} else {
																		BootstrapDialog
																				.show({
																					title : '通知消息',
																					message : '修改ModBus配置失败!'
																				});
																	}
																});
											} else if ($scope.sensorid == undefined) {
												// 将页面获取到的信息保存到配置文件中，调用接口
												if ($scope.mdatatypearray == undefined) {
													BootstrapDialog
															.show({
																title : '通知消息',
																message : '请务必填写每一个字段信息'
															});
													return;
												}
												//判断在添加算法的时候，是否选择了
												var suanfa = JSON.stringify($scope.checkkpilist);
												demoService
														.saveModBus(
																$scope.selectedGateitem.uniqueId,
																$scope.addr,
																$scope.funcCode,
																$scope.startAddr,
																$scope.readNum,
																$scope.mdatatypearray,
																suanfa,
																function(
																		returnObj) {
																	if (returnObj.data == 'success') {
																		BootstrapDialog
																				.show({
																					title : '通知消息',
																					message : '保存ModBus配置成功!5秒后自动刷新'
																				});
																		$scope.addmodbus = false;
																		// 重新读取配置文件
																		/*demoService
																				.getNodeAllConfig(
																						$scope.selectedGateitem.uniqueId,
																						function(
																								returnObj) {
																							if (returnObj.code == 0) {
																								$scope.kpiconfig = returnObj.data;
																							}
																						});*/
																		//setTimeout(mainVoid,5000); 
																	} else {
																		BootstrapDialog
																				.show({
																					title : '通知消息',
																					message : '保存ModBus配置失败!'
																				});
																	}
																});
											}
										};
										// 保存IO口功能配置
										$scope.saveIOFunc = function() {
											// console.log($scope.iovalue);
											// console.log($scope.funcvalue);
											if ($scope.datatypearray == null
													|| $scope.datatypearray == undefined) {
												BootstrapDialog.show({
													title : '通知消息',
													message : '请选择数据类型!'
												});
												return;
											}
											demoService
													.saveIoFunc(
															$scope.selectedGateitem.uniqueId,
															$scope.iovalue,
															$scope.funcvalue,
															$scope.datatypearray,
															function(returnObj) {
																if (returnObj.data == 'success') {
																	BootstrapDialog
																			.show({
																				title : '通知消息',
																				message : '保存IO口功能配置成功!5秒后自动刷新'
																			});
																	setTimeout(mainVoid,5000); 
																} else {
																	BootstrapDialog
																			.show({
																				title : '通知消息',
																				message : '保存IO口功能配置失败!'
																			});
																}
															})
										};
										// modbus数据类型
										$scope.mdatatypelist = [ {
											name : '温度',
											value : '1',
											selected : true
										}, {
											name : '湿度',
											value : '2',
											selected : true
										}, {
											name : '大气压',
											value : '3',
											selected : true
										} ];
										//选择算法生成解析数据
										$scope.suanfalist = [ {
											name : '*10',
											value : '1',
											selected : true
										}, {
											name : '*100',
											value : '2',
											selected : true
										}, {
											name : '*1000',
											value : '3',
											selected : true
										},{
											name : '/10',
											value : '4',
											selected : true
										},{
											name : '/100',
											value : '5',
											selected : true
										},{
											name : '/1000',
											value : '6',
											selected : true
										}];
										$scope.mdatatypevalue
												.push($scope.mdatatypelist[0].value);
										$scope.mchangeDataType = function(value) {
											// console.log(value);
											var json = {};
											if (value.length != 0) {
												for (var i = 0; i < value.length; i++) {
													var obj = new Object();
													obj.startkpinum= "0x";
													obj.endkpinum= "0x";
													obj.saunfanvalue= "1";
													json[i] = value[i];
													var index = value[i];
													$scope.checkkpilist[index] = obj;
													//循环选中的时候，
													$scope.showaddsuanfa=true;
												}
												$scope.mdatatypearray = JSON
														.stringify(json);
												console.log($scope.mdatatypearray);
											} else {
												BootstrapDialog.show({
													title : '通知消息',
													message : '请至少指定一项数据项'
												});
											}
										};
										// 数据类型
										$scope.sdatatypelist = [ {
											name : '温度',
											value : '1'
										}, {
											name : '湿度',
											value : '2'
										}, {
											name : '大气压',
											value : '3'
										} ];
										// $scope.sdatatypevalue =
										// $scope.sdatatypelist[0].value;
										$scope.schangeDataType = function(value) {
											// console.log(value);
											var json = {};
											if (value.length != 0) {
												for (var i = 0; i < value.length; i++) {
													json[i] = value[i];
												}
												$scope.sdatatypearray = JSON
														.stringify(json);
											} else {
												BootstrapDialog.show({
													title : '通知消息',
													message : '请至少指定一项数据项'
												});
											}
										};
										// 数据类型
										$scope.datatypelist = [ {
											name : '温度',
											value : '1'
										}, {
											name : '湿度',
											value : '2'
										}, {
											name : '大气压',
											value : '3'
										} ];
										// $scope.datatypevalue =
										// $scope.datatypelist[0].value;
										$scope.changeDateType = function(value) {
											// console.log(value);
											var json = {};
											if (value.length != 0) {
												for (var i = 0; i < value.length; i++) {
													json[i] = value[i];
												}
												$scope.datatypearray = JSON
														.stringify(json);
											} else {
												BootstrapDialog.show({
													title : '通知消息',
													message : '请至少指定一项数据项'
												});
											}
										};
										// 列表
										$scope.modbuscolumns = [ {
											label : '地址',
											name : 'ddress',
											type : 'string'
										}, {
											label : '功能码',
											name : 'funcCode',
											type : 'string'
										}, {
											label : '起始地址',
											name : 'startAddr',
											type : 'string'
										}, {
											label : '读取数据个数',
											name : 'readNum',
											type : 'string'
										}, {
											label : '操作',
											name : 'opration',
											type : 'string'
										} ];

										/*
										 * $scope.modbusList = [ { 'ddress' :
										 * 'GATEWAY', 'funcCode' : '0x001B, ', //
										 * 字符串类型 'startAddr' : '0x0001', // 数字类型
										 * 'readNum' : '0x00, ' // 金额类型 } ];
										 */
										// websocket订阅
										// var configuuid='getconfig';
										$scope.sendClick = function(e) {
											// 点击下发配置的时候，获取input里面的值
											// alert(111);

										};

										$scope.processForm = function() {
											// console.log($scope.vm.items);
											// 获取文本框里的值
											var network = $scope.vm.network;
											var channel = $scope.vm.channel;
											$scope.formData.network = network;
											$scope.formData.channel = channel;
											$scope.formData.items = $scope.vm.items;
											// console.log($scope.formData);
											// 提交数据到后台处理
											var data = demoService
													.saveConfig(
															JSON
																	.stringify($scope.formData),
															function(returnObj) {
																// console.log(returnObj.data);
																if (returnObj.data == 'success') {
																	BootstrapDialog
																			.show({
																				title : '通知消息',
																				message : '下发配置成功!'
																			});
																} else {
																	BootstrapDialog
																			.show({
																				title : '通知消息',
																				message : '下发配置失败!'
																			});
																}
															});

										};

										demoService
												.getConfig(function(returnObj) {
													console.log("log:"
															+ returnObj);
													// $scope.vm.items =
													// returnObj.data;
													$scope.vm.items = eval("("
															+ returnObj.data
															+ ")");
													$scope.vm.network = $scope.vm.items[0].network;
													$scope.vm.channel = $scope.vm.items[0].channelMap;
												});

										$scope.selectedGateitem = {};

										$scope.selectedDiritem = {};
										$scope.itemDirValues = {};
										$scope.orderList = [];
										$scope.kpiList = [];
										var callback = function(evendata) {
											if (evendata
													&& evendata.data.uniqueId == $scope.selectedGateitem.uniqueId) {
												var obj = {};
												if (evendata.data.msgType == 204
														|| evendata.data.msgType == 205
														|| evendata.data.msgType == 206) {
													obj.status = evendata.data.status == "successful" ? "成功"
															: "失败";
													$scope.modelsDirs
															.forEach(function(
																	model) {
																if (model.msgType == evendata.data.msgType) {
																	obj.name = model.label;
																}
															})
													obj.payload = evendata.data.payload;
													obj.cmdNum = evendata.data.cmdNum;
													obj.scanNum = evendata.data.scanNum;
													$scope.orderList.push(obj);
													$scope.$apply();
												} else if (evendata.data.msgType == 301) {
													obj.timestamp = evendata.data.timestamp;
													obj.data = evendata.data.data;
													$scope.kpiList.push(obj);
													if($scope.kpiList.length >= 10)
														{
														   $scope.kpiList = [];
														}
													$scope.$apply();
												}
											}
										};

										$scope.dirItemClick = function(item) {
											$scope.selectedDiritem = item;
										}
										$scope.clicktime = 0;
										$scope.sendItemDir = function() {
											
											for ( var i in $scope.selectedDiritem.params) {
												var obj = $scope.selectedDiritem.params[i];
												var value = $scope.itemDirValues[obj.name];
												if (!value) {
													growl
															.warning(
																	"请输入:"
																			+ $scope.selectedDiritem.params[i].label,
																	{});
													return;
												}
												$scope.selectedDiritem[obj.name] = value;
											}
											$scope.selectedDiritem["uniqueId"] = $scope.selectedGateitem.uniqueId;
											// websocket发送请求
											SwSocket.send(uuid, operation,
													'kpi',
													$scope.selectedDiritem);
										}
										$scope.configxieyichoose = [ {
											name : '串口透传',
											value : '1'
										}, {
											name : 'Modbus-RTU',
											value : '2'
										}, {
											name : '其它',
											value : '3'
										} ];
										// Io
										$scope.IoChoose = [ {
											name : 'IO1',
											value : '1'
										}, {
											name : 'IO2',
											value : '2'
										}, {
											name : 'IO3',
											value : '3'
										}, {
											name : 'IO4',
											value : '4'
										}, {
											name : 'IO5',
											value : '5'
										}, {
											name : 'IO6',
											value : '6'
										}, {
											name : 'IO7',
											value : '7'
										}, {
											name : 'IO8',
											value : '8'
										} ];
										// io function
										$scope.IoFunChoose = [ {
											name : '4-20mA',
											value : '1'
										}, {
											name : '0-5V',
											value : '2'
										}, {
											name : '开关量采集',
											value : '3'
										}, {
											name : '高低电平输出（继电器控制）',
											value : '4'
										}, {
											name : '0-200mV',
											value : '5'
										}, {
											name : 'SPI',
											value : '6'
										}, {
											name : 'IIC',
											value : '7'
										}, {
											name : 'PWM',
											value : '8'
										}, {
											name : 'DS18B20',
											value : '9'
										} ];
										$scope.nodeconfig = $scope.configxieyichoose[0].value;
										$scope.iovalue = $scope.IoChoose[0].value;
										$scope.funcvalue = $scope.IoFunChoose[0].value;
										var init = function() {
											$scope.orderList = [];
											uuid = "sss";
											SwSocket.register(uuid, operation,
													callback);
											$scope.modelsDirs = [
													{
														label : '订阅请求',
														msgType : 204,
														uniqueId : "",
														scanNum : "",
														params : [ {
															label : '订阅周期(秒)',
															name : 'scanNum',
															values : [ '1',
																	'2', '4',
																	'8', '16',
																	'32', '64',
																	'128',
																	'256',
																	'512' ],
															type : "select",
															placeholder : "单位:秒"
														} ]
													},
													{
														label : '取消订阅',
														msgType : 205,
														uniqueId : "",
														scanNum : "",
														params : [],
													},
													{
														label : '命令控制',
														msgType : 206,
														uniqueId : "",
														cmdNum : "",
														payload : "",
														params : [
																{
																	label : '命令值',
																	name : 'cmdNum',
																	type : "input",
																	placeholder : "请输入十进制参数"
																},
																{
																	label : '命令内容',
																	name : 'payload',
																	type : "input",
																	placeholder : "请输入十六进制参数"
																} ]
													},
													{
														label : '节点配置',
														msgType : 205,
														uniqueId : "",
														scanNum : "",
														nodetype : "nodeconfig",
														params : [],
													} ];
											$scope.selectedDiritem = $scope.modelsDirs[0];
										}
										if (nodeId) {
											if($rootScope.pointList.length == 0)
												{
												init();
												$scope.selectedGateitem = JSON.parse(sessionStorage.obj);
												   // alert(obj.deviceType);
												}
											$rootScope.pointList
													.forEach(function(node) {
														if (node.nickName == nodeId) {
															if (node.deviceType == 'fielddevice') {
																init();
															}
															/*
															 * var time =
															 * Date.parse(node.timeStr);
															 * node.timeStr =
															 * time;
															 */
															$scope.selectedGateitem = node;
															//保存数据到缓存中，解决刷新的时候
															sessionStorage.obj=JSON.stringify(node);;
														}
													})
										}
										// 从后端查询结果
										demoService
												.getModBusList(
														$scope.selectedGateitem.uniqueId,
														function(returnObj) {
															var modbuslist = eval("("
																	+ returnObj.data
																	+ ")");
															console
																	.log(returnObj);
															if (modbuslist.size != 0) {
																$scope.modbusList = modbuslist;
															}
														});
										// 获取该节点的配置
										demoService
												.getNodeAllConfig(
														$scope.selectedGateitem.uniqueId,
														function(returnObj) {
															if (returnObj.code == 0) {
																$scope.kpiconfig = returnObj.data;
															}
														});
										// 注销scope时注销方法heartBeat，回调函数callback
										$scope.$on("$destroy", function() {
											console.log("on-destroy");
											SwSocket.unregister(uuid);
										});
									} ]);
		});