/**
 * 定义Route配置
 */
require([
    'app',
    //注意：这不是Twitter Bootstrap，而是AngularJS bootstrap
    'angular-bootstrap',
    //所创建的所有控制器、服务、指令及过滤器文件都必须写到这里，这块内容必须手动维护
    'controllers/controllers',
    'services/services',
    'directives/directives',
    'filters/filters'
  ],

  function(app) {
    'use strict';
    app.config(['$routeProvider',
      function($routeProvider) {
        $routeProvider.
        when('/index', {
          templateUrl: 'partials/home.html',
          controller: 'ViewForceCtrl'
//        controller: 'module1Controller',
//        resolve: {
//          keyName: function($q) {
//            var deferred = $q.defer();
//            require(['module1/module1.js'], function(controller) {
//              $controllerProvider.register('module1Controller', controller); //由于是动态加载的controller，所以要先注册，再使用
//              deferred.resolve();
//            });
//            return deferred.promise;
//          }
//        }
        }).
        when('/showpoint/:nodeId', {
          templateUrl: 'partials/directiveview.html',
          controller: 'sendConfigCtrl'
        }).
		when('/sendconfig', {
          templateUrl: 'partials/sendconfig.html',
		  controller: 'sendConfigCtrl'
        }).
		when('/devicelist', {
          templateUrl: 'partials/devicelist.html',
		  controller: 'ViewForceCtrl'
        }).
		when('/nodelist', {
          templateUrl: 'partials/nodelist.html',
		  controller: 'ViewForceCtrl'
        }).
        when('/force', {
        	 templateUrl: 'partials/force.html'
          }).
          when('/time', {
         	 templateUrl: 'partials/timeset.html',
         	controller: 'ViewForceCtrl'
           }).
           when('/networkset', {
           	 templateUrl: 'partials/networkset.html',
           	controller: 'ViewForceCtrl'
             }).
             when('/updatepwd', {
               	 templateUrl: 'partials/updatepwd.html',
               	controller: 'ViewForceCtrl'
                 }).
        otherwise({
          redirectTo: '/index' //angular就喜欢斜杠开头
        });
      }
    ]);
    app.config(['growlProvider', function(growlProvider) {
      growlProvider.globalTimeToLive({
        success: 1000,
        error: 2000,
        warning: 3000,
        info: 4000
      });
    }]);
    app.config(["$httpProvider", function($httpProvider) {
      $httpProvider.defaults.withCredentials = true;
      $httpProvider.defaults.useXDomain = true;
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }]);
    return app;
  }
);