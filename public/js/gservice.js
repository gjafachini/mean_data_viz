// Creates the gservice factory. This will be the primary means by which we interact with Google Maps
var gservice = angular.module('gservice', ['googlechart']);
gservice.controller('gservice', function($rootScope, $scope, $http){

  var chart1 = {};
  chart1.type = "GeoChart";
  chart1.data = [
        ['Locale', 'Count', 'Percent'],
        ['Germany', 22, 23],
        ['United States', 34, 11],
        ['Brazil', 42, 11],
        ['Canada', 57, 32],
        ['France', 6, 9],
        ['RU', 72, 3]
      ];

  chart1.options = {
      chartArea: {left:10,top:10,bottom:0,height:"100%"},
      colorAxis: {colors: ['red', 'green']},
      displayMode: 'regions',
      backgroundColor: '#81d4fa'
  };

  chart1.formatters = {
     number : [{
       columnNum: 1,
       pattern: "$ #,##0.00"
     }]
   };

  $scope.chart = chart1;

});