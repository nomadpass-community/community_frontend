'use strict';

myApp.factory('itemResource', ['$resource', function ($resource) {
    var service = $resource('/data/item/:id', {id:'@id'});

    service.queryAll = function (cb) {
        return service.query({}, cb)
    };

    return service;
}]);