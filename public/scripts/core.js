(function(){
	
	'use strict' ;

	angular
		.module('articlesApp',['ui.router.title','ui.router', 'ui.router.stateHelper', 'satellizer','ngAnimate','ngAria','ngMaterial','ngMessages', 'angularFileUpload'])
		.config(function($provide, $httpProvider, $urlRouterProvider, $stateProvider, $authProvider){	
			 function redirectWhenLoggedOut($q, $injector) {
		        return {
		          responseError: function(rejection) {
		            // Need to use $injector.get to bring in $state or else we get
		            // a circular dependency error
		            var $state = $injector.get('$state');
		            // Instead of checking for a status code of 400 which might be used
		            // for other reasons in Laravel, we check for the specific rejection
		            // reasons to tell us if we need to redirect to the login state
		            var rejectionReasons = ['token_not_provided', 'token_expired', 'token_absent', 'token_invalid'];
		            // Loop through each rejection reason and redirect to the login
		            // state if one is encountered
		            angular.forEach(rejectionReasons, function(value, key) {

		              if(rejection.data.error === value) {
		                  // If we get a rejection corresponding to one of the reasons
		                  // in our array, we know we need to authenticate the user so 
		                  // we can remove the current user from local storage
		                  localStorage.removeItem('userId');
		                  // Send the user to the auth state so they can login
		                  $state.go('home');
		                  alertify.error("Connexion has expired",10) ;
		              }
		            });
		            return $q.reject(rejection);
		          }
		        }
		     }
      		// Setup for the $httpInterceptor
   			$provide.factory('redirectWhenLoggedOut', redirectWhenLoggedOut);

    		// Push the new factory onto the $http interceptor array
    		$httpProvider.interceptors.push('redirectWhenLoggedOut');

			$authProvider.loginUrl = '/authenticate';
            $urlRouterProvider.otherwise('/home');
            $stateProvider
                .state('home', {
                    url: '/home',
                    templateUrl: '../template/home.html',
                    controller: 'HomeController as home',
                    resolve:{
					      $title: function() { return 'Ressources LabREMO'; }
					 }
                })
                .state('dash', {
                    url: '/dash',
                    templateUrl: '../template/dash.html',
                    controller: 'DashController as dash',
                    data: {
                    	loginRequired:true
                    },
                    resolve:{
					      $title: function() { return 'Dashboard'; }
					 }
                })
		}).run(function($rootScope, $timeout, $auth, $state){
	    	 $rootScope.$on('$stateChangeStart', function(event, toState) {
	    	 		var requiredLogin = false;
	    	 		if (toState.data && toState.data.loginRequired) requiredLogin = true;
				    if (requiredLogin && !$auth.isAuthenticated()) {
				        event.preventDefault();
				        $state.go('home');
				    }
				    if(toState.name!='dash' && $auth.isAuthenticated()){
				    	$state.go('dash');
				    }	
					
	    	 }) ;
	    }) ;
	

	
})() ;

 