var ndarray = require("ndarray")
//construct plot with data as an array of 2 number arrays and strFunction being a string describing what y equals
function execute(data, strFunction){
  console.log(ndarray);
  if(data && strFunction){
    functionPlot({
      target: '#demo',
      data: [{
        fn: strFunction,
        derivative: {
          fn: '2x',
          updateOnMouseMove: true
        }
      },{
        fnType: 'points',
        graphType: 'scatter',
        points: data
      }]
    });
  }else{
    functionPlot({
      target: '#demo',
      data: [{
        fn: 'x^2',
        derivative: {
          fn: '2x',
          updateOnMouseMove: true
        }
      },{
        fnType: 'points',
        graphType: 'scatter',
        points: [[1,2],[2,2],[3,2]]
      }]
    });
  }

};

function randomize(){
  var randomData = [];
  for(var i = 0; i<Math.floor(Math.random() * 100); i++){
    randomData.push(getRandDataPt(3))
  }
  console.log(randomData)
  execute(randomData, 'x^5')
}

function getRandDataPt(max){
  return [(Math.random() * max), (Math.random() * max)]
}
window.execute = execute;
window.randomize = randomize;
