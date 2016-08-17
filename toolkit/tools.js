/*!
Math.uuid.js (v1.4)
http://www.broofa.com
mailto:robert@broofa.com
 
Copyright (c) 2010 Robert Kieffer
Dual licensed under the MIT and GPL licenses.
*/

/*
 * Generate a random uuid.
 *
 * USAGE: Math.uuid(length, radix)
 *   length - the desired number of characters
 *   radix  - the number of allowable values for each character.
 *
 * EXAMPLES:
 *   // No arguments  - returns RFC4122, version 4 ID
 *   >>> Math.uuid()
 *   "92329D39-6F5C-4520-ABFC-AAB64544E172"
 *
 *   // One argument - returns ID of the specified length
 *   >>> Math.uuid(15)     // 15 character ID (default base=62)
 *   "VcydxgltxrVZSTV"
 *
 *   // Two arguments - returns ID of the specified length, and radix. (Radix must be <= 62)
 *   >>> Math.uuid(8, 2)  // 8 character ID (base=2)
 *   "01001010"
 *   >>> Math.uuid(8, 10) // 8 character ID (base=10)
 *   "47473046"
 *   >>> Math.uuid(8, 16) // 8 character ID (base=16)
 *   "098F4D35"
 */
(function() {
	// Private array of chars to use
	var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

	Math.uuid = function(len, radix) {
		var chars = CHARS,
			uuid = [],
			i;
		radix = radix || chars.length;

		if (len) {
			// Compact form
			for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
		} else {
			// rfc4122, version 4 form
			var r;

			// rfc4122 requires these characters
			uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
			uuid[14] = '4';

			// Fill in random data.  At i==19 set the high bits of clock sequence as
			// per rfc4122, sec. 4.1.5
			for (i = 0; i < 36; i++) {
				if (!uuid[i]) {
					r = 0 | Math.random() * 16;
					uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
				}
			}
		}

		return uuid.join('');
	};

	// A more performant, but slightly bulkier, RFC4122v4 solution.  We boost performance
	// by minimizing calls to random()
	Math.uuidFast = function() {
		var chars = CHARS,
			uuid = new Array(36),
			rnd = 0,
			r;
		for (var i = 0; i < 36; i++) {
			if (i == 8 || i == 13 || i == 18 || i == 23) {
				uuid[i] = '-';
			} else if (i == 14) {
				uuid[i] = '4';
			} else {
				if (rnd <= 0x02) rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
				r = rnd & 0xf;
				rnd = rnd >> 4;
				uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
			}
		}
		return uuid.join('');
	};

	// A more compact, but less performant, RFC4122v4 solution:
	Math.uuidCompact = function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0,
				v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	};

	// 对Date的扩展，将 Date 转化为指定格式的String 
	// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
	// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
	// 例子： 
	// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
	// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
	Date.prototype.Format = function(fmt) { //author: meizz 
//		this.setTime(this.getTime() + this.getTimezoneOffset() * 60 * 1000);
		var o = {
			"M+": this.getMonth() + 1, //月份 
			"d+": this.getDate(), //日 
			"h+": this.getHours(), //小时 
			"m+": this.getMinutes(), //分 
			"s+": this.getSeconds(), //秒 
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
			"S": this.getMilliseconds() //毫秒 
		};

		if (/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt))
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));

		return fmt;
	};
	GetDateCategoryStrByLabel = function(labelStr) {
		if (labelStr == "年月日时分秒") {
			return "yyyy-MM-dd hh:mm:ss";
		} else if (labelStr == "时分秒") {
			return "hh:mm:ss";
		} else if (labelStr == "时分") {
			return "hh:mm";
		} else if (labelStr == "年月日") {
			return "yyyy-MM-dd";
		} else if (labelStr == "月日") {
			return "MM-dd";
		} else if (labelStr == "日") {
			return "dd";
		} else if (labelStr == "时") {
			return "hh";
		}
		return "yyyy-MM-dd hh:mm:ss";
	};

	Event.DOMAINDEVICESINIT = "domainDevicesInit";//资源域信息设备列表初始化
	Event.DOMAININFOSINIT = "domainInfosInit"; //资源域信息初始化
	Event.USERGROUPINIT = "userGroupInit"; //用户组用户列表初始化
	Event.CLIENTMANAGEINIT = "clientManageInit"; //客户列表初始化
	Event.REPORTTREEINIT = "reportTreeInit"; //报表目录树列表初始化
	Event.SUPPLIERMANAGEINIT = "supplierManageInit"; //供应商列表初始化
	Event.CURRENTINFOSINIT = "currentInfosInit"; //权限信息初始化
	Event.FUNCTIONINFOSINIT = "functionInfosInit"; //tree信息初始化
	Event.DOMAININFOSINIT = "domainInfosInit"; //tree域信息初始化
	Event.ECHARTINFOSINIT = "echartInfosInit" ;//echart信息初始化
	Event.ECHARTMAPINFOSINIT = "echartMapInfosInit"; //echart信息初始化
	Event.ECHARTMAPINFOSCHANGE = "echartMapInfosChange"; //echart信息初始化
	Event.ALERTINFOSINIT = "alertInfosInit"; //告警信息初始化
	Event.USERINFOSINIT = "userInfosInit"; //用户信息初始化
	Event.GROUPINFOSINIT = "groupInfosInit"; //工作组信息初始化
	Event.CMDBINFOSINIT = "cmdbInfosInit"; //cmdb信息初始化
	Event.CMDBINFOS4MAPINIT = "cmdbInfos4mapInit"; //cmdb信息初始化
	Event.ATTREDITINIT = "attrEditInit"; //属性设置初始化
	Event.KPIEDITINIT = "kpiEditInit"; //kpi设置初始化
	Event.ALERTEDITINIT = "alertEditInit"; //告警设置初始化
	Event.WORKORDERINIT = "workOrderInit"; //工单管理初始化
	Event.WORKORDERRECORDINIT = "workOrderRecordInit";//工单任务初始化
	Event.DIRECTIVESINIT = "directivesInit"; //指令管理初始化
	Event.WORKORDERTYPEINIT = "workOrderTypeInit"; //工单类型维护初始化
	json2xml = function(o, tab) {  
	   var toXml = function(v, name, ind) {  
	      var xml = "";  
	      if (v instanceof Array) {  
	         for (var i=0, n=v.length; i<n; i++)  
	            xml += ind + toXml(v[i], name, ind+"\t") + "\n";  
	      }  
	      else if (typeof(v) == "object") {  
	         var hasChild = false;  
	         xml += ind + "<" + name;  
	         for (var m in v) {  
	            if (m.charAt(0) == "@")  
	               xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";  
	            else  
	               hasChild = true;  
	         }  
	         xml += hasChild ? ">" : "/>";  
	         if (hasChild) {  
	            for (var m in v) {  
	               if (m == "#text")  
	                  xml += v[m];  
	               else if (m == "#cdata")  
	                  xml += "<![CDATA[" + v[m] + "]]>";  
	               else if (m.charAt(0) != "@")  
	                  xml += toXml(v[m], m, ind+"\t");  
	            }  
	            xml += (xml.charAt(xml.length-1)=="\n"?ind:"") + "</" + name + ">";  
	         }  
	      }  
	      else {  
	         xml += ind + "<" + name + ">" + v.toString() +  "</" + name + ">";  
	      }  
	      return xml;  
	   }, xml="";  
	   for (var m in o)  
	      xml += toXml(o[m], m, "");  
	   return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");  
	}
	//convert string to xml object
