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

    //initial button text when user is not signed in
    $scope.buttonText = "Login/Sign Up";
    $('.feedback').hide();

    //check if user session is not null
    if(window.localStorage['user']) var user = JSON.parse(window.localStorage['user']);
        if(user){ //show logoout buttons
        $('.loginBt').hide();
        $scope.profileImg = user.img;
        $scope.profileName = "Hi " + user.username + "!";
        $scope.profileId = user._id;
        $('.feedback').show();
    } else { //show login buttons
        $('.loginBt').show();
        $('.feedback').hide();
    }

    //logout 
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

LAFControllers.controller('PostItemController', ['Upload', '$scope', 'NgMap', 'Upload', '$location', '$timeout', 'ItemsFactory', 'multipartForm',
    function(Upload, $scope, NgMap, Upload, $location, $timeout, ItemsFactory, multipartForm) {

        //getters and setters
        var user = JSON.parse(window.localStorage['user']);
        var id = user._id;
        var username = user.username;
        var user_img = user.img;
        var author = { "id": id, "username": username, "img": user_img };

        var lat;
        var lon;
        $scope.img = "";

        //initialize the datepicker and set and fetch values
        $('.datepicker').pickadate({
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 15, // Creates a dropdown of 15 years to control year
            onSet: function(context) {
              $scope.context = context;
              $scope.date = new Date($scope.context.select).toISOString();
          },
          onStart: function() {
            var date = new Date();
            this.set('select', [date.getFullYear(), date.getMonth(), date.getDate()]);
          }
        });

        //setting default value for radio btn
        $scope.lost_found = "Lost";

        //google map initializations
        var vm = this;
        vm.types = "['establishment']";
        vm.placeChanged = function() {
            vm.place = this.getPlace();

            lat = vm.place.geometry.location.lat();
            lon = vm.place.geometry.location.lng();
            $scope.lat = lat;
            $scope.lon = lon;
            vm.map.setCenter(vm.place.geometry.location);
        };

        NgMap.getMap().then(function(map) {
            vm.map = map;
        });


        //image upload logic
        $scope.$watch(function(){
            return $scope.file
        }, function(){
            $scope.upload($scope.file);
        });

        var imgPath;
        $scope.upload = function(file) {
            if(file) {
                Upload.upload({
                    url: '/api/saveImage',
                    method: 'POST',
                    data: {
                        file: file
                    }
                }).progress(function(evt){
                    console.log('firing!');
                }).success(function(data){
                    imgPath = data;
                }).error(function(err){
                    console.log(err);
                });
            }
        }

        //post item
        $scope.postItem = function(valid){
            data = {
                "type": this.lost_found,
                "title": this.item_name,
                "description": this.item_descp,
                "locationLat": lat,
                "locationLon": lon,
                "date": $scope.date,
                "img": imgPath,
                "author": author
            };

            if (valid) {
                ItemsFactory.post(data).then(function(addedItem){
                    console.log("Post successful:", addedItem);
                    $location.url('/listings');
                }, function(error){
                    console.log(error);
                });
            }
        }
    }]
);

/**
 * ========================================
 * Controller for the search page
 * ========================================
 */
