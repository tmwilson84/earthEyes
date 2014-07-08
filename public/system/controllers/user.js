'use strict';

var app = angular.module('mean.system').controller('UserController', ['$scope', '$location', '$timeout', 'Global', 'Users', 'formatDate', function ($scope, $location, $timeout, Global, Users, formatDate) {
    $scope.global = Global;
    
    // get user data
    $scope.getUser = function() {

    	Users.get(function(user) {
    		$scope.fullName = user.name.first +' '+ user.name.last;
            console.log(user);
            $scope.user = user;
        });

    };

    // upatade user data
    $scope.updateUser = function() {

        var user = $scope.user;

        // get real date
        user.dob = formatDate(user.dob);        
        
        if (!user.updated) {
            user.updated = [];
        }
        // push new udpated time
        user.updated.push(new Date().getTime());

        user.$update(function() {
            //$location.path('user');
            $scope.success = true;
            $timeout(function() {
                $scope.success = false;
            }, 2000);
        });

    };
    
}]);

// date selection for user birthday
app.directive('birthDate', function() {

    return {
        require: "ngModel",
        link: function(scope, element, attrs, ngModelCtrl) {
            // calling date picker
            var nowTemp = new Date();
            var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);

            var checkin = element.datepicker({
                onRender: function(date) {
                    return date.valueOf() < now.valueOf() ? 'disabled' : '';
                }
            }).on('changeDate', function(ev) {
                // apply new variable to scope        
                scope.$apply(function () {
                  ngModelCtrl.$setViewValue(ev.date.valueOf());
                });
                // hide datebox
                checkin.hide();
                
            }).data('datepicker');
            
        }
    };

});