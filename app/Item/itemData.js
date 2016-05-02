'use strict';

myApp.factory('itemData', function (itemResource, authService) {
    return {

        getItem: function(itemId, callback) {
            return itemResource.get({id:itemId}, function(item) {
                if (callback)
                    callback(item);
            });
        },
        getAllItems: function(callback) {
            return itemResource.queryAll(callback);
        },
        getNextSessionId:function (item) {
            var max = 0;
            for (var idx = 0; idx < item.sessions.length; idx++) {
                if (item.sessions[idx].id > max) {
                    max = item.sessions[idx].id;
                }
            }
            return max+1;
        }
    };

    function getNextItemId(items) {
        var max = 0;
        for (var idx = 0; idx < items.length; idx++) {
            if (items[idx].id > max) {
                max = items[idx].id;
            }
        }
        return max+1;
    }

    function populateItem(item){
        item.description = 'Choke From Guard';
        item.templateUrl = 'templates/choke from guard.html';
        item.gifUrl = 'http://www.ninjacomapps.com/wp-content/uploads/2015/07/choke-from-guard.gif';
        item.movieUrl = 'http://www.ninjacomapps.com/wp-content/uploads/2015/04/101_choke_from_guard.mp4';
        item.favorite = true;
        return item;
    }
});