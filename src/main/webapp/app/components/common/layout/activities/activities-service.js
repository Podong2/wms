"use strict";

angular.module('wmsApp').factory('activityService', activityService);
activityService.$inject=['$http', '$log'];
    function activityService($http, $log) {

	function getActivities(callback){

		$http.get('app/components/common/layout/activities/tabs/activity.json').success(function(data){

			callback(data);

		}).error(function(){

			$log.log('Error');
			callback([]);

		});

	}

	function getActivitiesByType(type, callback){

		$http.get('app/components/common/layout/activities/tabs/activity-' + type + '.json').success(function(data){

			callback(data);

		}).error(function(){

			$log.log('Error');
			callback([]);

		});

	}

	return{
		get:function(callback){
			getActivities(callback);
		},
		getbytype:function(type,callback){
			getActivitiesByType(type, callback);
		}
	}
}
