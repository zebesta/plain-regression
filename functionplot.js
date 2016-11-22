var numeric = require("numeric");
// var nj = require('numjs');

// var X;
// var Y;
// var theta;
// var globalData;
var stringSteps = [];
var GLOBAL_COST = [];
var globalData;
var stop = false;

//construct plot with data as an array of 2 number arrays and strFunction being a string describing what y equals
function execute(data, strFunction, cost){
  // console.log("Executing");
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
  // console.log("UPDATING HTML!")
  document.getElementById("function").innerHTML = strFunction;
  document.getElementById("cost").innerHTML = '' + cost;
};

function randomize(){
  var alpha, iterations;
  alpha = document.getElementById("alpha").value;
  iterations = document.getElementById("iterations").value;

  var randomData = [];
  //generate a random data set of 10-100 x,y values
  for(var i = 0; i<Math.floor(Math.random() * 90 + 10); i++){
    randomData.push(getRandDataPt(20))
  }
  buildXY(randomData, alpha, iterations)
};

//build a plot with known data
function known(){
  var alpha, iterations;
  alpha = document.getElementById("alpha").value;
  iterations = document.getElementById("iterations").value;
  var data =[];
  for(var i = 0; i<10; i++){
    data.push([i/2, i*1.5+5]);
  }
  buildXY(data, alpha, iterations);
};

function resolve(){
  var alpha, iterations;
  alpha = document.getElementById("alpha").value;
  iterations = document.getElementById("iterations").value;
  //hacky double set, probably need to fix this
  data = globalData;
  buildXY(data, alpha, iterations);
}



//generate random data point within the range
function getRandDataPt(range){
  return [(Math.random() * range)-range/2, (Math.random() * range)-range/2]
}

function buildXY(data, alpha, iterations){
  globalData = data;
  var X=[[]];
  var Y=[];
  var theta = [[]];
  for(var i = 0; i<data.length; i++){
    //populate X with 1 and X value for each row
    X[i] = [1, data[i][0]];
    Y[i] = [data[i][1]];
  }
  //build theta based on X dimention
  for(var i =0; i<X[0].length; i++){
    theta[0][i] = 0;
  }
  //convert to the vector it should be
  console.log(numeric.prettyPrint(X));
  console.log(numeric.prettyPrint(theta));
  console.log(numeric.prettyPrint(Y));
  var arrReturn = gradientDescent(X,Y,theta, alpha, iterations, data);
  var ntheta = arrReturn[0];
  var ncost = arrReturn[1];
  console.log("RESULTS!");
  numeric.prettyPrint(ntheta);
  numeric.prettyPrint(ncost);
}


function iterate(){
  var step = parseInt(document.getElementById("step").value);
  if(step < stringSteps.length-1){
    var i = step+1;
    document.getElementById("step").value = i;
    execute(globalData, stringSteps[i], GLOBAL_COST[i]);
  }
}
function playButton(){
  stop = false;
  play();
}
function play(){
  //keep playing if stop button has not been pressed
  if(!stop){
    setTimeout(()=>{
      var step = parseInt(document.getElementById("step").value);
      if(step < stringSteps.length-1 && !stop){
        var i = step+1;
        document.getElementById("step").value = i;
        execute(globalData, stringSteps[i], GLOBAL_COST[i]);
        play();
      }
    }, 200)
  }
}

function stopButton(){
  stop = true;
  console.log("Stopping!");
}


//computes the cost of a linear regression function
function computeCost(X, Y, theta){
  console.log("cost");

  var xt = numeric.dot(X, numeric.transpose(theta));
  // console.log(numeric.prettyPrint(xt));
  var term = numeric.sub(xt, Y);
  // console.log(numeric.prettyPrint(term));
  var term2 = numeric.pow(term, 2);

  var cost = numeric.sum(term2)/(2*theta[0].length);
  console.log(cost);
  // gradientDescent(X,Y,theta,0.01,20);
  return cost;

}

//Gradient descent to converge to the solution
function gradientDescent(X, Y, theta, alpha, iters, data){
  console.log("Grad descent");
  //temp is a matrix of 0s as same dimensions of theta
  var temp = numeric.mul(theta, 0);

  //construct array of historical costs with size of iters
  var cost = [];
  for(var i = 0; i<iters;i++){
    cost.push(0);
  }


  //for each iteration
  for(var i=0; i<cost.length; i++){
    // console.log("Iteration")

    var error = numeric.sub(numeric.dot(X, numeric.transpose(theta)), Y);
    console.log("error:");
    console.log(numeric.prettyPrint(error));

    //for each parameter in X
    for(var j=0; j<theta[0].length; j++){
      // console.log("Param");
      // console.log(j);
      // console.log(numeric.prettyPrint(error));
      // console.log(numeric.prettyPrint(numeric.transpose(X)[j]));
      var term = numeric.dot(numeric.transpose(X)[j], error);
      // console.log(numeric.prettyPrint(term));
      // console.log(alpha/X[0].length);
      // console.log(numeric.sum(term));
      temp[0][j] = theta[0][j] - ((alpha/X[0].length) * numeric.sum(term));
    }
    // console.log("Temp:");
    // console.log(numeric.prettyPrint(temp));
    theta = temp;
    cost[i] = computeCost(X, Y, theta);
    console.log("The cost at iteration " + i + " is " +cost[i])
    console.log("Theta is: ");
    console.log(numeric.prettyPrint(theta));

    var strFunction = ''+theta[0][1]+'x+'+theta[0][0];
    stringSteps[i] = strFunction;
    document.getElementById("step").value = -1;
    execute(data, '0', '0');

  }

  GLOBAL_COST = cost;
  plotcost(GLOBAL_COST);
  return [theta, cost];

}


function plotcost(cost){
  //turn cost array into xy points
  costPoints = [];
  for(var i =0; i<cost.length; i++){
    costpt = [i,cost[i]];
    costPoints.push(costpt);
  }
  //plot cost vs iteration
  functionPlot({
    target: '#costplot',
    xAxis: {
      domain: [-10, cost.length],
      label: 'Itertaions'
    },
    yAxis: {
      domain: [-10, cost[0]*1.5],
      label: 'Cost'
    },
    data: [{
      fnType: 'points',
      graphType: 'polyline',
      points: costPoints
    }]
  });

}


//export button function to the window
window.playButton = playButton;
window.stopButton = stopButton;
window.randomize = randomize;
window.iterate = iterate;
window.known = known;
window.resolve = resolve;
