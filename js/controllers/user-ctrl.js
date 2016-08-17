define(['controllers/controllers','bootstrap-dialog'], function(controllers, BootstrapDialog) {
  'use strict';
  //根据接口调用自定义视图获取
  //用户登录demoService
  controllers.controller('AppNavCtrl', ['$scope', '$rootScope', 'Info', 'demoService',
    function($scope, $rootScope, Info, demoService) {
      $rootScope.pointList = []
      $scope.user = {
        username: "",
        password: ""
      };
      $scope.errorMsg = "";
      $scope.slide = "1";
	
      $scope.$watch("user.username", function(newValue, oldValue) {
        $scope.errorStatus = 0;
      });
      $scope.$watch("user.password", function(newValue, oldValue) {
        $scope.errorStatus = 0;
      });
      /**
       * 判断未登录后如何处理
       * localmodel＝true 本地测试使用
       */
      var dialogInstance
      var showLogin = function() {
        dialogInstance = BootstrapDialog.show({
          title: '欢迎来到ProudLink的世界',
          closable: false,
          //size:BootstrapDialog.SIZE_WIDE,
          message: function(dialog) {
            var $message = $('<div></div>');
            var pageToLoad = dialog.getData('pageToLoad');
            $message.load(pageToLoad);

            return $message;
          },
          data: {
            'pageToLoad': 'partials/login.html'
          },
          buttons: [{
            label: '登录',
            hotkey: 13,
            cssClass: 'btn-success',
            action: function(dialogRef) {
              var userInput = document.getElementById('username');
              var psdInput = document.getElementById('password');
              demoService.login(userInput.value.trim(), psdInput.value.trim());
            }
          }, {
            label: '退出',
            action: function(dialogRef) {
              dialogRef.close();
            }
          }]
        });
      }
       $scope.sayHello = function()
       {
    	   console.log("hello");  
       };
      $scope.loginClick = function(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 || keycode == undefined) {

          if ($scope.user.username == "") {
            $scope.errorStatus = 1;
            $scope.errorMsg = "登录名不能为空";
            return;
          }
          if ($scope.user.password == "") {
            $scope.errorStatus = 2;
            $scope.errorMsg = "密码不能为空";
            return;
          }
          console.log($scope.user.username);
          if ($scope.user.username != "" && $scope.user.password != "") {
            // if ($("#checkServe").attr("checked") == "checked") {
            demoService.login($scope.user.username, $scope.user.password);
            // } else {
            //     $scope.errorMsg = "请勾选《普奥云网站服务协议》";
            // }
          } else {
            $scope.errorMsg = "请输入用户名或密码";
            $scope.errorStatus = 1;
          }
        }

      }
      $scope.checkClick = function() {
        if ($("#checkServe").attr("checked") == "checked") {
          $("#checkServe").show();
          $("#checkName").hide();
          $("#checkServe").attr("checked", false)
        } else {
          $("#checkServe").hide();
          $("#checkName").show();
          $("#checkServe").attr("checked", true)
        }
      }
      $scope.homeClick = function() {
        window.open("http://www.proudsmart.com");
      }
	  $scope.logout = function() {
		  demoService.logout();
	  }
      $rootScope.indexShow = false;
      $rootScope.personalShow = true;
      var redirectHandler = function() {
        var industry = demoService.user.industry;
        if (!industry || industry == 0) {
          window.location.href = "apps.html";
//      } else if ((industry == 201004) || (industry == 201010)) {
//        window.location.href = "app/index_machine.html#/machine";
//      } else if (industry == 201002) {
//        window.location.href = "app/index_consumer.html";
        } else {
          window.location.href = "app-oc/index.html";
        }
      };

      
      $scope.$on('loginStatusChanged', function(evt, d) {
		 var arr = document.cookie.match(new RegExp("(^| )"+"name"+"=([^;]*)(;|$)"));
		 if(arr != null) 
		 {
			//登陆成功
				if (dialogInstance) {
				dialogInstance.close();
			  }
			  $scope.userInfo = demoService.user;
		 }else{
			 //showLogin();
			 location.reload();
		 }	 
		
        /*if (demoService.user.isAuthenticated) {
          if (dialogInstance) {
            dialogInstance.close();
          }
          $scope.userInfo = demoService.user;
        } else {
          showLogin();
        }*/
      });
	 var arr = document.cookie.match(new RegExp("(^| )"+"name"+"=([^;]*)(;|$)"));
	  if(arr == null)
	  {
		  showLogin();
	  }else{
		  demoService.login("admin", "admin");
	  }
	 
	  //login
	  var hello = function ()
	  {
		   alert(11);
		};
	  /*
      if (!demoService.user.isAuthenticated) {
        showLogin();
      }*/
    }
  ]);
});