define(['services/services'], function(services) {
	'use strict';
	services.factory('Info', ['$resource',
		function($resource) {
			return $resource('localdb/:fileName');
		}
	]);
	services.factory('XMLInfo', ['$http',
		function($http) {
			var service = {};
			service.get = function(fileName, callBack) {

				var url = "localdb/" + fileName;
				var callToken = $http.get(url);

				if (callBack != null) {

					callToken.success(callBack);
				}
				callToken.error(function(e) {
					alert(e);
				});
				return callToken;
			};
			return service;
		}
	]);
});