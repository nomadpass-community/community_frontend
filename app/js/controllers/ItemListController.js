'use strict';

myApp.controller('ItemController',
    function ItemListController($scope, $location, itemData) {
      $scope.items = itemData.getAllItems();

      $scope.navigateToDetails = function (item) {
        $location.url('/templates/' + item.name);
      };
    }
);