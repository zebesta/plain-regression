var ndarray = require("ndarray");
var numeric = require("numeric");
// var nj = require('numjs');

var X;
var Y;
var theta;

//construct plot with data as an array of 2 number arrays and strFunction being a string describing what y equals
function execute(data, strFunction){
  console.log("Executing");
  functionPlot({
    target: '#myplot',
    xAxis: {domain: [-10, 10]},
    yAxis: {domain: [-10, 10]},
    data: [{
      fn: strFunction,
      derivative: {
        fn: '5x^4',
        updateOnMouseMove: true
      }
    },{
      fnType: 'points',
      graphType: 'scatter',
      points: data
    }]
  });


};

function randomize(){
  var randomData = [];
  //generate a random data set of 10-100 x,y values
  for(var i = 0; i<Math.floor(Math.random() * 90 + 10); i++){
    randomData.push(getRandDataPt(20))
  }
  buildXY(randomData);
  execute(randomData, 'x')
}

//generate random data point within the range
function getRandDataPt(range){
  return [(Math.random() * range)-range/2, (Math.random() * range)-range/2]
}

function buildXY(data){
  X=[[]];
  Y=[[]];
  theta = [];
  for(var i = 0; i<data.length; i++){
    //populate X with 1 and X value for each row
    X[0][i] = [1, data[i][0]];
    Y[0][i] = [data[i][1]];
    theta[i] = 0;
  }
  console.log(X);
  console.log(theta);
  console.log(Y);
  computeCost(X,Y,theta)
}


function iterate(){

}

function computeCost(X, Y, theta){

}
function linearRegression(){

}

//export button function to the window
window.randomize = randomize;
window.iterate = iterate;