String2XML = function(xmlString) {
    // for IE
    if (window.ActiveXObject) {
      var xmlobject = new ActiveXObject("Microsoft.XMLDOM");
      xmlobject.async = "false";
      xmlobject.loadXML(xmlstring);
      return xmlobject;
    }
    // for other browsers
    else {
      var parser = new DOMParser();
      var xmlobject = parser.parseFromString(xmlstring, "text/xml");
      return xmlobject;
    }
  }
//convert xml object to string
XML2String = function(xmlObject) {
    // for IE
    if (window.ActiveXObject) {       
      return xmlobject.xml;
    }
    // for other browsers
    else {        
      return (new XMLSerializer()).serializeToString(xmlobject);
    }
  }
validatorCN = function(event) {
	event.value=event.value.replace(/[^/0-9a-z\u4e00-\u9fa5]/ig,'');
}
validatorNUM = function(event) {
	event.value=event.value.replace(/[^/0-9]/ig,'');
}
validatorEN = function(event) {
	event.value=event.value.replace(/[^/0-9a-z]/ig,'');
}
validatorHTML = function(event) {
	var currKey=event.keyCode||event.which||event.charCode;
	if((currKey==190||currKey==188)&&event.shiftKey){
		event.preventDefault();
		event.stopPropagation();
	}
	//event.value=event.value.replace(/[\<|\>]/ig,'');
}
})();