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
      fn: strFunction
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
  build(randomData)
};

//build a plot with known data
function known(){
  var data =[];
  for(var i = 0; i<10; i++){
    data.push([i, i]);
  }
  build(data);
};

function build(data){
  buildXY(data);
  execute(data, '0');
}

//generate random data point within the range
function getRandDataPt(range){
  return [(Math.random() * range)-range/2, (Math.random() * range)-range/2]
}

function buildXY(data){
  X=[[]];
  Y=[[]];
  theta = [[]];
  for(var i = 0; i<data.length; i++){
    //populate X with 1 and X value for each row
    X[i] = [1, data[i][0]];
    Y[0][i] = [data[i][1]];
  }
  //build theta based on X dimention
  for(var i =0; i<X.length; i++){
    theta[0][i] = 0;
  }
  //convert to the vector it should be
  console.log(numeric.prettyPrint(X));
  console.log(numeric.prettyPrint(theta));
  console.log(numeric.prettyPrint(Y));
  computeCost(X,Y,theta);
}


function iterate(){

}

function computeCost(X, Y, theta){
  console.log("cost");
  console.log(numeric.prettyPrint(numeric.transpose(theta)));
  var xt = numeric.dot(X, theta);
  console.log(numeric.prettyPrint(xt));
  var xt2 = numeric.exp(xt, 2);
  console.log(numeric.prettyPrint(xt2));
  var cost = numeric.sum(xt2)/(2*theta.length);
  console.log(cost);
  return cost;

}
function linearRegression(X, Y, theta, alpha, iters){
  //temp is a matrix of 0s as same dimensions of theta
  var temp = numeric.mul(theta, 0);


}

//export button function to the window
window.randomize = randomize;
window.iterate = iterate;
window.known = known;