LAFControllers.controller('SearchController', ['$scope', '$timeout', 'NgMap', 'ItemsFactory',
    function($scope, $timeout, NgMap, ItemsFactory) {

        //map logic
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
LAFControllers.controller('ItemDetails', ['$scope', '$http', '$routeParams', '$timeout', '$location', 'ItemsFactory',
    function($scope, $http, $routeParams, $timeout, $location, ItemsFactory) {

        //init getters and setters
        $scope.id = $routeParams.id;
        $scope.user = JSON.parse(window.localStorage['user']);

        /**
         * timeout for maps lazy load
         */
        $scope.pauseLoading=true;
        $timeout(function() {
            console.debug("Showing the map. The google maps api should load now.");
            $scope.pauseLoading=false;
        }, 3000);

        /**
         * Get lost items
         */
        ItemsFactory.getItemById($scope.id).then(function(item){
                $scope.item = item['data'][0];
                if ($scope.item.author.id === $scope.user._id) {
                    $('.delete_edit').show();
                } else {
                    $('.delete_edit').hide();
                }
                $http.get("http://maps.googleapis.com/maps/api/geocode/json?latlng="+ $scope.item.locationLat + ","+$scope.item.locationLon+"&sensor=true")
                .success(function(data){
                    $scope.address = data.results[0].formatted_address;
                    $scope.address = $scope.address.substring(0, $scope.address.length - 10);
                    console.log($scope.address);
                });
            },
            function(error) {
                console.log(error);
            });

        /**
         * Deleting the current item
         */
        $scope.deleteItem = function() {
            ItemsFactory.delete($scope.id).then(function(item){
                    console.log("Deleted: ", item);
                    $location.path( "/listings" );
                },
                function(error) {
                    console.log(error);
                });
        };
    }]
);

/**
 * ========================================
 * Controller for the edit page
 * ========================================
 */
LAFControllers.controller('EditController', ['$scope', '$routeParams', '$location', 'ItemsFactory', 'NgMap',
    function($scope, $routeParams, $location, ItemsFactory, NgMap) {

        $scope.id = $routeParams.id;

        var vm = this;
        var lat;
        var lon;
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

        /**
         * Get lost items
         */
        ItemsFactory.getItemById($scope.id).then(function(item){
                $scope.item = item['data'][0];
                // $scope.item_name = $scope.item.title;
                // $scope.item_description = $scope.item.description;
                // $scope.item_img = $scope.item.img;
                // lat = $scope.item.locationLat;
                // lon = $scope.item.locationLon;
            },
            function(error) {
                console.log(error);
            });
        $scope.obj = {};
        $scope.editItem = function(valid){
            if(valid){
                $scope.item['title'] = $scope.obj.item_name;
                $scope.item['description'] = $scope.obj.item_description;
                $scope.item['locationLat'] = lat;
                $scope.item['locationLon'] = lon;
                $scope.item['img'] = $scope.obj.item_img;
                ItemsFactory.put($scope.item).then(function(updatedUser){
                   console.log("user updated!");
                   $location.url('/listings');
                });
            }else{
                console.log("edit failed!");
            }
        }
    }]
);

/**
 * ========================================
 * Controller for the listings
 * ========================================
 */
LAFControllers.controller('ListingsController', ['$scope', 'ItemsFactory',
    function($scope, ItemsFactory) {

        if(window.localStorage['user']) var user = JSON.parse(window.localStorage['user']);

        var preloadLostItems = [];
        var preloadFoundItems = [];

        $scope.page = 1;
        $scope.reverse = true;
        $scope.propertyName = "postDate";

        /**
         * Initial loading and preloading of data
         */
        ItemsFactory.getItemsByPage($scope.page, "Lost").then(function(items) {
            $scope.lostItems = items['data'];
            preloadLostItems = items['data'];
            $scope.type = "Lost";
        }, function(error) {
            console.log("Getting found items failed: ", error);
        });

        ItemsFactory.getItemsByPage($scope.page, "Found").then(function(items) {
            preloadFoundItems = items['data'];
        }, function(error) {
            console.log("Getting found items failed: ", error);
        });

        /**
         * Controls the logic for changing tabs. To increase speed, tabs are preloaded before hand
         */
        $scope.changeToFound = function() {

            // Setting the preloaded lost items
            $scope.lostItems = preloadFoundItems;
            $scope.type = "Found";

            //preloading first page of lost items in background
            $scope.page = 1;
            ItemsFactory.getItemsByPage($scope.page, "Lost").then(function(items) {
                preloadLostItems = items['data'];
            }, function(error) {
                console.log("Getting found items failed: ", error);
            });
        };

        $scope.changeToLost = function() {

            // Setting the preloaded lost items
            $scope.lostItems = preloadLostItems;
            $scope.type = "Lost";

            // Preloading first page of found items in background
            $scope.page = 1;
            ItemsFactory.getItemsByPage($scope.page, "Found").then(function(items) {
                preloadFoundItems = items['data'];
            }, function(error) {
                console.log("Getting found items failed: ", error);
            });
        };
    }]
);

/**
 * ========================================
 * Controller for the profile page
 * ========================================
 */
LAFControllers.controller('ProfileController', ['$scope', '$routeParams', 'ItemsFactory', 'UsersFactory',
    function($scope, $routeParams, ItemsFactory, UsersFactory) {

        //fetch current user
        UsersFactory.getUserById($routeParams.id).then(function(user) {
            $scope.user = user['data'];
            return ItemsFactory.getByUserId($routeParams.id);
        }).then(function(items) {
            $scope.items = items['data'];
        }, function(error) {
            console.log("Profile page error:", error);
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
