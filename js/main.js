/**
 * 定义RequireJS配置
 */
require.config({
  urlArgs: "ver=1.0.0",
  waitSeconds: 0,
  paths: {
    'jquery': '../bower_components/jquery/dist/jquery.min',
    'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap.min',
    'bootstrap-dialog': '../bower_components/bootstrap3-dialog/dist/js/bootstrap-dialog.min',
    'angular': '../bower_components/angular/angular.min',
    'angular-route': '../bower_components/angular-route/angular-route.min',
    'angular-resource': '../bower_components/angular-resource/angular-resource.min',
    'angular-animate': '../bower_components/angular-animate/angular-animate.min',
    'angular-growl': '../bower_components/angular-growl-v2/build/angular-growl.min',
    'domReady': '../bower_components/requirejs-domready/domReady',
    'echarts': '../bower_components/echarts/dist/echarts',
    'bmap': '../bower_components/echarts/dist/extension/bmap',
    'macarons': '../bower_components/echarts/theme/macarons',
    'slimscroll': '../bower_components/slimScroll/jquery.slimscroll.min',
    'index-app': '../toolkit/admin-lte/app'
  },
  shim: {
    'angular': {
      exports: 'angular'
    },
    'angular-route': {
      deps: ['angular']
    },
    'angular-resource': {
      deps: ['angular']
    },
    'angular-animate': {
      deps: ['angular']
    },
    'angular-growl': {
      deps: ['angular']
    },
    'bootstrap': {
      deps: ['jquery']
    },
    'bootstrap-dialog': {
      deps: ['jquery', 'bootstrap']
    },
    'slimscroll': {
      deps: ['jquery']
    },
    'index-app': {
      deps: ['slimscroll', 'bootstrap']
    }
  },
  deps: [
    'index-app',
    './routes'
  ]
});