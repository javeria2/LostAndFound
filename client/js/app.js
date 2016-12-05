/**
 * Main angular app connected to the ng-view in index
 */
var app = angular.module('LostAndFound',['ngRoute', 'LAFControllers', 'LAFServices', 'ngMap', '720kb.datepicker', 'ngFileUpload'
    , 'ngRoute', 'ngResource', 'ngAnimate', 'ui.materialize', 'wu.masonry']);

app.config(['$routeProvider', function ($routeProvider) {

    // Setting up routes for various views
    $routeProvider.
    when('/home', {
        templateUrl: 'partials/home.html',
        controller: 'HomeController'
    }).
    when('/listings', {
        templateUrl: 'partials/listings.html',
        controller: 'ListingsController'
    }).
    when('/postitem', {
        templateUrl: 'partials/postitem.html',
        controller: 'PostItemController',
        resolve: {
            loggedin: checkLoggedIn
        }
    }).
    when('/search', {
        templateUrl: 'partials/search.html',
        controller: 'SearchController'
    }).
    when('/edit/:id', {
        templateUrl: 'partials/edit.html',
        controller: 'EditController',
        resolve: {
            loggedin: checkLoggedIn
        }
    }).
    when('/details/:id', {
        templateUrl: 'partials/itemdetails.html',
        controller: 'ItemDetails',
        resolve: {
            loggedin: checkLoggedIn
        }
    }).
    when('/profile/:id', {
        templateUrl: 'partials/profile.html',
        controller: 'ProfileController',
        resolve: {
            loggedin: checkLoggedIn
        }
    }).
    when('/auth', {
        templateUrl: 'partials/auth.html',
        controller: 'authController'
    }).
    otherwise({
        redirectTo: '/home'
    });
} ]);

//store list of default user avatars
app.constant('AVATARS', {
    urls: [
        "../rsrcs/imgs/1.png",
        "../rsrcs/imgs/2.png",
        "../rsrcs/imgs/3.png",
        "../rsrcs/imgs/4.png",
        "../rsrcs/imgs/5.png",
        "../rsrcs/imgs/6.png",
        "../rsrcs/imgs/7.png",
        "../rsrcs/imgs/8.png",
        "../rsrcs/imgs/9.png",
        "../rsrcs/imgs/10.png"
    ]
});

function checkLoggedIn($http, $location, $q) {
    var deferred = $q.defer();
    var user = JSON.parse(window.localStorage['user']);
    if(user) {
        deferred.resolve();
    } else {
        window.localStorage['user'] = null;
        deferred.reject();
        $location.url('/auth');
    }
    return deferred.promise;
}

