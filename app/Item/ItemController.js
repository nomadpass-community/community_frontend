'use strict';

myApp.controller('ItemController',
    function ItemListController($scope, $location, itemData) {
      $scope.item = itemData.getItem($routeParams.itemId);


        $scope.navigateToDetails = function (item) {
        $location.url('/item/' + item.id);

      };

    }
);