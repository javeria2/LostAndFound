var LAFControllers = angular.module('LAFControllers', []);

/**
 * ========================================
 * Controller for the home page
 * ========================================
 */
LAFControllers.controller('HomeController', ['$scope',
    function($scope) {
        //add a new class to the ng-view
        $scope.pageClass = 'page-home';
}]);

/**
 * =================
 * NAVBAR CONTROLLER
 * =================
 */
LAFControllers.controller('navBarController', ['$scope', '$http', '$location',
    function($scope, $http, $location){
    $scope.buttonText = "Login/Sign Up";
    $('.feedback').hide();
    if(window.localStorage['user']) var user = JSON.parse(window.localStorage['user']);
        if(user){
        $('.loginBt').hide();
        $scope.profileImg = user.img;
        $scope.profileName = "Hi " + user.username + "!";
        $('.feedback').show();
    } else {
        $('.loginBt').show();
        $('.feedback').hide();
    }
    $scope.logout = function() {
        $http.get('/api/logout').success(function(res){
            window.localStorage['user'] = null;
            $('.loginBt').show();
            $('.feedback').hide();
            $location.url('/listings');
        });
    }
}]);
/**
 * ========================================
 * Controller for the posting an item page
 * ========================================
 * https://ngmap.github.io/#/!places-auto-complete.html
 * https://github.com/danialfarid/ng-file-upload
 */

LAFControllers.controller('PostItemController', ['$scope', 'NgMap', 'Upload', '$timeout', 'ItemsFactory',
    function($scope, NgMap, Upload, $timeout, ItemsFactory) {
        var lat;
        var lon;
        var images = [];
        //setting default value for radio btn
        $scope.lost_found = "Lost";

        var vm = this;
        vm.types = "['establishment']";
        vm.placeChanged = function() {
            console.log("here")
            vm.place = this.getPlace();
            console.log('location', vm.place.geometry.location);
            lat = vm.place.geometry.location.lat();
            lon = vm.place.geometry.location.lng();
            vm.map.setCenter(vm.place.geometry.location);
        }
        NgMap.getMap().then(function(map) {
            vm.map = map;
        });

        //Uploading images
        // $scope.$watch('files', function () {
        //     $scope.upload($scope.files);
        // });
        // $scope.$watch('file', function () {
        //     if ($scope.file != null) {
        //         $scope.files = [$scope.file];
        //     }
        // });
        // $scope.log = '';

        // $scope.upload = function (files) {
        //     if (files && files.length) {
        //         for (var i = 0; i < files.length; i++) {
        //             images.push(files[i]);
        //             var file = files[i];
        //             if (!file.$error) {
        //                 Upload.upload({
        //                     url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
        //                     data: {
        //                         username: $scope.username,
        //                         file: file
        //                     }
        //                 }).then(function (resp) {
        //                     $timeout(function() {
        //                         $scope.log = 'file: ' +
        //                             resp.config.data.file.name +
        //                             ', Response: ' + JSON.stringify(resp.data) +
        //                             '\n' + $scope.log;
        //                     });
        //                 });
        //             }
        //         }
        //     }
        // };
        var files;
        $scope.fileNameChanged = function(ele) {
            files = ele;
        }

        $scope.postItem = function(valid){
            ItemsFactory.saveImage(files)
            .then(function(data){
                if(valid){
                    data = {
                        "type": this.lost_found,
                        "title": this.item_name,
                        "description": this.item_descp,
                        "locationLat": lat,
                        "locationLon": lon,
                        "date": this.date,
                        "img": images
                    };
                    ItemsFactory.post(data).then(function(addedItem){
                        alert("Item added!");
                    }, function(error){
                        console.log(error);
                        return;
                    });

                }else{
                    console.log("Error posting item!");
                }
            }, function(error){
                console.log(error);
                return;
            });
        }

    }]
);

/**
 * ========================================
 * Controller for the search page
 * ========================================
 */
LAFControllers.controller('SearchController', ['$scope', 'NgMap', 'ItemsFactory',
    function($scope, NgMap, ItemsFactory) {

        NgMap.getMap().then(function(map) {
            $scope.map = map;
        });
        $scope.radius = 0;
        /**
         * Function that handles getting all the items around a point
         */
        $scope.getAroundMe = function() {

            $scope.found_items = [];
            $scope.center = { lat: $scope.map.shapes[0].center.lat(), lon: $scope.map.shapes[0].center.lng() };
            $scope.radius = $scope.map.shapes[0].radius;

            ItemsFactory.getFound().then(function(data){

                var foundItems = data['data'];
                for(var i = 0; i < foundItems.length; i++) {
                    if ("locationLat" in foundItems[i]) {
                        var distance = getDistanceFromLatLonInKm(
                            foundItems[i].locationLat,
                            foundItems[i].locationLon,
                            $scope.center.lat,
                            $scope.center.lon
                        );

                        if (distance * 1000 < $scope.radius) {
                            $scope.found_items.push(foundItems[i]);
                        }
                    }
                }
            },
            function(error) {
                console.log(error);
            });
        };

        /**
         * Function that shows a modal when a marker is clicked
         * @param item is the item object passed in from ng-click
         */
        $scope.showModal = function(item) {
            $scope.modalInfo = item;
        }
    }]
);

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}


