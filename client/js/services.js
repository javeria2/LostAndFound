var LAFServices = angular.module('LAFServices', []);

/**
* ========================================
* Factory for items endpoint
* ========================================
*/
LAFServices.factory('ItemsFactory', function($http, $window, $q, $location) {
    // var baseUrl = 'http://fa16-cs498rk-050.cs.illinois.edu:4000/api';
    var baseUrl = '/api';
    return {
        getLost : function() {
            return $http.get(baseUrl+'/items?where={"type": "Lost"}')
                .then(function(response) {
                    if (typeof response.data === 'object') {
                        return response.data;
                    } else {
                        // invalid response
                        return $q.reject(response.data);
                    }
                }, function(response) {
                    // something went wrong
                    return $q.reject(response.data);
                });
        },
        getFound : function() {
            return $http.get(baseUrl+'/items?where={"type": "Found"}')
                .then(function(response) {
                    if (typeof response.data === 'object') {
                        return response.data;
                    } else {
                        // invalid response
                        return $q.reject(response.data);
                    }
                }, function(response) {
                    // something went wrong
                    return $q.reject(response.data);
                });
        },
        getByUserId : function(id) {
            console.log("ID is", id);
            return $http.get(baseUrl+'/items?where={"author.id": \"' + id + '\"}')
                .then(function(response) {
                    if (typeof response.data === 'object') {
                        return response.data;
                    } else {
                        // invalid response
                        return $q.reject(response.data);
                    }
                }, function(response) {
                    // something went wrong
                    return $q.reject(response.data);
                });
        },
        getItemById : function(id) {
            return $http.get(baseUrl+'/items?where={_id:\"'+id+'\"}')
                .then(function(response) {
                    if (typeof response.data === 'object') {
                        return response.data;
                    } else {
                        // invalid response
                        return $q.reject(response.data);
                    }
                }, function(response) {
                    // something went wrong
                    return $q.reject(response.data);
                });
        },
        post: function(data) {
            return $http.post(baseUrl+'/items', data)
                .then(function(response) {
                    if (typeof response.data === 'object') {
                        return response.data;
                    } else {
                        // invalid response
                        return $q.reject(response.data);
                    }
                }, function(response) {
                    // something went wrong
                    return $q.reject(response.data);
                });
        },
        delete: function(id) {
            return $http.delete(baseUrl+'/items/'+id)
                .then(function(response) {
                    if (typeof response.data === 'object') {
                        return response.data;
                    } else {
                        // invalid response
                        return $q.reject(response.data);
                    }
                }, function(response) {
                    // something went wrong
                    return $q.reject(response.data);
                });
        },
        put: function(updateUser) {
            return $http.put(baseUrl+'/items/' + updateUser._id, updateUser)
                .then(function(response) {
                    if (typeof response.data === 'object') {
                        return response.data;
                    } else {
                        // invalid response
                        return $q.reject(response.data);
                    }
                }, function(response) {
                    // something went wrong
                    return $q.reject(response.data);
                });
        },
        signup: function(user){
            return $http.post(baseUrl + "/signup", user)
                .then(function(response) {
                    if (typeof response.data === 'object') {
                        return response.data;
                    } else {
                        // invalid response
                        return $q.reject(response.data);
                    }
                }, function(response) {
                    // something went wrong
                    return $q.reject(response.data);
                });
        },
        login: function(user){
            return $http.post(baseUrl + "/login", user)
                .then(function(response) {
                    if (typeof response.data === 'object') {
                        return response.data;
                    } else {
                        // invalid response
                        return $q.reject(response.data);
                    }
                }, function(response) {
                    // something went wrong
                    return $q.reject(response.data);
                });
        },
        saveImage: function(img) {
            console.log(img.files[0]);
            return $http.post(baseUrl + '/saveImage', img.files)
            .then(function(response){
                if (typeof response.data === 'object') {
                        return response.data;
                    } else {
                        // invalid response
                    return $q.reject(response.data);
                }
            }, function(response){
                return $q.reject(response.data);
            });
        }
    }
});

/**
 * ========================================
 * Factory for users endpoint
 * ========================================
 */
LAFServices.factory('UsersFactory', function($http, $window, $q, $location) {
    var baseUrl = '/api';
    return {
        getUserById: function (id) {
            return $http.get(baseUrl + '/users/' + id)
                .then(function (response) {
                    if (typeof response.data === 'object') {
                        return response.data;
                    } else {
                        // invalid response
                        return $q.reject(response.data);
                    }
                }, function (response) {
                    // something went wrong
                    return $q.reject(response.data);
                });
        }
    }
});

LAFServices.service('multipartForm', ['$http', function($http){
    this.post = function(data){
        console.log(data);
        var fd = new FormData();
        for(var key in data) {
            fd.append(key, data[key]);
        }
        console.log(fd);
        $http.post('/api/saveImage', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
    }
}]);    

