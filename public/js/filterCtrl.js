var filterCtrl = angular.module('filterCtrl', ['checklist-model', 'googlechart']);
google.load('visualization', '1', { packages: ['Geochart', 'table'] });
filterCtrl.controller('filterCtrl', function($filter, $scope, $http){

    var options = {
        //legend:'null',
        colorAxis: {colors: ['#e31b23', 'white', '#4374e0']},
        //sizeAxis: {minValue: 0, maxSize: 50},
        backgroundColor: '#81d4fa'
    };

    function format(n, currency) {
        return currency + " " + n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
    }

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

    $scope.queryRanks = function() {
        // Post the queryRanks to the /queryRanks POST route to retrieve the filtered results

        if($scope.filter.sectors.length != 0) {
            $http.post('/queryRanks', $scope.filter)
                // Store the filtered results in queryResults
                .success(function(queryResult){
                    // Pass the filtered results to the Google Map Service and refresh the map

                    var map_data = new google.visualization.DataTable();
                    map_data.addColumn('string', 'Country');
                    map_data.addColumn('number', 'Balance');

                    for(var i=0; i<queryResult.length; i++) {
                        if (queryResult[i].debt != null) {
                            if(queryResult[i].country == 'US') {
                                map_data.addRow([queryResult[i].country,
                                    {v:Number(600000), f:format(Number(600000), "")}]);
                            } else {
                                map_data.addRow([queryResult[i].country,
                                    {v:Number(queryResult[i].debt), f:format(Number(queryResult[i].debt), "")}]);
                            }
                        }
                    }

                    $scope.Geochart = new google.visualization.GeoChart(document.getElementById('Geochart'));
                    $scope.Geochart.draw(map_data, options);

                    // Update table
                    console.log("Loading Table");

                    var query_data = new google.visualization.DataTable();
                    query_data.addColumn('string', 'Country');
                    query_data.addColumn('number', 'Balance');
                    query_data.addColumn('number', 'Lends');
                    query_data.addColumn('number', 'Loans');

                    for(var i=0; i<queryResult.length; i++) {
                        if (queryResult[i].debt != null) {
                            query_data.addRow([queryResult[i].country,
                                {v:Number(queryResult[i].debt), f:format(Number(queryResult[i].debt), "")},
                                {v:Number(queryResult[i].lends), f:format(Number(queryResult[i].lends), "")},
                                {v:Number(queryResult[i].loans), f:format(Number(queryResult[i].loans), "")}]);
                        }
                    }

                    $scope.table = new google.visualization.Table(document.getElementById('table'));
                    $scope.table.draw(query_data, {width: '100%', height: '100%'});

                    google.visualization.events.addListener($scope.Geochart, 'select',function () {
                        
                        $scope.table.setSelection($scope.Geochart.getSelection());                   
                        var selection = $scope.Geochart.getSelection();            
                        
                        //PARA RETORNAR VALOR DO PAIS SELECIONADO: data.getValue(selection[0].row, 0)
                        console.log(query_data.getValue(selection[0].row, 0));

                        if (selection.length > 0) {
                            
                            var view = new google.visualization.DataView(query_data);
                            
                            view.setColumns([0, {
                                type: 'number',
                                label: query_data.getColumnLabel(1),
                                calc: function (dt, row) {
                                    return dt.getValue(row, 1);
                                }
                            }]);
                            
                            Geochart.draw(view, options);
                        }
                        else {
                            Geochart.draw(query_data, options);
                        }
                    });
                })
                .error(function(queryResult){
                    console.log('Error ' + queryResult);
                })
            } else {
                var map_data = new google.visualization.DataTable();
                map_data.addColumn('string', 'Country');
                map_data.addColumn('number', 'Balance');

                var query_data = new google.visualization.DataTable();
                query_data.addColumn('string', 'Country');
                query_data.addColumn('number', 'Balance');
                query_data.addColumn('number', 'Lends');
                query_data.addColumn('number', 'Loans');

                $scope.Geochart = new google.visualization.GeoChart(document.getElementById('Geochart'));
                $scope.Geochart.draw(map_data, options);

                $scope.table = new google.visualization.Table(document.getElementById('table'));
                $scope.table.draw(query_data, {width: '100%', height: '100%'});

            }
    }

    $scope.queryRanks();
});