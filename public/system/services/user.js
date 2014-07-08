'use strict';

angular.module('mean.system').factory('Users', ['$resource', function($resource) {
    return $resource('users/me/:userId', {
        userId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);


// convert unix date to realtime date
angular.module('mean.system').factory('formatDate', ['$resource', function($resource) {
    
	return function(date) {

		var real_date = new Date(date);
		// real date format
	    var formatDate = function(d) {

	        var dd = d.getDate();
	        if ( dd < 10 ) dd = '0' + dd;

	        var mm = d.getMonth()+1
	        if ( mm < 10 ) mm = '0' + mm;

	        var yy = d.getFullYear();
	        if ( yy < 10 ) yy = '0' + yy;

	        return mm+'/'+dd+'/'+yy;
	    }
	    // return real date to the controller
	    return formatDate(real_date);
	}

}]);