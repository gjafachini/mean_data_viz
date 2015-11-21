var filterCtrl = angular.module('filterCtrl', ['checklist-model', 'googlechart']);
filterCtrl.controller('filterCtrl', function($scope, $http){

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

    $scope.updateMaps = function(queryResults) {
        var chart1 = {};
        chart1.type = "GeoChart";

        chart1.data = [['Country', 'Debt']];
        for(var i=0; i<queryResults.length; i++) {
            chart1.data[i+1] = [queryResults[i].country, queryResults[i].debt];
        }

        chart1.options = {
            chartArea: {left:10,top:10,bottom:0,height:"100%"},
            colorAxis: {colors: ['red', 'green']},
            displayMode: 'regions',
            backgroundColor: '#81d4fa'
        };

        chart1.formatters = {
            number : [{columnNum: 1, pattern: "$ #,##0.00"}]
        };

        $scope.chart = chart1;
    }

    $scope.queryRanks = function() {

        console.log("Filter:");
        console.log($scope.filter);

        // Post the queryRanks to the /queryRanks POST route to retrieve the filtered results
        $http.post('/queryRanks', $scope.filter)
            // Store the filtered results in queryResults
            .success(function(queryResult){
                console.log(queryResult);

                // Pass the filtered results to the Google Map Service and refresh the map
                $scope.updateMaps(queryResult);

                // Update table
                $scope.country_data = queryResult;
            })
        
            .error(function(queryResult){
                console.log('Error ' + queryResult);
            })
        
    }

    $scope.country_data = $scope.queryRanks();

});