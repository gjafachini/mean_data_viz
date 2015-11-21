var filterCtrl = angular.module('filterCtrl', ['checklist-model']);
filterCtrl.controller('filterCtrl', function($rootScope, $scope, $http){

    $scope.sectors = ['Agriculture', 
                      'Arts', 
                      'Clothing', 
                      'Construction', 
                      'Education',
                      'Entertainment', 
                      'Food', 
                      'Retail', 
                      'Health', 
                      'Personal Use',
                      'Housing', 
                      'Manufacturing', 
                      'Services', 
                      'Transportation', 
                      'Wholesale'];
    
    $scope.filter = {
        sectors: ['Agriculture', 
                      'Arts', 
                      'Clothing', 
                      'Construction', 
                      'Education',
                      'Entertainment', 
                      'Food', 
                      'Retail', 
                      'Health', 
                      'Personal Use',
                      'Housing', 
                      'Manufacturing', 
                      'Services', 
                      'Transportation', 
                      'Wholesale']
    };

    $scope.checkAll = function() {
        $scope.filter.sectors = $scope.sectors.map(function(item) { return item; });
    };
    
    $scope.uncheckAll = function() {
        $scope.filter.sectors = [];
    };
});