/**
 * ========================================
 * Controller for the item details page
 * ========================================
 */
LAFControllers.controller('ItemDetails', ['$scope', '$routeParams', 'ItemsFactory',
    function($scope, $routeParams, ItemsFactory) {

        $scope.id = $routeParams.id;

        /**
         * Get lost items
         */
        ItemsFactory.getItemById($scope.id).then(function(item){
                $scope.item = item['data'][0];
            },
            function(error) {
                console.log(error);
            });
    }]
);

/**
 * ========================================
 * Controller for the edit page
 * ========================================
 */
LAFControllers.controller('EditController', ['$scope', '$routeParams', 'ItemsFactory',
    function($scope, $routeParams, ItemsFactory) {

        $scope.id = $routeParams.id;

        /**
         * Get lost items
         */
        ItemsFactory.getItemById($scope.id).then(function(item){
                $scope.item = item['data'][0];
            },
            function(error) {
                console.log(error);
            });
    }]
);

/**
 * ========================================
 * Controller for the listings
 * ========================================
 */
LAFControllers.controller('ListingsController', ['$scope', 'ItemsFactory',
    function($scope, ItemsFactory) {
        var user = JSON.parse(window.localStorage['user']);

        /**
         * Get lost items
         */
        ItemsFactory.getLost().then(function(data){
                $scope.lostItems = data['data'];
            },
            function(error) {
                console.log(error);
            });

        /**
         * Get found items
         */
        ItemsFactory.getFound().then(function(data){                
                $scope.foundItems = data['data'];
            },
            function(error) {
                console.log(error);
            });
    }]
);

/**
 * ========================================
 * Controller for the profile page
 * ========================================
 */
LAFControllers.controller('ProfileController', ['$scope', '$routeParams', 'ItemsFactory',
    function($scope, $routeParams, ItemsFactory) {

        $scope.user = JSON.parse(window.localStorage['user']);

        ItemsFactory.getByUserId($scope.user._id).then(function(items) {
            $scope.items = items['data'];
        }, function(error) {
            console.log("Profile page error:", error);
        });

        ItemsFactory.getLost().then(function(data){
                console.log(data['data']);
                $scope.lostItems = data['data'];
            },
            function(error) {
                console.log(error);
            });

        ItemsFactory.getFound().then(function(data){
                console.log(data['data']);
                $scope.foundItems = data['data'];
            },
            function(error) {
                console.log(error);
            });
    }]
);

/**
 * ========================================
 * Controller for the auth
 * ========================================
 */
//controller for user auth
LAFControllers.controller('authController', ['$scope', '$http','$location', 'AVATARS', 'ItemsFactory', function($scope, $http, $location, AVATARS, ItemsFactory){
    $scope.buttonText = 'login';
    $('#about-me').hide();

    //get random integer between min and max with min inclusive
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    //log/sign user in
    $scope.authenticate = function(){
        if($scope.buttonText === 'login') {
            var user = {
                username: $scope.username,
                password: $scope.password
            };
            
            ItemsFactory.login(user).then(function(user) {
                window.localStorage['user'] = angular.toJson(user);
                $location.url('/listings');
            }, function(error) {
                console.log("Login error", error);
            });
        } else if($scope.buttonText === 'signup') {
            var user = {
                username: $scope.username,
                password: $scope.password,
                about: $scope.about,
                img: AVATARS.urls[getRandomInt(0, 10)]
            };

            ItemsFactory.signup(user).then(function(user) {
                window.localStorage['user'] = angular.toJson(user);
                $location.url('/listings');
            }, function(error) {
                console.log("Signup error", error);
            });
        }
    };

    //change signup button text
    $scope.changeBtText = function() {
        $scope.buttonText = 'signup';
        $('#about-me').show();
    };

    //login button text
    $scope.loginText = function() {
        $scope.buttonText = 'login';
        $('#about-me').hide();
    };

    //show password on clicking checkbox
    $scope.showPassword = function() {
        var control = $('#test5');
        var obj = document.getElementById('password');
        if(control.is(':checked')) {
            obj.type = "text";
        } else {
            obj.type = "password";
        }
    }
}]);    
