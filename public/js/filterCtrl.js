var filterCtrl = angular.module('filterCtrl', ['checklist-model', 'googlechart', 'ngTable']);
google.load('visualization', '1', { packages: ['Geochart', 'table'] });
filterCtrl.controller('filterCtrl', function($filter, $scope, $http, ngTableParams){

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
            if (queryResults[i].debt != null) {
                chart1.data[i+1] = [queryResults[i].country, queryResults[i].debt];
                console.log(chart1.data[i+1]);                
            }
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

        // Post the queryRanks to the /queryRanks POST route to retrieve the filtered results
        $http.post('/queryRanks', $scope.filter)
            // Store the filtered results in queryResults
            .success(function(queryResult){
                // Pass the filtered results to the Google Map Service and refresh the map
                ///$scope.updateMaps(queryResult);

                // Update table
                console.log("Loading Table");

                $scope.tableParams = new ngTableParams({
                    page: 1,            // show first page
                    total: queryResult.length, // length of data
                    count: 10,           // count per page
                    sorting: { debt: "desc" },
                });

                $scope.$watch('tableParams', function(params) {
                    console.log(params);

                    var orderedData = params.sorting ? $filter('orderBy')(queryResult, params.orderBy()) : queryResult;

                    $scope.table_data = orderedData;
                    console.log($scope.table_data);
                }, true);
            })
        
            .error(function(queryResult){
                console.log('Error ' + queryResult);
            })
        
    }

    $scope.queryRanks();
});