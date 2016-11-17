(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var numeric = require("numeric");
// var nj = require('numjs');

// var X;
// var Y;
// var theta;

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
    data.push([i/2, i*1.5+1]);
  }
  buildXY(data, alpha, iterations);
};



//generate random data point within the range
function getRandDataPt(range){
  return [(Math.random() * range)-range/2, (Math.random() * range)-range/2]
}

function buildXY(data, alpha, iterations){
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

}


//computes the cost of a linear regression function
function computeCost(X, Y, theta){
  console.log("cost");
  // console.log(numeric.prettyPrint(numeric.transpose(theta)));
  var xt = numeric.dot(X, theta);
  // console.log(numeric.prettyPrint(xt));
  var xt2 = numeric.exp(xt, 2);
  // console.log(numeric.prettyPrint(xt2));
  var cost = numeric.sum(xt2)/(2*theta.length);
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
      console.log("Param");
      console.log(j);
      console.log(numeric.prettyPrint(error));
      console.log(numeric.prettyPrint(numeric.transpose(X)[j]));
      var term = numeric.dot(numeric.transpose(X)[j], error);
      console.log(numeric.prettyPrint(term));
      console.log(alpha/X[0].length);
      console.log(numeric.sum(term));
      temp[0][j] = theta[0][j] - ((alpha/X[0].length) * numeric.sum(term));
    }
    console.log("Temp:");
    console.log(numeric.prettyPrint(temp));
    theta = temp;
    cost[i] = computeCost(X, Y, theta);
    console.log("The cost at iteration " + i + " is " +cost[i])
    console.log("Theta is: ");
    console.log(numeric.prettyPrint(theta));


    var strFunction = ''+theta[0][1]+'x+'+theta[0][0];
    execute(data, strFunction);

  }


  return [theta, cost];

}

//export button function to the window
window.randomize = randomize;
window.iterate = iterate;
window.known = known;

},{"numeric":2}],2:[function(require,module,exports){
(function (global){
"use strict";

var numeric = (typeof exports === "undefined")?(function numeric() {}):(exports);
if(typeof global !== "undefined") { global.numeric = numeric; }

numeric.version = "1.2.6";

// 1. Utility functions
numeric.bench = function bench (f,interval) {
    var t1,t2,n,i;
    if(typeof interval === "undefined") { interval = 15; }
    n = 0.5;
    t1 = new Date();
    while(1) {
        n*=2;
        for(i=n;i>3;i-=4) { f(); f(); f(); f(); }
        while(i>0) { f(); i--; }
        t2 = new Date();
        if(t2-t1 > interval) break;
    }
    for(i=n;i>3;i-=4) { f(); f(); f(); f(); }
    while(i>0) { f(); i--; }
    t2 = new Date();
    return 1000*(3*n-1)/(t2-t1);
}

numeric._myIndexOf = (function _myIndexOf(w) {
    var n = this.length,k;
    for(k=0;k<n;++k) if(this[k]===w) return k;
    return -1;
});
numeric.myIndexOf = (Array.prototype.indexOf)?Array.prototype.indexOf:numeric._myIndexOf;

numeric.Function = Function;
numeric.precision = 4;
numeric.largeArray = 50;

numeric.prettyPrint = function prettyPrint(x) {
    function fmtnum(x) {
        if(x === 0) { return '0'; }
        if(isNaN(x)) { return 'NaN'; }
        if(x<0) { return '-'+fmtnum(-x); }
        if(isFinite(x)) {
            var scale = Math.floor(Math.log(x) / Math.log(10));
            var normalized = x / Math.pow(10,scale);
            var basic = normalized.toPrecision(numeric.precision);
            if(parseFloat(basic) === 10) { scale++; normalized = 1; basic = normalized.toPrecision(numeric.precision); }
            return parseFloat(basic).toString()+'e'+scale.toString();
        }
        return 'Infinity';
    }
    var ret = [];
    function foo(x) {
        var k;
        if(typeof x === "undefined") { ret.push(Array(numeric.precision+8).join(' ')); return false; }
        if(typeof x === "string") { ret.push('"'+x+'"'); return false; }
        if(typeof x === "boolean") { ret.push(x.toString()); return false; }
        if(typeof x === "number") {
            var a = fmtnum(x);
            var b = x.toPrecision(numeric.precision);
            var c = parseFloat(x.toString()).toString();
            var d = [a,b,c,parseFloat(b).toString(),parseFloat(c).toString()];
            for(k=1;k<d.length;k++) { if(d[k].length < a.length) a = d[k]; }
            ret.push(Array(numeric.precision+8-a.length).join(' ')+a);
            return false;
        }
        if(x === null) { ret.push("null"); return false; }
        if(typeof x === "function") { 
            ret.push(x.toString());
            var flag = false;
            for(k in x) { if(x.hasOwnProperty(k)) { 
                if(flag) ret.push(',\n');
                else ret.push('\n{');
                flag = true; 
                ret.push(k); 
                ret.push(': \n'); 
                foo(x[k]); 
            } }
            if(flag) ret.push('}\n');
            return true;
        }
        if(x instanceof Array) {
            if(x.length > numeric.largeArray) { ret.push('...Large Array...'); return true; }
            var flag = false;
            ret.push('[');
            for(k=0;k<x.length;k++) { if(k>0) { ret.push(','); if(flag) ret.push('\n '); } flag = foo(x[k]); }
            ret.push(']');
            return true;
        }
        ret.push('{');
        var flag = false;
        for(k in x) { if(x.hasOwnProperty(k)) { if(flag) ret.push(',\n'); flag = true; ret.push(k); ret.push(': \n'); foo(x[k]); } }
        ret.push('}');
        return true;
    }
    foo(x);
    return ret.join('');
}

numeric.parseDate = function parseDate(d) {
    function foo(d) {
        if(typeof d === 'string') { return Date.parse(d.replace(/-/g,'/')); }
        if(!(d instanceof Array)) { throw new Error("parseDate: parameter must be arrays of strings"); }
        var ret = [],k;
        for(k=0;k<d.length;k++) { ret[k] = foo(d[k]); }
        return ret;
    }
    return foo(d);
}

numeric.parseFloat = function parseFloat_(d) {
    function foo(d) {
        if(typeof d === 'string') { return parseFloat(d); }
        if(!(d instanceof Array)) { throw new Error("parseFloat: parameter must be arrays of strings"); }
        var ret = [],k;
        for(k=0;k<d.length;k++) { ret[k] = foo(d[k]); }
        return ret;
    }
    return foo(d);
}

numeric.parseCSV = function parseCSV(t) {
    var foo = t.split('\n');
    var j,k;
    var ret = [];
    var pat = /(([^'",]*)|('[^']*')|("[^"]*")),/g;
    var patnum = /^\s*(([+-]?[0-9]+(\.[0-9]*)?(e[+-]?[0-9]+)?)|([+-]?[0-9]*(\.[0-9]+)?(e[+-]?[0-9]+)?))\s*$/;
    var stripper = function(n) { return n.substr(0,n.length-1); }
    var count = 0;
    for(k=0;k<foo.length;k++) {
      var bar = (foo[k]+",").match(pat),baz;
      if(bar.length>0) {
          ret[count] = [];
          for(j=0;j<bar.length;j++) {
              baz = stripper(bar[j]);
              if(patnum.test(baz)) { ret[count][j] = parseFloat(baz); }
              else ret[count][j] = baz;
          }
          count++;
      }
    }
    return ret;
}

numeric.toCSV = function toCSV(A) {
    var s = numeric.dim(A);
    var i,j,m,n,row,ret;
    m = s[0];
    n = s[1];
    ret = [];
    for(i=0;i<m;i++) {
        row = [];
        for(j=0;j<m;j++) { row[j] = A[i][j].toString(); }
        ret[i] = row.join(', ');
    }
    return ret.join('\n')+'\n';
}

numeric.getURL = function getURL(url) {
    var client = new XMLHttpRequest();
    client.open("GET",url,false);
    client.send();
    return client;
}

numeric.imageURL = function imageURL(img) {
    function base64(A) {
        var n = A.length, i,x,y,z,p,q,r,s;
        var key = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var ret = "";
        for(i=0;i<n;i+=3) {
            x = A[i];
            y = A[i+1];
            z = A[i+2];
            p = x >> 2;
            q = ((x & 3) << 4) + (y >> 4);
            r = ((y & 15) << 2) + (z >> 6);
            s = z & 63;
            if(i+1>=n) { r = s = 64; }
            else if(i+2>=n) { s = 64; }
            ret += key.charAt(p) + key.charAt(q) + key.charAt(r) + key.charAt(s);
            }
        return ret;
    }
    function crc32Array (a,from,to) {
        if(typeof from === "undefined") { from = 0; }
        if(typeof to === "undefined") { to = a.length; }
        var table = [0x00000000, 0x77073096, 0xEE0E612C, 0x990951BA, 0x076DC419, 0x706AF48F, 0xE963A535, 0x9E6495A3,
                     0x0EDB8832, 0x79DCB8A4, 0xE0D5E91E, 0x97D2D988, 0x09B64C2B, 0x7EB17CBD, 0xE7B82D07, 0x90BF1D91, 
                     0x1DB71064, 0x6AB020F2, 0xF3B97148, 0x84BE41DE, 0x1ADAD47D, 0x6DDDE4EB, 0xF4D4B551, 0x83D385C7,
                     0x136C9856, 0x646BA8C0, 0xFD62F97A, 0x8A65C9EC, 0x14015C4F, 0x63066CD9, 0xFA0F3D63, 0x8D080DF5, 
                     0x3B6E20C8, 0x4C69105E, 0xD56041E4, 0xA2677172, 0x3C03E4D1, 0x4B04D447, 0xD20D85FD, 0xA50AB56B, 
                     0x35B5A8FA, 0x42B2986C, 0xDBBBC9D6, 0xACBCF940, 0x32D86CE3, 0x45DF5C75, 0xDCD60DCF, 0xABD13D59, 
                     0x26D930AC, 0x51DE003A, 0xC8D75180, 0xBFD06116, 0x21B4F4B5, 0x56B3C423, 0xCFBA9599, 0xB8BDA50F,
                     0x2802B89E, 0x5F058808, 0xC60CD9B2, 0xB10BE924, 0x2F6F7C87, 0x58684C11, 0xC1611DAB, 0xB6662D3D,
                     0x76DC4190, 0x01DB7106, 0x98D220BC, 0xEFD5102A, 0x71B18589, 0x06B6B51F, 0x9FBFE4A5, 0xE8B8D433,
                     0x7807C9A2, 0x0F00F934, 0x9609A88E, 0xE10E9818, 0x7F6A0DBB, 0x086D3D2D, 0x91646C97, 0xE6635C01, 
                     0x6B6B51F4, 0x1C6C6162, 0x856530D8, 0xF262004E, 0x6C0695ED, 0x1B01A57B, 0x8208F4C1, 0xF50FC457, 
                     0x65B0D9C6, 0x12B7E950, 0x8BBEB8EA, 0xFCB9887C, 0x62DD1DDF, 0x15DA2D49, 0x8CD37CF3, 0xFBD44C65, 
                     0x4DB26158, 0x3AB551CE, 0xA3BC0074, 0xD4BB30E2, 0x4ADFA541, 0x3DD895D7, 0xA4D1C46D, 0xD3D6F4FB, 
                     0x4369E96A, 0x346ED9FC, 0xAD678846, 0xDA60B8D0, 0x44042D73, 0x33031DE5, 0xAA0A4C5F, 0xDD0D7CC9, 
                     0x5005713C, 0x270241AA, 0xBE0B1010, 0xC90C2086, 0x5768B525, 0x206F85B3, 0xB966D409, 0xCE61E49F, 
                     0x5EDEF90E, 0x29D9C998, 0xB0D09822, 0xC7D7A8B4, 0x59B33D17, 0x2EB40D81, 0xB7BD5C3B, 0xC0BA6CAD, 
                     0xEDB88320, 0x9ABFB3B6, 0x03B6E20C, 0x74B1D29A, 0xEAD54739, 0x9DD277AF, 0x04DB2615, 0x73DC1683, 
                     0xE3630B12, 0x94643B84, 0x0D6D6A3E, 0x7A6A5AA8, 0xE40ECF0B, 0x9309FF9D, 0x0A00AE27, 0x7D079EB1, 
                     0xF00F9344, 0x8708A3D2, 0x1E01F268, 0x6906C2FE, 0xF762575D, 0x806567CB, 0x196C3671, 0x6E6B06E7, 
                     0xFED41B76, 0x89D32BE0, 0x10DA7A5A, 0x67DD4ACC, 0xF9B9DF6F, 0x8EBEEFF9, 0x17B7BE43, 0x60B08ED5, 
                     0xD6D6A3E8, 0xA1D1937E, 0x38D8C2C4, 0x4FDFF252, 0xD1BB67F1, 0xA6BC5767, 0x3FB506DD, 0x48B2364B, 
                     0xD80D2BDA, 0xAF0A1B4C, 0x36034AF6, 0x41047A60, 0xDF60EFC3, 0xA867DF55, 0x316E8EEF, 0x4669BE79, 
                     0xCB61B38C, 0xBC66831A, 0x256FD2A0, 0x5268E236, 0xCC0C7795, 0xBB0B4703, 0x220216B9, 0x5505262F, 
                     0xC5BA3BBE, 0xB2BD0B28, 0x2BB45A92, 0x5CB36A04, 0xC2D7FFA7, 0xB5D0CF31, 0x2CD99E8B, 0x5BDEAE1D, 
                     0x9B64C2B0, 0xEC63F226, 0x756AA39C, 0x026D930A, 0x9C0906A9, 0xEB0E363F, 0x72076785, 0x05005713, 
                     0x95BF4A82, 0xE2B87A14, 0x7BB12BAE, 0x0CB61B38, 0x92D28E9B, 0xE5D5BE0D, 0x7CDCEFB7, 0x0BDBDF21, 
                     0x86D3D2D4, 0xF1D4E242, 0x68DDB3F8, 0x1FDA836E, 0x81BE16CD, 0xF6B9265B, 0x6FB077E1, 0x18B74777, 
                     0x88085AE6, 0xFF0F6A70, 0x66063BCA, 0x11010B5C, 0x8F659EFF, 0xF862AE69, 0x616BFFD3, 0x166CCF45, 
                     0xA00AE278, 0xD70DD2EE, 0x4E048354, 0x3903B3C2, 0xA7672661, 0xD06016F7, 0x4969474D, 0x3E6E77DB, 
                     0xAED16A4A, 0xD9D65ADC, 0x40DF0B66, 0x37D83BF0, 0xA9BCAE53, 0xDEBB9EC5, 0x47B2CF7F, 0x30B5FFE9, 
                     0xBDBDF21C, 0xCABAC28A, 0x53B39330, 0x24B4A3A6, 0xBAD03605, 0xCDD70693, 0x54DE5729, 0x23D967BF, 
                     0xB3667A2E, 0xC4614AB8, 0x5D681B02, 0x2A6F2B94, 0xB40BBE37, 0xC30C8EA1, 0x5A05DF1B, 0x2D02EF8D];
     
        var crc = -1, y = 0, n = a.length,i;

        for (i = from; i < to; i++) {
            y = (crc ^ a[i]) & 0xFF;
            crc = (crc >>> 8) ^ table[y];
        }
     
        return crc ^ (-1);
    }

    var h = img[0].length, w = img[0][0].length, s1, s2, next,k,length,a,b,i,j,adler32,crc32;
    var stream = [
                  137, 80, 78, 71, 13, 10, 26, 10,                           //  0: PNG signature
                  0,0,0,13,                                                  //  8: IHDR Chunk length
                  73, 72, 68, 82,                                            // 12: "IHDR" 
                  (w >> 24) & 255, (w >> 16) & 255, (w >> 8) & 255, w&255,   // 16: Width
                  (h >> 24) & 255, (h >> 16) & 255, (h >> 8) & 255, h&255,   // 20: Height
                  8,                                                         // 24: bit depth
                  2,                                                         // 25: RGB
                  0,                                                         // 26: deflate
                  0,                                                         // 27: no filter
                  0,                                                         // 28: no interlace
                  -1,-2,-3,-4,                                               // 29: CRC
                  -5,-6,-7,-8,                                               // 33: IDAT Chunk length
                  73, 68, 65, 84,                                            // 37: "IDAT"
                  // RFC 1950 header starts here
                  8,                                                         // 41: RFC1950 CMF
                  29                                                         // 42: RFC1950 FLG
                  ];
    crc32 = crc32Array(stream,12,29);
    stream[29] = (crc32>>24)&255;
    stream[30] = (crc32>>16)&255;
    stream[31] = (crc32>>8)&255;
    stream[32] = (crc32)&255;
    s1 = 1;
    s2 = 0;
    for(i=0;i<h;i++) {
        if(i<h-1) { stream.push(0); }
        else { stream.push(1); }
        a = (3*w+1+(i===0))&255; b = ((3*w+1+(i===0))>>8)&255;
        stream.push(a); stream.push(b);
        stream.push((~a)&255); stream.push((~b)&255);
        if(i===0) stream.push(0);
        for(j=0;j<w;j++) {
            for(k=0;k<3;k++) {
                a = img[k][i][j];
                if(a>255) a = 255;
                else if(a<0) a=0;
                else a = Math.round(a);
                s1 = (s1 + a )%65521;
                s2 = (s2 + s1)%65521;
                stream.push(a);
            }
        }
        stream.push(0);
    }
    adler32 = (s2<<16)+s1;
    stream.push((adler32>>24)&255);
    stream.push((adler32>>16)&255);
    stream.push((adler32>>8)&255);
    stream.push((adler32)&255);
    length = stream.length - 41;
    stream[33] = (length>>24)&255;
    stream[34] = (length>>16)&255;
    stream[35] = (length>>8)&255;
    stream[36] = (length)&255;
    crc32 = crc32Array(stream,37);
    stream.push((crc32>>24)&255);
    stream.push((crc32>>16)&255);
    stream.push((crc32>>8)&255);
    stream.push((crc32)&255);
    stream.push(0);
    stream.push(0);
    stream.push(0);
    stream.push(0);
//    a = stream.length;
    stream.push(73);  // I
    stream.push(69);  // E
    stream.push(78);  // N
    stream.push(68);  // D
    stream.push(174); // CRC1
    stream.push(66);  // CRC2
    stream.push(96);  // CRC3
    stream.push(130); // CRC4
    return 'data:image/png;base64,'+base64(stream);
}

// 2. Linear algebra with Arrays.
numeric._dim = function _dim(x) {
    var ret = [];
    while(typeof x === "object") { ret.push(x.length); x = x[0]; }
    return ret;
}

numeric.dim = function dim(x) {
    var y,z;
    if(typeof x === "object") {
        y = x[0];
        if(typeof y === "object") {
            z = y[0];
            if(typeof z === "object") {
                return numeric._dim(x);
            }
            return [x.length,y.length];
        }
        return [x.length];
    }
    return [];
}

numeric.mapreduce = function mapreduce(body,init) {
    return Function('x','accum','_s','_k',
            'if(typeof accum === "undefined") accum = '+init+';\n'+
            'if(typeof x === "number") { var xi = x; '+body+'; return accum; }\n'+
            'if(typeof _s === "undefined") _s = numeric.dim(x);\n'+
            'if(typeof _k === "undefined") _k = 0;\n'+
            'var _n = _s[_k];\n'+
            'var i,xi;\n'+
            'if(_k < _s.length-1) {\n'+
            '    for(i=_n-1;i>=0;i--) {\n'+
            '        accum = arguments.callee(x[i],accum,_s,_k+1);\n'+
            '    }'+
            '    return accum;\n'+
            '}\n'+
            'for(i=_n-1;i>=1;i-=2) { \n'+
            '    xi = x[i];\n'+
            '    '+body+';\n'+
            '    xi = x[i-1];\n'+
            '    '+body+';\n'+
            '}\n'+
            'if(i === 0) {\n'+
            '    xi = x[i];\n'+
            '    '+body+'\n'+
            '}\n'+
            'return accum;'
            );
}
numeric.mapreduce2 = function mapreduce2(body,setup) {
    return Function('x',
            'var n = x.length;\n'+
            'var i,xi;\n'+setup+';\n'+
            'for(i=n-1;i!==-1;--i) { \n'+
            '    xi = x[i];\n'+
            '    '+body+';\n'+
            '}\n'+
            'return accum;'
            );
}


numeric.same = function same(x,y) {
    var i,n;
    if(!(x instanceof Array) || !(y instanceof Array)) { return false; }
    n = x.length;
    if(n !== y.length) { return false; }
    for(i=0;i<n;i++) {
        if(x[i] === y[i]) { continue; }
        if(typeof x[i] === "object") { if(!same(x[i],y[i])) return false; }
        else { return false; }
    }
    return true;
}

numeric.rep = function rep(s,v,k) {
    if(typeof k === "undefined") { k=0; }
    var n = s[k], ret = Array(n), i;
    if(k === s.length-1) {
        for(i=n-2;i>=0;i-=2) { ret[i+1] = v; ret[i] = v; }
        if(i===-1) { ret[0] = v; }
        return ret;
    }
    for(i=n-1;i>=0;i--) { ret[i] = numeric.rep(s,v,k+1); }
    return ret;
}


numeric.dotMMsmall = function dotMMsmall(x,y) {
    var i,j,k,p,q,r,ret,foo,bar,woo,i0,k0,p0,r0;
    p = x.length; q = y.length; r = y[0].length;
    ret = Array(p);
    for(i=p-1;i>=0;i--) {
        foo = Array(r);
        bar = x[i];
        for(k=r-1;k>=0;k--) {
            woo = bar[q-1]*y[q-1][k];
            for(j=q-2;j>=1;j-=2) {
                i0 = j-1;
                woo += bar[j]*y[j][k] + bar[i0]*y[i0][k];
            }
            if(j===0) { woo += bar[0]*y[0][k]; }
            foo[k] = woo;
        }
        ret[i] = foo;
    }
    return ret;
}
numeric._getCol = function _getCol(A,j,x) {
    var n = A.length, i;
    for(i=n-1;i>0;--i) {
        x[i] = A[i][j];
        --i;
        x[i] = A[i][j];
    }
    if(i===0) x[0] = A[0][j];
}
numeric.dotMMbig = function dotMMbig(x,y){
    var gc = numeric._getCol, p = y.length, v = Array(p);
    var m = x.length, n = y[0].length, A = new Array(m), xj;
    var VV = numeric.dotVV;
    var i,j,k,z;
    --p;
    --m;
    for(i=m;i!==-1;--i) A[i] = Array(n);
    --n;
    for(i=n;i!==-1;--i) {
        gc(y,i,v);
        for(j=m;j!==-1;--j) {
            z=0;
            xj = x[j];
            A[j][i] = VV(xj,v);
        }
    }
    return A;
}

numeric.dotMV = function dotMV(x,y) {
    var p = x.length, q = y.length,i;
    var ret = Array(p), dotVV = numeric.dotVV;
    for(i=p-1;i>=0;i--) { ret[i] = dotVV(x[i],y); }
    return ret;
}

numeric.dotVM = function dotVM(x,y) {
    var i,j,k,p,q,r,ret,foo,bar,woo,i0,k0,p0,r0,s1,s2,s3,baz,accum;
    p = x.length; q = y[0].length;
    ret = Array(q);
    for(k=q-1;k>=0;k--) {
        woo = x[p-1]*y[p-1][k];
        for(j=p-2;j>=1;j-=2) {
            i0 = j-1;
            woo += x[j]*y[j][k] + x[i0]*y[i0][k];
        }
        if(j===0) { woo += x[0]*y[0][k]; }
        ret[k] = woo;
    }
    return ret;
}

numeric.dotVV = function dotVV(x,y) {
    var i,n=x.length,i1,ret = x[n-1]*y[n-1];
    for(i=n-2;i>=1;i-=2) {
        i1 = i-1;
        ret += x[i]*y[i] + x[i1]*y[i1];
    }
    if(i===0) { ret += x[0]*y[0]; }
    return ret;
}

numeric.dot = function dot(x,y) {
    var d = numeric.dim;
    switch(d(x).length*1000+d(y).length) {
    case 2002:
        if(y.length < 10) return numeric.dotMMsmall(x,y);
        else return numeric.dotMMbig(x,y);
    case 2001: return numeric.dotMV(x,y);
    case 1002: return numeric.dotVM(x,y);
    case 1001: return numeric.dotVV(x,y);
    case 1000: return numeric.mulVS(x,y);
    case 1: return numeric.mulSV(x,y);
    case 0: return x*y;
    default: throw new Error('numeric.dot only works on vectors and matrices');
    }
}

numeric.diag = function diag(d) {
    var i,i1,j,n = d.length, A = Array(n), Ai;
    for(i=n-1;i>=0;i--) {
        Ai = Array(n);
        i1 = i+2;
        for(j=n-1;j>=i1;j-=2) {
            Ai[j] = 0;
            Ai[j-1] = 0;
        }
        if(j>i) { Ai[j] = 0; }
        Ai[i] = d[i];
        for(j=i-1;j>=1;j-=2) {
            Ai[j] = 0;
            Ai[j-1] = 0;
        }
        if(j===0) { Ai[0] = 0; }
        A[i] = Ai;
    }
    return A;
}
numeric.getDiag = function(A) {
    var n = Math.min(A.length,A[0].length),i,ret = Array(n);
    for(i=n-1;i>=1;--i) {
        ret[i] = A[i][i];
        --i;
        ret[i] = A[i][i];
    }
    if(i===0) {
        ret[0] = A[0][0];
    }
    return ret;
}

numeric.identity = function identity(n) { return numeric.diag(numeric.rep([n],1)); }
numeric.pointwise = function pointwise(params,body,setup) {
    if(typeof setup === "undefined") { setup = ""; }
    var fun = [];
    var k;
    var avec = /\[i\]$/,p,thevec = '';
    var haveret = false;
    for(k=0;k<params.length;k++) {
        if(avec.test(params[k])) {
            p = params[k].substring(0,params[k].length-3);
            thevec = p;
        } else { p = params[k]; }
        if(p==='ret') haveret = true;
        fun.push(p);
    }
    fun[params.length] = '_s';
    fun[params.length+1] = '_k';
    fun[params.length+2] = (
            'if(typeof _s === "undefined") _s = numeric.dim('+thevec+');\n'+
            'if(typeof _k === "undefined") _k = 0;\n'+
            'var _n = _s[_k];\n'+
            'var i'+(haveret?'':', ret = Array(_n)')+';\n'+
            'if(_k < _s.length-1) {\n'+
            '    for(i=_n-1;i>=0;i--) ret[i] = arguments.callee('+params.join(',')+',_s,_k+1);\n'+
            '    return ret;\n'+
            '}\n'+
            setup+'\n'+
            'for(i=_n-1;i!==-1;--i) {\n'+
            '    '+body+'\n'+
            '}\n'+
            'return ret;'
            );
    return Function.apply(null,fun);
}
numeric.pointwise2 = function pointwise2(params,body,setup) {
    if(typeof setup === "undefined") { setup = ""; }
    var fun = [];
    var k;
    var avec = /\[i\]$/,p,thevec = '';
    var haveret = false;
    for(k=0;k<params.length;k++) {
        if(avec.test(params[k])) {
            p = params[k].substring(0,params[k].length-3);
            thevec = p;
        } else { p = params[k]; }
        if(p==='ret') haveret = true;
        fun.push(p);
    }
    fun[params.length] = (
            'var _n = '+thevec+'.length;\n'+
            'var i'+(haveret?'':', ret = Array(_n)')+';\n'+
            setup+'\n'+
            'for(i=_n-1;i!==-1;--i) {\n'+
            body+'\n'+
            '}\n'+
            'return ret;'
            );
    return Function.apply(null,fun);
}
numeric._biforeach = (function _biforeach(x,y,s,k,f) {
    if(k === s.length-1) { f(x,y); return; }
    var i,n=s[k];
    for(i=n-1;i>=0;i--) { _biforeach(typeof x==="object"?x[i]:x,typeof y==="object"?y[i]:y,s,k+1,f); }
});
numeric._biforeach2 = (function _biforeach2(x,y,s,k,f) {
    if(k === s.length-1) { return f(x,y); }
    var i,n=s[k],ret = Array(n);
    for(i=n-1;i>=0;--i) { ret[i] = _biforeach2(typeof x==="object"?x[i]:x,typeof y==="object"?y[i]:y,s,k+1,f); }
    return ret;
});
numeric._foreach = (function _foreach(x,s,k,f) {
    if(k === s.length-1) { f(x); return; }
    var i,n=s[k];
    for(i=n-1;i>=0;i--) { _foreach(x[i],s,k+1,f); }
});
numeric._foreach2 = (function _foreach2(x,s,k,f) {
    if(k === s.length-1) { return f(x); }
    var i,n=s[k], ret = Array(n);
    for(i=n-1;i>=0;i--) { ret[i] = _foreach2(x[i],s,k+1,f); }
    return ret;
});

/*numeric.anyV = numeric.mapreduce('if(xi) return true;','false');
numeric.allV = numeric.mapreduce('if(!xi) return false;','true');
numeric.any = function(x) { if(typeof x.length === "undefined") return x; return numeric.anyV(x); }
numeric.all = function(x) { if(typeof x.length === "undefined") return x; return numeric.allV(x); }*/

numeric.ops2 = {
        add: '+',
        sub: '-',
        mul: '*',
        div: '/',
        mod: '%',
        and: '&&',
        or:  '||',
        eq:  '===',
        neq: '!==',
        lt:  '<',
        gt:  '>',
        leq: '<=',
        geq: '>=',
        band: '&',
        bor: '|',
        bxor: '^',
        lshift: '<<',
        rshift: '>>',
        rrshift: '>>>'
};
numeric.opseq = {
        addeq: '+=',
        subeq: '-=',
        muleq: '*=',
        diveq: '/=',
        modeq: '%=',
        lshifteq: '<<=',
        rshifteq: '>>=',
        rrshifteq: '>>>=',
        bandeq: '&=',
        boreq: '|=',
        bxoreq: '^='
};
numeric.mathfuns = ['abs','acos','asin','atan','ceil','cos',
                    'exp','floor','log','round','sin','sqrt','tan',
                    'isNaN','isFinite'];
numeric.mathfuns2 = ['atan2','pow','max','min'];
numeric.ops1 = {
        neg: '-',
        not: '!',
        bnot: '~',
        clone: ''
};
numeric.mapreducers = {
        any: ['if(xi) return true;','var accum = false;'],
        all: ['if(!xi) return false;','var accum = true;'],
        sum: ['accum += xi;','var accum = 0;'],
        prod: ['accum *= xi;','var accum = 1;'],
        norm2Squared: ['accum += xi*xi;','var accum = 0;'],
        norminf: ['accum = max(accum,abs(xi));','var accum = 0, max = Math.max, abs = Math.abs;'],
        norm1: ['accum += abs(xi)','var accum = 0, abs = Math.abs;'],
        sup: ['accum = max(accum,xi);','var accum = -Infinity, max = Math.max;'],
        inf: ['accum = min(accum,xi);','var accum = Infinity, min = Math.min;']
};

(function () {
    var i,o;
    for(i=0;i<numeric.mathfuns2.length;++i) {
        o = numeric.mathfuns2[i];
        numeric.ops2[o] = o;
    }
    for(i in numeric.ops2) {
        if(numeric.ops2.hasOwnProperty(i)) {
            o = numeric.ops2[i];
            var code, codeeq, setup = '';
            if(numeric.myIndexOf.call(numeric.mathfuns2,i)!==-1) {
                setup = 'var '+o+' = Math.'+o+';\n';
                code = function(r,x,y) { return r+' = '+o+'('+x+','+y+')'; };
                codeeq = function(x,y) { return x+' = '+o+'('+x+','+y+')'; };
            } else {
                code = function(r,x,y) { return r+' = '+x+' '+o+' '+y; };
                if(numeric.opseq.hasOwnProperty(i+'eq')) {
                    codeeq = function(x,y) { return x+' '+o+'= '+y; };
                } else {
                    codeeq = function(x,y) { return x+' = '+x+' '+o+' '+y; };                    
                }
            }
            numeric[i+'VV'] = numeric.pointwise2(['x[i]','y[i]'],code('ret[i]','x[i]','y[i]'),setup);
            numeric[i+'SV'] = numeric.pointwise2(['x','y[i]'],code('ret[i]','x','y[i]'),setup);
            numeric[i+'VS'] = numeric.pointwise2(['x[i]','y'],code('ret[i]','x[i]','y'),setup);
            numeric[i] = Function(
                    'var n = arguments.length, i, x = arguments[0], y;\n'+
                    'var VV = numeric.'+i+'VV, VS = numeric.'+i+'VS, SV = numeric.'+i+'SV;\n'+
                    'var dim = numeric.dim;\n'+
                    'for(i=1;i!==n;++i) { \n'+
                    '  y = arguments[i];\n'+
                    '  if(typeof x === "object") {\n'+
                    '      if(typeof y === "object") x = numeric._biforeach2(x,y,dim(x),0,VV);\n'+
                    '      else x = numeric._biforeach2(x,y,dim(x),0,VS);\n'+
                    '  } else if(typeof y === "object") x = numeric._biforeach2(x,y,dim(y),0,SV);\n'+
                    '  else '+codeeq('x','y')+'\n'+
                    '}\nreturn x;\n');
            numeric[o] = numeric[i];
            numeric[i+'eqV'] = numeric.pointwise2(['ret[i]','x[i]'], codeeq('ret[i]','x[i]'),setup);
            numeric[i+'eqS'] = numeric.pointwise2(['ret[i]','x'], codeeq('ret[i]','x'),setup);
            numeric[i+'eq'] = Function(
                    'var n = arguments.length, i, x = arguments[0], y;\n'+
                    'var V = numeric.'+i+'eqV, S = numeric.'+i+'eqS\n'+
                    'var s = numeric.dim(x);\n'+
                    'for(i=1;i!==n;++i) { \n'+
                    '  y = arguments[i];\n'+
                    '  if(typeof y === "object") numeric._biforeach(x,y,s,0,V);\n'+
                    '  else numeric._biforeach(x,y,s,0,S);\n'+
                    '}\nreturn x;\n');
        }
    }
    for(i=0;i<numeric.mathfuns2.length;++i) {
        o = numeric.mathfuns2[i];
        delete numeric.ops2[o];
    }
    for(i=0;i<numeric.mathfuns.length;++i) {
        o = numeric.mathfuns[i];
        numeric.ops1[o] = o;
    }
    for(i in numeric.ops1) {
        if(numeric.ops1.hasOwnProperty(i)) {
            setup = '';
            o = numeric.ops1[i];
            if(numeric.myIndexOf.call(numeric.mathfuns,i)!==-1) {
                if(Math.hasOwnProperty(o)) setup = 'var '+o+' = Math.'+o+';\n';
            }
            numeric[i+'eqV'] = numeric.pointwise2(['ret[i]'],'ret[i] = '+o+'(ret[i]);',setup);
            numeric[i+'eq'] = Function('x',
                    'if(typeof x !== "object") return '+o+'x\n'+
                    'var i;\n'+
                    'var V = numeric.'+i+'eqV;\n'+
                    'var s = numeric.dim(x);\n'+
                    'numeric._foreach(x,s,0,V);\n'+
                    'return x;\n');
            numeric[i+'V'] = numeric.pointwise2(['x[i]'],'ret[i] = '+o+'(x[i]);',setup);
            numeric[i] = Function('x',
                    'if(typeof x !== "object") return '+o+'(x)\n'+
                    'var i;\n'+
                    'var V = numeric.'+i+'V;\n'+
                    'var s = numeric.dim(x);\n'+
                    'return numeric._foreach2(x,s,0,V);\n');
        }
    }
    for(i=0;i<numeric.mathfuns.length;++i) {
        o = numeric.mathfuns[i];
        delete numeric.ops1[o];
    }
    for(i in numeric.mapreducers) {
        if(numeric.mapreducers.hasOwnProperty(i)) {
            o = numeric.mapreducers[i];
            numeric[i+'V'] = numeric.mapreduce2(o[0],o[1]);
            numeric[i] = Function('x','s','k',
                    o[1]+
                    'if(typeof x !== "object") {'+
                    '    xi = x;\n'+
                    o[0]+';\n'+
                    '    return accum;\n'+
                    '}'+
                    'if(typeof s === "undefined") s = numeric.dim(x);\n'+
                    'if(typeof k === "undefined") k = 0;\n'+
                    'if(k === s.length-1) return numeric.'+i+'V(x);\n'+
                    'var xi;\n'+
                    'var n = x.length, i;\n'+
                    'for(i=n-1;i!==-1;--i) {\n'+
                    '   xi = arguments.callee(x[i]);\n'+
                    o[0]+';\n'+
                    '}\n'+
                    'return accum;\n');
        }
    }
}());

numeric.truncVV = numeric.pointwise(['x[i]','y[i]'],'ret[i] = round(x[i]/y[i])*y[i];','var round = Math.round;');
numeric.truncVS = numeric.pointwise(['x[i]','y'],'ret[i] = round(x[i]/y)*y;','var round = Math.round;');
numeric.truncSV = numeric.pointwise(['x','y[i]'],'ret[i] = round(x/y[i])*y[i];','var round = Math.round;');
numeric.trunc = function trunc(x,y) {
    if(typeof x === "object") {
        if(typeof y === "object") return numeric.truncVV(x,y);
        return numeric.truncVS(x,y);
    }
    if (typeof y === "object") return numeric.truncSV(x,y);
    return Math.round(x/y)*y;
}

numeric.inv = function inv(x) {
    var s = numeric.dim(x), abs = Math.abs, m = s[0], n = s[1];
    var A = numeric.clone(x), Ai, Aj;
    var I = numeric.identity(m), Ii, Ij;
    var i,j,k,x;
    for(j=0;j<n;++j) {
        var i0 = -1;
        var v0 = -1;
        for(i=j;i!==m;++i) { k = abs(A[i][j]); if(k>v0) { i0 = i; v0 = k; } }
        Aj = A[i0]; A[i0] = A[j]; A[j] = Aj;
        Ij = I[i0]; I[i0] = I[j]; I[j] = Ij;
        x = Aj[j];
        for(k=j;k!==n;++k)    Aj[k] /= x; 
        for(k=n-1;k!==-1;--k) Ij[k] /= x;
        for(i=m-1;i!==-1;--i) {
            if(i!==j) {
                Ai = A[i];
                Ii = I[i];
                x = Ai[j];
                for(k=j+1;k!==n;++k)  Ai[k] -= Aj[k]*x;
                for(k=n-1;k>0;--k) { Ii[k] -= Ij[k]*x; --k; Ii[k] -= Ij[k]*x; }
                if(k===0) Ii[0] -= Ij[0]*x;
            }
        }
    }
    return I;
}

numeric.det = function det(x) {
    var s = numeric.dim(x);
    if(s.length !== 2 || s[0] !== s[1]) { throw new Error('numeric: det() only works on square matrices'); }
    var n = s[0], ret = 1,i,j,k,A = numeric.clone(x),Aj,Ai,alpha,temp,k1,k2,k3;
    for(j=0;j<n-1;j++) {
        k=j;
        for(i=j+1;i<n;i++) { if(Math.abs(A[i][j]) > Math.abs(A[k][j])) { k = i; } }
        if(k !== j) {
            temp = A[k]; A[k] = A[j]; A[j] = temp;
            ret *= -1;
        }
        Aj = A[j];
        for(i=j+1;i<n;i++) {
            Ai = A[i];
            alpha = Ai[j]/Aj[j];
            for(k=j+1;k<n-1;k+=2) {
                k1 = k+1;
                Ai[k] -= Aj[k]*alpha;
                Ai[k1] -= Aj[k1]*alpha;
            }
            if(k!==n) { Ai[k] -= Aj[k]*alpha; }
        }
        if(Aj[j] === 0) { return 0; }
        ret *= Aj[j];
    }
    return ret*A[j][j];
}

numeric.transpose = function transpose(x) {
    var i,j,m = x.length,n = x[0].length, ret=Array(n),A0,A1,Bj;
    for(j=0;j<n;j++) ret[j] = Array(m);
    for(i=m-1;i>=1;i-=2) {
        A1 = x[i];
        A0 = x[i-1];
        for(j=n-1;j>=1;--j) {
            Bj = ret[j]; Bj[i] = A1[j]; Bj[i-1] = A0[j];
            --j;
            Bj = ret[j]; Bj[i] = A1[j]; Bj[i-1] = A0[j];
        }
        if(j===0) {
            Bj = ret[0]; Bj[i] = A1[0]; Bj[i-1] = A0[0];
        }
    }
    if(i===0) {
        A0 = x[0];
        for(j=n-1;j>=1;--j) {
            ret[j][0] = A0[j];
            --j;
            ret[j][0] = A0[j];
        }
        if(j===0) { ret[0][0] = A0[0]; }
    }
    return ret;
}
numeric.negtranspose = function negtranspose(x) {
    var i,j,m = x.length,n = x[0].length, ret=Array(n),A0,A1,Bj;
    for(j=0;j<n;j++) ret[j] = Array(m);
    for(i=m-1;i>=1;i-=2) {
        A1 = x[i];
        A0 = x[i-1];
        for(j=n-1;j>=1;--j) {
            Bj = ret[j]; Bj[i] = -A1[j]; Bj[i-1] = -A0[j];
            --j;
            Bj = ret[j]; Bj[i] = -A1[j]; Bj[i-1] = -A0[j];
        }
        if(j===0) {
            Bj = ret[0]; Bj[i] = -A1[0]; Bj[i-1] = -A0[0];
        }
    }
    if(i===0) {
        A0 = x[0];
        for(j=n-1;j>=1;--j) {
            ret[j][0] = -A0[j];
            --j;
            ret[j][0] = -A0[j];
        }
        if(j===0) { ret[0][0] = -A0[0]; }
    }
    return ret;
}

numeric._random = function _random(s,k) {
    var i,n=s[k],ret=Array(n), rnd;
    if(k === s.length-1) {
        rnd = Math.random;
        for(i=n-1;i>=1;i-=2) {
            ret[i] = rnd();
            ret[i-1] = rnd();
        }
        if(i===0) { ret[0] = rnd(); }
        return ret;
    }
    for(i=n-1;i>=0;i--) ret[i] = _random(s,k+1);
    return ret;
}
numeric.random = function random(s) { return numeric._random(s,0); }

numeric.norm2 = function norm2(x) { return Math.sqrt(numeric.norm2Squared(x)); }

numeric.linspace = function linspace(a,b,n) {
    if(typeof n === "undefined") n = Math.max(Math.round(b-a)+1,1);
    if(n<2) { return n===1?[a]:[]; }
    var i,ret = Array(n);
    n--;
    for(i=n;i>=0;i--) { ret[i] = (i*b+(n-i)*a)/n; }
    return ret;
}

numeric.getBlock = function getBlock(x,from,to) {
    var s = numeric.dim(x);
    function foo(x,k) {
        var i,a = from[k], n = to[k]-a, ret = Array(n);
        if(k === s.length-1) {
            for(i=n;i>=0;i--) { ret[i] = x[i+a]; }
            return ret;
        }
        for(i=n;i>=0;i--) { ret[i] = foo(x[i+a],k+1); }
        return ret;
    }
    return foo(x,0);
}

numeric.setBlock = function setBlock(x,from,to,B) {
    var s = numeric.dim(x);
    function foo(x,y,k) {
        var i,a = from[k], n = to[k]-a;
        if(k === s.length-1) { for(i=n;i>=0;i--) { x[i+a] = y[i]; } }
        for(i=n;i>=0;i--) { foo(x[i+a],y[i],k+1); }
    }
    foo(x,B,0);
    return x;
}

numeric.getRange = function getRange(A,I,J) {
    var m = I.length, n = J.length;
    var i,j;
    var B = Array(m), Bi, AI;
    for(i=m-1;i!==-1;--i) {
        B[i] = Array(n);
        Bi = B[i];
        AI = A[I[i]];
        for(j=n-1;j!==-1;--j) Bi[j] = AI[J[j]];
    }
    return B;
}

numeric.blockMatrix = function blockMatrix(X) {
    var s = numeric.dim(X);
    if(s.length<4) return numeric.blockMatrix([X]);
    var m=s[0],n=s[1],M,N,i,j,Xij;
    M = 0; N = 0;
    for(i=0;i<m;++i) M+=X[i][0].length;
    for(j=0;j<n;++j) N+=X[0][j][0].length;
    var Z = Array(M);
    for(i=0;i<M;++i) Z[i] = Array(N);
    var I=0,J,ZI,k,l,Xijk;
    for(i=0;i<m;++i) {
        J=N;
        for(j=n-1;j!==-1;--j) {
            Xij = X[i][j];
            J -= Xij[0].length;
            for(k=Xij.length-1;k!==-1;--k) {
                Xijk = Xij[k];
                ZI = Z[I+k];
                for(l = Xijk.length-1;l!==-1;--l) ZI[J+l] = Xijk[l];
            }
        }
        I += X[i][0].length;
    }
    return Z;
}

numeric.tensor = function tensor(x,y) {
    if(typeof x === "number" || typeof y === "number") return numeric.mul(x,y);
    var s1 = numeric.dim(x), s2 = numeric.dim(y);
    if(s1.length !== 1 || s2.length !== 1) {
        throw new Error('numeric: tensor product is only defined for vectors');
    }
    var m = s1[0], n = s2[0], A = Array(m), Ai, i,j,xi;
    for(i=m-1;i>=0;i--) {
        Ai = Array(n);
        xi = x[i];
        for(j=n-1;j>=3;--j) {
            Ai[j] = xi * y[j];
            --j;
            Ai[j] = xi * y[j];
            --j;
            Ai[j] = xi * y[j];
            --j;
            Ai[j] = xi * y[j];
        }
        while(j>=0) { Ai[j] = xi * y[j]; --j; }
        A[i] = Ai;
    }
    return A;
}

// 3. The Tensor type T
numeric.T = function T(x,y) { this.x = x; this.y = y; }
numeric.t = function t(x,y) { return new numeric.T(x,y); }

numeric.Tbinop = function Tbinop(rr,rc,cr,cc,setup) {
    var io = numeric.indexOf;
    if(typeof setup !== "string") {
        var k;
        setup = '';
        for(k in numeric) {
            if(numeric.hasOwnProperty(k) && (rr.indexOf(k)>=0 || rc.indexOf(k)>=0 || cr.indexOf(k)>=0 || cc.indexOf(k)>=0) && k.length>1) {
                setup += 'var '+k+' = numeric.'+k+';\n';
            }
        }
    }
    return Function(['y'],
            'var x = this;\n'+
            'if(!(y instanceof numeric.T)) { y = new numeric.T(y); }\n'+
            setup+'\n'+
            'if(x.y) {'+
            '  if(y.y) {'+
            '    return new numeric.T('+cc+');\n'+
            '  }\n'+
            '  return new numeric.T('+cr+');\n'+
            '}\n'+
            'if(y.y) {\n'+
            '  return new numeric.T('+rc+');\n'+
            '}\n'+
            'return new numeric.T('+rr+');\n'
    );
}

numeric.T.prototype.add = numeric.Tbinop(
        'add(x.x,y.x)',
        'add(x.x,y.x),y.y',
        'add(x.x,y.x),x.y',
        'add(x.x,y.x),add(x.y,y.y)');
numeric.T.prototype.sub = numeric.Tbinop(
        'sub(x.x,y.x)',
        'sub(x.x,y.x),neg(y.y)',
        'sub(x.x,y.x),x.y',
        'sub(x.x,y.x),sub(x.y,y.y)');
numeric.T.prototype.mul = numeric.Tbinop(
        'mul(x.x,y.x)',
        'mul(x.x,y.x),mul(x.x,y.y)',
        'mul(x.x,y.x),mul(x.y,y.x)',
        'sub(mul(x.x,y.x),mul(x.y,y.y)),add(mul(x.x,y.y),mul(x.y,y.x))');

numeric.T.prototype.reciprocal = function reciprocal() {
    var mul = numeric.mul, div = numeric.div;
    if(this.y) {
        var d = numeric.add(mul(this.x,this.x),mul(this.y,this.y));
        return new numeric.T(div(this.x,d),div(numeric.neg(this.y),d));
    }
    return new T(div(1,this.x));
}
numeric.T.prototype.div = function div(y) {
    if(!(y instanceof numeric.T)) y = new numeric.T(y);
    if(y.y) { return this.mul(y.reciprocal()); }
    var div = numeric.div;
    if(this.y) { return new numeric.T(div(this.x,y.x),div(this.y,y.x)); }
    return new numeric.T(div(this.x,y.x));
}
numeric.T.prototype.dot = numeric.Tbinop(
        'dot(x.x,y.x)',
        'dot(x.x,y.x),dot(x.x,y.y)',
        'dot(x.x,y.x),dot(x.y,y.x)',
        'sub(dot(x.x,y.x),dot(x.y,y.y)),add(dot(x.x,y.y),dot(x.y,y.x))'
        );
numeric.T.prototype.transpose = function transpose() {
    var t = numeric.transpose, x = this.x, y = this.y;
    if(y) { return new numeric.T(t(x),t(y)); }
    return new numeric.T(t(x));
}
numeric.T.prototype.transjugate = function transjugate() {
    var t = numeric.transpose, x = this.x, y = this.y;
    if(y) { return new numeric.T(t(x),numeric.negtranspose(y)); }
    return new numeric.T(t(x));
}
numeric.Tunop = function Tunop(r,c,s) {
    if(typeof s !== "string") { s = ''; }
    return Function(
            'var x = this;\n'+
            s+'\n'+
            'if(x.y) {'+
            '  '+c+';\n'+
            '}\n'+
            r+';\n'
    );
}

numeric.T.prototype.exp = numeric.Tunop(
        'return new numeric.T(ex)',
        'return new numeric.T(mul(cos(x.y),ex),mul(sin(x.y),ex))',
        'var ex = numeric.exp(x.x), cos = numeric.cos, sin = numeric.sin, mul = numeric.mul;');
numeric.T.prototype.conj = numeric.Tunop(
        'return new numeric.T(x.x);',
        'return new numeric.T(x.x,numeric.neg(x.y));');
numeric.T.prototype.neg = numeric.Tunop(
        'return new numeric.T(neg(x.x));',
        'return new numeric.T(neg(x.x),neg(x.y));',
        'var neg = numeric.neg;');
numeric.T.prototype.sin = numeric.Tunop(
        'return new numeric.T(numeric.sin(x.x))',
        'return x.exp().sub(x.neg().exp()).div(new numeric.T(0,2));');
numeric.T.prototype.cos = numeric.Tunop(
        'return new numeric.T(numeric.cos(x.x))',
        'return x.exp().add(x.neg().exp()).div(2);');
numeric.T.prototype.abs = numeric.Tunop(
        'return new numeric.T(numeric.abs(x.x));',
        'return new numeric.T(numeric.sqrt(numeric.add(mul(x.x,x.x),mul(x.y,x.y))));',
        'var mul = numeric.mul;');
numeric.T.prototype.log = numeric.Tunop(
        'return new numeric.T(numeric.log(x.x));',
        'var theta = new numeric.T(numeric.atan2(x.y,x.x)), r = x.abs();\n'+
        'return new numeric.T(numeric.log(r.x),theta.x);');
numeric.T.prototype.norm2 = numeric.Tunop(
        'return numeric.norm2(x.x);',
        'var f = numeric.norm2Squared;\n'+
        'return Math.sqrt(f(x.x)+f(x.y));');
numeric.T.prototype.inv = function inv() {
    var A = this;
    if(typeof A.y === "undefined") { return new numeric.T(numeric.inv(A.x)); }
    var n = A.x.length, i, j, k;
    var Rx = numeric.identity(n),Ry = numeric.rep([n,n],0);
    var Ax = numeric.clone(A.x), Ay = numeric.clone(A.y);
    var Aix, Aiy, Ajx, Ajy, Rix, Riy, Rjx, Rjy;
    var i,j,k,d,d1,ax,ay,bx,by,temp;
    for(i=0;i<n;i++) {
        ax = Ax[i][i]; ay = Ay[i][i];
        d = ax*ax+ay*ay;
        k = i;
        for(j=i+1;j<n;j++) {
            ax = Ax[j][i]; ay = Ay[j][i];
            d1 = ax*ax+ay*ay;
            if(d1 > d) { k=j; d = d1; }
        }
        if(k!==i) {
            temp = Ax[i]; Ax[i] = Ax[k]; Ax[k] = temp;
            temp = Ay[i]; Ay[i] = Ay[k]; Ay[k] = temp;
            temp = Rx[i]; Rx[i] = Rx[k]; Rx[k] = temp;
            temp = Ry[i]; Ry[i] = Ry[k]; Ry[k] = temp;
        }
        Aix = Ax[i]; Aiy = Ay[i];
        Rix = Rx[i]; Riy = Ry[i];
        ax = Aix[i]; ay = Aiy[i];
        for(j=i+1;j<n;j++) {
            bx = Aix[j]; by = Aiy[j];
            Aix[j] = (bx*ax+by*ay)/d;
            Aiy[j] = (by*ax-bx*ay)/d;
        }
        for(j=0;j<n;j++) {
            bx = Rix[j]; by = Riy[j];
            Rix[j] = (bx*ax+by*ay)/d;
            Riy[j] = (by*ax-bx*ay)/d;
        }
        for(j=i+1;j<n;j++) {
            Ajx = Ax[j]; Ajy = Ay[j];
            Rjx = Rx[j]; Rjy = Ry[j];
            ax = Ajx[i]; ay = Ajy[i];
            for(k=i+1;k<n;k++) {
                bx = Aix[k]; by = Aiy[k];
                Ajx[k] -= bx*ax-by*ay;
                Ajy[k] -= by*ax+bx*ay;
            }
            for(k=0;k<n;k++) {
                bx = Rix[k]; by = Riy[k];
                Rjx[k] -= bx*ax-by*ay;
                Rjy[k] -= by*ax+bx*ay;
            }
        }
    }
    for(i=n-1;i>0;i--) {
        Rix = Rx[i]; Riy = Ry[i];
        for(j=i-1;j>=0;j--) {
            Rjx = Rx[j]; Rjy = Ry[j];
            ax = Ax[j][i]; ay = Ay[j][i];
            for(k=n-1;k>=0;k--) {
                bx = Rix[k]; by = Riy[k];
                Rjx[k] -= ax*bx - ay*by;
                Rjy[k] -= ax*by + ay*bx;
            }
        }
    }
    return new numeric.T(Rx,Ry);
}
numeric.T.prototype.get = function get(i) {
    var x = this.x, y = this.y, k = 0, ik, n = i.length;
    if(y) {
        while(k<n) {
            ik = i[k];
            x = x[ik];
            y = y[ik];
            k++;
        }
        return new numeric.T(x,y);
    }
    while(k<n) {
        ik = i[k];
        x = x[ik];
        k++;
    }
    return new numeric.T(x);
}
numeric.T.prototype.set = function set(i,v) {
    var x = this.x, y = this.y, k = 0, ik, n = i.length, vx = v.x, vy = v.y;
    if(n===0) {
        if(vy) { this.y = vy; }
        else if(y) { this.y = undefined; }
        this.x = x;
        return this;
    }
    if(vy) {
        if(y) { /* ok */ }
        else {
            y = numeric.rep(numeric.dim(x),0);
            this.y = y;
        }
        while(k<n-1) {
            ik = i[k];
            x = x[ik];
            y = y[ik];
            k++;
        }
        ik = i[k];
        x[ik] = vx;
        y[ik] = vy;
        return this;
    }
    if(y) {
        while(k<n-1) {
            ik = i[k];
            x = x[ik];
            y = y[ik];
            k++;
        }
        ik = i[k];
        x[ik] = vx;
        if(vx instanceof Array) y[ik] = numeric.rep(numeric.dim(vx),0);
        else y[ik] = 0;
        return this;
    }
    while(k<n-1) {
        ik = i[k];
        x = x[ik];
        k++;
    }
    ik = i[k];
    x[ik] = vx;
    return this;
}
numeric.T.prototype.getRows = function getRows(i0,i1) {
    var n = i1-i0+1, j;
    var rx = Array(n), ry, x = this.x, y = this.y;
    for(j=i0;j<=i1;j++) { rx[j-i0] = x[j]; }
    if(y) {
        ry = Array(n);
        for(j=i0;j<=i1;j++) { ry[j-i0] = y[j]; }
        return new numeric.T(rx,ry);
    }
    return new numeric.T(rx);
}
numeric.T.prototype.setRows = function setRows(i0,i1,A) {
    var j;
    var rx = this.x, ry = this.y, x = A.x, y = A.y;
    for(j=i0;j<=i1;j++) { rx[j] = x[j-i0]; }
    if(y) {
        if(!ry) { ry = numeric.rep(numeric.dim(rx),0); this.y = ry; }
        for(j=i0;j<=i1;j++) { ry[j] = y[j-i0]; }
    } else if(ry) {
        for(j=i0;j<=i1;j++) { ry[j] = numeric.rep([x[j-i0].length],0); }
    }
    return this;
}
numeric.T.prototype.getRow = function getRow(k) {
    var x = this.x, y = this.y;
    if(y) { return new numeric.T(x[k],y[k]); }
    return new numeric.T(x[k]);
}
numeric.T.prototype.setRow = function setRow(i,v) {
    var rx = this.x, ry = this.y, x = v.x, y = v.y;
    rx[i] = x;
    if(y) {
        if(!ry) { ry = numeric.rep(numeric.dim(rx),0); this.y = ry; }
        ry[i] = y;
    } else if(ry) {
        ry = numeric.rep([x.length],0);
    }
    return this;
}

numeric.T.prototype.getBlock = function getBlock(from,to) {
    var x = this.x, y = this.y, b = numeric.getBlock;
    if(y) { return new numeric.T(b(x,from,to),b(y,from,to)); }
    return new numeric.T(b(x,from,to));
}
numeric.T.prototype.setBlock = function setBlock(from,to,A) {
    if(!(A instanceof numeric.T)) A = new numeric.T(A);
    var x = this.x, y = this.y, b = numeric.setBlock, Ax = A.x, Ay = A.y;
    if(Ay) {
        if(!y) { this.y = numeric.rep(numeric.dim(this),0); y = this.y; }
        b(x,from,to,Ax);
        b(y,from,to,Ay);
        return this;
    }
    b(x,from,to,Ax);
    if(y) b(y,from,to,numeric.rep(numeric.dim(Ax),0));
}
numeric.T.rep = function rep(s,v) {
    var T = numeric.T;
    if(!(v instanceof T)) v = new T(v);
    var x = v.x, y = v.y, r = numeric.rep;
    if(y) return new T(r(s,x),r(s,y));
    return new T(r(s,x));
}
numeric.T.diag = function diag(d) {
    if(!(d instanceof numeric.T)) d = new numeric.T(d);
    var x = d.x, y = d.y, diag = numeric.diag;
    if(y) return new numeric.T(diag(x),diag(y));
    return new numeric.T(diag(x));
}
numeric.T.eig = function eig() {
    if(this.y) { throw new Error('eig: not implemented for complex matrices.'); }
    return numeric.eig(this.x);
}
numeric.T.identity = function identity(n) { return new numeric.T(numeric.identity(n)); }
numeric.T.prototype.getDiag = function getDiag() {
    var n = numeric;
    var x = this.x, y = this.y;
    if(y) { return new n.T(n.getDiag(x),n.getDiag(y)); }
    return new n.T(n.getDiag(x));
}

// 4. Eigenvalues of real matrices

numeric.house = function house(x) {
    var v = numeric.clone(x);
    var s = x[0] >= 0 ? 1 : -1;
    var alpha = s*numeric.norm2(x);
    v[0] += alpha;
    var foo = numeric.norm2(v);
    if(foo === 0) { /* this should not happen */ throw new Error('eig: internal error'); }
    return numeric.div(v,foo);
}

numeric.toUpperHessenberg = function toUpperHessenberg(me) {
    var s = numeric.dim(me);
    if(s.length !== 2 || s[0] !== s[1]) { throw new Error('numeric: toUpperHessenberg() only works on square matrices'); }
    var m = s[0], i,j,k,x,v,A = numeric.clone(me),B,C,Ai,Ci,Q = numeric.identity(m),Qi;
    for(j=0;j<m-2;j++) {
        x = Array(m-j-1);
        for(i=j+1;i<m;i++) { x[i-j-1] = A[i][j]; }
        if(numeric.norm2(x)>0) {
            v = numeric.house(x);
            B = numeric.getBlock(A,[j+1,j],[m-1,m-1]);
            C = numeric.tensor(v,numeric.dot(v,B));
            for(i=j+1;i<m;i++) { Ai = A[i]; Ci = C[i-j-1]; for(k=j;k<m;k++) Ai[k] -= 2*Ci[k-j]; }
            B = numeric.getBlock(A,[0,j+1],[m-1,m-1]);
            C = numeric.tensor(numeric.dot(B,v),v);
            for(i=0;i<m;i++) { Ai = A[i]; Ci = C[i]; for(k=j+1;k<m;k++) Ai[k] -= 2*Ci[k-j-1]; }
            B = Array(m-j-1);
            for(i=j+1;i<m;i++) B[i-j-1] = Q[i];
            C = numeric.tensor(v,numeric.dot(v,B));
            for(i=j+1;i<m;i++) { Qi = Q[i]; Ci = C[i-j-1]; for(k=0;k<m;k++) Qi[k] -= 2*Ci[k]; }
        }
    }
    return {H:A, Q:Q};
}

numeric.epsilon = 2.220446049250313e-16;

numeric.QRFrancis = function(H,maxiter) {
    if(typeof maxiter === "undefined") { maxiter = 10000; }
    H = numeric.clone(H);
    var H0 = numeric.clone(H);
    var s = numeric.dim(H),m=s[0],x,v,a,b,c,d,det,tr, Hloc, Q = numeric.identity(m), Qi, Hi, B, C, Ci,i,j,k,iter;
    if(m<3) { return {Q:Q, B:[ [0,m-1] ]}; }
    var epsilon = numeric.epsilon;
    for(iter=0;iter<maxiter;iter++) {
        for(j=0;j<m-1;j++) {
            if(Math.abs(H[j+1][j]) < epsilon*(Math.abs(H[j][j])+Math.abs(H[j+1][j+1]))) {
                var QH1 = numeric.QRFrancis(numeric.getBlock(H,[0,0],[j,j]),maxiter);
                var QH2 = numeric.QRFrancis(numeric.getBlock(H,[j+1,j+1],[m-1,m-1]),maxiter);
                B = Array(j+1);
                for(i=0;i<=j;i++) { B[i] = Q[i]; }
                C = numeric.dot(QH1.Q,B);
                for(i=0;i<=j;i++) { Q[i] = C[i]; }
                B = Array(m-j-1);
                for(i=j+1;i<m;i++) { B[i-j-1] = Q[i]; }
                C = numeric.dot(QH2.Q,B);
                for(i=j+1;i<m;i++) { Q[i] = C[i-j-1]; }
                return {Q:Q,B:QH1.B.concat(numeric.add(QH2.B,j+1))};
            }
        }
        a = H[m-2][m-2]; b = H[m-2][m-1];
        c = H[m-1][m-2]; d = H[m-1][m-1];
        tr = a+d;
        det = (a*d-b*c);
        Hloc = numeric.getBlock(H, [0,0], [2,2]);
        if(tr*tr>=4*det) {
            var s1,s2;
            s1 = 0.5*(tr+Math.sqrt(tr*tr-4*det));
            s2 = 0.5*(tr-Math.sqrt(tr*tr-4*det));
            Hloc = numeric.add(numeric.sub(numeric.dot(Hloc,Hloc),
                                           numeric.mul(Hloc,s1+s2)),
                               numeric.diag(numeric.rep([3],s1*s2)));
        } else {
            Hloc = numeric.add(numeric.sub(numeric.dot(Hloc,Hloc),
                                           numeric.mul(Hloc,tr)),
                               numeric.diag(numeric.rep([3],det)));
        }
        x = [Hloc[0][0],Hloc[1][0],Hloc[2][0]];
        v = numeric.house(x);
        B = [H[0],H[1],H[2]];
        C = numeric.tensor(v,numeric.dot(v,B));
        for(i=0;i<3;i++) { Hi = H[i]; Ci = C[i]; for(k=0;k<m;k++) Hi[k] -= 2*Ci[k]; }
        B = numeric.getBlock(H, [0,0],[m-1,2]);
        C = numeric.tensor(numeric.dot(B,v),v);
        for(i=0;i<m;i++) { Hi = H[i]; Ci = C[i]; for(k=0;k<3;k++) Hi[k] -= 2*Ci[k]; }
        B = [Q[0],Q[1],Q[2]];
        C = numeric.tensor(v,numeric.dot(v,B));
        for(i=0;i<3;i++) { Qi = Q[i]; Ci = C[i]; for(k=0;k<m;k++) Qi[k] -= 2*Ci[k]; }
        var J;
        for(j=0;j<m-2;j++) {
            for(k=j;k<=j+1;k++) {
                if(Math.abs(H[k+1][k]) < epsilon*(Math.abs(H[k][k])+Math.abs(H[k+1][k+1]))) {
                    var QH1 = numeric.QRFrancis(numeric.getBlock(H,[0,0],[k,k]),maxiter);
                    var QH2 = numeric.QRFrancis(numeric.getBlock(H,[k+1,k+1],[m-1,m-1]),maxiter);
                    B = Array(k+1);
                    for(i=0;i<=k;i++) { B[i] = Q[i]; }
                    C = numeric.dot(QH1.Q,B);
                    for(i=0;i<=k;i++) { Q[i] = C[i]; }
                    B = Array(m-k-1);
                    for(i=k+1;i<m;i++) { B[i-k-1] = Q[i]; }
                    C = numeric.dot(QH2.Q,B);
                    for(i=k+1;i<m;i++) { Q[i] = C[i-k-1]; }
                    return {Q:Q,B:QH1.B.concat(numeric.add(QH2.B,k+1))};
                }
            }
            J = Math.min(m-1,j+3);
            x = Array(J-j);
            for(i=j+1;i<=J;i++) { x[i-j-1] = H[i][j]; }
            v = numeric.house(x);
            B = numeric.getBlock(H, [j+1,j],[J,m-1]);
            C = numeric.tensor(v,numeric.dot(v,B));
            for(i=j+1;i<=J;i++) { Hi = H[i]; Ci = C[i-j-1]; for(k=j;k<m;k++) Hi[k] -= 2*Ci[k-j]; }
            B = numeric.getBlock(H, [0,j+1],[m-1,J]);
            C = numeric.tensor(numeric.dot(B,v),v);
            for(i=0;i<m;i++) { Hi = H[i]; Ci = C[i]; for(k=j+1;k<=J;k++) Hi[k] -= 2*Ci[k-j-1]; }
            B = Array(J-j);
            for(i=j+1;i<=J;i++) B[i-j-1] = Q[i];
            C = numeric.tensor(v,numeric.dot(v,B));
            for(i=j+1;i<=J;i++) { Qi = Q[i]; Ci = C[i-j-1]; for(k=0;k<m;k++) Qi[k] -= 2*Ci[k]; }
        }
    }
    throw new Error('numeric: eigenvalue iteration does not converge -- increase maxiter?');
}

numeric.eig = function eig(A,maxiter) {
    var QH = numeric.toUpperHessenberg(A);
    var QB = numeric.QRFrancis(QH.H,maxiter);
    var T = numeric.T;
    var n = A.length,i,k,flag = false,B = QB.B,H = numeric.dot(QB.Q,numeric.dot(QH.H,numeric.transpose(QB.Q)));
    var Q = new T(numeric.dot(QB.Q,QH.Q)),Q0;
    var m = B.length,j;
    var a,b,c,d,p1,p2,disc,x,y,p,q,n1,n2;
    var sqrt = Math.sqrt;
    for(k=0;k<m;k++) {
        i = B[k][0];
        if(i === B[k][1]) {
            // nothing
        } else {
            j = i+1;
            a = H[i][i];
            b = H[i][j];
            c = H[j][i];
            d = H[j][j];
            if(b === 0 && c === 0) continue;
            p1 = -a-d;
            p2 = a*d-b*c;
            disc = p1*p1-4*p2;
            if(disc>=0) {
                if(p1<0) x = -0.5*(p1-sqrt(disc));
                else     x = -0.5*(p1+sqrt(disc));
                n1 = (a-x)*(a-x)+b*b;
                n2 = c*c+(d-x)*(d-x);
                if(n1>n2) {
                    n1 = sqrt(n1);
                    p = (a-x)/n1;
                    q = b/n1;
                } else {
                    n2 = sqrt(n2);
                    p = c/n2;
                    q = (d-x)/n2;
                }
                Q0 = new T([[q,-p],[p,q]]);
                Q.setRows(i,j,Q0.dot(Q.getRows(i,j)));
            } else {
                x = -0.5*p1;
                y = 0.5*sqrt(-disc);
                n1 = (a-x)*(a-x)+b*b;
                n2 = c*c+(d-x)*(d-x);
                if(n1>n2) {
                    n1 = sqrt(n1+y*y);
                    p = (a-x)/n1;
                    q = b/n1;
                    x = 0;
                    y /= n1;
                } else {
                    n2 = sqrt(n2+y*y);
                    p = c/n2;
                    q = (d-x)/n2;
                    x = y/n2;
                    y = 0;
                }
                Q0 = new T([[q,-p],[p,q]],[[x,y],[y,-x]]);
                Q.setRows(i,j,Q0.dot(Q.getRows(i,j)));
            }
        }
    }
    var R = Q.dot(A).dot(Q.transjugate()), n = A.length, E = numeric.T.identity(n);
    for(j=0;j<n;j++) {
        if(j>0) {
            for(k=j-1;k>=0;k--) {
                var Rk = R.get([k,k]), Rj = R.get([j,j]);
                if(numeric.neq(Rk.x,Rj.x) || numeric.neq(Rk.y,Rj.y)) {
                    x = R.getRow(k).getBlock([k],[j-1]);
                    y = E.getRow(j).getBlock([k],[j-1]);
                    E.set([j,k],(R.get([k,j]).neg().sub(x.dot(y))).div(Rk.sub(Rj)));
                } else {
                    E.setRow(j,E.getRow(k));
                    continue;
                }
            }
        }
    }
    for(j=0;j<n;j++) {
        x = E.getRow(j);
        E.setRow(j,x.div(x.norm2()));
    }
    E = E.transpose();
    E = Q.transjugate().dot(E);
    return { lambda:R.getDiag(), E:E };
};

// 5. Compressed Column Storage matrices
numeric.ccsSparse = function ccsSparse(A) {
    var m = A.length,n,foo, i,j, counts = [];
    for(i=m-1;i!==-1;--i) {
        foo = A[i];
        for(j in foo) {
            j = parseInt(j);
            while(j>=counts.length) counts[counts.length] = 0;
            if(foo[j]!==0) counts[j]++;
        }
    }
    var n = counts.length;
    var Ai = Array(n+1);
    Ai[0] = 0;
    for(i=0;i<n;++i) Ai[i+1] = Ai[i] + counts[i];
    var Aj = Array(Ai[n]), Av = Array(Ai[n]);
    for(i=m-1;i!==-1;--i) {
        foo = A[i];
        for(j in foo) {
            if(foo[j]!==0) {
                counts[j]--;
                Aj[Ai[j]+counts[j]] = i;
                Av[Ai[j]+counts[j]] = foo[j];
            }
        }
    }
    return [Ai,Aj,Av];
}
numeric.ccsFull = function ccsFull(A) {
    var Ai = A[0], Aj = A[1], Av = A[2], s = numeric.ccsDim(A), m = s[0], n = s[1], i,j,j0,j1,k;
    var B = numeric.rep([m,n],0);
    for(i=0;i<n;i++) {
        j0 = Ai[i];
        j1 = Ai[i+1];
        for(j=j0;j<j1;++j) { B[Aj[j]][i] = Av[j]; }
    }
    return B;
}
numeric.ccsTSolve = function ccsTSolve(A,b,x,bj,xj) {
    var Ai = A[0], Aj = A[1], Av = A[2],m = Ai.length-1, max = Math.max,n=0;
    if(typeof bj === "undefined") x = numeric.rep([m],0);
    if(typeof bj === "undefined") bj = numeric.linspace(0,x.length-1);
    if(typeof xj === "undefined") xj = [];
    function dfs(j) {
        var k;
        if(x[j] !== 0) return;
        x[j] = 1;
        for(k=Ai[j];k<Ai[j+1];++k) dfs(Aj[k]);
        xj[n] = j;
        ++n;
    }
    var i,j,j0,j1,k,l,l0,l1,a;
    for(i=bj.length-1;i!==-1;--i) { dfs(bj[i]); }
    xj.length = n;
    for(i=xj.length-1;i!==-1;--i) { x[xj[i]] = 0; }
    for(i=bj.length-1;i!==-1;--i) { j = bj[i]; x[j] = b[j]; }
    for(i=xj.length-1;i!==-1;--i) {
        j = xj[i];
        j0 = Ai[j];
        j1 = max(Ai[j+1],j0);
        for(k=j0;k!==j1;++k) { if(Aj[k] === j) { x[j] /= Av[k]; break; } }
        a = x[j];
        for(k=j0;k!==j1;++k) {
            l = Aj[k];
            if(l !== j) x[l] -= a*Av[k];
        }
    }
    return x;
}
numeric.ccsDFS = function ccsDFS(n) {
    this.k = Array(n);
    this.k1 = Array(n);
    this.j = Array(n);
}
numeric.ccsDFS.prototype.dfs = function dfs(J,Ai,Aj,x,xj,Pinv) {
    var m = 0,foo,n=xj.length;
    var k = this.k, k1 = this.k1, j = this.j,km,k11;
    if(x[J]!==0) return;
    x[J] = 1;
    j[0] = J;
    k[0] = km = Ai[J];
    k1[0] = k11 = Ai[J+1];
    while(1) {
        if(km >= k11) {
            xj[n] = j[m];
            if(m===0) return;
            ++n;
            --m;
            km = k[m];
            k11 = k1[m];
        } else {
            foo = Pinv[Aj[km]];
            if(x[foo] === 0) {
                x[foo] = 1;
                k[m] = km;
                ++m;
                j[m] = foo;
                km = Ai[foo];
                k1[m] = k11 = Ai[foo+1];
            } else ++km;
        }
    }
}
numeric.ccsLPSolve = function ccsLPSolve(A,B,x,xj,I,Pinv,dfs) {
    var Ai = A[0], Aj = A[1], Av = A[2],m = Ai.length-1, n=0;
    var Bi = B[0], Bj = B[1], Bv = B[2];
    
    var i,i0,i1,j,J,j0,j1,k,l,l0,l1,a;
    i0 = Bi[I];
    i1 = Bi[I+1];
    xj.length = 0;
    for(i=i0;i<i1;++i) { dfs.dfs(Pinv[Bj[i]],Ai,Aj,x,xj,Pinv); }
    for(i=xj.length-1;i!==-1;--i) { x[xj[i]] = 0; }
    for(i=i0;i!==i1;++i) { j = Pinv[Bj[i]]; x[j] = Bv[i]; }
    for(i=xj.length-1;i!==-1;--i) {
        j = xj[i];
        j0 = Ai[j];
        j1 = Ai[j+1];
        for(k=j0;k<j1;++k) { if(Pinv[Aj[k]] === j) { x[j] /= Av[k]; break; } }
        a = x[j];
        for(k=j0;k<j1;++k) {
            l = Pinv[Aj[k]];
            if(l !== j) x[l] -= a*Av[k];
        }
    }
    return x;
}
numeric.ccsLUP1 = function ccsLUP1(A,threshold) {
    var m = A[0].length-1;
    var L = [numeric.rep([m+1],0),[],[]], U = [numeric.rep([m+1], 0),[],[]];
    var Li = L[0], Lj = L[1], Lv = L[2], Ui = U[0], Uj = U[1], Uv = U[2];
    var x = numeric.rep([m],0), xj = numeric.rep([m],0);
    var i,j,k,j0,j1,a,e,c,d,K;
    var sol = numeric.ccsLPSolve, max = Math.max, abs = Math.abs;
    var P = numeric.linspace(0,m-1),Pinv = numeric.linspace(0,m-1);
    var dfs = new numeric.ccsDFS(m);
    if(typeof threshold === "undefined") { threshold = 1; }
    for(i=0;i<m;++i) {
        sol(L,A,x,xj,i,Pinv,dfs);
        a = -1;
        e = -1;
        for(j=xj.length-1;j!==-1;--j) {
            k = xj[j];
            if(k <= i) continue;
            c = abs(x[k]);
            if(c > a) { e = k; a = c; }
        }
        if(abs(x[i])<threshold*a) {
            j = P[i];
            a = P[e];
            P[i] = a; Pinv[a] = i;
            P[e] = j; Pinv[j] = e;
            a = x[i]; x[i] = x[e]; x[e] = a;
        }
        a = Li[i];
        e = Ui[i];
        d = x[i];
        Lj[a] = P[i];
        Lv[a] = 1;
        ++a;
        for(j=xj.length-1;j!==-1;--j) {
            k = xj[j];
            c = x[k];
            xj[j] = 0;
            x[k] = 0;
            if(k<=i) { Uj[e] = k; Uv[e] = c;   ++e; }
            else     { Lj[a] = P[k]; Lv[a] = c/d; ++a; }
        }
        Li[i+1] = a;
        Ui[i+1] = e;
    }
    for(j=Lj.length-1;j!==-1;--j) { Lj[j] = Pinv[Lj[j]]; }
    return {L:L, U:U, P:P, Pinv:Pinv};
}
numeric.ccsDFS0 = function ccsDFS0(n) {
    this.k = Array(n);
    this.k1 = Array(n);
    this.j = Array(n);
}
numeric.ccsDFS0.prototype.dfs = function dfs(J,Ai,Aj,x,xj,Pinv,P) {
    var m = 0,foo,n=xj.length;
    var k = this.k, k1 = this.k1, j = this.j,km,k11;
    if(x[J]!==0) return;
    x[J] = 1;
    j[0] = J;
    k[0] = km = Ai[Pinv[J]];
    k1[0] = k11 = Ai[Pinv[J]+1];
    while(1) {
        if(isNaN(km)) throw new Error("Ow!");
        if(km >= k11) {
            xj[n] = Pinv[j[m]];
            if(m===0) return;
            ++n;
            --m;
            km = k[m];
            k11 = k1[m];
        } else {
            foo = Aj[km];
            if(x[foo] === 0) {
                x[foo] = 1;
                k[m] = km;
                ++m;
                j[m] = foo;
                foo = Pinv[foo];
                km = Ai[foo];
                k1[m] = k11 = Ai[foo+1];
            } else ++km;
        }
    }
}
numeric.ccsLPSolve0 = function ccsLPSolve0(A,B,y,xj,I,Pinv,P,dfs) {
    var Ai = A[0], Aj = A[1], Av = A[2],m = Ai.length-1, n=0;
    var Bi = B[0], Bj = B[1], Bv = B[2];
    
    var i,i0,i1,j,J,j0,j1,k,l,l0,l1,a;
    i0 = Bi[I];
    i1 = Bi[I+1];
    xj.length = 0;
    for(i=i0;i<i1;++i) { dfs.dfs(Bj[i],Ai,Aj,y,xj,Pinv,P); }
    for(i=xj.length-1;i!==-1;--i) { j = xj[i]; y[P[j]] = 0; }
    for(i=i0;i!==i1;++i) { j = Bj[i]; y[j] = Bv[i]; }
    for(i=xj.length-1;i!==-1;--i) {
        j = xj[i];
        l = P[j];
        j0 = Ai[j];
        j1 = Ai[j+1];
        for(k=j0;k<j1;++k) { if(Aj[k] === l) { y[l] /= Av[k]; break; } }
        a = y[l];
        for(k=j0;k<j1;++k) y[Aj[k]] -= a*Av[k];
        y[l] = a;
    }
}
numeric.ccsLUP0 = function ccsLUP0(A,threshold) {
    var m = A[0].length-1;
    var L = [numeric.rep([m+1],0),[],[]], U = [numeric.rep([m+1], 0),[],[]];
    var Li = L[0], Lj = L[1], Lv = L[2], Ui = U[0], Uj = U[1], Uv = U[2];
    var y = numeric.rep([m],0), xj = numeric.rep([m],0);
    var i,j,k,j0,j1,a,e,c,d,K;
    var sol = numeric.ccsLPSolve0, max = Math.max, abs = Math.abs;
    var P = numeric.linspace(0,m-1),Pinv = numeric.linspace(0,m-1);
    var dfs = new numeric.ccsDFS0(m);
    if(typeof threshold === "undefined") { threshold = 1; }
    for(i=0;i<m;++i) {
        sol(L,A,y,xj,i,Pinv,P,dfs);
        a = -1;
        e = -1;
        for(j=xj.length-1;j!==-1;--j) {
            k = xj[j];
            if(k <= i) continue;
            c = abs(y[P[k]]);
            if(c > a) { e = k; a = c; }
        }
        if(abs(y[P[i]])<threshold*a) {
            j = P[i];
            a = P[e];
            P[i] = a; Pinv[a] = i;
            P[e] = j; Pinv[j] = e;
        }
        a = Li[i];
        e = Ui[i];
        d = y[P[i]];
        Lj[a] = P[i];
        Lv[a] = 1;
        ++a;
        for(j=xj.length-1;j!==-1;--j) {
            k = xj[j];
            c = y[P[k]];
            xj[j] = 0;
            y[P[k]] = 0;
            if(k<=i) { Uj[e] = k; Uv[e] = c;   ++e; }
            else     { Lj[a] = P[k]; Lv[a] = c/d; ++a; }
        }
        Li[i+1] = a;
        Ui[i+1] = e;
    }
    for(j=Lj.length-1;j!==-1;--j) { Lj[j] = Pinv[Lj[j]]; }
    return {L:L, U:U, P:P, Pinv:Pinv};
}
numeric.ccsLUP = numeric.ccsLUP0;

numeric.ccsDim = function ccsDim(A) { return [numeric.sup(A[1])+1,A[0].length-1]; }
numeric.ccsGetBlock = function ccsGetBlock(A,i,j) {
    var s = numeric.ccsDim(A),m=s[0],n=s[1];
    if(typeof i === "undefined") { i = numeric.linspace(0,m-1); }
    else if(typeof i === "number") { i = [i]; }
    if(typeof j === "undefined") { j = numeric.linspace(0,n-1); }
    else if(typeof j === "number") { j = [j]; }
    var p,p0,p1,P = i.length,q,Q = j.length,r,jq,ip;
    var Bi = numeric.rep([n],0), Bj=[], Bv=[], B = [Bi,Bj,Bv];
    var Ai = A[0], Aj = A[1], Av = A[2];
    var x = numeric.rep([m],0),count=0,flags = numeric.rep([m],0);
    for(q=0;q<Q;++q) {
        jq = j[q];
        var q0 = Ai[jq];
        var q1 = Ai[jq+1];
        for(p=q0;p<q1;++p) {
            r = Aj[p];
            flags[r] = 1;
            x[r] = Av[p];
        }
        for(p=0;p<P;++p) {
            ip = i[p];
            if(flags[ip]) {
                Bj[count] = p;
                Bv[count] = x[i[p]];
                ++count;
            }
        }
        for(p=q0;p<q1;++p) {
            r = Aj[p];
            flags[r] = 0;
        }
        Bi[q+1] = count;
    }
    return B;
}

numeric.ccsDot = function ccsDot(A,B) {
    var Ai = A[0], Aj = A[1], Av = A[2];
    var Bi = B[0], Bj = B[1], Bv = B[2];
    var sA = numeric.ccsDim(A), sB = numeric.ccsDim(B);
    var m = sA[0], n = sA[1], o = sB[1];
    var x = numeric.rep([m],0), flags = numeric.rep([m],0), xj = Array(m);
    var Ci = numeric.rep([o],0), Cj = [], Cv = [], C = [Ci,Cj,Cv];
    var i,j,k,j0,j1,i0,i1,l,p,a,b;
    for(k=0;k!==o;++k) {
        j0 = Bi[k];
        j1 = Bi[k+1];
        p = 0;
        for(j=j0;j<j1;++j) {
            a = Bj[j];
            b = Bv[j];
            i0 = Ai[a];
            i1 = Ai[a+1];
            for(i=i0;i<i1;++i) {
                l = Aj[i];
                if(flags[l]===0) {
                    xj[p] = l;
                    flags[l] = 1;
                    p = p+1;
                }
                x[l] = x[l] + Av[i]*b;
            }
        }
        j0 = Ci[k];
        j1 = j0+p;
        Ci[k+1] = j1;
        for(j=p-1;j!==-1;--j) {
            b = j0+j;
            i = xj[j];
            Cj[b] = i;
            Cv[b] = x[i];
            flags[i] = 0;
            x[i] = 0;
        }
        Ci[k+1] = Ci[k]+p;
    }
    return C;
}

numeric.ccsLUPSolve = function ccsLUPSolve(LUP,B) {
    var L = LUP.L, U = LUP.U, P = LUP.P;
    var Bi = B[0];
    var flag = false;
    if(typeof Bi !== "object") { B = [[0,B.length],numeric.linspace(0,B.length-1),B]; Bi = B[0]; flag = true; }
    var Bj = B[1], Bv = B[2];
    var n = L[0].length-1, m = Bi.length-1;
    var x = numeric.rep([n],0), xj = Array(n);
    var b = numeric.rep([n],0), bj = Array(n);
    var Xi = numeric.rep([m+1],0), Xj = [], Xv = [];
    var sol = numeric.ccsTSolve;
    var i,j,j0,j1,k,J,N=0;
    for(i=0;i<m;++i) {
        k = 0;
        j0 = Bi[i];
        j1 = Bi[i+1];
        for(j=j0;j<j1;++j) { 
            J = LUP.Pinv[Bj[j]];
            bj[k] = J;
            b[J] = Bv[j];
            ++k;
        }
        bj.length = k;
        sol(L,b,x,bj,xj);
        for(j=bj.length-1;j!==-1;--j) b[bj[j]] = 0;
        sol(U,x,b,xj,bj);
        if(flag) return b;
        for(j=xj.length-1;j!==-1;--j) x[xj[j]] = 0;
        for(j=bj.length-1;j!==-1;--j) {
            J = bj[j];
            Xj[N] = J;
            Xv[N] = b[J];
            b[J] = 0;
            ++N;
        }
        Xi[i+1] = N;
    }
    return [Xi,Xj,Xv];
}

numeric.ccsbinop = function ccsbinop(body,setup) {
    if(typeof setup === "undefined") setup='';
    return Function('X','Y',
            'var Xi = X[0], Xj = X[1], Xv = X[2];\n'+
            'var Yi = Y[0], Yj = Y[1], Yv = Y[2];\n'+
            'var n = Xi.length-1,m = Math.max(numeric.sup(Xj),numeric.sup(Yj))+1;\n'+
            'var Zi = numeric.rep([n+1],0), Zj = [], Zv = [];\n'+
            'var x = numeric.rep([m],0),y = numeric.rep([m],0);\n'+
            'var xk,yk,zk;\n'+
            'var i,j,j0,j1,k,p=0;\n'+
            setup+
            'for(i=0;i<n;++i) {\n'+
            '  j0 = Xi[i]; j1 = Xi[i+1];\n'+
            '  for(j=j0;j!==j1;++j) {\n'+
            '    k = Xj[j];\n'+
            '    x[k] = 1;\n'+
            '    Zj[p] = k;\n'+
            '    ++p;\n'+
            '  }\n'+
            '  j0 = Yi[i]; j1 = Yi[i+1];\n'+
            '  for(j=j0;j!==j1;++j) {\n'+
            '    k = Yj[j];\n'+
            '    y[k] = Yv[j];\n'+
            '    if(x[k] === 0) {\n'+
            '      Zj[p] = k;\n'+
            '      ++p;\n'+
            '    }\n'+
            '  }\n'+
            '  Zi[i+1] = p;\n'+
            '  j0 = Xi[i]; j1 = Xi[i+1];\n'+
            '  for(j=j0;j!==j1;++j) x[Xj[j]] = Xv[j];\n'+
            '  j0 = Zi[i]; j1 = Zi[i+1];\n'+
            '  for(j=j0;j!==j1;++j) {\n'+
            '    k = Zj[j];\n'+
            '    xk = x[k];\n'+
            '    yk = y[k];\n'+
            body+'\n'+
            '    Zv[j] = zk;\n'+
            '  }\n'+
            '  j0 = Xi[i]; j1 = Xi[i+1];\n'+
            '  for(j=j0;j!==j1;++j) x[Xj[j]] = 0;\n'+
            '  j0 = Yi[i]; j1 = Yi[i+1];\n'+
            '  for(j=j0;j!==j1;++j) y[Yj[j]] = 0;\n'+
            '}\n'+
            'return [Zi,Zj,Zv];'
            );
};

(function() {
    var k,A,B,C;
    for(k in numeric.ops2) {
        if(isFinite(eval('1'+numeric.ops2[k]+'0'))) A = '[Y[0],Y[1],numeric.'+k+'(X,Y[2])]';
        else A = 'NaN';
        if(isFinite(eval('0'+numeric.ops2[k]+'1'))) B = '[X[0],X[1],numeric.'+k+'(X[2],Y)]';
        else B = 'NaN';
        if(isFinite(eval('1'+numeric.ops2[k]+'0')) && isFinite(eval('0'+numeric.ops2[k]+'1'))) C = 'numeric.ccs'+k+'MM(X,Y)';
        else C = 'NaN';
        numeric['ccs'+k+'MM'] = numeric.ccsbinop('zk = xk '+numeric.ops2[k]+'yk;');
        numeric['ccs'+k] = Function('X','Y',
                'if(typeof X === "number") return '+A+';\n'+
                'if(typeof Y === "number") return '+B+';\n'+
                'return '+C+';\n'
                );
    }
}());

numeric.ccsScatter = function ccsScatter(A) {
    var Ai = A[0], Aj = A[1], Av = A[2];
    var n = numeric.sup(Aj)+1,m=Ai.length;
    var Ri = numeric.rep([n],0),Rj=Array(m), Rv = Array(m);
    var counts = numeric.rep([n],0),i;
    for(i=0;i<m;++i) counts[Aj[i]]++;
    for(i=0;i<n;++i) Ri[i+1] = Ri[i] + counts[i];
    var ptr = Ri.slice(0),k,Aii;
    for(i=0;i<m;++i) {
        Aii = Aj[i];
        k = ptr[Aii];
        Rj[k] = Ai[i];
        Rv[k] = Av[i];
        ptr[Aii]=ptr[Aii]+1;
    }
    return [Ri,Rj,Rv];
}

numeric.ccsGather = function ccsGather(A) {
    var Ai = A[0], Aj = A[1], Av = A[2];
    var n = Ai.length-1,m = Aj.length;
    var Ri = Array(m), Rj = Array(m), Rv = Array(m);
    var i,j,j0,j1,p;
    p=0;
    for(i=0;i<n;++i) {
        j0 = Ai[i];
        j1 = Ai[i+1];
        for(j=j0;j!==j1;++j) {
            Rj[p] = i;
            Ri[p] = Aj[j];
            Rv[p] = Av[j];
            ++p;
        }
    }
    return [Ri,Rj,Rv];
}

// The following sparse linear algebra routines are deprecated.

numeric.sdim = function dim(A,ret,k) {
    if(typeof ret === "undefined") { ret = []; }
    if(typeof A !== "object") return ret;
    if(typeof k === "undefined") { k=0; }
    if(!(k in ret)) { ret[k] = 0; }
    if(A.length > ret[k]) ret[k] = A.length;
    var i;
    for(i in A) {
        if(A.hasOwnProperty(i)) dim(A[i],ret,k+1);
    }
    return ret;
};

numeric.sclone = function clone(A,k,n) {
    if(typeof k === "undefined") { k=0; }
    if(typeof n === "undefined") { n = numeric.sdim(A).length; }
    var i,ret = Array(A.length);
    if(k === n-1) {
        for(i in A) { if(A.hasOwnProperty(i)) ret[i] = A[i]; }
        return ret;
    }
    for(i in A) {
        if(A.hasOwnProperty(i)) ret[i] = clone(A[i],k+1,n);
    }
    return ret;
}

numeric.sdiag = function diag(d) {
    var n = d.length,i,ret = Array(n),i1,i2,i3;
    for(i=n-1;i>=1;i-=2) {
        i1 = i-1;
        ret[i] = []; ret[i][i] = d[i];
        ret[i1] = []; ret[i1][i1] = d[i1];
    }
    if(i===0) { ret[0] = []; ret[0][0] = d[i]; }
    return ret;
}

numeric.sidentity = function identity(n) { return numeric.sdiag(numeric.rep([n],1)); }

numeric.stranspose = function transpose(A) {
    var ret = [], n = A.length, i,j,Ai;
    for(i in A) {
        if(!(A.hasOwnProperty(i))) continue;
        Ai = A[i];
        for(j in Ai) {
            if(!(Ai.hasOwnProperty(j))) continue;
            if(typeof ret[j] !== "object") { ret[j] = []; }
            ret[j][i] = Ai[j];
        }
    }
    return ret;
}

numeric.sLUP = function LUP(A,tol) {
    throw new Error("The function numeric.sLUP had a bug in it and has been removed. Please use the new numeric.ccsLUP function instead.");
};

numeric.sdotMM = function dotMM(A,B) {
    var p = A.length, q = B.length, BT = numeric.stranspose(B), r = BT.length, Ai, BTk;
    var i,j,k,accum;
    var ret = Array(p),reti;
    for(i=p-1;i>=0;i--) {
        reti = [];
        Ai = A[i];
        for(k=r-1;k>=0;k--) {
            accum = 0;
            BTk = BT[k];
            for(j in Ai) {
                if(!(Ai.hasOwnProperty(j))) continue;
                if(j in BTk) { accum += Ai[j]*BTk[j]; }
            }
            if(accum) reti[k] = accum;
        }
        ret[i] = reti;
    }
    return ret;
}

numeric.sdotMV = function dotMV(A,x) {
    var p = A.length, Ai, i,j;
    var ret = Array(p), accum;
    for(i=p-1;i>=0;i--) {
        Ai = A[i];
        accum = 0;
        for(j in Ai) {
            if(!(Ai.hasOwnProperty(j))) continue;
            if(x[j]) accum += Ai[j]*x[j];
        }
        if(accum) ret[i] = accum;
    }
    return ret;
}

numeric.sdotVM = function dotMV(x,A) {
    var i,j,Ai,alpha;
    var ret = [], accum;
    for(i in x) {
        if(!x.hasOwnProperty(i)) continue;
        Ai = A[i];
        alpha = x[i];
        for(j in Ai) {
            if(!Ai.hasOwnProperty(j)) continue;
            if(!ret[j]) { ret[j] = 0; }
            ret[j] += alpha*Ai[j];
        }
    }
    return ret;
}

numeric.sdotVV = function dotVV(x,y) {
    var i,ret=0;
    for(i in x) { if(x[i] && y[i]) ret+= x[i]*y[i]; }
    return ret;
}

numeric.sdot = function dot(A,B) {
    var m = numeric.sdim(A).length, n = numeric.sdim(B).length;
    var k = m*1000+n;
    switch(k) {
    case 0: return A*B;
    case 1001: return numeric.sdotVV(A,B);
    case 2001: return numeric.sdotMV(A,B);
    case 1002: return numeric.sdotVM(A,B);
    case 2002: return numeric.sdotMM(A,B);
    default: throw new Error('numeric.sdot not implemented for tensors of order '+m+' and '+n);
    }
}

numeric.sscatter = function scatter(V) {
    var n = V[0].length, Vij, i, j, m = V.length, A = [], Aj;
    for(i=n-1;i>=0;--i) {
        if(!V[m-1][i]) continue;
        Aj = A;
        for(j=0;j<m-2;j++) {
            Vij = V[j][i];
            if(!Aj[Vij]) Aj[Vij] = [];
            Aj = Aj[Vij];
        }
        Aj[V[j][i]] = V[j+1][i];
    }
    return A;
}

numeric.sgather = function gather(A,ret,k) {
    if(typeof ret === "undefined") ret = [];
    if(typeof k === "undefined") k = [];
    var n,i,Ai;
    n = k.length;
    for(i in A) {
        if(A.hasOwnProperty(i)) {
            k[n] = parseInt(i);
            Ai = A[i];
            if(typeof Ai === "number") {
                if(Ai) {
                    if(ret.length === 0) {
                        for(i=n+1;i>=0;--i) ret[i] = [];
                    }
                    for(i=n;i>=0;--i) ret[i].push(k[i]);
                    ret[n+1].push(Ai);
                }
            } else gather(Ai,ret,k);
        }
    }
    if(k.length>n) k.pop();
    return ret;
}

// 6. Coordinate matrices
numeric.cLU = function LU(A) {
    var I = A[0], J = A[1], V = A[2];
    var p = I.length, m=0, i,j,k,a,b,c;
    for(i=0;i<p;i++) if(I[i]>m) m=I[i];
    m++;
    var L = Array(m), U = Array(m), left = numeric.rep([m],Infinity), right = numeric.rep([m],-Infinity);
    var Ui, Uj,alpha;
    for(k=0;k<p;k++) {
        i = I[k];
        j = J[k];
        if(j<left[i]) left[i] = j;
        if(j>right[i]) right[i] = j;
    }
    for(i=0;i<m-1;i++) { if(right[i] > right[i+1]) right[i+1] = right[i]; }
    for(i=m-1;i>=1;i--) { if(left[i]<left[i-1]) left[i-1] = left[i]; }
    var countL = 0, countU = 0;
    for(i=0;i<m;i++) {
        U[i] = numeric.rep([right[i]-left[i]+1],0);
        L[i] = numeric.rep([i-left[i]],0);
        countL += i-left[i]+1;
        countU += right[i]-i+1;
    }
    for(k=0;k<p;k++) { i = I[k]; U[i][J[k]-left[i]] = V[k]; }
    for(i=0;i<m-1;i++) {
        a = i-left[i];
        Ui = U[i];
        for(j=i+1;left[j]<=i && j<m;j++) {
            b = i-left[j];
            c = right[i]-i;
            Uj = U[j];
            alpha = Uj[b]/Ui[a];
            if(alpha) {
                for(k=1;k<=c;k++) { Uj[k+b] -= alpha*Ui[k+a]; }
                L[j][i-left[j]] = alpha;
            }
        }
    }
    var Ui = [], Uj = [], Uv = [], Li = [], Lj = [], Lv = [];
    var p,q,foo;
    p=0; q=0;
    for(i=0;i<m;i++) {
        a = left[i];
        b = right[i];
        foo = U[i];
        for(j=i;j<=b;j++) {
            if(foo[j-a]) {
                Ui[p] = i;
                Uj[p] = j;
                Uv[p] = foo[j-a];
                p++;
            }
        }
        foo = L[i];
        for(j=a;j<i;j++) {
            if(foo[j-a]) {
                Li[q] = i;
                Lj[q] = j;
                Lv[q] = foo[j-a];
                q++;
            }
        }
        Li[q] = i;
        Lj[q] = i;
        Lv[q] = 1;
        q++;
    }
    return {U:[Ui,Uj,Uv], L:[Li,Lj,Lv]};
};

numeric.cLUsolve = function LUsolve(lu,b) {
    var L = lu.L, U = lu.U, ret = numeric.clone(b);
    var Li = L[0], Lj = L[1], Lv = L[2];
    var Ui = U[0], Uj = U[1], Uv = U[2];
    var p = Ui.length, q = Li.length;
    var m = ret.length,i,j,k;
    k = 0;
    for(i=0;i<m;i++) {
        while(Lj[k] < i) {
            ret[i] -= Lv[k]*ret[Lj[k]];
            k++;
        }
        k++;
    }
    k = p-1;
    for(i=m-1;i>=0;i--) {
        while(Uj[k] > i) {
            ret[i] -= Uv[k]*ret[Uj[k]];
            k--;
        }
        ret[i] /= Uv[k];
        k--;
    }
    return ret;
};

numeric.cgrid = function grid(n,shape) {
    if(typeof n === "number") n = [n,n];
    var ret = numeric.rep(n,-1);
    var i,j,count;
    if(typeof shape !== "function") {
        switch(shape) {
        case 'L':
            shape = function(i,j) { return (i>=n[0]/2 || j<n[1]/2); }
            break;
        default:
            shape = function(i,j) { return true; };
            break;
        }
    }
    count=0;
    for(i=1;i<n[0]-1;i++) for(j=1;j<n[1]-1;j++) 
        if(shape(i,j)) {
            ret[i][j] = count;
            count++;
        }
    return ret;
}

numeric.cdelsq = function delsq(g) {
    var dir = [[-1,0],[0,-1],[0,1],[1,0]];
    var s = numeric.dim(g), m = s[0], n = s[1], i,j,k,p,q;
    var Li = [], Lj = [], Lv = [];
    for(i=1;i<m-1;i++) for(j=1;j<n-1;j++) {
        if(g[i][j]<0) continue;
        for(k=0;k<4;k++) {
            p = i+dir[k][0];
            q = j+dir[k][1];
            if(g[p][q]<0) continue;
            Li.push(g[i][j]);
            Lj.push(g[p][q]);
            Lv.push(-1);
        }
        Li.push(g[i][j]);
        Lj.push(g[i][j]);
        Lv.push(4);
    }
    return [Li,Lj,Lv];
}

numeric.cdotMV = function dotMV(A,x) {
    var ret, Ai = A[0], Aj = A[1], Av = A[2],k,p=Ai.length,N;
    N=0;
    for(k=0;k<p;k++) { if(Ai[k]>N) N = Ai[k]; }
    N++;
    ret = numeric.rep([N],0);
    for(k=0;k<p;k++) { ret[Ai[k]]+=Av[k]*x[Aj[k]]; }
    return ret;
}

// 7. Splines

numeric.Spline = function Spline(x,yl,yr,kl,kr) { this.x = x; this.yl = yl; this.yr = yr; this.kl = kl; this.kr = kr; }
numeric.Spline.prototype._at = function _at(x1,p) {
    var x = this.x;
    var yl = this.yl;
    var yr = this.yr;
    var kl = this.kl;
    var kr = this.kr;
    var x1,a,b,t;
    var add = numeric.add, sub = numeric.sub, mul = numeric.mul;
    a = sub(mul(kl[p],x[p+1]-x[p]),sub(yr[p+1],yl[p]));
    b = add(mul(kr[p+1],x[p]-x[p+1]),sub(yr[p+1],yl[p]));
    t = (x1-x[p])/(x[p+1]-x[p]);
    var s = t*(1-t);
    return add(add(add(mul(1-t,yl[p]),mul(t,yr[p+1])),mul(a,s*(1-t))),mul(b,s*t));
}
numeric.Spline.prototype.at = function at(x0) {
    if(typeof x0 === "number") {
        var x = this.x;
        var n = x.length;
        var p,q,mid,floor = Math.floor,a,b,t;
        p = 0;
        q = n-1;
        while(q-p>1) {
            mid = floor((p+q)/2);
            if(x[mid] <= x0) p = mid;
            else q = mid;
        }
        return this._at(x0,p);
    }
    var n = x0.length, i, ret = Array(n);
    for(i=n-1;i!==-1;--i) ret[i] = this.at(x0[i]);
    return ret;
}
numeric.Spline.prototype.diff = function diff() {
    var x = this.x;
    var yl = this.yl;
    var yr = this.yr;
    var kl = this.kl;
    var kr = this.kr;
    var n = yl.length;
    var i,dx,dy;
    var zl = kl, zr = kr, pl = Array(n), pr = Array(n);
    var add = numeric.add, mul = numeric.mul, div = numeric.div, sub = numeric.sub;
    for(i=n-1;i!==-1;--i) {
        dx = x[i+1]-x[i];
        dy = sub(yr[i+1],yl[i]);
        pl[i] = div(add(mul(dy, 6),mul(kl[i],-4*dx),mul(kr[i+1],-2*dx)),dx*dx);
        pr[i+1] = div(add(mul(dy,-6),mul(kl[i], 2*dx),mul(kr[i+1], 4*dx)),dx*dx);
    }
    return new numeric.Spline(x,zl,zr,pl,pr);
}
numeric.Spline.prototype.roots = function roots() {
    function sqr(x) { return x*x; }
    function heval(y0,y1,k0,k1,x) {
        var A = k0*2-(y1-y0);
        var B = -k1*2+(y1-y0);
        var t = (x+1)*0.5;
        var s = t*(1-t);
        return (1-t)*y0+t*y1+A*s*(1-t)+B*s*t;
    }
    var ret = [];
    var x = this.x, yl = this.yl, yr = this.yr, kl = this.kl, kr = this.kr;
    if(typeof yl[0] === "number") {
        yl = [yl];
        yr = [yr];
        kl = [kl];
        kr = [kr];
    }
    var m = yl.length,n=x.length-1,i,j,k,y,s,t;
    var ai,bi,ci,di, ret = Array(m),ri,k0,k1,y0,y1,A,B,D,dx,cx,stops,z0,z1,zm,t0,t1,tm;
    var sqrt = Math.sqrt;
    for(i=0;i!==m;++i) {
        ai = yl[i];
        bi = yr[i];
        ci = kl[i];
        di = kr[i];
        ri = [];
        for(j=0;j!==n;j++) {
            if(j>0 && bi[j]*ai[j]<0) ri.push(x[j]);
            dx = (x[j+1]-x[j]);
            cx = x[j];
            y0 = ai[j];
            y1 = bi[j+1];
            k0 = ci[j]/dx;
            k1 = di[j+1]/dx;
            D = sqr(k0-k1+3*(y0-y1)) + 12*k1*y0;
            A = k1+3*y0+2*k0-3*y1;
            B = 3*(k1+k0+2*(y0-y1));
            if(D<=0) {
                z0 = A/B;
                if(z0>x[j] && z0<x[j+1]) stops = [x[j],z0,x[j+1]];
                else stops = [x[j],x[j+1]];
            } else {
                z0 = (A-sqrt(D))/B;
                z1 = (A+sqrt(D))/B;
                stops = [x[j]];
                if(z0>x[j] && z0<x[j+1]) stops.push(z0);
                if(z1>x[j] && z1<x[j+1]) stops.push(z1);
                stops.push(x[j+1]);
            }
            t0 = stops[0];
            z0 = this._at(t0,j);
            for(k=0;k<stops.length-1;k++) {
                t1 = stops[k+1];
                z1 = this._at(t1,j);
                if(z0 === 0) {
                    ri.push(t0); 
                    t0 = t1;
                    z0 = z1;
                    continue;
                }
                if(z1 === 0 || z0*z1>0) {
                    t0 = t1;
                    z0 = z1;
                    continue;
                }
                var side = 0;
                while(1) {
                    tm = (z0*t1-z1*t0)/(z0-z1);
                    if(tm <= t0 || tm >= t1) { break; }
                    zm = this._at(tm,j);
                    if(zm*z1>0) {
                        t1 = tm;
                        z1 = zm;
                        if(side === -1) z0*=0.5;
                        side = -1;
                    } else if(zm*z0>0) {
                        t0 = tm;
                        z0 = zm;
                        if(side === 1) z1*=0.5;
                        side = 1;
                    } else break;
                }
                ri.push(tm);
                t0 = stops[k+1];
                z0 = this._at(t0, j);
            }
            if(z1 === 0) ri.push(t1);
        }
        ret[i] = ri;
    }
    if(typeof this.yl[0] === "number") return ret[0];
    return ret;
}
numeric.spline = function spline(x,y,k1,kn) {
    var n = x.length, b = [], dx = [], dy = [];
    var i;
    var sub = numeric.sub,mul = numeric.mul,add = numeric.add;
    for(i=n-2;i>=0;i--) { dx[i] = x[i+1]-x[i]; dy[i] = sub(y[i+1],y[i]); }
    if(typeof k1 === "string" || typeof kn === "string") { 
        k1 = kn = "periodic";
    }
    // Build sparse tridiagonal system
    var T = [[],[],[]];
    switch(typeof k1) {
    case "undefined":
        b[0] = mul(3/(dx[0]*dx[0]),dy[0]);
        T[0].push(0,0);
        T[1].push(0,1);
        T[2].push(2/dx[0],1/dx[0]);
        break;
    case "string":
        b[0] = add(mul(3/(dx[n-2]*dx[n-2]),dy[n-2]),mul(3/(dx[0]*dx[0]),dy[0]));
        T[0].push(0,0,0);
        T[1].push(n-2,0,1);
        T[2].push(1/dx[n-2],2/dx[n-2]+2/dx[0],1/dx[0]);
        break;
    default:
        b[0] = k1;
        T[0].push(0);
        T[1].push(0);
        T[2].push(1);
        break;
    }
    for(i=1;i<n-1;i++) {
        b[i] = add(mul(3/(dx[i-1]*dx[i-1]),dy[i-1]),mul(3/(dx[i]*dx[i]),dy[i]));
        T[0].push(i,i,i);
        T[1].push(i-1,i,i+1);
        T[2].push(1/dx[i-1],2/dx[i-1]+2/dx[i],1/dx[i]);
    }
    switch(typeof kn) {
    case "undefined":
        b[n-1] = mul(3/(dx[n-2]*dx[n-2]),dy[n-2]);
        T[0].push(n-1,n-1);
        T[1].push(n-2,n-1);
        T[2].push(1/dx[n-2],2/dx[n-2]);
        break;
    case "string":
        T[1][T[1].length-1] = 0;
        break;
    default:
        b[n-1] = kn;
        T[0].push(n-1);
        T[1].push(n-1);
        T[2].push(1);
        break;
    }
    if(typeof b[0] !== "number") b = numeric.transpose(b);
    else b = [b];
    var k = Array(b.length);
    if(typeof k1 === "string") {
        for(i=k.length-1;i!==-1;--i) {
            k[i] = numeric.ccsLUPSolve(numeric.ccsLUP(numeric.ccsScatter(T)),b[i]);
            k[i][n-1] = k[i][0];
        }
    } else {
        for(i=k.length-1;i!==-1;--i) {
            k[i] = numeric.cLUsolve(numeric.cLU(T),b[i]);
        }
    }
    if(typeof y[0] === "number") k = k[0];
    else k = numeric.transpose(k);
    return new numeric.Spline(x,y,y,k,k);
}

// 8. FFT
numeric.fftpow2 = function fftpow2(x,y) {
    var n = x.length;
    if(n === 1) return;
    var cos = Math.cos, sin = Math.sin, i,j;
    var xe = Array(n/2), ye = Array(n/2), xo = Array(n/2), yo = Array(n/2);
    j = n/2;
    for(i=n-1;i!==-1;--i) {
        --j;
        xo[j] = x[i];
        yo[j] = y[i];
        --i;
        xe[j] = x[i];
        ye[j] = y[i];
    }
    fftpow2(xe,ye);
    fftpow2(xo,yo);
    j = n/2;
    var t,k = (-6.2831853071795864769252867665590057683943387987502116419/n),ci,si;
    for(i=n-1;i!==-1;--i) {
        --j;
        if(j === -1) j = n/2-1;
        t = k*i;
        ci = cos(t);
        si = sin(t);
        x[i] = xe[j] + ci*xo[j] - si*yo[j];
        y[i] = ye[j] + ci*yo[j] + si*xo[j];
    }
}
numeric._ifftpow2 = function _ifftpow2(x,y) {
    var n = x.length;
    if(n === 1) return;
    var cos = Math.cos, sin = Math.sin, i,j;
    var xe = Array(n/2), ye = Array(n/2), xo = Array(n/2), yo = Array(n/2);
    j = n/2;
    for(i=n-1;i!==-1;--i) {
        --j;
        xo[j] = x[i];
        yo[j] = y[i];
        --i;
        xe[j] = x[i];
        ye[j] = y[i];
    }
    _ifftpow2(xe,ye);
    _ifftpow2(xo,yo);
    j = n/2;
    var t,k = (6.2831853071795864769252867665590057683943387987502116419/n),ci,si;
    for(i=n-1;i!==-1;--i) {
        --j;
        if(j === -1) j = n/2-1;
        t = k*i;
        ci = cos(t);
        si = sin(t);
        x[i] = xe[j] + ci*xo[j] - si*yo[j];
        y[i] = ye[j] + ci*yo[j] + si*xo[j];
    }
}
numeric.ifftpow2 = function ifftpow2(x,y) {
    numeric._ifftpow2(x,y);
    numeric.diveq(x,x.length);
    numeric.diveq(y,y.length);
}
numeric.convpow2 = function convpow2(ax,ay,bx,by) {
    numeric.fftpow2(ax,ay);
    numeric.fftpow2(bx,by);
    var i,n = ax.length,axi,bxi,ayi,byi;
    for(i=n-1;i!==-1;--i) {
        axi = ax[i]; ayi = ay[i]; bxi = bx[i]; byi = by[i];
        ax[i] = axi*bxi-ayi*byi;
        ay[i] = axi*byi+ayi*bxi;
    }
    numeric.ifftpow2(ax,ay);
}
numeric.T.prototype.fft = function fft() {
    var x = this.x, y = this.y;
    var n = x.length, log = Math.log, log2 = log(2),
        p = Math.ceil(log(2*n-1)/log2), m = Math.pow(2,p);
    var cx = numeric.rep([m],0), cy = numeric.rep([m],0), cos = Math.cos, sin = Math.sin;
    var k, c = (-3.141592653589793238462643383279502884197169399375105820/n),t;
    var a = numeric.rep([m],0), b = numeric.rep([m],0),nhalf = Math.floor(n/2);
    for(k=0;k<n;k++) a[k] = x[k];
    if(typeof y !== "undefined") for(k=0;k<n;k++) b[k] = y[k];
    cx[0] = 1;
    for(k=1;k<=m/2;k++) {
        t = c*k*k;
        cx[k] = cos(t);
        cy[k] = sin(t);
        cx[m-k] = cos(t);
        cy[m-k] = sin(t)
    }
    var X = new numeric.T(a,b), Y = new numeric.T(cx,cy);
    X = X.mul(Y);
    numeric.convpow2(X.x,X.y,numeric.clone(Y.x),numeric.neg(Y.y));
    X = X.mul(Y);
    X.x.length = n;
    X.y.length = n;
    return X;
}
numeric.T.prototype.ifft = function ifft() {
    var x = this.x, y = this.y;
    var n = x.length, log = Math.log, log2 = log(2),
        p = Math.ceil(log(2*n-1)/log2), m = Math.pow(2,p);
    var cx = numeric.rep([m],0), cy = numeric.rep([m],0), cos = Math.cos, sin = Math.sin;
    var k, c = (3.141592653589793238462643383279502884197169399375105820/n),t;
    var a = numeric.rep([m],0), b = numeric.rep([m],0),nhalf = Math.floor(n/2);
    for(k=0;k<n;k++) a[k] = x[k];
    if(typeof y !== "undefined") for(k=0;k<n;k++) b[k] = y[k];
    cx[0] = 1;
    for(k=1;k<=m/2;k++) {
        t = c*k*k;
        cx[k] = cos(t);
        cy[k] = sin(t);
        cx[m-k] = cos(t);
        cy[m-k] = sin(t)
    }
    var X = new numeric.T(a,b), Y = new numeric.T(cx,cy);
    X = X.mul(Y);
    numeric.convpow2(X.x,X.y,numeric.clone(Y.x),numeric.neg(Y.y));
    X = X.mul(Y);
    X.x.length = n;
    X.y.length = n;
    return X.div(n);
}

//9. Unconstrained optimization
numeric.gradient = function gradient(f,x) {
    var n = x.length;
    var f0 = f(x);
    if(isNaN(f0)) throw new Error('gradient: f(x) is a NaN!');
    var max = Math.max;
    var i,x0 = numeric.clone(x),f1,f2, J = Array(n);
    var div = numeric.div, sub = numeric.sub,errest,roundoff,max = Math.max,eps = 1e-3,abs = Math.abs, min = Math.min;
    var t0,t1,t2,it=0,d1,d2,N;
    for(i=0;i<n;i++) {
        var h = max(1e-6*f0,1e-8);
        while(1) {
            ++it;
            if(it>20) { throw new Error("Numerical gradient fails"); }
            x0[i] = x[i]+h;
            f1 = f(x0);
            x0[i] = x[i]-h;
            f2 = f(x0);
            x0[i] = x[i];
            if(isNaN(f1) || isNaN(f2)) { h/=16; continue; }
            J[i] = (f1-f2)/(2*h);
            t0 = x[i]-h;
            t1 = x[i];
            t2 = x[i]+h;
            d1 = (f1-f0)/h;
            d2 = (f0-f2)/h;
            N = max(abs(J[i]),abs(f0),abs(f1),abs(f2),abs(t0),abs(t1),abs(t2),1e-8);
            errest = min(max(abs(d1-J[i]),abs(d2-J[i]),abs(d1-d2))/N,h/N);
            if(errest>eps) { h/=16; }
            else break;
            }
    }
    return J;
}

numeric.uncmin = function uncmin(f,x0,tol,gradient,maxit,callback,options) {
    var grad = numeric.gradient;
    if(typeof options === "undefined") { options = {}; }
    if(typeof tol === "undefined") { tol = 1e-8; }
    if(typeof gradient === "undefined") { gradient = function(x) { return grad(f,x); }; }
    if(typeof maxit === "undefined") maxit = 1000;
    x0 = numeric.clone(x0);
    var n = x0.length;
    var f0 = f(x0),f1,df0;
    if(isNaN(f0)) throw new Error('uncmin: f(x0) is a NaN!');
    var max = Math.max, norm2 = numeric.norm2;
    tol = max(tol,numeric.epsilon);
    var step,g0,g1,H1 = options.Hinv || numeric.identity(n);
    var dot = numeric.dot, inv = numeric.inv, sub = numeric.sub, add = numeric.add, ten = numeric.tensor, div = numeric.div, mul = numeric.mul;
    var all = numeric.all, isfinite = numeric.isFinite, neg = numeric.neg;
    var it=0,i,s,x1,y,Hy,Hs,ys,i0,t,nstep,t1,t2;
    var msg = "";
    g0 = gradient(x0);
    while(it<maxit) {
        if(typeof callback === "function") { if(callback(it,x0,f0,g0,H1)) { msg = "Callback returned true"; break; } }
        if(!all(isfinite(g0))) { msg = "Gradient has Infinity or NaN"; break; }
        step = neg(dot(H1,g0));
        if(!all(isfinite(step))) { msg = "Search direction has Infinity or NaN"; break; }
        nstep = norm2(step);
        if(nstep < tol) { msg="Newton step smaller than tol"; break; }
        t = 1;
        df0 = dot(g0,step);
        // line search
        x1 = x0;
        while(it < maxit) {
            if(t*nstep < tol) { break; }
            s = mul(step,t);
            x1 = add(x0,s);
            f1 = f(x1);
            if(f1-f0 >= 0.1*t*df0 || isNaN(f1)) {
                t *= 0.5;
                ++it;
                continue;
            }
            break;
        }
        if(t*nstep < tol) { msg = "Line search step size smaller than tol"; break; }
        if(it === maxit) { msg = "maxit reached during line search"; break; }
        g1 = gradient(x1);
        y = sub(g1,g0);
        ys = dot(y,s);
        Hy = dot(H1,y);
        H1 = sub(add(H1,
                mul(
                        (ys+dot(y,Hy))/(ys*ys),
                        ten(s,s)    )),
                div(add(ten(Hy,s),ten(s,Hy)),ys));
        x0 = x1;
        f0 = f1;
        g0 = g1;
        ++it;
    }
    return {solution: x0, f: f0, gradient: g0, invHessian: H1, iterations:it, message: msg};
}

// 10. Ode solver (Dormand-Prince)
numeric.Dopri = function Dopri(x,y,f,ymid,iterations,msg,events) {
    this.x = x;
    this.y = y;
    this.f = f;
    this.ymid = ymid;
    this.iterations = iterations;
    this.events = events;
    this.message = msg;
}
numeric.Dopri.prototype._at = function _at(xi,j) {
    function sqr(x) { return x*x; }
    var sol = this;
    var xs = sol.x;
    var ys = sol.y;
    var k1 = sol.f;
    var ymid = sol.ymid;
    var n = xs.length;
    var x0,x1,xh,y0,y1,yh,xi;
    var floor = Math.floor,h;
    var c = 0.5;
    var add = numeric.add, mul = numeric.mul,sub = numeric.sub, p,q,w;
    x0 = xs[j];
    x1 = xs[j+1];
    y0 = ys[j];
    y1 = ys[j+1];
    h  = x1-x0;
    xh = x0+c*h;
    yh = ymid[j];
    p = sub(k1[j  ],mul(y0,1/(x0-xh)+2/(x0-x1)));
    q = sub(k1[j+1],mul(y1,1/(x1-xh)+2/(x1-x0)));
    w = [sqr(xi - x1) * (xi - xh) / sqr(x0 - x1) / (x0 - xh),
         sqr(xi - x0) * sqr(xi - x1) / sqr(x0 - xh) / sqr(x1 - xh),
         sqr(xi - x0) * (xi - xh) / sqr(x1 - x0) / (x1 - xh),
         (xi - x0) * sqr(xi - x1) * (xi - xh) / sqr(x0-x1) / (x0 - xh),
         (xi - x1) * sqr(xi - x0) * (xi - xh) / sqr(x0-x1) / (x1 - xh)];
    return add(add(add(add(mul(y0,w[0]),
                           mul(yh,w[1])),
                           mul(y1,w[2])),
                           mul( p,w[3])),
                           mul( q,w[4]));
}
numeric.Dopri.prototype.at = function at(x) {
    var i,j,k,floor = Math.floor;
    if(typeof x !== "number") {
        var n = x.length, ret = Array(n);
        for(i=n-1;i!==-1;--i) {
            ret[i] = this.at(x[i]);
        }
        return ret;
    }
    var x0 = this.x;
    i = 0; j = x0.length-1;
    while(j-i>1) {
        k = floor(0.5*(i+j));
        if(x0[k] <= x) i = k;
        else j = k;
    }
    return this._at(x,i);
}

numeric.dopri = function dopri(x0,x1,y0,f,tol,maxit,event) {
    if(typeof tol === "undefined") { tol = 1e-6; }
    if(typeof maxit === "undefined") { maxit = 1000; }
    var xs = [x0], ys = [y0], k1 = [f(x0,y0)], k2,k3,k4,k5,k6,k7, ymid = [];
    var A2 = 1/5;
    var A3 = [3/40,9/40];
    var A4 = [44/45,-56/15,32/9];
    var A5 = [19372/6561,-25360/2187,64448/6561,-212/729];
    var A6 = [9017/3168,-355/33,46732/5247,49/176,-5103/18656];
    var b = [35/384,0,500/1113,125/192,-2187/6784,11/84];
    var bm = [0.5*6025192743/30085553152,
              0,
              0.5*51252292925/65400821598,
              0.5*-2691868925/45128329728,
              0.5*187940372067/1594534317056,
              0.5*-1776094331/19743644256,
              0.5*11237099/235043384];
    var c = [1/5,3/10,4/5,8/9,1,1];
    var e = [-71/57600,0,71/16695,-71/1920,17253/339200,-22/525,1/40];
    var i = 0,er,j;
    var h = (x1-x0)/10;
    var it = 0;
    var add = numeric.add, mul = numeric.mul, y1,erinf;
    var max = Math.max, min = Math.min, abs = Math.abs, norminf = numeric.norminf,pow = Math.pow;
    var any = numeric.any, lt = numeric.lt, and = numeric.and, sub = numeric.sub;
    var e0, e1, ev;
    var ret = new numeric.Dopri(xs,ys,k1,ymid,-1,"");
    if(typeof event === "function") e0 = event(x0,y0);
    while(x0<x1 && it<maxit) {
        ++it;
        if(x0+h>x1) h = x1-x0;
        k2 = f(x0+c[0]*h,                add(y0,mul(   A2*h,k1[i])));
        k3 = f(x0+c[1]*h,            add(add(y0,mul(A3[0]*h,k1[i])),mul(A3[1]*h,k2)));
        k4 = f(x0+c[2]*h,        add(add(add(y0,mul(A4[0]*h,k1[i])),mul(A4[1]*h,k2)),mul(A4[2]*h,k3)));
        k5 = f(x0+c[3]*h,    add(add(add(add(y0,mul(A5[0]*h,k1[i])),mul(A5[1]*h,k2)),mul(A5[2]*h,k3)),mul(A5[3]*h,k4)));
        k6 = f(x0+c[4]*h,add(add(add(add(add(y0,mul(A6[0]*h,k1[i])),mul(A6[1]*h,k2)),mul(A6[2]*h,k3)),mul(A6[3]*h,k4)),mul(A6[4]*h,k5)));
        y1 = add(add(add(add(add(y0,mul(k1[i],h*b[0])),mul(k3,h*b[2])),mul(k4,h*b[3])),mul(k5,h*b[4])),mul(k6,h*b[5]));
        k7 = f(x0+h,y1);
        er = add(add(add(add(add(mul(k1[i],h*e[0]),mul(k3,h*e[2])),mul(k4,h*e[3])),mul(k5,h*e[4])),mul(k6,h*e[5])),mul(k7,h*e[6]));
        if(typeof er === "number") erinf = abs(er);
        else erinf = norminf(er);
        if(erinf > tol) { // reject
            h = 0.2*h*pow(tol/erinf,0.25);
            if(x0+h === x0) {
                ret.msg = "Step size became too small";
                break;
            }
            continue;
        }
        ymid[i] = add(add(add(add(add(add(y0,
                mul(k1[i],h*bm[0])),
                mul(k3   ,h*bm[2])),
                mul(k4   ,h*bm[3])),
                mul(k5   ,h*bm[4])),
                mul(k6   ,h*bm[5])),
                mul(k7   ,h*bm[6]));
        ++i;
        xs[i] = x0+h;
        ys[i] = y1;
        k1[i] = k7;
        if(typeof event === "function") {
            var yi,xl = x0,xr = x0+0.5*h,xi;
            e1 = event(xr,ymid[i-1]);
            ev = and(lt(e0,0),lt(0,e1));
            if(!any(ev)) { xl = xr; xr = x0+h; e0 = e1; e1 = event(xr,y1); ev = and(lt(e0,0),lt(0,e1)); }
            if(any(ev)) {
                var xc, yc, en,ei;
                var side=0, sl = 1.0, sr = 1.0;
                while(1) {
                    if(typeof e0 === "number") xi = (sr*e1*xl-sl*e0*xr)/(sr*e1-sl*e0);
                    else {
                        xi = xr;
                        for(j=e0.length-1;j!==-1;--j) {
                            if(e0[j]<0 && e1[j]>0) xi = min(xi,(sr*e1[j]*xl-sl*e0[j]*xr)/(sr*e1[j]-sl*e0[j]));
                        }
                    }
                    if(xi <= xl || xi >= xr) break;
                    yi = ret._at(xi, i-1);
                    ei = event(xi,yi);
                    en = and(lt(e0,0),lt(0,ei));
                    if(any(en)) {
                        xr = xi;
                        e1 = ei;
                        ev = en;
                        sr = 1.0;
                        if(side === -1) sl *= 0.5;
                        else sl = 1.0;
                        side = -1;
                    } else {
                        xl = xi;
                        e0 = ei;
                        sl = 1.0;
                        if(side === 1) sr *= 0.5;
                        else sr = 1.0;
                        side = 1;
                    }
                }
                y1 = ret._at(0.5*(x0+xi),i-1);
                ret.f[i] = f(xi,yi);
                ret.x[i] = xi;
                ret.y[i] = yi;
                ret.ymid[i-1] = y1;
                ret.events = ev;
                ret.iterations = it;
                return ret;
            }
        }
        x0 += h;
        y0 = y1;
        e0 = e1;
        h = min(0.8*h*pow(tol/erinf,0.25),4*h);
    }
    ret.iterations = it;
    return ret;
}

// 11. Ax = b
numeric.LU = function(A, fast) {
  fast = fast || false;

  var abs = Math.abs;
  var i, j, k, absAjk, Akk, Ak, Pk, Ai;
  var max;
  var n = A.length, n1 = n-1;
  var P = new Array(n);
  if(!fast) A = numeric.clone(A);

  for (k = 0; k < n; ++k) {
    Pk = k;
    Ak = A[k];
    max = abs(Ak[k]);
    for (j = k + 1; j < n; ++j) {
      absAjk = abs(A[j][k]);
      if (max < absAjk) {
        max = absAjk;
        Pk = j;
      }
    }
    P[k] = Pk;

    if (Pk != k) {
      A[k] = A[Pk];
      A[Pk] = Ak;
      Ak = A[k];
    }

    Akk = Ak[k];

    for (i = k + 1; i < n; ++i) {
      A[i][k] /= Akk;
    }

    for (i = k + 1; i < n; ++i) {
      Ai = A[i];
      for (j = k + 1; j < n1; ++j) {
        Ai[j] -= Ai[k] * Ak[j];
        ++j;
        Ai[j] -= Ai[k] * Ak[j];
      }
      if(j===n1) Ai[j] -= Ai[k] * Ak[j];
    }
  }

  return {
    LU: A,
    P:  P
  };
}

numeric.LUsolve = function LUsolve(LUP, b) {
  var i, j;
  var LU = LUP.LU;
  var n   = LU.length;
  var x = numeric.clone(b);
  var P   = LUP.P;
  var Pi, LUi, LUii, tmp;

  for (i=n-1;i!==-1;--i) x[i] = b[i];
  for (i = 0; i < n; ++i) {
    Pi = P[i];
    if (P[i] !== i) {
      tmp = x[i];
      x[i] = x[Pi];
      x[Pi] = tmp;
    }

    LUi = LU[i];
    for (j = 0; j < i; ++j) {
      x[i] -= x[j] * LUi[j];
    }
  }

  for (i = n - 1; i >= 0; --i) {
    LUi = LU[i];
    for (j = i + 1; j < n; ++j) {
      x[i] -= x[j] * LUi[j];
    }

    x[i] /= LUi[i];
  }

  return x;
}

numeric.solve = function solve(A,b,fast) { return numeric.LUsolve(numeric.LU(A,fast), b); }

// 12. Linear programming
numeric.echelonize = function echelonize(A) {
    var s = numeric.dim(A), m = s[0], n = s[1];
    var I = numeric.identity(m);
    var P = Array(m);
    var i,j,k,l,Ai,Ii,Z,a;
    var abs = Math.abs;
    var diveq = numeric.diveq;
    A = numeric.clone(A);
    for(i=0;i<m;++i) {
        k = 0;
        Ai = A[i];
        Ii = I[i];
        for(j=1;j<n;++j) if(abs(Ai[k])<abs(Ai[j])) k=j;
        P[i] = k;
        diveq(Ii,Ai[k]);
        diveq(Ai,Ai[k]);
        for(j=0;j<m;++j) if(j!==i) {
            Z = A[j]; a = Z[k];
            for(l=n-1;l!==-1;--l) Z[l] -= Ai[l]*a;
            Z = I[j];
            for(l=m-1;l!==-1;--l) Z[l] -= Ii[l]*a;
        }
    }
    return {I:I, A:A, P:P};
}

numeric.__solveLP = function __solveLP(c,A,b,tol,maxit,x,flag) {
    var sum = numeric.sum, log = numeric.log, mul = numeric.mul, sub = numeric.sub, dot = numeric.dot, div = numeric.div, add = numeric.add;
    var m = c.length, n = b.length,y;
    var unbounded = false, cb,i0=0;
    var alpha = 1.0;
    var f0,df0,AT = numeric.transpose(A), svd = numeric.svd,transpose = numeric.transpose,leq = numeric.leq, sqrt = Math.sqrt, abs = Math.abs;
    var muleq = numeric.muleq;
    var norm = numeric.norminf, any = numeric.any,min = Math.min;
    var all = numeric.all, gt = numeric.gt;
    var p = Array(m), A0 = Array(n),e=numeric.rep([n],1), H;
    var solve = numeric.solve, z = sub(b,dot(A,x)),count;
    var dotcc = dot(c,c);
    var g;
    for(count=i0;count<maxit;++count) {
        var i,j,d;
        for(i=n-1;i!==-1;--i) A0[i] = div(A[i],z[i]);
        var A1 = transpose(A0);
        for(i=m-1;i!==-1;--i) p[i] = (/*x[i]+*/sum(A1[i]));
        alpha = 0.25*abs(dotcc/dot(c,p));
        var a1 = 100*sqrt(dotcc/dot(p,p));
        if(!isFinite(alpha) || alpha>a1) alpha = a1;
        g = add(c,mul(alpha,p));
        H = dot(A1,A0);
        for(i=m-1;i!==-1;--i) H[i][i] += 1;
        d = solve(H,div(g,alpha),true);
        var t0 = div(z,dot(A,d));
        var t = 1.0;
        for(i=n-1;i!==-1;--i) if(t0[i]<0) t = min(t,-0.999*t0[i]);
        y = sub(x,mul(d,t));
        z = sub(b,dot(A,y));
        if(!all(gt(z,0))) return { solution: x, message: "", iterations: count };
        x = y;
        if(alpha<tol) return { solution: y, message: "", iterations: count };
        if(flag) {
            var s = dot(c,g), Ag = dot(A,g);
            unbounded = true;
            for(i=n-1;i!==-1;--i) if(s*Ag[i]<0) { unbounded = false; break; }
        } else {
            if(x[m-1]>=0) unbounded = false;
            else unbounded = true;
        }
        if(unbounded) return { solution: y, message: "Unbounded", iterations: count };
    }
    return { solution: x, message: "maximum iteration count exceeded", iterations:count };
}

numeric._solveLP = function _solveLP(c,A,b,tol,maxit) {
    var m = c.length, n = b.length,y;
    var sum = numeric.sum, log = numeric.log, mul = numeric.mul, sub = numeric.sub, dot = numeric.dot, div = numeric.div, add = numeric.add;
    var c0 = numeric.rep([m],0).concat([1]);
    var J = numeric.rep([n,1],-1);
    var A0 = numeric.blockMatrix([[A                   ,   J  ]]);
    var b0 = b;
    var y = numeric.rep([m],0).concat(Math.max(0,numeric.sup(numeric.neg(b)))+1);
    var x0 = numeric.__solveLP(c0,A0,b0,tol,maxit,y,false);
    var x = numeric.clone(x0.solution);
    x.length = m;
    var foo = numeric.inf(sub(b,dot(A,x)));
    if(foo<0) { return { solution: NaN, message: "Infeasible", iterations: x0.iterations }; }
    var ret = numeric.__solveLP(c, A, b, tol, maxit-x0.iterations, x, true);
    ret.iterations += x0.iterations;
    return ret;
};

numeric.solveLP = function solveLP(c,A,b,Aeq,beq,tol,maxit) {
    if(typeof maxit === "undefined") maxit = 1000;
    if(typeof tol === "undefined") tol = numeric.epsilon;
    if(typeof Aeq === "undefined") return numeric._solveLP(c,A,b,tol,maxit);
    var m = Aeq.length, n = Aeq[0].length, o = A.length;
    var B = numeric.echelonize(Aeq);
    var flags = numeric.rep([n],0);
    var P = B.P;
    var Q = [];
    var i;
    for(i=P.length-1;i!==-1;--i) flags[P[i]] = 1;
    for(i=n-1;i!==-1;--i) if(flags[i]===0) Q.push(i);
    var g = numeric.getRange;
    var I = numeric.linspace(0,m-1), J = numeric.linspace(0,o-1);
    var Aeq2 = g(Aeq,I,Q), A1 = g(A,J,P), A2 = g(A,J,Q), dot = numeric.dot, sub = numeric.sub;
    var A3 = dot(A1,B.I);
    var A4 = sub(A2,dot(A3,Aeq2)), b4 = sub(b,dot(A3,beq));
    var c1 = Array(P.length), c2 = Array(Q.length);
    for(i=P.length-1;i!==-1;--i) c1[i] = c[P[i]];
    for(i=Q.length-1;i!==-1;--i) c2[i] = c[Q[i]];
    var c4 = sub(c2,dot(c1,dot(B.I,Aeq2)));
    var S = numeric._solveLP(c4,A4,b4,tol,maxit);
    var x2 = S.solution;
    if(x2!==x2) return S;
    var x1 = dot(B.I,sub(beq,dot(Aeq2,x2)));
    var x = Array(c.length);
    for(i=P.length-1;i!==-1;--i) x[P[i]] = x1[i];
    for(i=Q.length-1;i!==-1;--i) x[Q[i]] = x2[i];
    return { solution: x, message:S.message, iterations: S.iterations };
}

numeric.MPStoLP = function MPStoLP(MPS) {
    if(MPS instanceof String) { MPS.split('\n'); }
    var state = 0;
    var states = ['Initial state','NAME','ROWS','COLUMNS','RHS','BOUNDS','ENDATA'];
    var n = MPS.length;
    var i,j,z,N=0,rows = {}, sign = [], rl = 0, vars = {}, nv = 0;
    var name;
    var c = [], A = [], b = [];
    function err(e) { throw new Error('MPStoLP: '+e+'\nLine '+i+': '+MPS[i]+'\nCurrent state: '+states[state]+'\n'); }
    for(i=0;i<n;++i) {
        z = MPS[i];
        var w0 = z.match(/\S*/g);
        var w = [];
        for(j=0;j<w0.length;++j) if(w0[j]!=="") w.push(w0[j]);
        if(w.length === 0) continue;
        for(j=0;j<states.length;++j) if(z.substr(0,states[j].length) === states[j]) break;
        if(j<states.length) {
            state = j;
            if(j===1) { name = w[1]; }
            if(j===6) return { name:name, c:c, A:numeric.transpose(A), b:b, rows:rows, vars:vars };
            continue;
        }
        switch(state) {
        case 0: case 1: err('Unexpected line');
        case 2: 
            switch(w[0]) {
            case 'N': if(N===0) N = w[1]; else err('Two or more N rows'); break;
            case 'L': rows[w[1]] = rl; sign[rl] = 1; b[rl] = 0; ++rl; break;
            case 'G': rows[w[1]] = rl; sign[rl] = -1;b[rl] = 0; ++rl; break;
            case 'E': rows[w[1]] = rl; sign[rl] = 0;b[rl] = 0; ++rl; break;
            default: err('Parse error '+numeric.prettyPrint(w));
            }
            break;
        case 3:
            if(!vars.hasOwnProperty(w[0])) { vars[w[0]] = nv; c[nv] = 0; A[nv] = numeric.rep([rl],0); ++nv; }
            var p = vars[w[0]];
            for(j=1;j<w.length;j+=2) {
                if(w[j] === N) { c[p] = parseFloat(w[j+1]); continue; }
                var q = rows[w[j]];
                A[p][q] = (sign[q]<0?-1:1)*parseFloat(w[j+1]);
            }
            break;
        case 4:
            for(j=1;j<w.length;j+=2) b[rows[w[j]]] = (sign[rows[w[j]]]<0?-1:1)*parseFloat(w[j+1]);
            break;
        case 5: /*FIXME*/ break;
        case 6: err('Internal error');
        }
    }
    err('Reached end of file without ENDATA');
}
// seedrandom.js version 2.0.
// Author: David Bau 4/2/2011
//
// Defines a method Math.seedrandom() that, when called, substitutes
// an explicitly seeded RC4-based algorithm for Math.random().  Also
// supports automatic seeding from local or network sources of entropy.
//
// Usage:
//
//   <script src=http://davidbau.com/encode/seedrandom-min.js></script>
//
//   Math.seedrandom('yipee'); Sets Math.random to a function that is
//                             initialized using the given explicit seed.
//
//   Math.seedrandom();        Sets Math.random to a function that is
//                             seeded using the current time, dom state,
//                             and other accumulated local entropy.
//                             The generated seed string is returned.
//
//   Math.seedrandom('yowza', true);
//                             Seeds using the given explicit seed mixed
//                             together with accumulated entropy.
//
//   <script src="http://bit.ly/srandom-512"></script>
//                             Seeds using physical random bits downloaded
//                             from random.org.
//
//   <script src="https://jsonlib.appspot.com/urandom?callback=Math.seedrandom">
//   </script>                 Seeds using urandom bits from call.jsonlib.com,
//                             which is faster than random.org.
//
// Examples:
//
//   Math.seedrandom("hello");            // Use "hello" as the seed.
//   document.write(Math.random());       // Always 0.5463663768140734
//   document.write(Math.random());       // Always 0.43973793770592234
//   var rng1 = Math.random;              // Remember the current prng.
//
//   var autoseed = Math.seedrandom();    // New prng with an automatic seed.
//   document.write(Math.random());       // Pretty much unpredictable.
//
//   Math.random = rng1;                  // Continue "hello" prng sequence.
//   document.write(Math.random());       // Always 0.554769432473455
//
//   Math.seedrandom(autoseed);           // Restart at the previous seed.
//   document.write(Math.random());       // Repeat the 'unpredictable' value.
//
// Notes:
//
// Each time seedrandom('arg') is called, entropy from the passed seed
// is accumulated in a pool to help generate future seeds for the
// zero-argument form of Math.seedrandom, so entropy can be injected over
// time by calling seedrandom with explicit data repeatedly.
//
// On speed - This javascript implementation of Math.random() is about
// 3-10x slower than the built-in Math.random() because it is not native
// code, but this is typically fast enough anyway.  Seeding is more expensive,
// especially if you use auto-seeding.  Some details (timings on Chrome 4):
//
// Our Math.random()            - avg less than 0.002 milliseconds per call
// seedrandom('explicit')       - avg less than 0.5 milliseconds per call
// seedrandom('explicit', true) - avg less than 2 milliseconds per call
// seedrandom()                 - avg about 38 milliseconds per call
//
// LICENSE (BSD):
//
// Copyright 2010 David Bau, all rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
// 
//   1. Redistributions of source code must retain the above copyright
//      notice, this list of conditions and the following disclaimer.
//
//   2. Redistributions in binary form must reproduce the above copyright
//      notice, this list of conditions and the following disclaimer in the
//      documentation and/or other materials provided with the distribution.
// 
//   3. Neither the name of this module nor the names of its contributors may
//      be used to endorse or promote products derived from this software
//      without specific prior written permission.
// 
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
/**
 * All code is in an anonymous closure to keep the global namespace clean.
 *
 * @param {number=} overflow 
 * @param {number=} startdenom
 */

// Patched by Seb so that seedrandom.js does not pollute the Math object.
// My tests suggest that doing Math.trouble = 1 makes Math lookups about 5%
// slower.
numeric.seedrandom = { pow:Math.pow, random:Math.random };

(function (pool, math, width, chunks, significance, overflow, startdenom) {


//
// seedrandom()
// This is the seedrandom function described above.
//
math['seedrandom'] = function seedrandom(seed, use_entropy) {
  var key = [];
  var arc4;

  // Flatten the seed string or build one from local entropy if needed.
  seed = mixkey(flatten(
    use_entropy ? [seed, pool] :
    arguments.length ? seed :
    [new Date().getTime(), pool, window], 3), key);

  // Use the seed to initialize an ARC4 generator.
  arc4 = new ARC4(key);

  // Mix the randomness into accumulated entropy.
  mixkey(arc4.S, pool);

  // Override Math.random

  // This function returns a random double in [0, 1) that contains
  // randomness in every bit of the mantissa of the IEEE 754 value.

  math['random'] = function random() {  // Closure to return a random double:
    var n = arc4.g(chunks);             // Start with a numerator n < 2 ^ 48
    var d = startdenom;                 //   and denominator d = 2 ^ 48.
    var x = 0;                          //   and no 'extra last byte'.
    while (n < significance) {          // Fill up all significant digits by
      n = (n + x) * width;              //   shifting numerator and
      d *= width;                       //   denominator and generating a
      x = arc4.g(1);                    //   new least-significant-byte.
    }
    while (n >= overflow) {             // To avoid rounding up, before adding
      n /= 2;                           //   last byte, shift everything
      d /= 2;                           //   right using integer math until
      x >>>= 1;                         //   we have exactly the desired bits.
    }
    return (n + x) / d;                 // Form the number within [0, 1).
  };

  // Return the seed that was used
  return seed;
};

//
// ARC4
//
// An ARC4 implementation.  The constructor takes a key in the form of
// an array of at most (width) integers that should be 0 <= x < (width).
//
// The g(count) method returns a pseudorandom integer that concatenates
// the next (count) outputs from ARC4.  Its return value is a number x
// that is in the range 0 <= x < (width ^ count).
//
/** @constructor */
function ARC4(key) {
  var t, u, me = this, keylen = key.length;
  var i = 0, j = me.i = me.j = me.m = 0;
  me.S = [];
  me.c = [];

  // The empty key [] is treated as [0].
  if (!keylen) { key = [keylen++]; }

  // Set up S using the standard key scheduling algorithm.
  while (i < width) { me.S[i] = i++; }
  for (i = 0; i < width; i++) {
    t = me.S[i];
    j = lowbits(j + t + key[i % keylen]);
    u = me.S[j];
    me.S[i] = u;
    me.S[j] = t;
  }

  // The "g" method returns the next (count) outputs as one number.
  me.g = function getnext(count) {
    var s = me.S;
    var i = lowbits(me.i + 1); var t = s[i];
    var j = lowbits(me.j + t); var u = s[j];
    s[i] = u;
    s[j] = t;
    var r = s[lowbits(t + u)];
    while (--count) {
      i = lowbits(i + 1); t = s[i];
      j = lowbits(j + t); u = s[j];
      s[i] = u;
      s[j] = t;
      r = r * width + s[lowbits(t + u)];
    }
    me.i = i;
    me.j = j;
    return r;
  };
  // For robust unpredictability discard an initial batch of values.
  // See http://www.rsa.com/rsalabs/node.asp?id=2009
  me.g(width);
}

//
// flatten()
// Converts an object tree to nested arrays of strings.
//
/** @param {Object=} result 
  * @param {string=} prop
  * @param {string=} typ */
function flatten(obj, depth, result, prop, typ) {
  result = [];
  typ = typeof(obj);
  if (depth && typ == 'object') {
    for (prop in obj) {
      if (prop.indexOf('S') < 5) {    // Avoid FF3 bug (local/sessionStorage)
        try { result.push(flatten(obj[prop], depth - 1)); } catch (e) {}
      }
    }
  }
  return (result.length ? result : obj + (typ != 'string' ? '\0' : ''));
}

//
// mixkey()
// Mixes a string seed into a key that is an array of integers, and
// returns a shortened string seed that is equivalent to the result key.
//
/** @param {number=} smear 
  * @param {number=} j */
function mixkey(seed, key, smear, j) {
  seed += '';                         // Ensure the seed is a string
  smear = 0;
  for (j = 0; j < seed.length; j++) {
    key[lowbits(j)] =
      lowbits((smear ^= key[lowbits(j)] * 19) + seed.charCodeAt(j));
  }
  seed = '';
  for (j in key) { seed += String.fromCharCode(key[j]); }
  return seed;
}

//
// lowbits()
// A quick "n mod width" for width a power of 2.
//
function lowbits(n) { return n & (width - 1); }

//
// The following constants are related to IEEE 754 limits.
//
startdenom = math.pow(width, chunks);
significance = math.pow(2, significance);
overflow = significance * 2;

//
// When seedrandom.js is loaded, we immediately mix a few bits
// from the built-in RNG into the entropy pool.  Because we do
// not want to intefere with determinstic PRNG state later,
// seedrandom will not call math.random on its own again after
// initialization.
//
mixkey(math.random(), pool);

// End anonymous scope, and pass initial values.
}(
  [],   // pool: entropy pool starts empty
  numeric.seedrandom, // math: package containing random, pow, and seedrandom
  256,  // width: each RC4 output is 0 <= x < 256
  6,    // chunks: at least six RC4 outputs for each double
  52    // significance: there are 52 significant digits in a double
  ));
/* This file is a slightly modified version of quadprog.js from Alberto Santini.
 * It has been slightly modified by Sébastien Loisel to make sure that it handles
 * 0-based Arrays instead of 1-based Arrays.
 * License is in resources/LICENSE.quadprog */
(function(exports) {

function base0to1(A) {
    if(typeof A !== "object") { return A; }
    var ret = [], i,n=A.length;
    for(i=0;i<n;i++) ret[i+1] = base0to1(A[i]);
    return ret;
}
function base1to0(A) {
    if(typeof A !== "object") { return A; }
    var ret = [], i,n=A.length;
    for(i=1;i<n;i++) ret[i-1] = base1to0(A[i]);
    return ret;
}

function dpori(a, lda, n) {
    var i, j, k, kp1, t;

    for (k = 1; k <= n; k = k + 1) {
        a[k][k] = 1 / a[k][k];
        t = -a[k][k];
        //~ dscal(k - 1, t, a[1][k], 1);
        for (i = 1; i < k; i = i + 1) {
            a[i][k] = t * a[i][k];
        }

        kp1 = k + 1;
        if (n < kp1) {
            break;
        }
        for (j = kp1; j <= n; j = j + 1) {
            t = a[k][j];
            a[k][j] = 0;
            //~ daxpy(k, t, a[1][k], 1, a[1][j], 1);
            for (i = 1; i <= k; i = i + 1) {
                a[i][j] = a[i][j] + (t * a[i][k]);
            }
        }
    }

}

function dposl(a, lda, n, b) {
    var i, k, kb, t;

    for (k = 1; k <= n; k = k + 1) {
        //~ t = ddot(k - 1, a[1][k], 1, b[1], 1);
        t = 0;
        for (i = 1; i < k; i = i + 1) {
            t = t + (a[i][k] * b[i]);
        }

        b[k] = (b[k] - t) / a[k][k];
    }

    for (kb = 1; kb <= n; kb = kb + 1) {
        k = n + 1 - kb;
        b[k] = b[k] / a[k][k];
        t = -b[k];
        //~ daxpy(k - 1, t, a[1][k], 1, b[1], 1);
        for (i = 1; i < k; i = i + 1) {
            b[i] = b[i] + (t * a[i][k]);
        }
    }
}

function dpofa(a, lda, n, info) {
    var i, j, jm1, k, t, s;

    for (j = 1; j <= n; j = j + 1) {
        info[1] = j;
        s = 0;
        jm1 = j - 1;
        if (jm1 < 1) {
            s = a[j][j] - s;
            if (s <= 0) {
                break;
            }
            a[j][j] = Math.sqrt(s);
        } else {
            for (k = 1; k <= jm1; k = k + 1) {
                //~ t = a[k][j] - ddot(k - 1, a[1][k], 1, a[1][j], 1);
                t = a[k][j];
                for (i = 1; i < k; i = i + 1) {
                    t = t - (a[i][j] * a[i][k]);
                }
                t = t / a[k][k];
                a[k][j] = t;
                s = s + t * t;
            }
            s = a[j][j] - s;
            if (s <= 0) {
                break;
            }
            a[j][j] = Math.sqrt(s);
        }
        info[1] = 0;
    }
}

function qpgen2(dmat, dvec, fddmat, n, sol, crval, amat,
    bvec, fdamat, q, meq, iact, nact, iter, work, ierr) {

    var i, j, l, l1, info, it1, iwzv, iwrv, iwrm, iwsv, iwuv, nvl, r, iwnbv,
        temp, sum, t1, tt, gc, gs, nu,
        t1inf, t2min,
        vsmall, tmpa, tmpb,
        go;

    r = Math.min(n, q);
    l = 2 * n + (r * (r + 5)) / 2 + 2 * q + 1;

    vsmall = 1.0e-60;
    do {
        vsmall = vsmall + vsmall;
        tmpa = 1 + 0.1 * vsmall;
        tmpb = 1 + 0.2 * vsmall;
    } while (tmpa <= 1 || tmpb <= 1);

    for (i = 1; i <= n; i = i + 1) {
        work[i] = dvec[i];
    }
    for (i = n + 1; i <= l; i = i + 1) {
        work[i] = 0;
    }
    for (i = 1; i <= q; i = i + 1) {
        iact[i] = 0;
    }

    info = [];

    if (ierr[1] === 0) {
        dpofa(dmat, fddmat, n, info);
        if (info[1] !== 0) {
            ierr[1] = 2;
            return;
        }
        dposl(dmat, fddmat, n, dvec);
        dpori(dmat, fddmat, n);
    } else {
        for (j = 1; j <= n; j = j + 1) {
            sol[j] = 0;
            for (i = 1; i <= j; i = i + 1) {
                sol[j] = sol[j] + dmat[i][j] * dvec[i];
            }
        }
        for (j = 1; j <= n; j = j + 1) {
            dvec[j] = 0;
            for (i = j; i <= n; i = i + 1) {
                dvec[j] = dvec[j] + dmat[j][i] * sol[i];
            }
        }
    }

    crval[1] = 0;
    for (j = 1; j <= n; j = j + 1) {
        sol[j] = dvec[j];
        crval[1] = crval[1] + work[j] * sol[j];
        work[j] = 0;
        for (i = j + 1; i <= n; i = i + 1) {
            dmat[i][j] = 0;
        }
    }
    crval[1] = -crval[1] / 2;
    ierr[1] = 0;

    iwzv = n;
    iwrv = iwzv + n;
    iwuv = iwrv + r;
    iwrm = iwuv + r + 1;
    iwsv = iwrm + (r * (r + 1)) / 2;
    iwnbv = iwsv + q;

    for (i = 1; i <= q; i = i + 1) {
        sum = 0;
        for (j = 1; j <= n; j = j + 1) {
            sum = sum + amat[j][i] * amat[j][i];
        }
        work[iwnbv + i] = Math.sqrt(sum);
    }
    nact = 0;
    iter[1] = 0;
    iter[2] = 0;

    function fn_goto_50() {
        iter[1] = iter[1] + 1;

        l = iwsv;
        for (i = 1; i <= q; i = i + 1) {
            l = l + 1;
            sum = -bvec[i];
            for (j = 1; j <= n; j = j + 1) {
                sum = sum + amat[j][i] * sol[j];
            }
            if (Math.abs(sum) < vsmall) {
                sum = 0;
            }
            if (i > meq) {
                work[l] = sum;
            } else {
                work[l] = -Math.abs(sum);
                if (sum > 0) {
                    for (j = 1; j <= n; j = j + 1) {
                        amat[j][i] = -amat[j][i];
                    }
                    bvec[i] = -bvec[i];
                }
            }
        }

        for (i = 1; i <= nact; i = i + 1) {
            work[iwsv + iact[i]] = 0;
        }

        nvl = 0;
        temp = 0;
        for (i = 1; i <= q; i = i + 1) {
            if (work[iwsv + i] < temp * work[iwnbv + i]) {
                nvl = i;
                temp = work[iwsv + i] / work[iwnbv + i];
            }
        }
        if (nvl === 0) {
            return 999;
        }

        return 0;
    }

    function fn_goto_55() {
        for (i = 1; i <= n; i = i + 1) {
            sum = 0;
            for (j = 1; j <= n; j = j + 1) {
                sum = sum + dmat[j][i] * amat[j][nvl];
            }
            work[i] = sum;
        }

        l1 = iwzv;
        for (i = 1; i <= n; i = i + 1) {
            work[l1 + i] = 0;
        }
        for (j = nact + 1; j <= n; j = j + 1) {
            for (i = 1; i <= n; i = i + 1) {
                work[l1 + i] = work[l1 + i] + dmat[i][j] * work[j];
            }
        }

        t1inf = true;
        for (i = nact; i >= 1; i = i - 1) {
            sum = work[i];
            l = iwrm + (i * (i + 3)) / 2;
            l1 = l - i;
            for (j = i + 1; j <= nact; j = j + 1) {
                sum = sum - work[l] * work[iwrv + j];
                l = l + j;
            }
            sum = sum / work[l1];
            work[iwrv + i] = sum;
            if (iact[i] < meq) {
                // continue;
                break;
            }
            if (sum < 0) {
                // continue;
                break;
            }
            t1inf = false;
            it1 = i;
        }

        if (!t1inf) {
            t1 = work[iwuv + it1] / work[iwrv + it1];
            for (i = 1; i <= nact; i = i + 1) {
                if (iact[i] < meq) {
                    // continue;
                    break;
                }
                if (work[iwrv + i] < 0) {
                    // continue;
                    break;
                }
                temp = work[iwuv + i] / work[iwrv + i];
                if (temp < t1) {
                    t1 = temp;
                    it1 = i;
                }
            }
        }

        sum = 0;
        for (i = iwzv + 1; i <= iwzv + n; i = i + 1) {
            sum = sum + work[i] * work[i];
        }
        if (Math.abs(sum) <= vsmall) {
            if (t1inf) {
                ierr[1] = 1;
                // GOTO 999
                return 999;
            } else {
                for (i = 1; i <= nact; i = i + 1) {
                    work[iwuv + i] = work[iwuv + i] - t1 * work[iwrv + i];
                }
                work[iwuv + nact + 1] = work[iwuv + nact + 1] + t1;
                // GOTO 700
                return 700;
            }
        } else {
            sum = 0;
            for (i = 1; i <= n; i = i + 1) {
                sum = sum + work[iwzv + i] * amat[i][nvl];
            }
            tt = -work[iwsv + nvl] / sum;
            t2min = true;
            if (!t1inf) {
                if (t1 < tt) {
                    tt = t1;
                    t2min = false;
                }
            }

            for (i = 1; i <= n; i = i + 1) {
                sol[i] = sol[i] + tt * work[iwzv + i];
                if (Math.abs(sol[i]) < vsmall) {
                    sol[i] = 0;
                }
            }

            crval[1] = crval[1] + tt * sum * (tt / 2 + work[iwuv + nact + 1]);
            for (i = 1; i <= nact; i = i + 1) {
                work[iwuv + i] = work[iwuv + i] - tt * work[iwrv + i];
            }
            work[iwuv + nact + 1] = work[iwuv + nact + 1] + tt;

            if (t2min) {
                nact = nact + 1;
                iact[nact] = nvl;

                l = iwrm + ((nact - 1) * nact) / 2 + 1;
                for (i = 1; i <= nact - 1; i = i + 1) {
                    work[l] = work[i];
                    l = l + 1;
                }

                if (nact === n) {
                    work[l] = work[n];
                } else {
                    for (i = n; i >= nact + 1; i = i - 1) {
                        if (work[i] === 0) {
                            // continue;
                            break;
                        }
                        gc = Math.max(Math.abs(work[i - 1]), Math.abs(work[i]));
                        gs = Math.min(Math.abs(work[i - 1]), Math.abs(work[i]));
                        if (work[i - 1] >= 0) {
                            temp = Math.abs(gc * Math.sqrt(1 + gs * gs / (gc * gc)));
                        } else {
                            temp = -Math.abs(gc * Math.sqrt(1 + gs * gs / (gc * gc)));
                        }
                        gc = work[i - 1] / temp;
                        gs = work[i] / temp;

                        if (gc === 1) {
                            // continue;
                            break;
                        }
                        if (gc === 0) {
                            work[i - 1] = gs * temp;
                            for (j = 1; j <= n; j = j + 1) {
                                temp = dmat[j][i - 1];
                                dmat[j][i - 1] = dmat[j][i];
                                dmat[j][i] = temp;
                            }
                        } else {
                            work[i - 1] = temp;
                            nu = gs / (1 + gc);
                            for (j = 1; j <= n; j = j + 1) {
                                temp = gc * dmat[j][i - 1] + gs * dmat[j][i];
                                dmat[j][i] = nu * (dmat[j][i - 1] + temp) - dmat[j][i];
                                dmat[j][i - 1] = temp;

                            }
                        }
                    }
                    work[l] = work[nact];
                }
            } else {
                sum = -bvec[nvl];
                for (j = 1; j <= n; j = j + 1) {
                    sum = sum + sol[j] * amat[j][nvl];
                }
                if (nvl > meq) {
                    work[iwsv + nvl] = sum;
                } else {
                    work[iwsv + nvl] = -Math.abs(sum);
                    if (sum > 0) {
                        for (j = 1; j <= n; j = j + 1) {
                            amat[j][nvl] = -amat[j][nvl];
                        }
                        bvec[nvl] = -bvec[nvl];
                    }
                }
                // GOTO 700
                return 700;
            }
        }

        return 0;
    }

    function fn_goto_797() {
        l = iwrm + (it1 * (it1 + 1)) / 2 + 1;
        l1 = l + it1;
        if (work[l1] === 0) {
            // GOTO 798
            return 798;
        }
        gc = Math.max(Math.abs(work[l1 - 1]), Math.abs(work[l1]));
        gs = Math.min(Math.abs(work[l1 - 1]), Math.abs(work[l1]));
        if (work[l1 - 1] >= 0) {
            temp = Math.abs(gc * Math.sqrt(1 + gs * gs / (gc * gc)));
        } else {
            temp = -Math.abs(gc * Math.sqrt(1 + gs * gs / (gc * gc)));
        }
        gc = work[l1 - 1] / temp;
        gs = work[l1] / temp;

        if (gc === 1) {
            // GOTO 798
            return 798;
        }
        if (gc === 0) {
            for (i = it1 + 1; i <= nact; i = i + 1) {
                temp = work[l1 - 1];
                work[l1 - 1] = work[l1];
                work[l1] = temp;
                l1 = l1 + i;
            }
            for (i = 1; i <= n; i = i + 1) {
                temp = dmat[i][it1];
                dmat[i][it1] = dmat[i][it1 + 1];
                dmat[i][it1 + 1] = temp;
            }
        } else {
            nu = gs / (1 + gc);
            for (i = it1 + 1; i <= nact; i = i + 1) {
                temp = gc * work[l1 - 1] + gs * work[l1];
                work[l1] = nu * (work[l1 - 1] + temp) - work[l1];
                work[l1 - 1] = temp;
                l1 = l1 + i;
            }
            for (i = 1; i <= n; i = i + 1) {
                temp = gc * dmat[i][it1] + gs * dmat[i][it1 + 1];
                dmat[i][it1 + 1] = nu * (dmat[i][it1] + temp) - dmat[i][it1 + 1];
                dmat[i][it1] = temp;
            }
        }

        return 0;
    }

    function fn_goto_798() {
        l1 = l - it1;
        for (i = 1; i <= it1; i = i + 1) {
            work[l1] = work[l];
            l = l + 1;
            l1 = l1 + 1;
        }

        work[iwuv + it1] = work[iwuv + it1 + 1];
        iact[it1] = iact[it1 + 1];
        it1 = it1 + 1;
        if (it1 < nact) {
            // GOTO 797
            return 797;
        }

        return 0;
    }

    function fn_goto_799() {
        work[iwuv + nact] = work[iwuv + nact + 1];
        work[iwuv + nact + 1] = 0;
        iact[nact] = 0;
        nact = nact - 1;
        iter[2] = iter[2] + 1;

        return 0;
    }

    go = 0;
    while (true) {
        go = fn_goto_50();
        if (go === 999) {
            return;
        }
        while (true) {
            go = fn_goto_55();
            if (go === 0) {
                break;
            }
            if (go === 999) {
                return;
            }
            if (go === 700) {
                if (it1 === nact) {
                    fn_goto_799();
                } else {
                    while (true) {
                        fn_goto_797();
                        go = fn_goto_798();
                        if (go !== 797) {
                            break;
                        }
                    }
                    fn_goto_799();
                }
            }
        }
    }

}

function solveQP(Dmat, dvec, Amat, bvec, meq, factorized) {
    Dmat = base0to1(Dmat);
    dvec = base0to1(dvec);
    Amat = base0to1(Amat);
    var i, n, q,
        nact, r,
        crval = [], iact = [], sol = [], work = [], iter = [],
        message;

    meq = meq || 0;
    factorized = factorized ? base0to1(factorized) : [undefined, 0];
    bvec = bvec ? base0to1(bvec) : [];

    // In Fortran the array index starts from 1
    n = Dmat.length - 1;
    q = Amat[1].length - 1;

    if (!bvec) {
        for (i = 1; i <= q; i = i + 1) {
            bvec[i] = 0;
        }
    }
    for (i = 1; i <= q; i = i + 1) {
        iact[i] = 0;
    }
    nact = 0;
    r = Math.min(n, q);
    for (i = 1; i <= n; i = i + 1) {
        sol[i] = 0;
    }
    crval[1] = 0;
    for (i = 1; i <= (2 * n + (r * (r + 5)) / 2 + 2 * q + 1); i = i + 1) {
        work[i] = 0;
    }
    for (i = 1; i <= 2; i = i + 1) {
        iter[i] = 0;
    }

    qpgen2(Dmat, dvec, n, n, sol, crval, Amat,
        bvec, n, q, meq, iact, nact, iter, work, factorized);

    message = "";
    if (factorized[1] === 1) {
        message = "constraints are inconsistent, no solution!";
    }
    if (factorized[1] === 2) {
        message = "matrix D in quadratic function is not positive definite!";
    }

    return {
        solution: base1to0(sol),
        value: base1to0(crval),
        unconstrained_solution: base1to0(dvec),
        iterations: base1to0(iter),
        iact: base1to0(iact),
        message: message
    };
}
exports.solveQP = solveQP;
}(numeric));
/*
Shanti Rao sent me this routine by private email. I had to modify it
slightly to work on Arrays instead of using a Matrix object.
It is apparently translated from http://stitchpanorama.sourceforge.net/Python/svd.py
*/

numeric.svd= function svd(A) {
    var temp;
//Compute the thin SVD from G. H. Golub and C. Reinsch, Numer. Math. 14, 403-420 (1970)
	var prec= numeric.epsilon; //Math.pow(2,-52) // assumes double prec
	var tolerance= 1.e-64/prec;
	var itmax= 50;
	var c=0;
	var i=0;
	var j=0;
	var k=0;
	var l=0;
	
	var u= numeric.clone(A);
	var m= u.length;
	
	var n= u[0].length;
	
	if (m < n) throw "Need more rows than columns"
	
	var e = new Array(n);
	var q = new Array(n);
	for (i=0; i<n; i++) e[i] = q[i] = 0.0;
	var v = numeric.rep([n,n],0);
//	v.zero();
	
 	function pythag(a,b)
 	{
		a = Math.abs(a)
		b = Math.abs(b)
		if (a > b)
			return a*Math.sqrt(1.0+(b*b/a/a))
		else if (b == 0.0) 
			return a
		return b*Math.sqrt(1.0+(a*a/b/b))
	}

	//Householder's reduction to bidiagonal form

	var f= 0.0;
	var g= 0.0;
	var h= 0.0;
	var x= 0.0;
	var y= 0.0;
	var z= 0.0;
	var s= 0.0;
	
	for (i=0; i < n; i++)
	{	
		e[i]= g;
		s= 0.0;
		l= i+1;
		for (j=i; j < m; j++) 
			s += (u[j][i]*u[j][i]);
		if (s <= tolerance)
			g= 0.0;
		else
		{	
			f= u[i][i];
			g= Math.sqrt(s);
			if (f >= 0.0) g= -g;
			h= f*g-s
			u[i][i]=f-g;
			for (j=l; j < n; j++)
			{
				s= 0.0
				for (k=i; k < m; k++) 
					s += u[k][i]*u[k][j]
				f= s/h
				for (k=i; k < m; k++) 
					u[k][j]+=f*u[k][i]
			}
		}
		q[i]= g
		s= 0.0
		for (j=l; j < n; j++) 
			s= s + u[i][j]*u[i][j]
		if (s <= tolerance)
			g= 0.0
		else
		{	
			f= u[i][i+1]
			g= Math.sqrt(s)
			if (f >= 0.0) g= -g
			h= f*g - s
			u[i][i+1] = f-g;
			for (j=l; j < n; j++) e[j]= u[i][j]/h
			for (j=l; j < m; j++)
			{	
				s=0.0
				for (k=l; k < n; k++) 
					s += (u[j][k]*u[i][k])
				for (k=l; k < n; k++) 
					u[j][k]+=s*e[k]
			}	
		}
		y= Math.abs(q[i])+Math.abs(e[i])
		if (y>x) 
			x=y
	}
	
	// accumulation of right hand gtransformations
	for (i=n-1; i != -1; i+= -1)
	{	
		if (g != 0.0)
		{
		 	h= g*u[i][i+1]
			for (j=l; j < n; j++) 
				v[j][i]=u[i][j]/h
			for (j=l; j < n; j++)
			{	
				s=0.0
				for (k=l; k < n; k++) 
					s += u[i][k]*v[k][j]
				for (k=l; k < n; k++) 
					v[k][j]+=(s*v[k][i])
			}	
		}
		for (j=l; j < n; j++)
		{
			v[i][j] = 0;
			v[j][i] = 0;
		}
		v[i][i] = 1;
		g= e[i]
		l= i
	}
	
	// accumulation of left hand transformations
	for (i=n-1; i != -1; i+= -1)
	{	
		l= i+1
		g= q[i]
		for (j=l; j < n; j++) 
			u[i][j] = 0;
		if (g != 0.0)
		{
			h= u[i][i]*g
			for (j=l; j < n; j++)
			{
				s=0.0
				for (k=l; k < m; k++) s += u[k][i]*u[k][j];
				f= s/h
				for (k=i; k < m; k++) u[k][j]+=f*u[k][i];
			}
			for (j=i; j < m; j++) u[j][i] = u[j][i]/g;
		}
		else
			for (j=i; j < m; j++) u[j][i] = 0;
		u[i][i] += 1;
	}
	
	// diagonalization of the bidiagonal form
	prec= prec*x
	for (k=n-1; k != -1; k+= -1)
	{
		for (var iteration=0; iteration < itmax; iteration++)
		{	// test f splitting
			var test_convergence = false
			for (l=k; l != -1; l+= -1)
			{	
				if (Math.abs(e[l]) <= prec)
				{	test_convergence= true
					break 
				}
				if (Math.abs(q[l-1]) <= prec)
					break 
			}
			if (!test_convergence)
			{	// cancellation of e[l] if l>0
				c= 0.0
				s= 1.0
				var l1= l-1
				for (i =l; i<k+1; i++)
				{	
					f= s*e[i]
					e[i]= c*e[i]
					if (Math.abs(f) <= prec)
						break
					g= q[i]
					h= pythag(f,g)
					q[i]= h
					c= g/h
					s= -f/h
					for (j=0; j < m; j++)
					{	
						y= u[j][l1]
						z= u[j][i]
						u[j][l1] =  y*c+(z*s)
						u[j][i] = -y*s+(z*c)
					} 
				}	
			}
			// test f convergence
			z= q[k]
			if (l== k)
			{	//convergence
				if (z<0.0)
				{	//q[k] is made non-negative
					q[k]= -z
					for (j=0; j < n; j++)
						v[j][k] = -v[j][k]
				}
				break  //break out of iteration loop and move on to next k value
			}
			if (iteration >= itmax-1)
				throw 'Error: no convergence.'
			// shift from bottom 2x2 minor
			x= q[l]
			y= q[k-1]
			g= e[k-1]
			h= e[k]
			f= ((y-z)*(y+z)+(g-h)*(g+h))/(2.0*h*y)
			g= pythag(f,1.0)
			if (f < 0.0)
				f= ((x-z)*(x+z)+h*(y/(f-g)-h))/x
			else
				f= ((x-z)*(x+z)+h*(y/(f+g)-h))/x
			// next QR transformation
			c= 1.0
			s= 1.0
			for (i=l+1; i< k+1; i++)
			{	
				g= e[i]
				y= q[i]
				h= s*g
				g= c*g
				z= pythag(f,h)
				e[i-1]= z
				c= f/z
				s= h/z
				f= x*c+g*s
				g= -x*s+g*c
				h= y*s
				y= y*c
				for (j=0; j < n; j++)
				{	
					x= v[j][i-1]
					z= v[j][i]
					v[j][i-1] = x*c+z*s
					v[j][i] = -x*s+z*c
				}
				z= pythag(f,h)
				q[i-1]= z
				c= f/z
				s= h/z
				f= c*g+s*y
				x= -s*g+c*y
				for (j=0; j < m; j++)
				{
					y= u[j][i-1]
					z= u[j][i]
					u[j][i-1] = y*c+z*s
					u[j][i] = -y*s+z*c
				}
			}
			e[l]= 0.0
			e[k]= f
			q[k]= x
		} 
	}
		
	//vt= transpose(v)
	//return (u,q,vt)
	for (i=0;i<q.length; i++) 
	  if (q[i] < prec) q[i] = 0
	  
	//sort eigenvalues	
	for (i=0; i< n; i++)
	{	 
	//writeln(q)
	 for (j=i-1; j >= 0; j--)
	 {
	  if (q[j] < q[i])
	  {
	//  writeln(i,'-',j)
	   c = q[j]
	   q[j] = q[i]
	   q[i] = c
	   for(k=0;k<u.length;k++) { temp = u[k][i]; u[k][i] = u[k][j]; u[k][j] = temp; }
	   for(k=0;k<v.length;k++) { temp = v[k][i]; v[k][i] = v[k][j]; v[k][j] = temp; }
//	   u.swapCols(i,j)
//	   v.swapCols(i,j)
	   i = j	   
	  }
	 }	
	}
	
	return {U:u,S:q,V:v}
};


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJmdW5jdGlvbnBsb3QuanMiLCJub2RlX21vZHVsZXMvbnVtZXJpYy9udW1lcmljLTEuMi42LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNqS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBudW1lcmljID0gcmVxdWlyZShcIm51bWVyaWNcIik7XG4vLyB2YXIgbmogPSByZXF1aXJlKCdudW1qcycpO1xuXG4vLyB2YXIgWDtcbi8vIHZhciBZO1xuLy8gdmFyIHRoZXRhO1xuXG4vL2NvbnN0cnVjdCBwbG90IHdpdGggZGF0YSBhcyBhbiBhcnJheSBvZiAyIG51bWJlciBhcnJheXMgYW5kIHN0ckZ1bmN0aW9uIGJlaW5nIGEgc3RyaW5nIGRlc2NyaWJpbmcgd2hhdCB5IGVxdWFsc1xuZnVuY3Rpb24gZXhlY3V0ZShkYXRhLCBzdHJGdW5jdGlvbil7XG4gIGNvbnNvbGUubG9nKFwiRXhlY3V0aW5nXCIpO1xuICBmdW5jdGlvblBsb3Qoe1xuICAgIHRhcmdldDogJyNteXBsb3QnLFxuICAgIHhBeGlzOiB7ZG9tYWluOiBbLTEwLCAxMF19LFxuICAgIHlBeGlzOiB7ZG9tYWluOiBbLTEwLCAxMF19LFxuICAgIGRhdGE6IFt7XG4gICAgICBmbjogc3RyRnVuY3Rpb25cbiAgICB9LHtcbiAgICAgIGZuVHlwZTogJ3BvaW50cycsXG4gICAgICBncmFwaFR5cGU6ICdzY2F0dGVyJyxcbiAgICAgIHBvaW50czogZGF0YVxuICAgIH1dXG4gIH0pO1xuXG5cbn07XG5cbmZ1bmN0aW9uIHJhbmRvbWl6ZSgpe1xuICB2YXIgYWxwaGEsIGl0ZXJhdGlvbnM7XG4gIGFscGhhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbHBoYVwiKS52YWx1ZTtcbiAgaXRlcmF0aW9ucyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaXRlcmF0aW9uc1wiKS52YWx1ZTtcblxuICB2YXIgcmFuZG9tRGF0YSA9IFtdO1xuICAvL2dlbmVyYXRlIGEgcmFuZG9tIGRhdGEgc2V0IG9mIDEwLTEwMCB4LHkgdmFsdWVzXG4gIGZvcih2YXIgaSA9IDA7IGk8TWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogOTAgKyAxMCk7IGkrKyl7XG4gICAgcmFuZG9tRGF0YS5wdXNoKGdldFJhbmREYXRhUHQoMjApKVxuICB9XG4gIGJ1aWxkWFkocmFuZG9tRGF0YSwgYWxwaGEsIGl0ZXJhdGlvbnMpXG59O1xuXG4vL2J1aWxkIGEgcGxvdCB3aXRoIGtub3duIGRhdGFcbmZ1bmN0aW9uIGtub3duKCl7XG4gIHZhciBhbHBoYSwgaXRlcmF0aW9ucztcbiAgYWxwaGEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFscGhhXCIpLnZhbHVlO1xuICBpdGVyYXRpb25zID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpdGVyYXRpb25zXCIpLnZhbHVlO1xuICBcbiAgdmFyIGRhdGEgPVtdO1xuICBmb3IodmFyIGkgPSAwOyBpPDEwOyBpKyspe1xuICAgIGRhdGEucHVzaChbaS8yLCBpKjEuNSsxXSk7XG4gIH1cbiAgYnVpbGRYWShkYXRhLCBhbHBoYSwgaXRlcmF0aW9ucyk7XG59O1xuXG5cblxuLy9nZW5lcmF0ZSByYW5kb20gZGF0YSBwb2ludCB3aXRoaW4gdGhlIHJhbmdlXG5mdW5jdGlvbiBnZXRSYW5kRGF0YVB0KHJhbmdlKXtcbiAgcmV0dXJuIFsoTWF0aC5yYW5kb20oKSAqIHJhbmdlKS1yYW5nZS8yLCAoTWF0aC5yYW5kb20oKSAqIHJhbmdlKS1yYW5nZS8yXVxufVxuXG5mdW5jdGlvbiBidWlsZFhZKGRhdGEsIGFscGhhLCBpdGVyYXRpb25zKXtcbiAgdmFyIFg9W1tdXTtcbiAgdmFyIFk9W107XG4gIHZhciB0aGV0YSA9IFtbXV07XG4gIGZvcih2YXIgaSA9IDA7IGk8ZGF0YS5sZW5ndGg7IGkrKyl7XG4gICAgLy9wb3B1bGF0ZSBYIHdpdGggMSBhbmQgWCB2YWx1ZSBmb3IgZWFjaCByb3dcbiAgICBYW2ldID0gWzEsIGRhdGFbaV1bMF1dO1xuICAgIFlbaV0gPSBbZGF0YVtpXVsxXV07XG4gIH1cbiAgLy9idWlsZCB0aGV0YSBiYXNlZCBvbiBYIGRpbWVudGlvblxuICBmb3IodmFyIGkgPTA7IGk8WFswXS5sZW5ndGg7IGkrKyl7XG4gICAgdGhldGFbMF1baV0gPSAwO1xuICB9XG4gIC8vY29udmVydCB0byB0aGUgdmVjdG9yIGl0IHNob3VsZCBiZVxuICBjb25zb2xlLmxvZyhudW1lcmljLnByZXR0eVByaW50KFgpKTtcbiAgY29uc29sZS5sb2cobnVtZXJpYy5wcmV0dHlQcmludCh0aGV0YSkpO1xuICBjb25zb2xlLmxvZyhudW1lcmljLnByZXR0eVByaW50KFkpKTtcbiAgdmFyIGFyclJldHVybiA9IGdyYWRpZW50RGVzY2VudChYLFksdGhldGEsIGFscGhhLCBpdGVyYXRpb25zLCBkYXRhKTtcbiAgdmFyIG50aGV0YSA9IGFyclJldHVyblswXTtcbiAgdmFyIG5jb3N0ID0gYXJyUmV0dXJuWzFdO1xuICBjb25zb2xlLmxvZyhcIlJFU1VMVFMhXCIpO1xuICBudW1lcmljLnByZXR0eVByaW50KG50aGV0YSk7XG4gIG51bWVyaWMucHJldHR5UHJpbnQobmNvc3QpO1xufVxuXG5cbmZ1bmN0aW9uIGl0ZXJhdGUoKXtcblxufVxuXG5cbi8vY29tcHV0ZXMgdGhlIGNvc3Qgb2YgYSBsaW5lYXIgcmVncmVzc2lvbiBmdW5jdGlvblxuZnVuY3Rpb24gY29tcHV0ZUNvc3QoWCwgWSwgdGhldGEpe1xuICBjb25zb2xlLmxvZyhcImNvc3RcIik7XG4gIC8vIGNvbnNvbGUubG9nKG51bWVyaWMucHJldHR5UHJpbnQobnVtZXJpYy50cmFuc3Bvc2UodGhldGEpKSk7XG4gIHZhciB4dCA9IG51bWVyaWMuZG90KFgsIHRoZXRhKTtcbiAgLy8gY29uc29sZS5sb2cobnVtZXJpYy5wcmV0dHlQcmludCh4dCkpO1xuICB2YXIgeHQyID0gbnVtZXJpYy5leHAoeHQsIDIpO1xuICAvLyBjb25zb2xlLmxvZyhudW1lcmljLnByZXR0eVByaW50KHh0MikpO1xuICB2YXIgY29zdCA9IG51bWVyaWMuc3VtKHh0MikvKDIqdGhldGEubGVuZ3RoKTtcbiAgY29uc29sZS5sb2coY29zdCk7XG4gIC8vIGdyYWRpZW50RGVzY2VudChYLFksdGhldGEsMC4wMSwyMCk7XG4gIHJldHVybiBjb3N0O1xuXG59XG5cbi8vR3JhZGllbnQgZGVzY2VudCB0byBjb252ZXJnZSB0byB0aGUgc29sdXRpb25cbmZ1bmN0aW9uIGdyYWRpZW50RGVzY2VudChYLCBZLCB0aGV0YSwgYWxwaGEsIGl0ZXJzLCBkYXRhKXtcbiAgY29uc29sZS5sb2coXCJHcmFkIGRlc2NlbnRcIik7XG4gIC8vdGVtcCBpcyBhIG1hdHJpeCBvZiAwcyBhcyBzYW1lIGRpbWVuc2lvbnMgb2YgdGhldGFcbiAgdmFyIHRlbXAgPSBudW1lcmljLm11bCh0aGV0YSwgMCk7XG5cbiAgLy9jb25zdHJ1Y3QgYXJyYXkgb2YgaGlzdG9yaWNhbCBjb3N0cyB3aXRoIHNpemUgb2YgaXRlcnNcbiAgdmFyIGNvc3QgPSBbXTtcbiAgZm9yKHZhciBpID0gMDsgaTxpdGVycztpKyspe1xuICAgIGNvc3QucHVzaCgwKTtcbiAgfVxuXG5cbiAgLy9mb3IgZWFjaCBpdGVyYXRpb25cbiAgZm9yKHZhciBpPTA7IGk8Y29zdC5sZW5ndGg7IGkrKyl7XG4gICAgLy8gY29uc29sZS5sb2coXCJJdGVyYXRpb25cIilcblxuICAgIHZhciBlcnJvciA9IG51bWVyaWMuc3ViKG51bWVyaWMuZG90KFgsIG51bWVyaWMudHJhbnNwb3NlKHRoZXRhKSksIFkpO1xuICAgIGNvbnNvbGUubG9nKFwiZXJyb3I6XCIpO1xuICAgIGNvbnNvbGUubG9nKG51bWVyaWMucHJldHR5UHJpbnQoZXJyb3IpKTtcblxuICAgIC8vZm9yIGVhY2ggcGFyYW1ldGVyIGluIFhcbiAgICBmb3IodmFyIGo9MDsgajx0aGV0YVswXS5sZW5ndGg7IGorKyl7XG4gICAgICBjb25zb2xlLmxvZyhcIlBhcmFtXCIpO1xuICAgICAgY29uc29sZS5sb2coaik7XG4gICAgICBjb25zb2xlLmxvZyhudW1lcmljLnByZXR0eVByaW50KGVycm9yKSk7XG4gICAgICBjb25zb2xlLmxvZyhudW1lcmljLnByZXR0eVByaW50KG51bWVyaWMudHJhbnNwb3NlKFgpW2pdKSk7XG4gICAgICB2YXIgdGVybSA9IG51bWVyaWMuZG90KG51bWVyaWMudHJhbnNwb3NlKFgpW2pdLCBlcnJvcik7XG4gICAgICBjb25zb2xlLmxvZyhudW1lcmljLnByZXR0eVByaW50KHRlcm0pKTtcbiAgICAgIGNvbnNvbGUubG9nKGFscGhhL1hbMF0ubGVuZ3RoKTtcbiAgICAgIGNvbnNvbGUubG9nKG51bWVyaWMuc3VtKHRlcm0pKTtcbiAgICAgIHRlbXBbMF1bal0gPSB0aGV0YVswXVtqXSAtICgoYWxwaGEvWFswXS5sZW5ndGgpICogbnVtZXJpYy5zdW0odGVybSkpO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhcIlRlbXA6XCIpO1xuICAgIGNvbnNvbGUubG9nKG51bWVyaWMucHJldHR5UHJpbnQodGVtcCkpO1xuICAgIHRoZXRhID0gdGVtcDtcbiAgICBjb3N0W2ldID0gY29tcHV0ZUNvc3QoWCwgWSwgdGhldGEpO1xuICAgIGNvbnNvbGUubG9nKFwiVGhlIGNvc3QgYXQgaXRlcmF0aW9uIFwiICsgaSArIFwiIGlzIFwiICtjb3N0W2ldKVxuICAgIGNvbnNvbGUubG9nKFwiVGhldGEgaXM6IFwiKTtcbiAgICBjb25zb2xlLmxvZyhudW1lcmljLnByZXR0eVByaW50KHRoZXRhKSk7XG5cblxuICAgIHZhciBzdHJGdW5jdGlvbiA9ICcnK3RoZXRhWzBdWzFdKyd4KycrdGhldGFbMF1bMF07XG4gICAgZXhlY3V0ZShkYXRhLCBzdHJGdW5jdGlvbik7XG5cbiAgfVxuXG5cbiAgcmV0dXJuIFt0aGV0YSwgY29zdF07XG5cbn1cblxuLy9leHBvcnQgYnV0dG9uIGZ1bmN0aW9uIHRvIHRoZSB3aW5kb3dcbndpbmRvdy5yYW5kb21pemUgPSByYW5kb21pemU7XG53aW5kb3cuaXRlcmF0ZSA9IGl0ZXJhdGU7XG53aW5kb3cua25vd24gPSBrbm93bjtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbnVtZXJpYyA9ICh0eXBlb2YgZXhwb3J0cyA9PT0gXCJ1bmRlZmluZWRcIik/KGZ1bmN0aW9uIG51bWVyaWMoKSB7fSk6KGV4cG9ydHMpO1xuaWYodHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIikgeyBnbG9iYWwubnVtZXJpYyA9IG51bWVyaWM7IH1cblxubnVtZXJpYy52ZXJzaW9uID0gXCIxLjIuNlwiO1xuXG4vLyAxLiBVdGlsaXR5IGZ1bmN0aW9uc1xubnVtZXJpYy5iZW5jaCA9IGZ1bmN0aW9uIGJlbmNoIChmLGludGVydmFsKSB7XG4gICAgdmFyIHQxLHQyLG4saTtcbiAgICBpZih0eXBlb2YgaW50ZXJ2YWwgPT09IFwidW5kZWZpbmVkXCIpIHsgaW50ZXJ2YWwgPSAxNTsgfVxuICAgIG4gPSAwLjU7XG4gICAgdDEgPSBuZXcgRGF0ZSgpO1xuICAgIHdoaWxlKDEpIHtcbiAgICAgICAgbio9MjtcbiAgICAgICAgZm9yKGk9bjtpPjM7aS09NCkgeyBmKCk7IGYoKTsgZigpOyBmKCk7IH1cbiAgICAgICAgd2hpbGUoaT4wKSB7IGYoKTsgaS0tOyB9XG4gICAgICAgIHQyID0gbmV3IERhdGUoKTtcbiAgICAgICAgaWYodDItdDEgPiBpbnRlcnZhbCkgYnJlYWs7XG4gICAgfVxuICAgIGZvcihpPW47aT4zO2ktPTQpIHsgZigpOyBmKCk7IGYoKTsgZigpOyB9XG4gICAgd2hpbGUoaT4wKSB7IGYoKTsgaS0tOyB9XG4gICAgdDIgPSBuZXcgRGF0ZSgpO1xuICAgIHJldHVybiAxMDAwKigzKm4tMSkvKHQyLXQxKTtcbn1cblxubnVtZXJpYy5fbXlJbmRleE9mID0gKGZ1bmN0aW9uIF9teUluZGV4T2Yodykge1xuICAgIHZhciBuID0gdGhpcy5sZW5ndGgsaztcbiAgICBmb3Ioaz0wO2s8bjsrK2spIGlmKHRoaXNba109PT13KSByZXR1cm4gaztcbiAgICByZXR1cm4gLTE7XG59KTtcbm51bWVyaWMubXlJbmRleE9mID0gKEFycmF5LnByb3RvdHlwZS5pbmRleE9mKT9BcnJheS5wcm90b3R5cGUuaW5kZXhPZjpudW1lcmljLl9teUluZGV4T2Y7XG5cbm51bWVyaWMuRnVuY3Rpb24gPSBGdW5jdGlvbjtcbm51bWVyaWMucHJlY2lzaW9uID0gNDtcbm51bWVyaWMubGFyZ2VBcnJheSA9IDUwO1xuXG5udW1lcmljLnByZXR0eVByaW50ID0gZnVuY3Rpb24gcHJldHR5UHJpbnQoeCkge1xuICAgIGZ1bmN0aW9uIGZtdG51bSh4KSB7XG4gICAgICAgIGlmKHggPT09IDApIHsgcmV0dXJuICcwJzsgfVxuICAgICAgICBpZihpc05hTih4KSkgeyByZXR1cm4gJ05hTic7IH1cbiAgICAgICAgaWYoeDwwKSB7IHJldHVybiAnLScrZm10bnVtKC14KTsgfVxuICAgICAgICBpZihpc0Zpbml0ZSh4KSkge1xuICAgICAgICAgICAgdmFyIHNjYWxlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh4KSAvIE1hdGgubG9nKDEwKSk7XG4gICAgICAgICAgICB2YXIgbm9ybWFsaXplZCA9IHggLyBNYXRoLnBvdygxMCxzY2FsZSk7XG4gICAgICAgICAgICB2YXIgYmFzaWMgPSBub3JtYWxpemVkLnRvUHJlY2lzaW9uKG51bWVyaWMucHJlY2lzaW9uKTtcbiAgICAgICAgICAgIGlmKHBhcnNlRmxvYXQoYmFzaWMpID09PSAxMCkgeyBzY2FsZSsrOyBub3JtYWxpemVkID0gMTsgYmFzaWMgPSBub3JtYWxpemVkLnRvUHJlY2lzaW9uKG51bWVyaWMucHJlY2lzaW9uKTsgfVxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoYmFzaWMpLnRvU3RyaW5nKCkrJ2UnK3NjYWxlLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICdJbmZpbml0eSc7XG4gICAgfVxuICAgIHZhciByZXQgPSBbXTtcbiAgICBmdW5jdGlvbiBmb28oeCkge1xuICAgICAgICB2YXIgaztcbiAgICAgICAgaWYodHlwZW9mIHggPT09IFwidW5kZWZpbmVkXCIpIHsgcmV0LnB1c2goQXJyYXkobnVtZXJpYy5wcmVjaXNpb24rOCkuam9pbignICcpKTsgcmV0dXJuIGZhbHNlOyB9XG4gICAgICAgIGlmKHR5cGVvZiB4ID09PSBcInN0cmluZ1wiKSB7IHJldC5wdXNoKCdcIicreCsnXCInKTsgcmV0dXJuIGZhbHNlOyB9XG4gICAgICAgIGlmKHR5cGVvZiB4ID09PSBcImJvb2xlYW5cIikgeyByZXQucHVzaCh4LnRvU3RyaW5nKCkpOyByZXR1cm4gZmFsc2U7IH1cbiAgICAgICAgaWYodHlwZW9mIHggPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgIHZhciBhID0gZm10bnVtKHgpO1xuICAgICAgICAgICAgdmFyIGIgPSB4LnRvUHJlY2lzaW9uKG51bWVyaWMucHJlY2lzaW9uKTtcbiAgICAgICAgICAgIHZhciBjID0gcGFyc2VGbG9hdCh4LnRvU3RyaW5nKCkpLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB2YXIgZCA9IFthLGIsYyxwYXJzZUZsb2F0KGIpLnRvU3RyaW5nKCkscGFyc2VGbG9hdChjKS50b1N0cmluZygpXTtcbiAgICAgICAgICAgIGZvcihrPTE7azxkLmxlbmd0aDtrKyspIHsgaWYoZFtrXS5sZW5ndGggPCBhLmxlbmd0aCkgYSA9IGRba107IH1cbiAgICAgICAgICAgIHJldC5wdXNoKEFycmF5KG51bWVyaWMucHJlY2lzaW9uKzgtYS5sZW5ndGgpLmpvaW4oJyAnKSthKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZih4ID09PSBudWxsKSB7IHJldC5wdXNoKFwibnVsbFwiKTsgcmV0dXJuIGZhbHNlOyB9XG4gICAgICAgIGlmKHR5cGVvZiB4ID09PSBcImZ1bmN0aW9uXCIpIHsgXG4gICAgICAgICAgICByZXQucHVzaCh4LnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgdmFyIGZsYWcgPSBmYWxzZTtcbiAgICAgICAgICAgIGZvcihrIGluIHgpIHsgaWYoeC5oYXNPd25Qcm9wZXJ0eShrKSkgeyBcbiAgICAgICAgICAgICAgICBpZihmbGFnKSByZXQucHVzaCgnLFxcbicpO1xuICAgICAgICAgICAgICAgIGVsc2UgcmV0LnB1c2goJ1xcbnsnKTtcbiAgICAgICAgICAgICAgICBmbGFnID0gdHJ1ZTsgXG4gICAgICAgICAgICAgICAgcmV0LnB1c2goayk7IFxuICAgICAgICAgICAgICAgIHJldC5wdXNoKCc6IFxcbicpOyBcbiAgICAgICAgICAgICAgICBmb28oeFtrXSk7IFxuICAgICAgICAgICAgfSB9XG4gICAgICAgICAgICBpZihmbGFnKSByZXQucHVzaCgnfVxcbicpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYoeCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICBpZih4Lmxlbmd0aCA+IG51bWVyaWMubGFyZ2VBcnJheSkgeyByZXQucHVzaCgnLi4uTGFyZ2UgQXJyYXkuLi4nKTsgcmV0dXJuIHRydWU7IH1cbiAgICAgICAgICAgIHZhciBmbGFnID0gZmFsc2U7XG4gICAgICAgICAgICByZXQucHVzaCgnWycpO1xuICAgICAgICAgICAgZm9yKGs9MDtrPHgubGVuZ3RoO2srKykgeyBpZihrPjApIHsgcmV0LnB1c2goJywnKTsgaWYoZmxhZykgcmV0LnB1c2goJ1xcbiAnKTsgfSBmbGFnID0gZm9vKHhba10pOyB9XG4gICAgICAgICAgICByZXQucHVzaCgnXScpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0LnB1c2goJ3snKTtcbiAgICAgICAgdmFyIGZsYWcgPSBmYWxzZTtcbiAgICAgICAgZm9yKGsgaW4geCkgeyBpZih4Lmhhc093blByb3BlcnR5KGspKSB7IGlmKGZsYWcpIHJldC5wdXNoKCcsXFxuJyk7IGZsYWcgPSB0cnVlOyByZXQucHVzaChrKTsgcmV0LnB1c2goJzogXFxuJyk7IGZvbyh4W2tdKTsgfSB9XG4gICAgICAgIHJldC5wdXNoKCd9Jyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBmb28oeCk7XG4gICAgcmV0dXJuIHJldC5qb2luKCcnKTtcbn1cblxubnVtZXJpYy5wYXJzZURhdGUgPSBmdW5jdGlvbiBwYXJzZURhdGUoZCkge1xuICAgIGZ1bmN0aW9uIGZvbyhkKSB7XG4gICAgICAgIGlmKHR5cGVvZiBkID09PSAnc3RyaW5nJykgeyByZXR1cm4gRGF0ZS5wYXJzZShkLnJlcGxhY2UoLy0vZywnLycpKTsgfVxuICAgICAgICBpZighKGQgaW5zdGFuY2VvZiBBcnJheSkpIHsgdGhyb3cgbmV3IEVycm9yKFwicGFyc2VEYXRlOiBwYXJhbWV0ZXIgbXVzdCBiZSBhcnJheXMgb2Ygc3RyaW5nc1wiKTsgfVxuICAgICAgICB2YXIgcmV0ID0gW10saztcbiAgICAgICAgZm9yKGs9MDtrPGQubGVuZ3RoO2srKykgeyByZXRba10gPSBmb28oZFtrXSk7IH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgcmV0dXJuIGZvbyhkKTtcbn1cblxubnVtZXJpYy5wYXJzZUZsb2F0ID0gZnVuY3Rpb24gcGFyc2VGbG9hdF8oZCkge1xuICAgIGZ1bmN0aW9uIGZvbyhkKSB7XG4gICAgICAgIGlmKHR5cGVvZiBkID09PSAnc3RyaW5nJykgeyByZXR1cm4gcGFyc2VGbG9hdChkKTsgfVxuICAgICAgICBpZighKGQgaW5zdGFuY2VvZiBBcnJheSkpIHsgdGhyb3cgbmV3IEVycm9yKFwicGFyc2VGbG9hdDogcGFyYW1ldGVyIG11c3QgYmUgYXJyYXlzIG9mIHN0cmluZ3NcIik7IH1cbiAgICAgICAgdmFyIHJldCA9IFtdLGs7XG4gICAgICAgIGZvcihrPTA7azxkLmxlbmd0aDtrKyspIHsgcmV0W2tdID0gZm9vKGRba10pOyB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuICAgIHJldHVybiBmb28oZCk7XG59XG5cbm51bWVyaWMucGFyc2VDU1YgPSBmdW5jdGlvbiBwYXJzZUNTVih0KSB7XG4gICAgdmFyIGZvbyA9IHQuc3BsaXQoJ1xcbicpO1xuICAgIHZhciBqLGs7XG4gICAgdmFyIHJldCA9IFtdO1xuICAgIHZhciBwYXQgPSAvKChbXidcIixdKil8KCdbXiddKicpfChcIlteXCJdKlwiKSksL2c7XG4gICAgdmFyIHBhdG51bSA9IC9eXFxzKigoWystXT9bMC05XSsoXFwuWzAtOV0qKT8oZVsrLV0/WzAtOV0rKT8pfChbKy1dP1swLTldKihcXC5bMC05XSspPyhlWystXT9bMC05XSspPykpXFxzKiQvO1xuICAgIHZhciBzdHJpcHBlciA9IGZ1bmN0aW9uKG4pIHsgcmV0dXJuIG4uc3Vic3RyKDAsbi5sZW5ndGgtMSk7IH1cbiAgICB2YXIgY291bnQgPSAwO1xuICAgIGZvcihrPTA7azxmb28ubGVuZ3RoO2srKykge1xuICAgICAgdmFyIGJhciA9IChmb29ba10rXCIsXCIpLm1hdGNoKHBhdCksYmF6O1xuICAgICAgaWYoYmFyLmxlbmd0aD4wKSB7XG4gICAgICAgICAgcmV0W2NvdW50XSA9IFtdO1xuICAgICAgICAgIGZvcihqPTA7ajxiYXIubGVuZ3RoO2orKykge1xuICAgICAgICAgICAgICBiYXogPSBzdHJpcHBlcihiYXJbal0pO1xuICAgICAgICAgICAgICBpZihwYXRudW0udGVzdChiYXopKSB7IHJldFtjb3VudF1bal0gPSBwYXJzZUZsb2F0KGJheik7IH1cbiAgICAgICAgICAgICAgZWxzZSByZXRbY291bnRdW2pdID0gYmF6O1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb3VudCsrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmV0O1xufVxuXG5udW1lcmljLnRvQ1NWID0gZnVuY3Rpb24gdG9DU1YoQSkge1xuICAgIHZhciBzID0gbnVtZXJpYy5kaW0oQSk7XG4gICAgdmFyIGksaixtLG4scm93LHJldDtcbiAgICBtID0gc1swXTtcbiAgICBuID0gc1sxXTtcbiAgICByZXQgPSBbXTtcbiAgICBmb3IoaT0wO2k8bTtpKyspIHtcbiAgICAgICAgcm93ID0gW107XG4gICAgICAgIGZvcihqPTA7ajxtO2orKykgeyByb3dbal0gPSBBW2ldW2pdLnRvU3RyaW5nKCk7IH1cbiAgICAgICAgcmV0W2ldID0gcm93LmpvaW4oJywgJyk7XG4gICAgfVxuICAgIHJldHVybiByZXQuam9pbignXFxuJykrJ1xcbic7XG59XG5cbm51bWVyaWMuZ2V0VVJMID0gZnVuY3Rpb24gZ2V0VVJMKHVybCkge1xuICAgIHZhciBjbGllbnQgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICBjbGllbnQub3BlbihcIkdFVFwiLHVybCxmYWxzZSk7XG4gICAgY2xpZW50LnNlbmQoKTtcbiAgICByZXR1cm4gY2xpZW50O1xufVxuXG5udW1lcmljLmltYWdlVVJMID0gZnVuY3Rpb24gaW1hZ2VVUkwoaW1nKSB7XG4gICAgZnVuY3Rpb24gYmFzZTY0KEEpIHtcbiAgICAgICAgdmFyIG4gPSBBLmxlbmd0aCwgaSx4LHkseixwLHEscixzO1xuICAgICAgICB2YXIga2V5ID0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvPVwiO1xuICAgICAgICB2YXIgcmV0ID0gXCJcIjtcbiAgICAgICAgZm9yKGk9MDtpPG47aSs9Mykge1xuICAgICAgICAgICAgeCA9IEFbaV07XG4gICAgICAgICAgICB5ID0gQVtpKzFdO1xuICAgICAgICAgICAgeiA9IEFbaSsyXTtcbiAgICAgICAgICAgIHAgPSB4ID4+IDI7XG4gICAgICAgICAgICBxID0gKCh4ICYgMykgPDwgNCkgKyAoeSA+PiA0KTtcbiAgICAgICAgICAgIHIgPSAoKHkgJiAxNSkgPDwgMikgKyAoeiA+PiA2KTtcbiAgICAgICAgICAgIHMgPSB6ICYgNjM7XG4gICAgICAgICAgICBpZihpKzE+PW4pIHsgciA9IHMgPSA2NDsgfVxuICAgICAgICAgICAgZWxzZSBpZihpKzI+PW4pIHsgcyA9IDY0OyB9XG4gICAgICAgICAgICByZXQgKz0ga2V5LmNoYXJBdChwKSArIGtleS5jaGFyQXQocSkgKyBrZXkuY2hhckF0KHIpICsga2V5LmNoYXJBdChzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgZnVuY3Rpb24gY3JjMzJBcnJheSAoYSxmcm9tLHRvKSB7XG4gICAgICAgIGlmKHR5cGVvZiBmcm9tID09PSBcInVuZGVmaW5lZFwiKSB7IGZyb20gPSAwOyB9XG4gICAgICAgIGlmKHR5cGVvZiB0byA9PT0gXCJ1bmRlZmluZWRcIikgeyB0byA9IGEubGVuZ3RoOyB9XG4gICAgICAgIHZhciB0YWJsZSA9IFsweDAwMDAwMDAwLCAweDc3MDczMDk2LCAweEVFMEU2MTJDLCAweDk5MDk1MUJBLCAweDA3NkRDNDE5LCAweDcwNkFGNDhGLCAweEU5NjNBNTM1LCAweDlFNjQ5NUEzLFxuICAgICAgICAgICAgICAgICAgICAgMHgwRURCODgzMiwgMHg3OURDQjhBNCwgMHhFMEQ1RTkxRSwgMHg5N0QyRDk4OCwgMHgwOUI2NEMyQiwgMHg3RUIxN0NCRCwgMHhFN0I4MkQwNywgMHg5MEJGMUQ5MSwgXG4gICAgICAgICAgICAgICAgICAgICAweDFEQjcxMDY0LCAweDZBQjAyMEYyLCAweEYzQjk3MTQ4LCAweDg0QkU0MURFLCAweDFBREFENDdELCAweDZERERFNEVCLCAweEY0RDRCNTUxLCAweDgzRDM4NUM3LFxuICAgICAgICAgICAgICAgICAgICAgMHgxMzZDOTg1NiwgMHg2NDZCQThDMCwgMHhGRDYyRjk3QSwgMHg4QTY1QzlFQywgMHgxNDAxNUM0RiwgMHg2MzA2NkNEOSwgMHhGQTBGM0Q2MywgMHg4RDA4MERGNSwgXG4gICAgICAgICAgICAgICAgICAgICAweDNCNkUyMEM4LCAweDRDNjkxMDVFLCAweEQ1NjA0MUU0LCAweEEyNjc3MTcyLCAweDNDMDNFNEQxLCAweDRCMDRENDQ3LCAweEQyMEQ4NUZELCAweEE1MEFCNTZCLCBcbiAgICAgICAgICAgICAgICAgICAgIDB4MzVCNUE4RkEsIDB4NDJCMjk4NkMsIDB4REJCQkM5RDYsIDB4QUNCQ0Y5NDAsIDB4MzJEODZDRTMsIDB4NDVERjVDNzUsIDB4RENENjBEQ0YsIDB4QUJEMTNENTksIFxuICAgICAgICAgICAgICAgICAgICAgMHgyNkQ5MzBBQywgMHg1MURFMDAzQSwgMHhDOEQ3NTE4MCwgMHhCRkQwNjExNiwgMHgyMUI0RjRCNSwgMHg1NkIzQzQyMywgMHhDRkJBOTU5OSwgMHhCOEJEQTUwRixcbiAgICAgICAgICAgICAgICAgICAgIDB4MjgwMkI4OUUsIDB4NUYwNTg4MDgsIDB4QzYwQ0Q5QjIsIDB4QjEwQkU5MjQsIDB4MkY2RjdDODcsIDB4NTg2ODRDMTEsIDB4QzE2MTFEQUIsIDB4QjY2NjJEM0QsXG4gICAgICAgICAgICAgICAgICAgICAweDc2REM0MTkwLCAweDAxREI3MTA2LCAweDk4RDIyMEJDLCAweEVGRDUxMDJBLCAweDcxQjE4NTg5LCAweDA2QjZCNTFGLCAweDlGQkZFNEE1LCAweEU4QjhENDMzLFxuICAgICAgICAgICAgICAgICAgICAgMHg3ODA3QzlBMiwgMHgwRjAwRjkzNCwgMHg5NjA5QTg4RSwgMHhFMTBFOTgxOCwgMHg3RjZBMERCQiwgMHgwODZEM0QyRCwgMHg5MTY0NkM5NywgMHhFNjYzNUMwMSwgXG4gICAgICAgICAgICAgICAgICAgICAweDZCNkI1MUY0LCAweDFDNkM2MTYyLCAweDg1NjUzMEQ4LCAweEYyNjIwMDRFLCAweDZDMDY5NUVELCAweDFCMDFBNTdCLCAweDgyMDhGNEMxLCAweEY1MEZDNDU3LCBcbiAgICAgICAgICAgICAgICAgICAgIDB4NjVCMEQ5QzYsIDB4MTJCN0U5NTAsIDB4OEJCRUI4RUEsIDB4RkNCOTg4N0MsIDB4NjJERDFEREYsIDB4MTVEQTJENDksIDB4OENEMzdDRjMsIDB4RkJENDRDNjUsIFxuICAgICAgICAgICAgICAgICAgICAgMHg0REIyNjE1OCwgMHgzQUI1NTFDRSwgMHhBM0JDMDA3NCwgMHhENEJCMzBFMiwgMHg0QURGQTU0MSwgMHgzREQ4OTVENywgMHhBNEQxQzQ2RCwgMHhEM0Q2RjRGQiwgXG4gICAgICAgICAgICAgICAgICAgICAweDQzNjlFOTZBLCAweDM0NkVEOUZDLCAweEFENjc4ODQ2LCAweERBNjBCOEQwLCAweDQ0MDQyRDczLCAweDMzMDMxREU1LCAweEFBMEE0QzVGLCAweEREMEQ3Q0M5LCBcbiAgICAgICAgICAgICAgICAgICAgIDB4NTAwNTcxM0MsIDB4MjcwMjQxQUEsIDB4QkUwQjEwMTAsIDB4QzkwQzIwODYsIDB4NTc2OEI1MjUsIDB4MjA2Rjg1QjMsIDB4Qjk2NkQ0MDksIDB4Q0U2MUU0OUYsIFxuICAgICAgICAgICAgICAgICAgICAgMHg1RURFRjkwRSwgMHgyOUQ5Qzk5OCwgMHhCMEQwOTgyMiwgMHhDN0Q3QThCNCwgMHg1OUIzM0QxNywgMHgyRUI0MEQ4MSwgMHhCN0JENUMzQiwgMHhDMEJBNkNBRCwgXG4gICAgICAgICAgICAgICAgICAgICAweEVEQjg4MzIwLCAweDlBQkZCM0I2LCAweDAzQjZFMjBDLCAweDc0QjFEMjlBLCAweEVBRDU0NzM5LCAweDlERDI3N0FGLCAweDA0REIyNjE1LCAweDczREMxNjgzLCBcbiAgICAgICAgICAgICAgICAgICAgIDB4RTM2MzBCMTIsIDB4OTQ2NDNCODQsIDB4MEQ2RDZBM0UsIDB4N0E2QTVBQTgsIDB4RTQwRUNGMEIsIDB4OTMwOUZGOUQsIDB4MEEwMEFFMjcsIDB4N0QwNzlFQjEsIFxuICAgICAgICAgICAgICAgICAgICAgMHhGMDBGOTM0NCwgMHg4NzA4QTNEMiwgMHgxRTAxRjI2OCwgMHg2OTA2QzJGRSwgMHhGNzYyNTc1RCwgMHg4MDY1NjdDQiwgMHgxOTZDMzY3MSwgMHg2RTZCMDZFNywgXG4gICAgICAgICAgICAgICAgICAgICAweEZFRDQxQjc2LCAweDg5RDMyQkUwLCAweDEwREE3QTVBLCAweDY3REQ0QUNDLCAweEY5QjlERjZGLCAweDhFQkVFRkY5LCAweDE3QjdCRTQzLCAweDYwQjA4RUQ1LCBcbiAgICAgICAgICAgICAgICAgICAgIDB4RDZENkEzRTgsIDB4QTFEMTkzN0UsIDB4MzhEOEMyQzQsIDB4NEZERkYyNTIsIDB4RDFCQjY3RjEsIDB4QTZCQzU3NjcsIDB4M0ZCNTA2REQsIDB4NDhCMjM2NEIsIFxuICAgICAgICAgICAgICAgICAgICAgMHhEODBEMkJEQSwgMHhBRjBBMUI0QywgMHgzNjAzNEFGNiwgMHg0MTA0N0E2MCwgMHhERjYwRUZDMywgMHhBODY3REY1NSwgMHgzMTZFOEVFRiwgMHg0NjY5QkU3OSwgXG4gICAgICAgICAgICAgICAgICAgICAweENCNjFCMzhDLCAweEJDNjY4MzFBLCAweDI1NkZEMkEwLCAweDUyNjhFMjM2LCAweENDMEM3Nzk1LCAweEJCMEI0NzAzLCAweDIyMDIxNkI5LCAweDU1MDUyNjJGLCBcbiAgICAgICAgICAgICAgICAgICAgIDB4QzVCQTNCQkUsIDB4QjJCRDBCMjgsIDB4MkJCNDVBOTIsIDB4NUNCMzZBMDQsIDB4QzJEN0ZGQTcsIDB4QjVEMENGMzEsIDB4MkNEOTlFOEIsIDB4NUJERUFFMUQsIFxuICAgICAgICAgICAgICAgICAgICAgMHg5QjY0QzJCMCwgMHhFQzYzRjIyNiwgMHg3NTZBQTM5QywgMHgwMjZEOTMwQSwgMHg5QzA5MDZBOSwgMHhFQjBFMzYzRiwgMHg3MjA3Njc4NSwgMHgwNTAwNTcxMywgXG4gICAgICAgICAgICAgICAgICAgICAweDk1QkY0QTgyLCAweEUyQjg3QTE0LCAweDdCQjEyQkFFLCAweDBDQjYxQjM4LCAweDkyRDI4RTlCLCAweEU1RDVCRTBELCAweDdDRENFRkI3LCAweDBCREJERjIxLCBcbiAgICAgICAgICAgICAgICAgICAgIDB4ODZEM0QyRDQsIDB4RjFENEUyNDIsIDB4NjhEREIzRjgsIDB4MUZEQTgzNkUsIDB4ODFCRTE2Q0QsIDB4RjZCOTI2NUIsIDB4NkZCMDc3RTEsIDB4MThCNzQ3NzcsIFxuICAgICAgICAgICAgICAgICAgICAgMHg4ODA4NUFFNiwgMHhGRjBGNkE3MCwgMHg2NjA2M0JDQSwgMHgxMTAxMEI1QywgMHg4RjY1OUVGRiwgMHhGODYyQUU2OSwgMHg2MTZCRkZEMywgMHgxNjZDQ0Y0NSwgXG4gICAgICAgICAgICAgICAgICAgICAweEEwMEFFMjc4LCAweEQ3MEREMkVFLCAweDRFMDQ4MzU0LCAweDM5MDNCM0MyLCAweEE3NjcyNjYxLCAweEQwNjAxNkY3LCAweDQ5Njk0NzRELCAweDNFNkU3N0RCLCBcbiAgICAgICAgICAgICAgICAgICAgIDB4QUVEMTZBNEEsIDB4RDlENjVBREMsIDB4NDBERjBCNjYsIDB4MzdEODNCRjAsIDB4QTlCQ0FFNTMsIDB4REVCQjlFQzUsIDB4NDdCMkNGN0YsIDB4MzBCNUZGRTksIFxuICAgICAgICAgICAgICAgICAgICAgMHhCREJERjIxQywgMHhDQUJBQzI4QSwgMHg1M0IzOTMzMCwgMHgyNEI0QTNBNiwgMHhCQUQwMzYwNSwgMHhDREQ3MDY5MywgMHg1NERFNTcyOSwgMHgyM0Q5NjdCRiwgXG4gICAgICAgICAgICAgICAgICAgICAweEIzNjY3QTJFLCAweEM0NjE0QUI4LCAweDVENjgxQjAyLCAweDJBNkYyQjk0LCAweEI0MEJCRTM3LCAweEMzMEM4RUExLCAweDVBMDVERjFCLCAweDJEMDJFRjhEXTtcbiAgICAgXG4gICAgICAgIHZhciBjcmMgPSAtMSwgeSA9IDAsIG4gPSBhLmxlbmd0aCxpO1xuXG4gICAgICAgIGZvciAoaSA9IGZyb207IGkgPCB0bzsgaSsrKSB7XG4gICAgICAgICAgICB5ID0gKGNyYyBeIGFbaV0pICYgMHhGRjtcbiAgICAgICAgICAgIGNyYyA9IChjcmMgPj4+IDgpIF4gdGFibGVbeV07XG4gICAgICAgIH1cbiAgICAgXG4gICAgICAgIHJldHVybiBjcmMgXiAoLTEpO1xuICAgIH1cblxuICAgIHZhciBoID0gaW1nWzBdLmxlbmd0aCwgdyA9IGltZ1swXVswXS5sZW5ndGgsIHMxLCBzMiwgbmV4dCxrLGxlbmd0aCxhLGIsaSxqLGFkbGVyMzIsY3JjMzI7XG4gICAgdmFyIHN0cmVhbSA9IFtcbiAgICAgICAgICAgICAgICAgIDEzNywgODAsIDc4LCA3MSwgMTMsIDEwLCAyNiwgMTAsICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gIDA6IFBORyBzaWduYXR1cmVcbiAgICAgICAgICAgICAgICAgIDAsMCwwLDEzLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gIDg6IElIRFIgQ2h1bmsgbGVuZ3RoXG4gICAgICAgICAgICAgICAgICA3MywgNzIsIDY4LCA4MiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDEyOiBcIklIRFJcIiBcbiAgICAgICAgICAgICAgICAgICh3ID4+IDI0KSAmIDI1NSwgKHcgPj4gMTYpICYgMjU1LCAodyA+PiA4KSAmIDI1NSwgdyYyNTUsICAgLy8gMTY6IFdpZHRoXG4gICAgICAgICAgICAgICAgICAoaCA+PiAyNCkgJiAyNTUsIChoID4+IDE2KSAmIDI1NSwgKGggPj4gOCkgJiAyNTUsIGgmMjU1LCAgIC8vIDIwOiBIZWlnaHRcbiAgICAgICAgICAgICAgICAgIDgsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMjQ6IGJpdCBkZXB0aFxuICAgICAgICAgICAgICAgICAgMiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAyNTogUkdCXG4gICAgICAgICAgICAgICAgICAwLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDI2OiBkZWZsYXRlXG4gICAgICAgICAgICAgICAgICAwLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDI3OiBubyBmaWx0ZXJcbiAgICAgICAgICAgICAgICAgIDAsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMjg6IG5vIGludGVybGFjZVxuICAgICAgICAgICAgICAgICAgLTEsLTIsLTMsLTQsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAyOTogQ1JDXG4gICAgICAgICAgICAgICAgICAtNSwtNiwtNywtOCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDMzOiBJREFUIENodW5rIGxlbmd0aFxuICAgICAgICAgICAgICAgICAgNzMsIDY4LCA2NSwgODQsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAzNzogXCJJREFUXCJcbiAgICAgICAgICAgICAgICAgIC8vIFJGQyAxOTUwIGhlYWRlciBzdGFydHMgaGVyZVxuICAgICAgICAgICAgICAgICAgOCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA0MTogUkZDMTk1MCBDTUZcbiAgICAgICAgICAgICAgICAgIDI5ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gNDI6IFJGQzE5NTAgRkxHXG4gICAgICAgICAgICAgICAgICBdO1xuICAgIGNyYzMyID0gY3JjMzJBcnJheShzdHJlYW0sMTIsMjkpO1xuICAgIHN0cmVhbVsyOV0gPSAoY3JjMzI+PjI0KSYyNTU7XG4gICAgc3RyZWFtWzMwXSA9IChjcmMzMj4+MTYpJjI1NTtcbiAgICBzdHJlYW1bMzFdID0gKGNyYzMyPj44KSYyNTU7XG4gICAgc3RyZWFtWzMyXSA9IChjcmMzMikmMjU1O1xuICAgIHMxID0gMTtcbiAgICBzMiA9IDA7XG4gICAgZm9yKGk9MDtpPGg7aSsrKSB7XG4gICAgICAgIGlmKGk8aC0xKSB7IHN0cmVhbS5wdXNoKDApOyB9XG4gICAgICAgIGVsc2UgeyBzdHJlYW0ucHVzaCgxKTsgfVxuICAgICAgICBhID0gKDMqdysxKyhpPT09MCkpJjI1NTsgYiA9ICgoMyp3KzErKGk9PT0wKSk+PjgpJjI1NTtcbiAgICAgICAgc3RyZWFtLnB1c2goYSk7IHN0cmVhbS5wdXNoKGIpO1xuICAgICAgICBzdHJlYW0ucHVzaCgofmEpJjI1NSk7IHN0cmVhbS5wdXNoKCh+YikmMjU1KTtcbiAgICAgICAgaWYoaT09PTApIHN0cmVhbS5wdXNoKDApO1xuICAgICAgICBmb3Ioaj0wO2o8dztqKyspIHtcbiAgICAgICAgICAgIGZvcihrPTA7azwzO2srKykge1xuICAgICAgICAgICAgICAgIGEgPSBpbWdba11baV1bal07XG4gICAgICAgICAgICAgICAgaWYoYT4yNTUpIGEgPSAyNTU7XG4gICAgICAgICAgICAgICAgZWxzZSBpZihhPDApIGE9MDtcbiAgICAgICAgICAgICAgICBlbHNlIGEgPSBNYXRoLnJvdW5kKGEpO1xuICAgICAgICAgICAgICAgIHMxID0gKHMxICsgYSApJTY1NTIxO1xuICAgICAgICAgICAgICAgIHMyID0gKHMyICsgczEpJTY1NTIxO1xuICAgICAgICAgICAgICAgIHN0cmVhbS5wdXNoKGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHN0cmVhbS5wdXNoKDApO1xuICAgIH1cbiAgICBhZGxlcjMyID0gKHMyPDwxNikrczE7XG4gICAgc3RyZWFtLnB1c2goKGFkbGVyMzI+PjI0KSYyNTUpO1xuICAgIHN0cmVhbS5wdXNoKChhZGxlcjMyPj4xNikmMjU1KTtcbiAgICBzdHJlYW0ucHVzaCgoYWRsZXIzMj4+OCkmMjU1KTtcbiAgICBzdHJlYW0ucHVzaCgoYWRsZXIzMikmMjU1KTtcbiAgICBsZW5ndGggPSBzdHJlYW0ubGVuZ3RoIC0gNDE7XG4gICAgc3RyZWFtWzMzXSA9IChsZW5ndGg+PjI0KSYyNTU7XG4gICAgc3RyZWFtWzM0XSA9IChsZW5ndGg+PjE2KSYyNTU7XG4gICAgc3RyZWFtWzM1XSA9IChsZW5ndGg+PjgpJjI1NTtcbiAgICBzdHJlYW1bMzZdID0gKGxlbmd0aCkmMjU1O1xuICAgIGNyYzMyID0gY3JjMzJBcnJheShzdHJlYW0sMzcpO1xuICAgIHN0cmVhbS5wdXNoKChjcmMzMj4+MjQpJjI1NSk7XG4gICAgc3RyZWFtLnB1c2goKGNyYzMyPj4xNikmMjU1KTtcbiAgICBzdHJlYW0ucHVzaCgoY3JjMzI+PjgpJjI1NSk7XG4gICAgc3RyZWFtLnB1c2goKGNyYzMyKSYyNTUpO1xuICAgIHN0cmVhbS5wdXNoKDApO1xuICAgIHN0cmVhbS5wdXNoKDApO1xuICAgIHN0cmVhbS5wdXNoKDApO1xuICAgIHN0cmVhbS5wdXNoKDApO1xuLy8gICAgYSA9IHN0cmVhbS5sZW5ndGg7XG4gICAgc3RyZWFtLnB1c2goNzMpOyAgLy8gSVxuICAgIHN0cmVhbS5wdXNoKDY5KTsgIC8vIEVcbiAgICBzdHJlYW0ucHVzaCg3OCk7ICAvLyBOXG4gICAgc3RyZWFtLnB1c2goNjgpOyAgLy8gRFxuICAgIHN0cmVhbS5wdXNoKDE3NCk7IC8vIENSQzFcbiAgICBzdHJlYW0ucHVzaCg2Nik7ICAvLyBDUkMyXG4gICAgc3RyZWFtLnB1c2goOTYpOyAgLy8gQ1JDM1xuICAgIHN0cmVhbS5wdXNoKDEzMCk7IC8vIENSQzRcbiAgICByZXR1cm4gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCwnK2Jhc2U2NChzdHJlYW0pO1xufVxuXG4vLyAyLiBMaW5lYXIgYWxnZWJyYSB3aXRoIEFycmF5cy5cbm51bWVyaWMuX2RpbSA9IGZ1bmN0aW9uIF9kaW0oeCkge1xuICAgIHZhciByZXQgPSBbXTtcbiAgICB3aGlsZSh0eXBlb2YgeCA9PT0gXCJvYmplY3RcIikgeyByZXQucHVzaCh4Lmxlbmd0aCk7IHggPSB4WzBdOyB9XG4gICAgcmV0dXJuIHJldDtcbn1cblxubnVtZXJpYy5kaW0gPSBmdW5jdGlvbiBkaW0oeCkge1xuICAgIHZhciB5LHo7XG4gICAgaWYodHlwZW9mIHggPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgeSA9IHhbMF07XG4gICAgICAgIGlmKHR5cGVvZiB5ID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICB6ID0geVswXTtcbiAgICAgICAgICAgIGlmKHR5cGVvZiB6ID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bWVyaWMuX2RpbSh4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBbeC5sZW5ndGgseS5sZW5ndGhdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbeC5sZW5ndGhdO1xuICAgIH1cbiAgICByZXR1cm4gW107XG59XG5cbm51bWVyaWMubWFwcmVkdWNlID0gZnVuY3Rpb24gbWFwcmVkdWNlKGJvZHksaW5pdCkge1xuICAgIHJldHVybiBGdW5jdGlvbigneCcsJ2FjY3VtJywnX3MnLCdfaycsXG4gICAgICAgICAgICAnaWYodHlwZW9mIGFjY3VtID09PSBcInVuZGVmaW5lZFwiKSBhY2N1bSA9ICcraW5pdCsnO1xcbicrXG4gICAgICAgICAgICAnaWYodHlwZW9mIHggPT09IFwibnVtYmVyXCIpIHsgdmFyIHhpID0geDsgJytib2R5Kyc7IHJldHVybiBhY2N1bTsgfVxcbicrXG4gICAgICAgICAgICAnaWYodHlwZW9mIF9zID09PSBcInVuZGVmaW5lZFwiKSBfcyA9IG51bWVyaWMuZGltKHgpO1xcbicrXG4gICAgICAgICAgICAnaWYodHlwZW9mIF9rID09PSBcInVuZGVmaW5lZFwiKSBfayA9IDA7XFxuJytcbiAgICAgICAgICAgICd2YXIgX24gPSBfc1tfa107XFxuJytcbiAgICAgICAgICAgICd2YXIgaSx4aTtcXG4nK1xuICAgICAgICAgICAgJ2lmKF9rIDwgX3MubGVuZ3RoLTEpIHtcXG4nK1xuICAgICAgICAgICAgJyAgICBmb3IoaT1fbi0xO2k+PTA7aS0tKSB7XFxuJytcbiAgICAgICAgICAgICcgICAgICAgIGFjY3VtID0gYXJndW1lbnRzLmNhbGxlZSh4W2ldLGFjY3VtLF9zLF9rKzEpO1xcbicrXG4gICAgICAgICAgICAnICAgIH0nK1xuICAgICAgICAgICAgJyAgICByZXR1cm4gYWNjdW07XFxuJytcbiAgICAgICAgICAgICd9XFxuJytcbiAgICAgICAgICAgICdmb3IoaT1fbi0xO2k+PTE7aS09MikgeyBcXG4nK1xuICAgICAgICAgICAgJyAgICB4aSA9IHhbaV07XFxuJytcbiAgICAgICAgICAgICcgICAgJytib2R5Kyc7XFxuJytcbiAgICAgICAgICAgICcgICAgeGkgPSB4W2ktMV07XFxuJytcbiAgICAgICAgICAgICcgICAgJytib2R5Kyc7XFxuJytcbiAgICAgICAgICAgICd9XFxuJytcbiAgICAgICAgICAgICdpZihpID09PSAwKSB7XFxuJytcbiAgICAgICAgICAgICcgICAgeGkgPSB4W2ldO1xcbicrXG4gICAgICAgICAgICAnICAgICcrYm9keSsnXFxuJytcbiAgICAgICAgICAgICd9XFxuJytcbiAgICAgICAgICAgICdyZXR1cm4gYWNjdW07J1xuICAgICAgICAgICAgKTtcbn1cbm51bWVyaWMubWFwcmVkdWNlMiA9IGZ1bmN0aW9uIG1hcHJlZHVjZTIoYm9keSxzZXR1cCkge1xuICAgIHJldHVybiBGdW5jdGlvbigneCcsXG4gICAgICAgICAgICAndmFyIG4gPSB4Lmxlbmd0aDtcXG4nK1xuICAgICAgICAgICAgJ3ZhciBpLHhpO1xcbicrc2V0dXArJztcXG4nK1xuICAgICAgICAgICAgJ2ZvcihpPW4tMTtpIT09LTE7LS1pKSB7IFxcbicrXG4gICAgICAgICAgICAnICAgIHhpID0geFtpXTtcXG4nK1xuICAgICAgICAgICAgJyAgICAnK2JvZHkrJztcXG4nK1xuICAgICAgICAgICAgJ31cXG4nK1xuICAgICAgICAgICAgJ3JldHVybiBhY2N1bTsnXG4gICAgICAgICAgICApO1xufVxuXG5cbm51bWVyaWMuc2FtZSA9IGZ1bmN0aW9uIHNhbWUoeCx5KSB7XG4gICAgdmFyIGksbjtcbiAgICBpZighKHggaW5zdGFuY2VvZiBBcnJheSkgfHwgISh5IGluc3RhbmNlb2YgQXJyYXkpKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIG4gPSB4Lmxlbmd0aDtcbiAgICBpZihuICE9PSB5Lmxlbmd0aCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICBmb3IoaT0wO2k8bjtpKyspIHtcbiAgICAgICAgaWYoeFtpXSA9PT0geVtpXSkgeyBjb250aW51ZTsgfVxuICAgICAgICBpZih0eXBlb2YgeFtpXSA9PT0gXCJvYmplY3RcIikgeyBpZighc2FtZSh4W2ldLHlbaV0pKSByZXR1cm4gZmFsc2U7IH1cbiAgICAgICAgZWxzZSB7IHJldHVybiBmYWxzZTsgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxubnVtZXJpYy5yZXAgPSBmdW5jdGlvbiByZXAocyx2LGspIHtcbiAgICBpZih0eXBlb2YgayA9PT0gXCJ1bmRlZmluZWRcIikgeyBrPTA7IH1cbiAgICB2YXIgbiA9IHNba10sIHJldCA9IEFycmF5KG4pLCBpO1xuICAgIGlmKGsgPT09IHMubGVuZ3RoLTEpIHtcbiAgICAgICAgZm9yKGk9bi0yO2k+PTA7aS09MikgeyByZXRbaSsxXSA9IHY7IHJldFtpXSA9IHY7IH1cbiAgICAgICAgaWYoaT09PS0xKSB7IHJldFswXSA9IHY7IH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgZm9yKGk9bi0xO2k+PTA7aS0tKSB7IHJldFtpXSA9IG51bWVyaWMucmVwKHMsdixrKzEpOyB9XG4gICAgcmV0dXJuIHJldDtcbn1cblxuXG5udW1lcmljLmRvdE1Nc21hbGwgPSBmdW5jdGlvbiBkb3RNTXNtYWxsKHgseSkge1xuICAgIHZhciBpLGosayxwLHEscixyZXQsZm9vLGJhcix3b28saTAsazAscDAscjA7XG4gICAgcCA9IHgubGVuZ3RoOyBxID0geS5sZW5ndGg7IHIgPSB5WzBdLmxlbmd0aDtcbiAgICByZXQgPSBBcnJheShwKTtcbiAgICBmb3IoaT1wLTE7aT49MDtpLS0pIHtcbiAgICAgICAgZm9vID0gQXJyYXkocik7XG4gICAgICAgIGJhciA9IHhbaV07XG4gICAgICAgIGZvcihrPXItMTtrPj0wO2stLSkge1xuICAgICAgICAgICAgd29vID0gYmFyW3EtMV0qeVtxLTFdW2tdO1xuICAgICAgICAgICAgZm9yKGo9cS0yO2o+PTE7ai09Mikge1xuICAgICAgICAgICAgICAgIGkwID0gai0xO1xuICAgICAgICAgICAgICAgIHdvbyArPSBiYXJbal0qeVtqXVtrXSArIGJhcltpMF0qeVtpMF1ba107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihqPT09MCkgeyB3b28gKz0gYmFyWzBdKnlbMF1ba107IH1cbiAgICAgICAgICAgIGZvb1trXSA9IHdvbztcbiAgICAgICAgfVxuICAgICAgICByZXRbaV0gPSBmb287XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG59XG5udW1lcmljLl9nZXRDb2wgPSBmdW5jdGlvbiBfZ2V0Q29sKEEsaix4KSB7XG4gICAgdmFyIG4gPSBBLmxlbmd0aCwgaTtcbiAgICBmb3IoaT1uLTE7aT4wOy0taSkge1xuICAgICAgICB4W2ldID0gQVtpXVtqXTtcbiAgICAgICAgLS1pO1xuICAgICAgICB4W2ldID0gQVtpXVtqXTtcbiAgICB9XG4gICAgaWYoaT09PTApIHhbMF0gPSBBWzBdW2pdO1xufVxubnVtZXJpYy5kb3RNTWJpZyA9IGZ1bmN0aW9uIGRvdE1NYmlnKHgseSl7XG4gICAgdmFyIGdjID0gbnVtZXJpYy5fZ2V0Q29sLCBwID0geS5sZW5ndGgsIHYgPSBBcnJheShwKTtcbiAgICB2YXIgbSA9IHgubGVuZ3RoLCBuID0geVswXS5sZW5ndGgsIEEgPSBuZXcgQXJyYXkobSksIHhqO1xuICAgIHZhciBWViA9IG51bWVyaWMuZG90VlY7XG4gICAgdmFyIGksaixrLHo7XG4gICAgLS1wO1xuICAgIC0tbTtcbiAgICBmb3IoaT1tO2khPT0tMTstLWkpIEFbaV0gPSBBcnJheShuKTtcbiAgICAtLW47XG4gICAgZm9yKGk9bjtpIT09LTE7LS1pKSB7XG4gICAgICAgIGdjKHksaSx2KTtcbiAgICAgICAgZm9yKGo9bTtqIT09LTE7LS1qKSB7XG4gICAgICAgICAgICB6PTA7XG4gICAgICAgICAgICB4aiA9IHhbal07XG4gICAgICAgICAgICBBW2pdW2ldID0gVlYoeGosdik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIEE7XG59XG5cbm51bWVyaWMuZG90TVYgPSBmdW5jdGlvbiBkb3RNVih4LHkpIHtcbiAgICB2YXIgcCA9IHgubGVuZ3RoLCBxID0geS5sZW5ndGgsaTtcbiAgICB2YXIgcmV0ID0gQXJyYXkocCksIGRvdFZWID0gbnVtZXJpYy5kb3RWVjtcbiAgICBmb3IoaT1wLTE7aT49MDtpLS0pIHsgcmV0W2ldID0gZG90VlYoeFtpXSx5KTsgfVxuICAgIHJldHVybiByZXQ7XG59XG5cbm51bWVyaWMuZG90Vk0gPSBmdW5jdGlvbiBkb3RWTSh4LHkpIHtcbiAgICB2YXIgaSxqLGsscCxxLHIscmV0LGZvbyxiYXIsd29vLGkwLGswLHAwLHIwLHMxLHMyLHMzLGJheixhY2N1bTtcbiAgICBwID0geC5sZW5ndGg7IHEgPSB5WzBdLmxlbmd0aDtcbiAgICByZXQgPSBBcnJheShxKTtcbiAgICBmb3Ioaz1xLTE7az49MDtrLS0pIHtcbiAgICAgICAgd29vID0geFtwLTFdKnlbcC0xXVtrXTtcbiAgICAgICAgZm9yKGo9cC0yO2o+PTE7ai09Mikge1xuICAgICAgICAgICAgaTAgPSBqLTE7XG4gICAgICAgICAgICB3b28gKz0geFtqXSp5W2pdW2tdICsgeFtpMF0qeVtpMF1ba107XG4gICAgICAgIH1cbiAgICAgICAgaWYoaj09PTApIHsgd29vICs9IHhbMF0qeVswXVtrXTsgfVxuICAgICAgICByZXRba10gPSB3b287XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG59XG5cbm51bWVyaWMuZG90VlYgPSBmdW5jdGlvbiBkb3RWVih4LHkpIHtcbiAgICB2YXIgaSxuPXgubGVuZ3RoLGkxLHJldCA9IHhbbi0xXSp5W24tMV07XG4gICAgZm9yKGk9bi0yO2k+PTE7aS09Mikge1xuICAgICAgICBpMSA9IGktMTtcbiAgICAgICAgcmV0ICs9IHhbaV0qeVtpXSArIHhbaTFdKnlbaTFdO1xuICAgIH1cbiAgICBpZihpPT09MCkgeyByZXQgKz0geFswXSp5WzBdOyB9XG4gICAgcmV0dXJuIHJldDtcbn1cblxubnVtZXJpYy5kb3QgPSBmdW5jdGlvbiBkb3QoeCx5KSB7XG4gICAgdmFyIGQgPSBudW1lcmljLmRpbTtcbiAgICBzd2l0Y2goZCh4KS5sZW5ndGgqMTAwMCtkKHkpLmxlbmd0aCkge1xuICAgIGNhc2UgMjAwMjpcbiAgICAgICAgaWYoeS5sZW5ndGggPCAxMCkgcmV0dXJuIG51bWVyaWMuZG90TU1zbWFsbCh4LHkpO1xuICAgICAgICBlbHNlIHJldHVybiBudW1lcmljLmRvdE1NYmlnKHgseSk7XG4gICAgY2FzZSAyMDAxOiByZXR1cm4gbnVtZXJpYy5kb3RNVih4LHkpO1xuICAgIGNhc2UgMTAwMjogcmV0dXJuIG51bWVyaWMuZG90Vk0oeCx5KTtcbiAgICBjYXNlIDEwMDE6IHJldHVybiBudW1lcmljLmRvdFZWKHgseSk7XG4gICAgY2FzZSAxMDAwOiByZXR1cm4gbnVtZXJpYy5tdWxWUyh4LHkpO1xuICAgIGNhc2UgMTogcmV0dXJuIG51bWVyaWMubXVsU1YoeCx5KTtcbiAgICBjYXNlIDA6IHJldHVybiB4Knk7XG4gICAgZGVmYXVsdDogdGhyb3cgbmV3IEVycm9yKCdudW1lcmljLmRvdCBvbmx5IHdvcmtzIG9uIHZlY3RvcnMgYW5kIG1hdHJpY2VzJyk7XG4gICAgfVxufVxuXG5udW1lcmljLmRpYWcgPSBmdW5jdGlvbiBkaWFnKGQpIHtcbiAgICB2YXIgaSxpMSxqLG4gPSBkLmxlbmd0aCwgQSA9IEFycmF5KG4pLCBBaTtcbiAgICBmb3IoaT1uLTE7aT49MDtpLS0pIHtcbiAgICAgICAgQWkgPSBBcnJheShuKTtcbiAgICAgICAgaTEgPSBpKzI7XG4gICAgICAgIGZvcihqPW4tMTtqPj1pMTtqLT0yKSB7XG4gICAgICAgICAgICBBaVtqXSA9IDA7XG4gICAgICAgICAgICBBaVtqLTFdID0gMDtcbiAgICAgICAgfVxuICAgICAgICBpZihqPmkpIHsgQWlbal0gPSAwOyB9XG4gICAgICAgIEFpW2ldID0gZFtpXTtcbiAgICAgICAgZm9yKGo9aS0xO2o+PTE7ai09Mikge1xuICAgICAgICAgICAgQWlbal0gPSAwO1xuICAgICAgICAgICAgQWlbai0xXSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYoaj09PTApIHsgQWlbMF0gPSAwOyB9XG4gICAgICAgIEFbaV0gPSBBaTtcbiAgICB9XG4gICAgcmV0dXJuIEE7XG59XG5udW1lcmljLmdldERpYWcgPSBmdW5jdGlvbihBKSB7XG4gICAgdmFyIG4gPSBNYXRoLm1pbihBLmxlbmd0aCxBWzBdLmxlbmd0aCksaSxyZXQgPSBBcnJheShuKTtcbiAgICBmb3IoaT1uLTE7aT49MTstLWkpIHtcbiAgICAgICAgcmV0W2ldID0gQVtpXVtpXTtcbiAgICAgICAgLS1pO1xuICAgICAgICByZXRbaV0gPSBBW2ldW2ldO1xuICAgIH1cbiAgICBpZihpPT09MCkge1xuICAgICAgICByZXRbMF0gPSBBWzBdWzBdO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xufVxuXG5udW1lcmljLmlkZW50aXR5ID0gZnVuY3Rpb24gaWRlbnRpdHkobikgeyByZXR1cm4gbnVtZXJpYy5kaWFnKG51bWVyaWMucmVwKFtuXSwxKSk7IH1cbm51bWVyaWMucG9pbnR3aXNlID0gZnVuY3Rpb24gcG9pbnR3aXNlKHBhcmFtcyxib2R5LHNldHVwKSB7XG4gICAgaWYodHlwZW9mIHNldHVwID09PSBcInVuZGVmaW5lZFwiKSB7IHNldHVwID0gXCJcIjsgfVxuICAgIHZhciBmdW4gPSBbXTtcbiAgICB2YXIgaztcbiAgICB2YXIgYXZlYyA9IC9cXFtpXFxdJC8scCx0aGV2ZWMgPSAnJztcbiAgICB2YXIgaGF2ZXJldCA9IGZhbHNlO1xuICAgIGZvcihrPTA7azxwYXJhbXMubGVuZ3RoO2srKykge1xuICAgICAgICBpZihhdmVjLnRlc3QocGFyYW1zW2tdKSkge1xuICAgICAgICAgICAgcCA9IHBhcmFtc1trXS5zdWJzdHJpbmcoMCxwYXJhbXNba10ubGVuZ3RoLTMpO1xuICAgICAgICAgICAgdGhldmVjID0gcDtcbiAgICAgICAgfSBlbHNlIHsgcCA9IHBhcmFtc1trXTsgfVxuICAgICAgICBpZihwPT09J3JldCcpIGhhdmVyZXQgPSB0cnVlO1xuICAgICAgICBmdW4ucHVzaChwKTtcbiAgICB9XG4gICAgZnVuW3BhcmFtcy5sZW5ndGhdID0gJ19zJztcbiAgICBmdW5bcGFyYW1zLmxlbmd0aCsxXSA9ICdfayc7XG4gICAgZnVuW3BhcmFtcy5sZW5ndGgrMl0gPSAoXG4gICAgICAgICAgICAnaWYodHlwZW9mIF9zID09PSBcInVuZGVmaW5lZFwiKSBfcyA9IG51bWVyaWMuZGltKCcrdGhldmVjKycpO1xcbicrXG4gICAgICAgICAgICAnaWYodHlwZW9mIF9rID09PSBcInVuZGVmaW5lZFwiKSBfayA9IDA7XFxuJytcbiAgICAgICAgICAgICd2YXIgX24gPSBfc1tfa107XFxuJytcbiAgICAgICAgICAgICd2YXIgaScrKGhhdmVyZXQ/Jyc6JywgcmV0ID0gQXJyYXkoX24pJykrJztcXG4nK1xuICAgICAgICAgICAgJ2lmKF9rIDwgX3MubGVuZ3RoLTEpIHtcXG4nK1xuICAgICAgICAgICAgJyAgICBmb3IoaT1fbi0xO2k+PTA7aS0tKSByZXRbaV0gPSBhcmd1bWVudHMuY2FsbGVlKCcrcGFyYW1zLmpvaW4oJywnKSsnLF9zLF9rKzEpO1xcbicrXG4gICAgICAgICAgICAnICAgIHJldHVybiByZXQ7XFxuJytcbiAgICAgICAgICAgICd9XFxuJytcbiAgICAgICAgICAgIHNldHVwKydcXG4nK1xuICAgICAgICAgICAgJ2ZvcihpPV9uLTE7aSE9PS0xOy0taSkge1xcbicrXG4gICAgICAgICAgICAnICAgICcrYm9keSsnXFxuJytcbiAgICAgICAgICAgICd9XFxuJytcbiAgICAgICAgICAgICdyZXR1cm4gcmV0OydcbiAgICAgICAgICAgICk7XG4gICAgcmV0dXJuIEZ1bmN0aW9uLmFwcGx5KG51bGwsZnVuKTtcbn1cbm51bWVyaWMucG9pbnR3aXNlMiA9IGZ1bmN0aW9uIHBvaW50d2lzZTIocGFyYW1zLGJvZHksc2V0dXApIHtcbiAgICBpZih0eXBlb2Ygc2V0dXAgPT09IFwidW5kZWZpbmVkXCIpIHsgc2V0dXAgPSBcIlwiOyB9XG4gICAgdmFyIGZ1biA9IFtdO1xuICAgIHZhciBrO1xuICAgIHZhciBhdmVjID0gL1xcW2lcXF0kLyxwLHRoZXZlYyA9ICcnO1xuICAgIHZhciBoYXZlcmV0ID0gZmFsc2U7XG4gICAgZm9yKGs9MDtrPHBhcmFtcy5sZW5ndGg7aysrKSB7XG4gICAgICAgIGlmKGF2ZWMudGVzdChwYXJhbXNba10pKSB7XG4gICAgICAgICAgICBwID0gcGFyYW1zW2tdLnN1YnN0cmluZygwLHBhcmFtc1trXS5sZW5ndGgtMyk7XG4gICAgICAgICAgICB0aGV2ZWMgPSBwO1xuICAgICAgICB9IGVsc2UgeyBwID0gcGFyYW1zW2tdOyB9XG4gICAgICAgIGlmKHA9PT0ncmV0JykgaGF2ZXJldCA9IHRydWU7XG4gICAgICAgIGZ1bi5wdXNoKHApO1xuICAgIH1cbiAgICBmdW5bcGFyYW1zLmxlbmd0aF0gPSAoXG4gICAgICAgICAgICAndmFyIF9uID0gJyt0aGV2ZWMrJy5sZW5ndGg7XFxuJytcbiAgICAgICAgICAgICd2YXIgaScrKGhhdmVyZXQ/Jyc6JywgcmV0ID0gQXJyYXkoX24pJykrJztcXG4nK1xuICAgICAgICAgICAgc2V0dXArJ1xcbicrXG4gICAgICAgICAgICAnZm9yKGk9X24tMTtpIT09LTE7LS1pKSB7XFxuJytcbiAgICAgICAgICAgIGJvZHkrJ1xcbicrXG4gICAgICAgICAgICAnfVxcbicrXG4gICAgICAgICAgICAncmV0dXJuIHJldDsnXG4gICAgICAgICAgICApO1xuICAgIHJldHVybiBGdW5jdGlvbi5hcHBseShudWxsLGZ1bik7XG59XG5udW1lcmljLl9iaWZvcmVhY2ggPSAoZnVuY3Rpb24gX2JpZm9yZWFjaCh4LHkscyxrLGYpIHtcbiAgICBpZihrID09PSBzLmxlbmd0aC0xKSB7IGYoeCx5KTsgcmV0dXJuOyB9XG4gICAgdmFyIGksbj1zW2tdO1xuICAgIGZvcihpPW4tMTtpPj0wO2ktLSkgeyBfYmlmb3JlYWNoKHR5cGVvZiB4PT09XCJvYmplY3RcIj94W2ldOngsdHlwZW9mIHk9PT1cIm9iamVjdFwiP3lbaV06eSxzLGsrMSxmKTsgfVxufSk7XG5udW1lcmljLl9iaWZvcmVhY2gyID0gKGZ1bmN0aW9uIF9iaWZvcmVhY2gyKHgseSxzLGssZikge1xuICAgIGlmKGsgPT09IHMubGVuZ3RoLTEpIHsgcmV0dXJuIGYoeCx5KTsgfVxuICAgIHZhciBpLG49c1trXSxyZXQgPSBBcnJheShuKTtcbiAgICBmb3IoaT1uLTE7aT49MDstLWkpIHsgcmV0W2ldID0gX2JpZm9yZWFjaDIodHlwZW9mIHg9PT1cIm9iamVjdFwiP3hbaV06eCx0eXBlb2YgeT09PVwib2JqZWN0XCI/eVtpXTp5LHMsaysxLGYpOyB9XG4gICAgcmV0dXJuIHJldDtcbn0pO1xubnVtZXJpYy5fZm9yZWFjaCA9IChmdW5jdGlvbiBfZm9yZWFjaCh4LHMsayxmKSB7XG4gICAgaWYoayA9PT0gcy5sZW5ndGgtMSkgeyBmKHgpOyByZXR1cm47IH1cbiAgICB2YXIgaSxuPXNba107XG4gICAgZm9yKGk9bi0xO2k+PTA7aS0tKSB7IF9mb3JlYWNoKHhbaV0scyxrKzEsZik7IH1cbn0pO1xubnVtZXJpYy5fZm9yZWFjaDIgPSAoZnVuY3Rpb24gX2ZvcmVhY2gyKHgscyxrLGYpIHtcbiAgICBpZihrID09PSBzLmxlbmd0aC0xKSB7IHJldHVybiBmKHgpOyB9XG4gICAgdmFyIGksbj1zW2tdLCByZXQgPSBBcnJheShuKTtcbiAgICBmb3IoaT1uLTE7aT49MDtpLS0pIHsgcmV0W2ldID0gX2ZvcmVhY2gyKHhbaV0scyxrKzEsZik7IH1cbiAgICByZXR1cm4gcmV0O1xufSk7XG5cbi8qbnVtZXJpYy5hbnlWID0gbnVtZXJpYy5tYXByZWR1Y2UoJ2lmKHhpKSByZXR1cm4gdHJ1ZTsnLCdmYWxzZScpO1xubnVtZXJpYy5hbGxWID0gbnVtZXJpYy5tYXByZWR1Y2UoJ2lmKCF4aSkgcmV0dXJuIGZhbHNlOycsJ3RydWUnKTtcbm51bWVyaWMuYW55ID0gZnVuY3Rpb24oeCkgeyBpZih0eXBlb2YgeC5sZW5ndGggPT09IFwidW5kZWZpbmVkXCIpIHJldHVybiB4OyByZXR1cm4gbnVtZXJpYy5hbnlWKHgpOyB9XG5udW1lcmljLmFsbCA9IGZ1bmN0aW9uKHgpIHsgaWYodHlwZW9mIHgubGVuZ3RoID09PSBcInVuZGVmaW5lZFwiKSByZXR1cm4geDsgcmV0dXJuIG51bWVyaWMuYWxsVih4KTsgfSovXG5cbm51bWVyaWMub3BzMiA9IHtcbiAgICAgICAgYWRkOiAnKycsXG4gICAgICAgIHN1YjogJy0nLFxuICAgICAgICBtdWw6ICcqJyxcbiAgICAgICAgZGl2OiAnLycsXG4gICAgICAgIG1vZDogJyUnLFxuICAgICAgICBhbmQ6ICcmJicsXG4gICAgICAgIG9yOiAgJ3x8JyxcbiAgICAgICAgZXE6ICAnPT09JyxcbiAgICAgICAgbmVxOiAnIT09JyxcbiAgICAgICAgbHQ6ICAnPCcsXG4gICAgICAgIGd0OiAgJz4nLFxuICAgICAgICBsZXE6ICc8PScsXG4gICAgICAgIGdlcTogJz49JyxcbiAgICAgICAgYmFuZDogJyYnLFxuICAgICAgICBib3I6ICd8JyxcbiAgICAgICAgYnhvcjogJ14nLFxuICAgICAgICBsc2hpZnQ6ICc8PCcsXG4gICAgICAgIHJzaGlmdDogJz4+JyxcbiAgICAgICAgcnJzaGlmdDogJz4+Pidcbn07XG5udW1lcmljLm9wc2VxID0ge1xuICAgICAgICBhZGRlcTogJys9JyxcbiAgICAgICAgc3ViZXE6ICctPScsXG4gICAgICAgIG11bGVxOiAnKj0nLFxuICAgICAgICBkaXZlcTogJy89JyxcbiAgICAgICAgbW9kZXE6ICclPScsXG4gICAgICAgIGxzaGlmdGVxOiAnPDw9JyxcbiAgICAgICAgcnNoaWZ0ZXE6ICc+Pj0nLFxuICAgICAgICBycnNoaWZ0ZXE6ICc+Pj49JyxcbiAgICAgICAgYmFuZGVxOiAnJj0nLFxuICAgICAgICBib3JlcTogJ3w9JyxcbiAgICAgICAgYnhvcmVxOiAnXj0nXG59O1xubnVtZXJpYy5tYXRoZnVucyA9IFsnYWJzJywnYWNvcycsJ2FzaW4nLCdhdGFuJywnY2VpbCcsJ2NvcycsXG4gICAgICAgICAgICAgICAgICAgICdleHAnLCdmbG9vcicsJ2xvZycsJ3JvdW5kJywnc2luJywnc3FydCcsJ3RhbicsXG4gICAgICAgICAgICAgICAgICAgICdpc05hTicsJ2lzRmluaXRlJ107XG5udW1lcmljLm1hdGhmdW5zMiA9IFsnYXRhbjInLCdwb3cnLCdtYXgnLCdtaW4nXTtcbm51bWVyaWMub3BzMSA9IHtcbiAgICAgICAgbmVnOiAnLScsXG4gICAgICAgIG5vdDogJyEnLFxuICAgICAgICBibm90OiAnficsXG4gICAgICAgIGNsb25lOiAnJ1xufTtcbm51bWVyaWMubWFwcmVkdWNlcnMgPSB7XG4gICAgICAgIGFueTogWydpZih4aSkgcmV0dXJuIHRydWU7JywndmFyIGFjY3VtID0gZmFsc2U7J10sXG4gICAgICAgIGFsbDogWydpZigheGkpIHJldHVybiBmYWxzZTsnLCd2YXIgYWNjdW0gPSB0cnVlOyddLFxuICAgICAgICBzdW06IFsnYWNjdW0gKz0geGk7JywndmFyIGFjY3VtID0gMDsnXSxcbiAgICAgICAgcHJvZDogWydhY2N1bSAqPSB4aTsnLCd2YXIgYWNjdW0gPSAxOyddLFxuICAgICAgICBub3JtMlNxdWFyZWQ6IFsnYWNjdW0gKz0geGkqeGk7JywndmFyIGFjY3VtID0gMDsnXSxcbiAgICAgICAgbm9ybWluZjogWydhY2N1bSA9IG1heChhY2N1bSxhYnMoeGkpKTsnLCd2YXIgYWNjdW0gPSAwLCBtYXggPSBNYXRoLm1heCwgYWJzID0gTWF0aC5hYnM7J10sXG4gICAgICAgIG5vcm0xOiBbJ2FjY3VtICs9IGFicyh4aSknLCd2YXIgYWNjdW0gPSAwLCBhYnMgPSBNYXRoLmFiczsnXSxcbiAgICAgICAgc3VwOiBbJ2FjY3VtID0gbWF4KGFjY3VtLHhpKTsnLCd2YXIgYWNjdW0gPSAtSW5maW5pdHksIG1heCA9IE1hdGgubWF4OyddLFxuICAgICAgICBpbmY6IFsnYWNjdW0gPSBtaW4oYWNjdW0seGkpOycsJ3ZhciBhY2N1bSA9IEluZmluaXR5LCBtaW4gPSBNYXRoLm1pbjsnXVxufTtcblxuKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaSxvO1xuICAgIGZvcihpPTA7aTxudW1lcmljLm1hdGhmdW5zMi5sZW5ndGg7KytpKSB7XG4gICAgICAgIG8gPSBudW1lcmljLm1hdGhmdW5zMltpXTtcbiAgICAgICAgbnVtZXJpYy5vcHMyW29dID0gbztcbiAgICB9XG4gICAgZm9yKGkgaW4gbnVtZXJpYy5vcHMyKSB7XG4gICAgICAgIGlmKG51bWVyaWMub3BzMi5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICAgICAgbyA9IG51bWVyaWMub3BzMltpXTtcbiAgICAgICAgICAgIHZhciBjb2RlLCBjb2RlZXEsIHNldHVwID0gJyc7XG4gICAgICAgICAgICBpZihudW1lcmljLm15SW5kZXhPZi5jYWxsKG51bWVyaWMubWF0aGZ1bnMyLGkpIT09LTEpIHtcbiAgICAgICAgICAgICAgICBzZXR1cCA9ICd2YXIgJytvKycgPSBNYXRoLicrbysnO1xcbic7XG4gICAgICAgICAgICAgICAgY29kZSA9IGZ1bmN0aW9uKHIseCx5KSB7IHJldHVybiByKycgPSAnK28rJygnK3grJywnK3krJyknOyB9O1xuICAgICAgICAgICAgICAgIGNvZGVlcSA9IGZ1bmN0aW9uKHgseSkgeyByZXR1cm4geCsnID0gJytvKycoJyt4KycsJyt5KycpJzsgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29kZSA9IGZ1bmN0aW9uKHIseCx5KSB7IHJldHVybiByKycgPSAnK3grJyAnK28rJyAnK3k7IH07XG4gICAgICAgICAgICAgICAgaWYobnVtZXJpYy5vcHNlcS5oYXNPd25Qcm9wZXJ0eShpKydlcScpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvZGVlcSA9IGZ1bmN0aW9uKHgseSkgeyByZXR1cm4geCsnICcrbysnPSAnK3k7IH07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29kZWVxID0gZnVuY3Rpb24oeCx5KSB7IHJldHVybiB4KycgPSAnK3grJyAnK28rJyAnK3k7IH07ICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBudW1lcmljW2krJ1ZWJ10gPSBudW1lcmljLnBvaW50d2lzZTIoWyd4W2ldJywneVtpXSddLGNvZGUoJ3JldFtpXScsJ3hbaV0nLCd5W2ldJyksc2V0dXApO1xuICAgICAgICAgICAgbnVtZXJpY1tpKydTViddID0gbnVtZXJpYy5wb2ludHdpc2UyKFsneCcsJ3lbaV0nXSxjb2RlKCdyZXRbaV0nLCd4JywneVtpXScpLHNldHVwKTtcbiAgICAgICAgICAgIG51bWVyaWNbaSsnVlMnXSA9IG51bWVyaWMucG9pbnR3aXNlMihbJ3hbaV0nLCd5J10sY29kZSgncmV0W2ldJywneFtpXScsJ3knKSxzZXR1cCk7XG4gICAgICAgICAgICBudW1lcmljW2ldID0gRnVuY3Rpb24oXG4gICAgICAgICAgICAgICAgICAgICd2YXIgbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGksIHggPSBhcmd1bWVudHNbMF0sIHk7XFxuJytcbiAgICAgICAgICAgICAgICAgICAgJ3ZhciBWViA9IG51bWVyaWMuJytpKydWViwgVlMgPSBudW1lcmljLicraSsnVlMsIFNWID0gbnVtZXJpYy4nK2krJ1NWO1xcbicrXG4gICAgICAgICAgICAgICAgICAgICd2YXIgZGltID0gbnVtZXJpYy5kaW07XFxuJytcbiAgICAgICAgICAgICAgICAgICAgJ2ZvcihpPTE7aSE9PW47KytpKSB7IFxcbicrXG4gICAgICAgICAgICAgICAgICAgICcgIHkgPSBhcmd1bWVudHNbaV07XFxuJytcbiAgICAgICAgICAgICAgICAgICAgJyAgaWYodHlwZW9mIHggPT09IFwib2JqZWN0XCIpIHtcXG4nK1xuICAgICAgICAgICAgICAgICAgICAnICAgICAgaWYodHlwZW9mIHkgPT09IFwib2JqZWN0XCIpIHggPSBudW1lcmljLl9iaWZvcmVhY2gyKHgseSxkaW0oeCksMCxWVik7XFxuJytcbiAgICAgICAgICAgICAgICAgICAgJyAgICAgIGVsc2UgeCA9IG51bWVyaWMuX2JpZm9yZWFjaDIoeCx5LGRpbSh4KSwwLFZTKTtcXG4nK1xuICAgICAgICAgICAgICAgICAgICAnICB9IGVsc2UgaWYodHlwZW9mIHkgPT09IFwib2JqZWN0XCIpIHggPSBudW1lcmljLl9iaWZvcmVhY2gyKHgseSxkaW0oeSksMCxTVik7XFxuJytcbiAgICAgICAgICAgICAgICAgICAgJyAgZWxzZSAnK2NvZGVlcSgneCcsJ3knKSsnXFxuJytcbiAgICAgICAgICAgICAgICAgICAgJ31cXG5yZXR1cm4geDtcXG4nKTtcbiAgICAgICAgICAgIG51bWVyaWNbb10gPSBudW1lcmljW2ldO1xuICAgICAgICAgICAgbnVtZXJpY1tpKydlcVYnXSA9IG51bWVyaWMucG9pbnR3aXNlMihbJ3JldFtpXScsJ3hbaV0nXSwgY29kZWVxKCdyZXRbaV0nLCd4W2ldJyksc2V0dXApO1xuICAgICAgICAgICAgbnVtZXJpY1tpKydlcVMnXSA9IG51bWVyaWMucG9pbnR3aXNlMihbJ3JldFtpXScsJ3gnXSwgY29kZWVxKCdyZXRbaV0nLCd4Jyksc2V0dXApO1xuICAgICAgICAgICAgbnVtZXJpY1tpKydlcSddID0gRnVuY3Rpb24oXG4gICAgICAgICAgICAgICAgICAgICd2YXIgbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGksIHggPSBhcmd1bWVudHNbMF0sIHk7XFxuJytcbiAgICAgICAgICAgICAgICAgICAgJ3ZhciBWID0gbnVtZXJpYy4nK2krJ2VxViwgUyA9IG51bWVyaWMuJytpKydlcVNcXG4nK1xuICAgICAgICAgICAgICAgICAgICAndmFyIHMgPSBudW1lcmljLmRpbSh4KTtcXG4nK1xuICAgICAgICAgICAgICAgICAgICAnZm9yKGk9MTtpIT09bjsrK2kpIHsgXFxuJytcbiAgICAgICAgICAgICAgICAgICAgJyAgeSA9IGFyZ3VtZW50c1tpXTtcXG4nK1xuICAgICAgICAgICAgICAgICAgICAnICBpZih0eXBlb2YgeSA9PT0gXCJvYmplY3RcIikgbnVtZXJpYy5fYmlmb3JlYWNoKHgseSxzLDAsVik7XFxuJytcbiAgICAgICAgICAgICAgICAgICAgJyAgZWxzZSBudW1lcmljLl9iaWZvcmVhY2goeCx5LHMsMCxTKTtcXG4nK1xuICAgICAgICAgICAgICAgICAgICAnfVxcbnJldHVybiB4O1xcbicpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZvcihpPTA7aTxudW1lcmljLm1hdGhmdW5zMi5sZW5ndGg7KytpKSB7XG4gICAgICAgIG8gPSBudW1lcmljLm1hdGhmdW5zMltpXTtcbiAgICAgICAgZGVsZXRlIG51bWVyaWMub3BzMltvXTtcbiAgICB9XG4gICAgZm9yKGk9MDtpPG51bWVyaWMubWF0aGZ1bnMubGVuZ3RoOysraSkge1xuICAgICAgICBvID0gbnVtZXJpYy5tYXRoZnVuc1tpXTtcbiAgICAgICAgbnVtZXJpYy5vcHMxW29dID0gbztcbiAgICB9XG4gICAgZm9yKGkgaW4gbnVtZXJpYy5vcHMxKSB7XG4gICAgICAgIGlmKG51bWVyaWMub3BzMS5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICAgICAgc2V0dXAgPSAnJztcbiAgICAgICAgICAgIG8gPSBudW1lcmljLm9wczFbaV07XG4gICAgICAgICAgICBpZihudW1lcmljLm15SW5kZXhPZi5jYWxsKG51bWVyaWMubWF0aGZ1bnMsaSkhPT0tMSkge1xuICAgICAgICAgICAgICAgIGlmKE1hdGguaGFzT3duUHJvcGVydHkobykpIHNldHVwID0gJ3ZhciAnK28rJyA9IE1hdGguJytvKyc7XFxuJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG51bWVyaWNbaSsnZXFWJ10gPSBudW1lcmljLnBvaW50d2lzZTIoWydyZXRbaV0nXSwncmV0W2ldID0gJytvKycocmV0W2ldKTsnLHNldHVwKTtcbiAgICAgICAgICAgIG51bWVyaWNbaSsnZXEnXSA9IEZ1bmN0aW9uKCd4JyxcbiAgICAgICAgICAgICAgICAgICAgJ2lmKHR5cGVvZiB4ICE9PSBcIm9iamVjdFwiKSByZXR1cm4gJytvKyd4XFxuJytcbiAgICAgICAgICAgICAgICAgICAgJ3ZhciBpO1xcbicrXG4gICAgICAgICAgICAgICAgICAgICd2YXIgViA9IG51bWVyaWMuJytpKydlcVY7XFxuJytcbiAgICAgICAgICAgICAgICAgICAgJ3ZhciBzID0gbnVtZXJpYy5kaW0oeCk7XFxuJytcbiAgICAgICAgICAgICAgICAgICAgJ251bWVyaWMuX2ZvcmVhY2goeCxzLDAsVik7XFxuJytcbiAgICAgICAgICAgICAgICAgICAgJ3JldHVybiB4O1xcbicpO1xuICAgICAgICAgICAgbnVtZXJpY1tpKydWJ10gPSBudW1lcmljLnBvaW50d2lzZTIoWyd4W2ldJ10sJ3JldFtpXSA9ICcrbysnKHhbaV0pOycsc2V0dXApO1xuICAgICAgICAgICAgbnVtZXJpY1tpXSA9IEZ1bmN0aW9uKCd4JyxcbiAgICAgICAgICAgICAgICAgICAgJ2lmKHR5cGVvZiB4ICE9PSBcIm9iamVjdFwiKSByZXR1cm4gJytvKycoeClcXG4nK1xuICAgICAgICAgICAgICAgICAgICAndmFyIGk7XFxuJytcbiAgICAgICAgICAgICAgICAgICAgJ3ZhciBWID0gbnVtZXJpYy4nK2krJ1Y7XFxuJytcbiAgICAgICAgICAgICAgICAgICAgJ3ZhciBzID0gbnVtZXJpYy5kaW0oeCk7XFxuJytcbiAgICAgICAgICAgICAgICAgICAgJ3JldHVybiBudW1lcmljLl9mb3JlYWNoMih4LHMsMCxWKTtcXG4nKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IoaT0wO2k8bnVtZXJpYy5tYXRoZnVucy5sZW5ndGg7KytpKSB7XG4gICAgICAgIG8gPSBudW1lcmljLm1hdGhmdW5zW2ldO1xuICAgICAgICBkZWxldGUgbnVtZXJpYy5vcHMxW29dO1xuICAgIH1cbiAgICBmb3IoaSBpbiBudW1lcmljLm1hcHJlZHVjZXJzKSB7XG4gICAgICAgIGlmKG51bWVyaWMubWFwcmVkdWNlcnMuaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgICAgIG8gPSBudW1lcmljLm1hcHJlZHVjZXJzW2ldO1xuICAgICAgICAgICAgbnVtZXJpY1tpKydWJ10gPSBudW1lcmljLm1hcHJlZHVjZTIob1swXSxvWzFdKTtcbiAgICAgICAgICAgIG51bWVyaWNbaV0gPSBGdW5jdGlvbigneCcsJ3MnLCdrJyxcbiAgICAgICAgICAgICAgICAgICAgb1sxXStcbiAgICAgICAgICAgICAgICAgICAgJ2lmKHR5cGVvZiB4ICE9PSBcIm9iamVjdFwiKSB7JytcbiAgICAgICAgICAgICAgICAgICAgJyAgICB4aSA9IHg7XFxuJytcbiAgICAgICAgICAgICAgICAgICAgb1swXSsnO1xcbicrXG4gICAgICAgICAgICAgICAgICAgICcgICAgcmV0dXJuIGFjY3VtO1xcbicrXG4gICAgICAgICAgICAgICAgICAgICd9JytcbiAgICAgICAgICAgICAgICAgICAgJ2lmKHR5cGVvZiBzID09PSBcInVuZGVmaW5lZFwiKSBzID0gbnVtZXJpYy5kaW0oeCk7XFxuJytcbiAgICAgICAgICAgICAgICAgICAgJ2lmKHR5cGVvZiBrID09PSBcInVuZGVmaW5lZFwiKSBrID0gMDtcXG4nK1xuICAgICAgICAgICAgICAgICAgICAnaWYoayA9PT0gcy5sZW5ndGgtMSkgcmV0dXJuIG51bWVyaWMuJytpKydWKHgpO1xcbicrXG4gICAgICAgICAgICAgICAgICAgICd2YXIgeGk7XFxuJytcbiAgICAgICAgICAgICAgICAgICAgJ3ZhciBuID0geC5sZW5ndGgsIGk7XFxuJytcbiAgICAgICAgICAgICAgICAgICAgJ2ZvcihpPW4tMTtpIT09LTE7LS1pKSB7XFxuJytcbiAgICAgICAgICAgICAgICAgICAgJyAgIHhpID0gYXJndW1lbnRzLmNhbGxlZSh4W2ldKTtcXG4nK1xuICAgICAgICAgICAgICAgICAgICBvWzBdKyc7XFxuJytcbiAgICAgICAgICAgICAgICAgICAgJ31cXG4nK1xuICAgICAgICAgICAgICAgICAgICAncmV0dXJuIGFjY3VtO1xcbicpO1xuICAgICAgICB9XG4gICAgfVxufSgpKTtcblxubnVtZXJpYy50cnVuY1ZWID0gbnVtZXJpYy5wb2ludHdpc2UoWyd4W2ldJywneVtpXSddLCdyZXRbaV0gPSByb3VuZCh4W2ldL3lbaV0pKnlbaV07JywndmFyIHJvdW5kID0gTWF0aC5yb3VuZDsnKTtcbm51bWVyaWMudHJ1bmNWUyA9IG51bWVyaWMucG9pbnR3aXNlKFsneFtpXScsJ3knXSwncmV0W2ldID0gcm91bmQoeFtpXS95KSp5OycsJ3ZhciByb3VuZCA9IE1hdGgucm91bmQ7Jyk7XG5udW1lcmljLnRydW5jU1YgPSBudW1lcmljLnBvaW50d2lzZShbJ3gnLCd5W2ldJ10sJ3JldFtpXSA9IHJvdW5kKHgveVtpXSkqeVtpXTsnLCd2YXIgcm91bmQgPSBNYXRoLnJvdW5kOycpO1xubnVtZXJpYy50cnVuYyA9IGZ1bmN0aW9uIHRydW5jKHgseSkge1xuICAgIGlmKHR5cGVvZiB4ID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIGlmKHR5cGVvZiB5ID09PSBcIm9iamVjdFwiKSByZXR1cm4gbnVtZXJpYy50cnVuY1ZWKHgseSk7XG4gICAgICAgIHJldHVybiBudW1lcmljLnRydW5jVlMoeCx5KTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB5ID09PSBcIm9iamVjdFwiKSByZXR1cm4gbnVtZXJpYy50cnVuY1NWKHgseSk7XG4gICAgcmV0dXJuIE1hdGgucm91bmQoeC95KSp5O1xufVxuXG5udW1lcmljLmludiA9IGZ1bmN0aW9uIGludih4KSB7XG4gICAgdmFyIHMgPSBudW1lcmljLmRpbSh4KSwgYWJzID0gTWF0aC5hYnMsIG0gPSBzWzBdLCBuID0gc1sxXTtcbiAgICB2YXIgQSA9IG51bWVyaWMuY2xvbmUoeCksIEFpLCBBajtcbiAgICB2YXIgSSA9IG51bWVyaWMuaWRlbnRpdHkobSksIElpLCBJajtcbiAgICB2YXIgaSxqLGsseDtcbiAgICBmb3Ioaj0wO2o8bjsrK2opIHtcbiAgICAgICAgdmFyIGkwID0gLTE7XG4gICAgICAgIHZhciB2MCA9IC0xO1xuICAgICAgICBmb3IoaT1qO2khPT1tOysraSkgeyBrID0gYWJzKEFbaV1bal0pOyBpZihrPnYwKSB7IGkwID0gaTsgdjAgPSBrOyB9IH1cbiAgICAgICAgQWogPSBBW2kwXTsgQVtpMF0gPSBBW2pdOyBBW2pdID0gQWo7XG4gICAgICAgIElqID0gSVtpMF07IElbaTBdID0gSVtqXTsgSVtqXSA9IElqO1xuICAgICAgICB4ID0gQWpbal07XG4gICAgICAgIGZvcihrPWo7ayE9PW47KytrKSAgICBBaltrXSAvPSB4OyBcbiAgICAgICAgZm9yKGs9bi0xO2shPT0tMTstLWspIElqW2tdIC89IHg7XG4gICAgICAgIGZvcihpPW0tMTtpIT09LTE7LS1pKSB7XG4gICAgICAgICAgICBpZihpIT09aikge1xuICAgICAgICAgICAgICAgIEFpID0gQVtpXTtcbiAgICAgICAgICAgICAgICBJaSA9IElbaV07XG4gICAgICAgICAgICAgICAgeCA9IEFpW2pdO1xuICAgICAgICAgICAgICAgIGZvcihrPWorMTtrIT09bjsrK2spICBBaVtrXSAtPSBBaltrXSp4O1xuICAgICAgICAgICAgICAgIGZvcihrPW4tMTtrPjA7LS1rKSB7IElpW2tdIC09IElqW2tdKng7IC0tazsgSWlba10gLT0gSWpba10qeDsgfVxuICAgICAgICAgICAgICAgIGlmKGs9PT0wKSBJaVswXSAtPSBJalswXSp4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBJO1xufVxuXG5udW1lcmljLmRldCA9IGZ1bmN0aW9uIGRldCh4KSB7XG4gICAgdmFyIHMgPSBudW1lcmljLmRpbSh4KTtcbiAgICBpZihzLmxlbmd0aCAhPT0gMiB8fCBzWzBdICE9PSBzWzFdKSB7IHRocm93IG5ldyBFcnJvcignbnVtZXJpYzogZGV0KCkgb25seSB3b3JrcyBvbiBzcXVhcmUgbWF0cmljZXMnKTsgfVxuICAgIHZhciBuID0gc1swXSwgcmV0ID0gMSxpLGosayxBID0gbnVtZXJpYy5jbG9uZSh4KSxBaixBaSxhbHBoYSx0ZW1wLGsxLGsyLGszO1xuICAgIGZvcihqPTA7ajxuLTE7aisrKSB7XG4gICAgICAgIGs9ajtcbiAgICAgICAgZm9yKGk9aisxO2k8bjtpKyspIHsgaWYoTWF0aC5hYnMoQVtpXVtqXSkgPiBNYXRoLmFicyhBW2tdW2pdKSkgeyBrID0gaTsgfSB9XG4gICAgICAgIGlmKGsgIT09IGopIHtcbiAgICAgICAgICAgIHRlbXAgPSBBW2tdOyBBW2tdID0gQVtqXTsgQVtqXSA9IHRlbXA7XG4gICAgICAgICAgICByZXQgKj0gLTE7XG4gICAgICAgIH1cbiAgICAgICAgQWogPSBBW2pdO1xuICAgICAgICBmb3IoaT1qKzE7aTxuO2krKykge1xuICAgICAgICAgICAgQWkgPSBBW2ldO1xuICAgICAgICAgICAgYWxwaGEgPSBBaVtqXS9BaltqXTtcbiAgICAgICAgICAgIGZvcihrPWorMTtrPG4tMTtrKz0yKSB7XG4gICAgICAgICAgICAgICAgazEgPSBrKzE7XG4gICAgICAgICAgICAgICAgQWlba10gLT0gQWpba10qYWxwaGE7XG4gICAgICAgICAgICAgICAgQWlbazFdIC09IEFqW2sxXSphbHBoYTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKGshPT1uKSB7IEFpW2tdIC09IEFqW2tdKmFscGhhOyB9XG4gICAgICAgIH1cbiAgICAgICAgaWYoQWpbal0gPT09IDApIHsgcmV0dXJuIDA7IH1cbiAgICAgICAgcmV0ICo9IEFqW2pdO1xuICAgIH1cbiAgICByZXR1cm4gcmV0KkFbal1bal07XG59XG5cbm51bWVyaWMudHJhbnNwb3NlID0gZnVuY3Rpb24gdHJhbnNwb3NlKHgpIHtcbiAgICB2YXIgaSxqLG0gPSB4Lmxlbmd0aCxuID0geFswXS5sZW5ndGgsIHJldD1BcnJheShuKSxBMCxBMSxCajtcbiAgICBmb3Ioaj0wO2o8bjtqKyspIHJldFtqXSA9IEFycmF5KG0pO1xuICAgIGZvcihpPW0tMTtpPj0xO2ktPTIpIHtcbiAgICAgICAgQTEgPSB4W2ldO1xuICAgICAgICBBMCA9IHhbaS0xXTtcbiAgICAgICAgZm9yKGo9bi0xO2o+PTE7LS1qKSB7XG4gICAgICAgICAgICBCaiA9IHJldFtqXTsgQmpbaV0gPSBBMVtqXTsgQmpbaS0xXSA9IEEwW2pdO1xuICAgICAgICAgICAgLS1qO1xuICAgICAgICAgICAgQmogPSByZXRbal07IEJqW2ldID0gQTFbal07IEJqW2ktMV0gPSBBMFtqXTtcbiAgICAgICAgfVxuICAgICAgICBpZihqPT09MCkge1xuICAgICAgICAgICAgQmogPSByZXRbMF07IEJqW2ldID0gQTFbMF07IEJqW2ktMV0gPSBBMFswXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZihpPT09MCkge1xuICAgICAgICBBMCA9IHhbMF07XG4gICAgICAgIGZvcihqPW4tMTtqPj0xOy0taikge1xuICAgICAgICAgICAgcmV0W2pdWzBdID0gQTBbal07XG4gICAgICAgICAgICAtLWo7XG4gICAgICAgICAgICByZXRbal1bMF0gPSBBMFtqXTtcbiAgICAgICAgfVxuICAgICAgICBpZihqPT09MCkgeyByZXRbMF1bMF0gPSBBMFswXTsgfVxuICAgIH1cbiAgICByZXR1cm4gcmV0O1xufVxubnVtZXJpYy5uZWd0cmFuc3Bvc2UgPSBmdW5jdGlvbiBuZWd0cmFuc3Bvc2UoeCkge1xuICAgIHZhciBpLGosbSA9IHgubGVuZ3RoLG4gPSB4WzBdLmxlbmd0aCwgcmV0PUFycmF5KG4pLEEwLEExLEJqO1xuICAgIGZvcihqPTA7ajxuO2orKykgcmV0W2pdID0gQXJyYXkobSk7XG4gICAgZm9yKGk9bS0xO2k+PTE7aS09Mikge1xuICAgICAgICBBMSA9IHhbaV07XG4gICAgICAgIEEwID0geFtpLTFdO1xuICAgICAgICBmb3Ioaj1uLTE7aj49MTstLWopIHtcbiAgICAgICAgICAgIEJqID0gcmV0W2pdOyBCaltpXSA9IC1BMVtqXTsgQmpbaS0xXSA9IC1BMFtqXTtcbiAgICAgICAgICAgIC0tajtcbiAgICAgICAgICAgIEJqID0gcmV0W2pdOyBCaltpXSA9IC1BMVtqXTsgQmpbaS0xXSA9IC1BMFtqXTtcbiAgICAgICAgfVxuICAgICAgICBpZihqPT09MCkge1xuICAgICAgICAgICAgQmogPSByZXRbMF07IEJqW2ldID0gLUExWzBdOyBCaltpLTFdID0gLUEwWzBdO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmKGk9PT0wKSB7XG4gICAgICAgIEEwID0geFswXTtcbiAgICAgICAgZm9yKGo9bi0xO2o+PTE7LS1qKSB7XG4gICAgICAgICAgICByZXRbal1bMF0gPSAtQTBbal07XG4gICAgICAgICAgICAtLWo7XG4gICAgICAgICAgICByZXRbal1bMF0gPSAtQTBbal07XG4gICAgICAgIH1cbiAgICAgICAgaWYoaj09PTApIHsgcmV0WzBdWzBdID0gLUEwWzBdOyB9XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG59XG5cbm51bWVyaWMuX3JhbmRvbSA9IGZ1bmN0aW9uIF9yYW5kb20ocyxrKSB7XG4gICAgdmFyIGksbj1zW2tdLHJldD1BcnJheShuKSwgcm5kO1xuICAgIGlmKGsgPT09IHMubGVuZ3RoLTEpIHtcbiAgICAgICAgcm5kID0gTWF0aC5yYW5kb207XG4gICAgICAgIGZvcihpPW4tMTtpPj0xO2ktPTIpIHtcbiAgICAgICAgICAgIHJldFtpXSA9IHJuZCgpO1xuICAgICAgICAgICAgcmV0W2ktMV0gPSBybmQoKTtcbiAgICAgICAgfVxuICAgICAgICBpZihpPT09MCkgeyByZXRbMF0gPSBybmQoKTsgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbiAgICBmb3IoaT1uLTE7aT49MDtpLS0pIHJldFtpXSA9IF9yYW5kb20ocyxrKzEpO1xuICAgIHJldHVybiByZXQ7XG59XG5udW1lcmljLnJhbmRvbSA9IGZ1bmN0aW9uIHJhbmRvbShzKSB7IHJldHVybiBudW1lcmljLl9yYW5kb20ocywwKTsgfVxuXG5udW1lcmljLm5vcm0yID0gZnVuY3Rpb24gbm9ybTIoeCkgeyByZXR1cm4gTWF0aC5zcXJ0KG51bWVyaWMubm9ybTJTcXVhcmVkKHgpKTsgfVxuXG5udW1lcmljLmxpbnNwYWNlID0gZnVuY3Rpb24gbGluc3BhY2UoYSxiLG4pIHtcbiAgICBpZih0eXBlb2YgbiA9PT0gXCJ1bmRlZmluZWRcIikgbiA9IE1hdGgubWF4KE1hdGgucm91bmQoYi1hKSsxLDEpO1xuICAgIGlmKG48MikgeyByZXR1cm4gbj09PTE/W2FdOltdOyB9XG4gICAgdmFyIGkscmV0ID0gQXJyYXkobik7XG4gICAgbi0tO1xuICAgIGZvcihpPW47aT49MDtpLS0pIHsgcmV0W2ldID0gKGkqYisobi1pKSphKS9uOyB9XG4gICAgcmV0dXJuIHJldDtcbn1cblxubnVtZXJpYy5nZXRCbG9jayA9IGZ1bmN0aW9uIGdldEJsb2NrKHgsZnJvbSx0bykge1xuICAgIHZhciBzID0gbnVtZXJpYy5kaW0oeCk7XG4gICAgZnVuY3Rpb24gZm9vKHgsaykge1xuICAgICAgICB2YXIgaSxhID0gZnJvbVtrXSwgbiA9IHRvW2tdLWEsIHJldCA9IEFycmF5KG4pO1xuICAgICAgICBpZihrID09PSBzLmxlbmd0aC0xKSB7XG4gICAgICAgICAgICBmb3IoaT1uO2k+PTA7aS0tKSB7IHJldFtpXSA9IHhbaSthXTsgfVxuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfVxuICAgICAgICBmb3IoaT1uO2k+PTA7aS0tKSB7IHJldFtpXSA9IGZvbyh4W2krYV0saysxKTsgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbiAgICByZXR1cm4gZm9vKHgsMCk7XG59XG5cbm51bWVyaWMuc2V0QmxvY2sgPSBmdW5jdGlvbiBzZXRCbG9jayh4LGZyb20sdG8sQikge1xuICAgIHZhciBzID0gbnVtZXJpYy5kaW0oeCk7XG4gICAgZnVuY3Rpb24gZm9vKHgseSxrKSB7XG4gICAgICAgIHZhciBpLGEgPSBmcm9tW2tdLCBuID0gdG9ba10tYTtcbiAgICAgICAgaWYoayA9PT0gcy5sZW5ndGgtMSkgeyBmb3IoaT1uO2k+PTA7aS0tKSB7IHhbaSthXSA9IHlbaV07IH0gfVxuICAgICAgICBmb3IoaT1uO2k+PTA7aS0tKSB7IGZvbyh4W2krYV0seVtpXSxrKzEpOyB9XG4gICAgfVxuICAgIGZvbyh4LEIsMCk7XG4gICAgcmV0dXJuIHg7XG59XG5cbm51bWVyaWMuZ2V0UmFuZ2UgPSBmdW5jdGlvbiBnZXRSYW5nZShBLEksSikge1xuICAgIHZhciBtID0gSS5sZW5ndGgsIG4gPSBKLmxlbmd0aDtcbiAgICB2YXIgaSxqO1xuICAgIHZhciBCID0gQXJyYXkobSksIEJpLCBBSTtcbiAgICBmb3IoaT1tLTE7aSE9PS0xOy0taSkge1xuICAgICAgICBCW2ldID0gQXJyYXkobik7XG4gICAgICAgIEJpID0gQltpXTtcbiAgICAgICAgQUkgPSBBW0lbaV1dO1xuICAgICAgICBmb3Ioaj1uLTE7aiE9PS0xOy0taikgQmlbal0gPSBBSVtKW2pdXTtcbiAgICB9XG4gICAgcmV0dXJuIEI7XG59XG5cbm51bWVyaWMuYmxvY2tNYXRyaXggPSBmdW5jdGlvbiBibG9ja01hdHJpeChYKSB7XG4gICAgdmFyIHMgPSBudW1lcmljLmRpbShYKTtcbiAgICBpZihzLmxlbmd0aDw0KSByZXR1cm4gbnVtZXJpYy5ibG9ja01hdHJpeChbWF0pO1xuICAgIHZhciBtPXNbMF0sbj1zWzFdLE0sTixpLGosWGlqO1xuICAgIE0gPSAwOyBOID0gMDtcbiAgICBmb3IoaT0wO2k8bTsrK2kpIE0rPVhbaV1bMF0ubGVuZ3RoO1xuICAgIGZvcihqPTA7ajxuOysraikgTis9WFswXVtqXVswXS5sZW5ndGg7XG4gICAgdmFyIFogPSBBcnJheShNKTtcbiAgICBmb3IoaT0wO2k8TTsrK2kpIFpbaV0gPSBBcnJheShOKTtcbiAgICB2YXIgST0wLEosWkksayxsLFhpams7XG4gICAgZm9yKGk9MDtpPG07KytpKSB7XG4gICAgICAgIEo9TjtcbiAgICAgICAgZm9yKGo9bi0xO2ohPT0tMTstLWopIHtcbiAgICAgICAgICAgIFhpaiA9IFhbaV1bal07XG4gICAgICAgICAgICBKIC09IFhpalswXS5sZW5ndGg7XG4gICAgICAgICAgICBmb3Ioaz1YaWoubGVuZ3RoLTE7ayE9PS0xOy0taykge1xuICAgICAgICAgICAgICAgIFhpamsgPSBYaWpba107XG4gICAgICAgICAgICAgICAgWkkgPSBaW0kra107XG4gICAgICAgICAgICAgICAgZm9yKGwgPSBYaWprLmxlbmd0aC0xO2whPT0tMTstLWwpIFpJW0orbF0gPSBYaWprW2xdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIEkgKz0gWFtpXVswXS5sZW5ndGg7XG4gICAgfVxuICAgIHJldHVybiBaO1xufVxuXG5udW1lcmljLnRlbnNvciA9IGZ1bmN0aW9uIHRlbnNvcih4LHkpIHtcbiAgICBpZih0eXBlb2YgeCA9PT0gXCJudW1iZXJcIiB8fCB0eXBlb2YgeSA9PT0gXCJudW1iZXJcIikgcmV0dXJuIG51bWVyaWMubXVsKHgseSk7XG4gICAgdmFyIHMxID0gbnVtZXJpYy5kaW0oeCksIHMyID0gbnVtZXJpYy5kaW0oeSk7XG4gICAgaWYoczEubGVuZ3RoICE9PSAxIHx8IHMyLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ251bWVyaWM6IHRlbnNvciBwcm9kdWN0IGlzIG9ubHkgZGVmaW5lZCBmb3IgdmVjdG9ycycpO1xuICAgIH1cbiAgICB2YXIgbSA9IHMxWzBdLCBuID0gczJbMF0sIEEgPSBBcnJheShtKSwgQWksIGksaix4aTtcbiAgICBmb3IoaT1tLTE7aT49MDtpLS0pIHtcbiAgICAgICAgQWkgPSBBcnJheShuKTtcbiAgICAgICAgeGkgPSB4W2ldO1xuICAgICAgICBmb3Ioaj1uLTE7aj49MzstLWopIHtcbiAgICAgICAgICAgIEFpW2pdID0geGkgKiB5W2pdO1xuICAgICAgICAgICAgLS1qO1xuICAgICAgICAgICAgQWlbal0gPSB4aSAqIHlbal07XG4gICAgICAgICAgICAtLWo7XG4gICAgICAgICAgICBBaVtqXSA9IHhpICogeVtqXTtcbiAgICAgICAgICAgIC0tajtcbiAgICAgICAgICAgIEFpW2pdID0geGkgKiB5W2pdO1xuICAgICAgICB9XG4gICAgICAgIHdoaWxlKGo+PTApIHsgQWlbal0gPSB4aSAqIHlbal07IC0tajsgfVxuICAgICAgICBBW2ldID0gQWk7XG4gICAgfVxuICAgIHJldHVybiBBO1xufVxuXG4vLyAzLiBUaGUgVGVuc29yIHR5cGUgVFxubnVtZXJpYy5UID0gZnVuY3Rpb24gVCh4LHkpIHsgdGhpcy54ID0geDsgdGhpcy55ID0geTsgfVxubnVtZXJpYy50ID0gZnVuY3Rpb24gdCh4LHkpIHsgcmV0dXJuIG5ldyBudW1lcmljLlQoeCx5KTsgfVxuXG5udW1lcmljLlRiaW5vcCA9IGZ1bmN0aW9uIFRiaW5vcChycixyYyxjcixjYyxzZXR1cCkge1xuICAgIHZhciBpbyA9IG51bWVyaWMuaW5kZXhPZjtcbiAgICBpZih0eXBlb2Ygc2V0dXAgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgdmFyIGs7XG4gICAgICAgIHNldHVwID0gJyc7XG4gICAgICAgIGZvcihrIGluIG51bWVyaWMpIHtcbiAgICAgICAgICAgIGlmKG51bWVyaWMuaGFzT3duUHJvcGVydHkoaykgJiYgKHJyLmluZGV4T2Yoayk+PTAgfHwgcmMuaW5kZXhPZihrKT49MCB8fCBjci5pbmRleE9mKGspPj0wIHx8IGNjLmluZGV4T2Yoayk+PTApICYmIGsubGVuZ3RoPjEpIHtcbiAgICAgICAgICAgICAgICBzZXR1cCArPSAndmFyICcraysnID0gbnVtZXJpYy4nK2srJztcXG4nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBGdW5jdGlvbihbJ3knXSxcbiAgICAgICAgICAgICd2YXIgeCA9IHRoaXM7XFxuJytcbiAgICAgICAgICAgICdpZighKHkgaW5zdGFuY2VvZiBudW1lcmljLlQpKSB7IHkgPSBuZXcgbnVtZXJpYy5UKHkpOyB9XFxuJytcbiAgICAgICAgICAgIHNldHVwKydcXG4nK1xuICAgICAgICAgICAgJ2lmKHgueSkgeycrXG4gICAgICAgICAgICAnICBpZih5LnkpIHsnK1xuICAgICAgICAgICAgJyAgICByZXR1cm4gbmV3IG51bWVyaWMuVCgnK2NjKycpO1xcbicrXG4gICAgICAgICAgICAnICB9XFxuJytcbiAgICAgICAgICAgICcgIHJldHVybiBuZXcgbnVtZXJpYy5UKCcrY3IrJyk7XFxuJytcbiAgICAgICAgICAgICd9XFxuJytcbiAgICAgICAgICAgICdpZih5LnkpIHtcXG4nK1xuICAgICAgICAgICAgJyAgcmV0dXJuIG5ldyBudW1lcmljLlQoJytyYysnKTtcXG4nK1xuICAgICAgICAgICAgJ31cXG4nK1xuICAgICAgICAgICAgJ3JldHVybiBuZXcgbnVtZXJpYy5UKCcrcnIrJyk7XFxuJ1xuICAgICk7XG59XG5cbm51bWVyaWMuVC5wcm90b3R5cGUuYWRkID0gbnVtZXJpYy5UYmlub3AoXG4gICAgICAgICdhZGQoeC54LHkueCknLFxuICAgICAgICAnYWRkKHgueCx5LngpLHkueScsXG4gICAgICAgICdhZGQoeC54LHkueCkseC55JyxcbiAgICAgICAgJ2FkZCh4LngseS54KSxhZGQoeC55LHkueSknKTtcbm51bWVyaWMuVC5wcm90b3R5cGUuc3ViID0gbnVtZXJpYy5UYmlub3AoXG4gICAgICAgICdzdWIoeC54LHkueCknLFxuICAgICAgICAnc3ViKHgueCx5LngpLG5lZyh5LnkpJyxcbiAgICAgICAgJ3N1Yih4LngseS54KSx4LnknLFxuICAgICAgICAnc3ViKHgueCx5LngpLHN1Yih4LnkseS55KScpO1xubnVtZXJpYy5ULnByb3RvdHlwZS5tdWwgPSBudW1lcmljLlRiaW5vcChcbiAgICAgICAgJ211bCh4LngseS54KScsXG4gICAgICAgICdtdWwoeC54LHkueCksbXVsKHgueCx5LnkpJyxcbiAgICAgICAgJ211bCh4LngseS54KSxtdWwoeC55LHkueCknLFxuICAgICAgICAnc3ViKG11bCh4LngseS54KSxtdWwoeC55LHkueSkpLGFkZChtdWwoeC54LHkueSksbXVsKHgueSx5LngpKScpO1xuXG5udW1lcmljLlQucHJvdG90eXBlLnJlY2lwcm9jYWwgPSBmdW5jdGlvbiByZWNpcHJvY2FsKCkge1xuICAgIHZhciBtdWwgPSBudW1lcmljLm11bCwgZGl2ID0gbnVtZXJpYy5kaXY7XG4gICAgaWYodGhpcy55KSB7XG4gICAgICAgIHZhciBkID0gbnVtZXJpYy5hZGQobXVsKHRoaXMueCx0aGlzLngpLG11bCh0aGlzLnksdGhpcy55KSk7XG4gICAgICAgIHJldHVybiBuZXcgbnVtZXJpYy5UKGRpdih0aGlzLngsZCksZGl2KG51bWVyaWMubmVnKHRoaXMueSksZCkpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFQoZGl2KDEsdGhpcy54KSk7XG59XG5udW1lcmljLlQucHJvdG90eXBlLmRpdiA9IGZ1bmN0aW9uIGRpdih5KSB7XG4gICAgaWYoISh5IGluc3RhbmNlb2YgbnVtZXJpYy5UKSkgeSA9IG5ldyBudW1lcmljLlQoeSk7XG4gICAgaWYoeS55KSB7IHJldHVybiB0aGlzLm11bCh5LnJlY2lwcm9jYWwoKSk7IH1cbiAgICB2YXIgZGl2ID0gbnVtZXJpYy5kaXY7XG4gICAgaWYodGhpcy55KSB7IHJldHVybiBuZXcgbnVtZXJpYy5UKGRpdih0aGlzLngseS54KSxkaXYodGhpcy55LHkueCkpOyB9XG4gICAgcmV0dXJuIG5ldyBudW1lcmljLlQoZGl2KHRoaXMueCx5LngpKTtcbn1cbm51bWVyaWMuVC5wcm90b3R5cGUuZG90ID0gbnVtZXJpYy5UYmlub3AoXG4gICAgICAgICdkb3QoeC54LHkueCknLFxuICAgICAgICAnZG90KHgueCx5LngpLGRvdCh4LngseS55KScsXG4gICAgICAgICdkb3QoeC54LHkueCksZG90KHgueSx5LngpJyxcbiAgICAgICAgJ3N1Yihkb3QoeC54LHkueCksZG90KHgueSx5LnkpKSxhZGQoZG90KHgueCx5LnkpLGRvdCh4LnkseS54KSknXG4gICAgICAgICk7XG5udW1lcmljLlQucHJvdG90eXBlLnRyYW5zcG9zZSA9IGZ1bmN0aW9uIHRyYW5zcG9zZSgpIHtcbiAgICB2YXIgdCA9IG51bWVyaWMudHJhbnNwb3NlLCB4ID0gdGhpcy54LCB5ID0gdGhpcy55O1xuICAgIGlmKHkpIHsgcmV0dXJuIG5ldyBudW1lcmljLlQodCh4KSx0KHkpKTsgfVxuICAgIHJldHVybiBuZXcgbnVtZXJpYy5UKHQoeCkpO1xufVxubnVtZXJpYy5ULnByb3RvdHlwZS50cmFuc2p1Z2F0ZSA9IGZ1bmN0aW9uIHRyYW5zanVnYXRlKCkge1xuICAgIHZhciB0ID0gbnVtZXJpYy50cmFuc3Bvc2UsIHggPSB0aGlzLngsIHkgPSB0aGlzLnk7XG4gICAgaWYoeSkgeyByZXR1cm4gbmV3IG51bWVyaWMuVCh0KHgpLG51bWVyaWMubmVndHJhbnNwb3NlKHkpKTsgfVxuICAgIHJldHVybiBuZXcgbnVtZXJpYy5UKHQoeCkpO1xufVxubnVtZXJpYy5UdW5vcCA9IGZ1bmN0aW9uIFR1bm9wKHIsYyxzKSB7XG4gICAgaWYodHlwZW9mIHMgIT09IFwic3RyaW5nXCIpIHsgcyA9ICcnOyB9XG4gICAgcmV0dXJuIEZ1bmN0aW9uKFxuICAgICAgICAgICAgJ3ZhciB4ID0gdGhpcztcXG4nK1xuICAgICAgICAgICAgcysnXFxuJytcbiAgICAgICAgICAgICdpZih4LnkpIHsnK1xuICAgICAgICAgICAgJyAgJytjKyc7XFxuJytcbiAgICAgICAgICAgICd9XFxuJytcbiAgICAgICAgICAgIHIrJztcXG4nXG4gICAgKTtcbn1cblxubnVtZXJpYy5ULnByb3RvdHlwZS5leHAgPSBudW1lcmljLlR1bm9wKFxuICAgICAgICAncmV0dXJuIG5ldyBudW1lcmljLlQoZXgpJyxcbiAgICAgICAgJ3JldHVybiBuZXcgbnVtZXJpYy5UKG11bChjb3MoeC55KSxleCksbXVsKHNpbih4LnkpLGV4KSknLFxuICAgICAgICAndmFyIGV4ID0gbnVtZXJpYy5leHAoeC54KSwgY29zID0gbnVtZXJpYy5jb3MsIHNpbiA9IG51bWVyaWMuc2luLCBtdWwgPSBudW1lcmljLm11bDsnKTtcbm51bWVyaWMuVC5wcm90b3R5cGUuY29uaiA9IG51bWVyaWMuVHVub3AoXG4gICAgICAgICdyZXR1cm4gbmV3IG51bWVyaWMuVCh4LngpOycsXG4gICAgICAgICdyZXR1cm4gbmV3IG51bWVyaWMuVCh4LngsbnVtZXJpYy5uZWcoeC55KSk7Jyk7XG5udW1lcmljLlQucHJvdG90eXBlLm5lZyA9IG51bWVyaWMuVHVub3AoXG4gICAgICAgICdyZXR1cm4gbmV3IG51bWVyaWMuVChuZWcoeC54KSk7JyxcbiAgICAgICAgJ3JldHVybiBuZXcgbnVtZXJpYy5UKG5lZyh4LngpLG5lZyh4LnkpKTsnLFxuICAgICAgICAndmFyIG5lZyA9IG51bWVyaWMubmVnOycpO1xubnVtZXJpYy5ULnByb3RvdHlwZS5zaW4gPSBudW1lcmljLlR1bm9wKFxuICAgICAgICAncmV0dXJuIG5ldyBudW1lcmljLlQobnVtZXJpYy5zaW4oeC54KSknLFxuICAgICAgICAncmV0dXJuIHguZXhwKCkuc3ViKHgubmVnKCkuZXhwKCkpLmRpdihuZXcgbnVtZXJpYy5UKDAsMikpOycpO1xubnVtZXJpYy5ULnByb3RvdHlwZS5jb3MgPSBudW1lcmljLlR1bm9wKFxuICAgICAgICAncmV0dXJuIG5ldyBudW1lcmljLlQobnVtZXJpYy5jb3MoeC54KSknLFxuICAgICAgICAncmV0dXJuIHguZXhwKCkuYWRkKHgubmVnKCkuZXhwKCkpLmRpdigyKTsnKTtcbm51bWVyaWMuVC5wcm90b3R5cGUuYWJzID0gbnVtZXJpYy5UdW5vcChcbiAgICAgICAgJ3JldHVybiBuZXcgbnVtZXJpYy5UKG51bWVyaWMuYWJzKHgueCkpOycsXG4gICAgICAgICdyZXR1cm4gbmV3IG51bWVyaWMuVChudW1lcmljLnNxcnQobnVtZXJpYy5hZGQobXVsKHgueCx4LngpLG11bCh4LnkseC55KSkpKTsnLFxuICAgICAgICAndmFyIG11bCA9IG51bWVyaWMubXVsOycpO1xubnVtZXJpYy5ULnByb3RvdHlwZS5sb2cgPSBudW1lcmljLlR1bm9wKFxuICAgICAgICAncmV0dXJuIG5ldyBudW1lcmljLlQobnVtZXJpYy5sb2coeC54KSk7JyxcbiAgICAgICAgJ3ZhciB0aGV0YSA9IG5ldyBudW1lcmljLlQobnVtZXJpYy5hdGFuMih4LnkseC54KSksIHIgPSB4LmFicygpO1xcbicrXG4gICAgICAgICdyZXR1cm4gbmV3IG51bWVyaWMuVChudW1lcmljLmxvZyhyLngpLHRoZXRhLngpOycpO1xubnVtZXJpYy5ULnByb3RvdHlwZS5ub3JtMiA9IG51bWVyaWMuVHVub3AoXG4gICAgICAgICdyZXR1cm4gbnVtZXJpYy5ub3JtMih4LngpOycsXG4gICAgICAgICd2YXIgZiA9IG51bWVyaWMubm9ybTJTcXVhcmVkO1xcbicrXG4gICAgICAgICdyZXR1cm4gTWF0aC5zcXJ0KGYoeC54KStmKHgueSkpOycpO1xubnVtZXJpYy5ULnByb3RvdHlwZS5pbnYgPSBmdW5jdGlvbiBpbnYoKSB7XG4gICAgdmFyIEEgPSB0aGlzO1xuICAgIGlmKHR5cGVvZiBBLnkgPT09IFwidW5kZWZpbmVkXCIpIHsgcmV0dXJuIG5ldyBudW1lcmljLlQobnVtZXJpYy5pbnYoQS54KSk7IH1cbiAgICB2YXIgbiA9IEEueC5sZW5ndGgsIGksIGosIGs7XG4gICAgdmFyIFJ4ID0gbnVtZXJpYy5pZGVudGl0eShuKSxSeSA9IG51bWVyaWMucmVwKFtuLG5dLDApO1xuICAgIHZhciBBeCA9IG51bWVyaWMuY2xvbmUoQS54KSwgQXkgPSBudW1lcmljLmNsb25lKEEueSk7XG4gICAgdmFyIEFpeCwgQWl5LCBBangsIEFqeSwgUml4LCBSaXksIFJqeCwgUmp5O1xuICAgIHZhciBpLGosayxkLGQxLGF4LGF5LGJ4LGJ5LHRlbXA7XG4gICAgZm9yKGk9MDtpPG47aSsrKSB7XG4gICAgICAgIGF4ID0gQXhbaV1baV07IGF5ID0gQXlbaV1baV07XG4gICAgICAgIGQgPSBheCpheCtheSpheTtcbiAgICAgICAgayA9IGk7XG4gICAgICAgIGZvcihqPWkrMTtqPG47aisrKSB7XG4gICAgICAgICAgICBheCA9IEF4W2pdW2ldOyBheSA9IEF5W2pdW2ldO1xuICAgICAgICAgICAgZDEgPSBheCpheCtheSpheTtcbiAgICAgICAgICAgIGlmKGQxID4gZCkgeyBrPWo7IGQgPSBkMTsgfVxuICAgICAgICB9XG4gICAgICAgIGlmKGshPT1pKSB7XG4gICAgICAgICAgICB0ZW1wID0gQXhbaV07IEF4W2ldID0gQXhba107IEF4W2tdID0gdGVtcDtcbiAgICAgICAgICAgIHRlbXAgPSBBeVtpXTsgQXlbaV0gPSBBeVtrXTsgQXlba10gPSB0ZW1wO1xuICAgICAgICAgICAgdGVtcCA9IFJ4W2ldOyBSeFtpXSA9IFJ4W2tdOyBSeFtrXSA9IHRlbXA7XG4gICAgICAgICAgICB0ZW1wID0gUnlbaV07IFJ5W2ldID0gUnlba107IFJ5W2tdID0gdGVtcDtcbiAgICAgICAgfVxuICAgICAgICBBaXggPSBBeFtpXTsgQWl5ID0gQXlbaV07XG4gICAgICAgIFJpeCA9IFJ4W2ldOyBSaXkgPSBSeVtpXTtcbiAgICAgICAgYXggPSBBaXhbaV07IGF5ID0gQWl5W2ldO1xuICAgICAgICBmb3Ioaj1pKzE7ajxuO2orKykge1xuICAgICAgICAgICAgYnggPSBBaXhbal07IGJ5ID0gQWl5W2pdO1xuICAgICAgICAgICAgQWl4W2pdID0gKGJ4KmF4K2J5KmF5KS9kO1xuICAgICAgICAgICAgQWl5W2pdID0gKGJ5KmF4LWJ4KmF5KS9kO1xuICAgICAgICB9XG4gICAgICAgIGZvcihqPTA7ajxuO2orKykge1xuICAgICAgICAgICAgYnggPSBSaXhbal07IGJ5ID0gUml5W2pdO1xuICAgICAgICAgICAgUml4W2pdID0gKGJ4KmF4K2J5KmF5KS9kO1xuICAgICAgICAgICAgUml5W2pdID0gKGJ5KmF4LWJ4KmF5KS9kO1xuICAgICAgICB9XG4gICAgICAgIGZvcihqPWkrMTtqPG47aisrKSB7XG4gICAgICAgICAgICBBanggPSBBeFtqXTsgQWp5ID0gQXlbal07XG4gICAgICAgICAgICBSanggPSBSeFtqXTsgUmp5ID0gUnlbal07XG4gICAgICAgICAgICBheCA9IEFqeFtpXTsgYXkgPSBBanlbaV07XG4gICAgICAgICAgICBmb3Ioaz1pKzE7azxuO2srKykge1xuICAgICAgICAgICAgICAgIGJ4ID0gQWl4W2tdOyBieSA9IEFpeVtrXTtcbiAgICAgICAgICAgICAgICBBanhba10gLT0gYngqYXgtYnkqYXk7XG4gICAgICAgICAgICAgICAgQWp5W2tdIC09IGJ5KmF4K2J4KmF5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yKGs9MDtrPG47aysrKSB7XG4gICAgICAgICAgICAgICAgYnggPSBSaXhba107IGJ5ID0gUml5W2tdO1xuICAgICAgICAgICAgICAgIFJqeFtrXSAtPSBieCpheC1ieSpheTtcbiAgICAgICAgICAgICAgICBSanlba10gLT0gYnkqYXgrYngqYXk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9yKGk9bi0xO2k+MDtpLS0pIHtcbiAgICAgICAgUml4ID0gUnhbaV07IFJpeSA9IFJ5W2ldO1xuICAgICAgICBmb3Ioaj1pLTE7aj49MDtqLS0pIHtcbiAgICAgICAgICAgIFJqeCA9IFJ4W2pdOyBSankgPSBSeVtqXTtcbiAgICAgICAgICAgIGF4ID0gQXhbal1baV07IGF5ID0gQXlbal1baV07XG4gICAgICAgICAgICBmb3Ioaz1uLTE7az49MDtrLS0pIHtcbiAgICAgICAgICAgICAgICBieCA9IFJpeFtrXTsgYnkgPSBSaXlba107XG4gICAgICAgICAgICAgICAgUmp4W2tdIC09IGF4KmJ4IC0gYXkqYnk7XG4gICAgICAgICAgICAgICAgUmp5W2tdIC09IGF4KmJ5ICsgYXkqYng7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ldyBudW1lcmljLlQoUngsUnkpO1xufVxubnVtZXJpYy5ULnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiBnZXQoaSkge1xuICAgIHZhciB4ID0gdGhpcy54LCB5ID0gdGhpcy55LCBrID0gMCwgaWssIG4gPSBpLmxlbmd0aDtcbiAgICBpZih5KSB7XG4gICAgICAgIHdoaWxlKGs8bikge1xuICAgICAgICAgICAgaWsgPSBpW2tdO1xuICAgICAgICAgICAgeCA9IHhbaWtdO1xuICAgICAgICAgICAgeSA9IHlbaWtdO1xuICAgICAgICAgICAgaysrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgbnVtZXJpYy5UKHgseSk7XG4gICAgfVxuICAgIHdoaWxlKGs8bikge1xuICAgICAgICBpayA9IGlba107XG4gICAgICAgIHggPSB4W2lrXTtcbiAgICAgICAgaysrO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IG51bWVyaWMuVCh4KTtcbn1cbm51bWVyaWMuVC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gc2V0KGksdikge1xuICAgIHZhciB4ID0gdGhpcy54LCB5ID0gdGhpcy55LCBrID0gMCwgaWssIG4gPSBpLmxlbmd0aCwgdnggPSB2LngsIHZ5ID0gdi55O1xuICAgIGlmKG49PT0wKSB7XG4gICAgICAgIGlmKHZ5KSB7IHRoaXMueSA9IHZ5OyB9XG4gICAgICAgIGVsc2UgaWYoeSkgeyB0aGlzLnkgPSB1bmRlZmluZWQ7IH1cbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGlmKHZ5KSB7XG4gICAgICAgIGlmKHkpIHsgLyogb2sgKi8gfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHkgPSBudW1lcmljLnJlcChudW1lcmljLmRpbSh4KSwwKTtcbiAgICAgICAgICAgIHRoaXMueSA9IHk7XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUoazxuLTEpIHtcbiAgICAgICAgICAgIGlrID0gaVtrXTtcbiAgICAgICAgICAgIHggPSB4W2lrXTtcbiAgICAgICAgICAgIHkgPSB5W2lrXTtcbiAgICAgICAgICAgIGsrKztcbiAgICAgICAgfVxuICAgICAgICBpayA9IGlba107XG4gICAgICAgIHhbaWtdID0gdng7XG4gICAgICAgIHlbaWtdID0gdnk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBpZih5KSB7XG4gICAgICAgIHdoaWxlKGs8bi0xKSB7XG4gICAgICAgICAgICBpayA9IGlba107XG4gICAgICAgICAgICB4ID0geFtpa107XG4gICAgICAgICAgICB5ID0geVtpa107XG4gICAgICAgICAgICBrKys7XG4gICAgICAgIH1cbiAgICAgICAgaWsgPSBpW2tdO1xuICAgICAgICB4W2lrXSA9IHZ4O1xuICAgICAgICBpZih2eCBpbnN0YW5jZW9mIEFycmF5KSB5W2lrXSA9IG51bWVyaWMucmVwKG51bWVyaWMuZGltKHZ4KSwwKTtcbiAgICAgICAgZWxzZSB5W2lrXSA9IDA7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICB3aGlsZShrPG4tMSkge1xuICAgICAgICBpayA9IGlba107XG4gICAgICAgIHggPSB4W2lrXTtcbiAgICAgICAgaysrO1xuICAgIH1cbiAgICBpayA9IGlba107XG4gICAgeFtpa10gPSB2eDtcbiAgICByZXR1cm4gdGhpcztcbn1cbm51bWVyaWMuVC5wcm90b3R5cGUuZ2V0Um93cyA9IGZ1bmN0aW9uIGdldFJvd3MoaTAsaTEpIHtcbiAgICB2YXIgbiA9IGkxLWkwKzEsIGo7XG4gICAgdmFyIHJ4ID0gQXJyYXkobiksIHJ5LCB4ID0gdGhpcy54LCB5ID0gdGhpcy55O1xuICAgIGZvcihqPWkwO2o8PWkxO2orKykgeyByeFtqLWkwXSA9IHhbal07IH1cbiAgICBpZih5KSB7XG4gICAgICAgIHJ5ID0gQXJyYXkobik7XG4gICAgICAgIGZvcihqPWkwO2o8PWkxO2orKykgeyByeVtqLWkwXSA9IHlbal07IH1cbiAgICAgICAgcmV0dXJuIG5ldyBudW1lcmljLlQocngscnkpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IG51bWVyaWMuVChyeCk7XG59XG5udW1lcmljLlQucHJvdG90eXBlLnNldFJvd3MgPSBmdW5jdGlvbiBzZXRSb3dzKGkwLGkxLEEpIHtcbiAgICB2YXIgajtcbiAgICB2YXIgcnggPSB0aGlzLngsIHJ5ID0gdGhpcy55LCB4ID0gQS54LCB5ID0gQS55O1xuICAgIGZvcihqPWkwO2o8PWkxO2orKykgeyByeFtqXSA9IHhbai1pMF07IH1cbiAgICBpZih5KSB7XG4gICAgICAgIGlmKCFyeSkgeyByeSA9IG51bWVyaWMucmVwKG51bWVyaWMuZGltKHJ4KSwwKTsgdGhpcy55ID0gcnk7IH1cbiAgICAgICAgZm9yKGo9aTA7ajw9aTE7aisrKSB7IHJ5W2pdID0geVtqLWkwXTsgfVxuICAgIH0gZWxzZSBpZihyeSkge1xuICAgICAgICBmb3Ioaj1pMDtqPD1pMTtqKyspIHsgcnlbal0gPSBudW1lcmljLnJlcChbeFtqLWkwXS5sZW5ndGhdLDApOyB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufVxubnVtZXJpYy5ULnByb3RvdHlwZS5nZXRSb3cgPSBmdW5jdGlvbiBnZXRSb3coaykge1xuICAgIHZhciB4ID0gdGhpcy54LCB5ID0gdGhpcy55O1xuICAgIGlmKHkpIHsgcmV0dXJuIG5ldyBudW1lcmljLlQoeFtrXSx5W2tdKTsgfVxuICAgIHJldHVybiBuZXcgbnVtZXJpYy5UKHhba10pO1xufVxubnVtZXJpYy5ULnByb3RvdHlwZS5zZXRSb3cgPSBmdW5jdGlvbiBzZXRSb3coaSx2KSB7XG4gICAgdmFyIHJ4ID0gdGhpcy54LCByeSA9IHRoaXMueSwgeCA9IHYueCwgeSA9IHYueTtcbiAgICByeFtpXSA9IHg7XG4gICAgaWYoeSkge1xuICAgICAgICBpZighcnkpIHsgcnkgPSBudW1lcmljLnJlcChudW1lcmljLmRpbShyeCksMCk7IHRoaXMueSA9IHJ5OyB9XG4gICAgICAgIHJ5W2ldID0geTtcbiAgICB9IGVsc2UgaWYocnkpIHtcbiAgICAgICAgcnkgPSBudW1lcmljLnJlcChbeC5sZW5ndGhdLDApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn1cblxubnVtZXJpYy5ULnByb3RvdHlwZS5nZXRCbG9jayA9IGZ1bmN0aW9uIGdldEJsb2NrKGZyb20sdG8pIHtcbiAgICB2YXIgeCA9IHRoaXMueCwgeSA9IHRoaXMueSwgYiA9IG51bWVyaWMuZ2V0QmxvY2s7XG4gICAgaWYoeSkgeyByZXR1cm4gbmV3IG51bWVyaWMuVChiKHgsZnJvbSx0byksYih5LGZyb20sdG8pKTsgfVxuICAgIHJldHVybiBuZXcgbnVtZXJpYy5UKGIoeCxmcm9tLHRvKSk7XG59XG5udW1lcmljLlQucHJvdG90eXBlLnNldEJsb2NrID0gZnVuY3Rpb24gc2V0QmxvY2soZnJvbSx0byxBKSB7XG4gICAgaWYoIShBIGluc3RhbmNlb2YgbnVtZXJpYy5UKSkgQSA9IG5ldyBudW1lcmljLlQoQSk7XG4gICAgdmFyIHggPSB0aGlzLngsIHkgPSB0aGlzLnksIGIgPSBudW1lcmljLnNldEJsb2NrLCBBeCA9IEEueCwgQXkgPSBBLnk7XG4gICAgaWYoQXkpIHtcbiAgICAgICAgaWYoIXkpIHsgdGhpcy55ID0gbnVtZXJpYy5yZXAobnVtZXJpYy5kaW0odGhpcyksMCk7IHkgPSB0aGlzLnk7IH1cbiAgICAgICAgYih4LGZyb20sdG8sQXgpO1xuICAgICAgICBiKHksZnJvbSx0byxBeSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBiKHgsZnJvbSx0byxBeCk7XG4gICAgaWYoeSkgYih5LGZyb20sdG8sbnVtZXJpYy5yZXAobnVtZXJpYy5kaW0oQXgpLDApKTtcbn1cbm51bWVyaWMuVC5yZXAgPSBmdW5jdGlvbiByZXAocyx2KSB7XG4gICAgdmFyIFQgPSBudW1lcmljLlQ7XG4gICAgaWYoISh2IGluc3RhbmNlb2YgVCkpIHYgPSBuZXcgVCh2KTtcbiAgICB2YXIgeCA9IHYueCwgeSA9IHYueSwgciA9IG51bWVyaWMucmVwO1xuICAgIGlmKHkpIHJldHVybiBuZXcgVChyKHMseCkscihzLHkpKTtcbiAgICByZXR1cm4gbmV3IFQocihzLHgpKTtcbn1cbm51bWVyaWMuVC5kaWFnID0gZnVuY3Rpb24gZGlhZyhkKSB7XG4gICAgaWYoIShkIGluc3RhbmNlb2YgbnVtZXJpYy5UKSkgZCA9IG5ldyBudW1lcmljLlQoZCk7XG4gICAgdmFyIHggPSBkLngsIHkgPSBkLnksIGRpYWcgPSBudW1lcmljLmRpYWc7XG4gICAgaWYoeSkgcmV0dXJuIG5ldyBudW1lcmljLlQoZGlhZyh4KSxkaWFnKHkpKTtcbiAgICByZXR1cm4gbmV3IG51bWVyaWMuVChkaWFnKHgpKTtcbn1cbm51bWVyaWMuVC5laWcgPSBmdW5jdGlvbiBlaWcoKSB7XG4gICAgaWYodGhpcy55KSB7IHRocm93IG5ldyBFcnJvcignZWlnOiBub3QgaW1wbGVtZW50ZWQgZm9yIGNvbXBsZXggbWF0cmljZXMuJyk7IH1cbiAgICByZXR1cm4gbnVtZXJpYy5laWcodGhpcy54KTtcbn1cbm51bWVyaWMuVC5pZGVudGl0eSA9IGZ1bmN0aW9uIGlkZW50aXR5KG4pIHsgcmV0dXJuIG5ldyBudW1lcmljLlQobnVtZXJpYy5pZGVudGl0eShuKSk7IH1cbm51bWVyaWMuVC5wcm90b3R5cGUuZ2V0RGlhZyA9IGZ1bmN0aW9uIGdldERpYWcoKSB7XG4gICAgdmFyIG4gPSBudW1lcmljO1xuICAgIHZhciB4ID0gdGhpcy54LCB5ID0gdGhpcy55O1xuICAgIGlmKHkpIHsgcmV0dXJuIG5ldyBuLlQobi5nZXREaWFnKHgpLG4uZ2V0RGlhZyh5KSk7IH1cbiAgICByZXR1cm4gbmV3IG4uVChuLmdldERpYWcoeCkpO1xufVxuXG4vLyA0LiBFaWdlbnZhbHVlcyBvZiByZWFsIG1hdHJpY2VzXG5cbm51bWVyaWMuaG91c2UgPSBmdW5jdGlvbiBob3VzZSh4KSB7XG4gICAgdmFyIHYgPSBudW1lcmljLmNsb25lKHgpO1xuICAgIHZhciBzID0geFswXSA+PSAwID8gMSA6IC0xO1xuICAgIHZhciBhbHBoYSA9IHMqbnVtZXJpYy5ub3JtMih4KTtcbiAgICB2WzBdICs9IGFscGhhO1xuICAgIHZhciBmb28gPSBudW1lcmljLm5vcm0yKHYpO1xuICAgIGlmKGZvbyA9PT0gMCkgeyAvKiB0aGlzIHNob3VsZCBub3QgaGFwcGVuICovIHRocm93IG5ldyBFcnJvcignZWlnOiBpbnRlcm5hbCBlcnJvcicpOyB9XG4gICAgcmV0dXJuIG51bWVyaWMuZGl2KHYsZm9vKTtcbn1cblxubnVtZXJpYy50b1VwcGVySGVzc2VuYmVyZyA9IGZ1bmN0aW9uIHRvVXBwZXJIZXNzZW5iZXJnKG1lKSB7XG4gICAgdmFyIHMgPSBudW1lcmljLmRpbShtZSk7XG4gICAgaWYocy5sZW5ndGggIT09IDIgfHwgc1swXSAhPT0gc1sxXSkgeyB0aHJvdyBuZXcgRXJyb3IoJ251bWVyaWM6IHRvVXBwZXJIZXNzZW5iZXJnKCkgb25seSB3b3JrcyBvbiBzcXVhcmUgbWF0cmljZXMnKTsgfVxuICAgIHZhciBtID0gc1swXSwgaSxqLGsseCx2LEEgPSBudW1lcmljLmNsb25lKG1lKSxCLEMsQWksQ2ksUSA9IG51bWVyaWMuaWRlbnRpdHkobSksUWk7XG4gICAgZm9yKGo9MDtqPG0tMjtqKyspIHtcbiAgICAgICAgeCA9IEFycmF5KG0tai0xKTtcbiAgICAgICAgZm9yKGk9aisxO2k8bTtpKyspIHsgeFtpLWotMV0gPSBBW2ldW2pdOyB9XG4gICAgICAgIGlmKG51bWVyaWMubm9ybTIoeCk+MCkge1xuICAgICAgICAgICAgdiA9IG51bWVyaWMuaG91c2UoeCk7XG4gICAgICAgICAgICBCID0gbnVtZXJpYy5nZXRCbG9jayhBLFtqKzEsal0sW20tMSxtLTFdKTtcbiAgICAgICAgICAgIEMgPSBudW1lcmljLnRlbnNvcih2LG51bWVyaWMuZG90KHYsQikpO1xuICAgICAgICAgICAgZm9yKGk9aisxO2k8bTtpKyspIHsgQWkgPSBBW2ldOyBDaSA9IENbaS1qLTFdOyBmb3Ioaz1qO2s8bTtrKyspIEFpW2tdIC09IDIqQ2lbay1qXTsgfVxuICAgICAgICAgICAgQiA9IG51bWVyaWMuZ2V0QmxvY2soQSxbMCxqKzFdLFttLTEsbS0xXSk7XG4gICAgICAgICAgICBDID0gbnVtZXJpYy50ZW5zb3IobnVtZXJpYy5kb3QoQix2KSx2KTtcbiAgICAgICAgICAgIGZvcihpPTA7aTxtO2krKykgeyBBaSA9IEFbaV07IENpID0gQ1tpXTsgZm9yKGs9aisxO2s8bTtrKyspIEFpW2tdIC09IDIqQ2lbay1qLTFdOyB9XG4gICAgICAgICAgICBCID0gQXJyYXkobS1qLTEpO1xuICAgICAgICAgICAgZm9yKGk9aisxO2k8bTtpKyspIEJbaS1qLTFdID0gUVtpXTtcbiAgICAgICAgICAgIEMgPSBudW1lcmljLnRlbnNvcih2LG51bWVyaWMuZG90KHYsQikpO1xuICAgICAgICAgICAgZm9yKGk9aisxO2k8bTtpKyspIHsgUWkgPSBRW2ldOyBDaSA9IENbaS1qLTFdOyBmb3Ioaz0wO2s8bTtrKyspIFFpW2tdIC09IDIqQ2lba107IH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge0g6QSwgUTpRfTtcbn1cblxubnVtZXJpYy5lcHNpbG9uID0gMi4yMjA0NDYwNDkyNTAzMTNlLTE2O1xuXG5udW1lcmljLlFSRnJhbmNpcyA9IGZ1bmN0aW9uKEgsbWF4aXRlcikge1xuICAgIGlmKHR5cGVvZiBtYXhpdGVyID09PSBcInVuZGVmaW5lZFwiKSB7IG1heGl0ZXIgPSAxMDAwMDsgfVxuICAgIEggPSBudW1lcmljLmNsb25lKEgpO1xuICAgIHZhciBIMCA9IG51bWVyaWMuY2xvbmUoSCk7XG4gICAgdmFyIHMgPSBudW1lcmljLmRpbShIKSxtPXNbMF0seCx2LGEsYixjLGQsZGV0LHRyLCBIbG9jLCBRID0gbnVtZXJpYy5pZGVudGl0eShtKSwgUWksIEhpLCBCLCBDLCBDaSxpLGosayxpdGVyO1xuICAgIGlmKG08MykgeyByZXR1cm4ge1E6USwgQjpbIFswLG0tMV0gXX07IH1cbiAgICB2YXIgZXBzaWxvbiA9IG51bWVyaWMuZXBzaWxvbjtcbiAgICBmb3IoaXRlcj0wO2l0ZXI8bWF4aXRlcjtpdGVyKyspIHtcbiAgICAgICAgZm9yKGo9MDtqPG0tMTtqKyspIHtcbiAgICAgICAgICAgIGlmKE1hdGguYWJzKEhbaisxXVtqXSkgPCBlcHNpbG9uKihNYXRoLmFicyhIW2pdW2pdKStNYXRoLmFicyhIW2orMV1baisxXSkpKSB7XG4gICAgICAgICAgICAgICAgdmFyIFFIMSA9IG51bWVyaWMuUVJGcmFuY2lzKG51bWVyaWMuZ2V0QmxvY2soSCxbMCwwXSxbaixqXSksbWF4aXRlcik7XG4gICAgICAgICAgICAgICAgdmFyIFFIMiA9IG51bWVyaWMuUVJGcmFuY2lzKG51bWVyaWMuZ2V0QmxvY2soSCxbaisxLGorMV0sW20tMSxtLTFdKSxtYXhpdGVyKTtcbiAgICAgICAgICAgICAgICBCID0gQXJyYXkoaisxKTtcbiAgICAgICAgICAgICAgICBmb3IoaT0wO2k8PWo7aSsrKSB7IEJbaV0gPSBRW2ldOyB9XG4gICAgICAgICAgICAgICAgQyA9IG51bWVyaWMuZG90KFFIMS5RLEIpO1xuICAgICAgICAgICAgICAgIGZvcihpPTA7aTw9ajtpKyspIHsgUVtpXSA9IENbaV07IH1cbiAgICAgICAgICAgICAgICBCID0gQXJyYXkobS1qLTEpO1xuICAgICAgICAgICAgICAgIGZvcihpPWorMTtpPG07aSsrKSB7IEJbaS1qLTFdID0gUVtpXTsgfVxuICAgICAgICAgICAgICAgIEMgPSBudW1lcmljLmRvdChRSDIuUSxCKTtcbiAgICAgICAgICAgICAgICBmb3IoaT1qKzE7aTxtO2krKykgeyBRW2ldID0gQ1tpLWotMV07IH1cbiAgICAgICAgICAgICAgICByZXR1cm4ge1E6USxCOlFIMS5CLmNvbmNhdChudW1lcmljLmFkZChRSDIuQixqKzEpKX07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYSA9IEhbbS0yXVttLTJdOyBiID0gSFttLTJdW20tMV07XG4gICAgICAgIGMgPSBIW20tMV1bbS0yXTsgZCA9IEhbbS0xXVttLTFdO1xuICAgICAgICB0ciA9IGErZDtcbiAgICAgICAgZGV0ID0gKGEqZC1iKmMpO1xuICAgICAgICBIbG9jID0gbnVtZXJpYy5nZXRCbG9jayhILCBbMCwwXSwgWzIsMl0pO1xuICAgICAgICBpZih0cip0cj49NCpkZXQpIHtcbiAgICAgICAgICAgIHZhciBzMSxzMjtcbiAgICAgICAgICAgIHMxID0gMC41Kih0citNYXRoLnNxcnQodHIqdHItNCpkZXQpKTtcbiAgICAgICAgICAgIHMyID0gMC41Kih0ci1NYXRoLnNxcnQodHIqdHItNCpkZXQpKTtcbiAgICAgICAgICAgIEhsb2MgPSBudW1lcmljLmFkZChudW1lcmljLnN1YihudW1lcmljLmRvdChIbG9jLEhsb2MpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bWVyaWMubXVsKEhsb2MsczErczIpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudW1lcmljLmRpYWcobnVtZXJpYy5yZXAoWzNdLHMxKnMyKSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgSGxvYyA9IG51bWVyaWMuYWRkKG51bWVyaWMuc3ViKG51bWVyaWMuZG90KEhsb2MsSGxvYyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtZXJpYy5tdWwoSGxvYyx0cikpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bWVyaWMuZGlhZyhudW1lcmljLnJlcChbM10sZGV0KSkpO1xuICAgICAgICB9XG4gICAgICAgIHggPSBbSGxvY1swXVswXSxIbG9jWzFdWzBdLEhsb2NbMl1bMF1dO1xuICAgICAgICB2ID0gbnVtZXJpYy5ob3VzZSh4KTtcbiAgICAgICAgQiA9IFtIWzBdLEhbMV0sSFsyXV07XG4gICAgICAgIEMgPSBudW1lcmljLnRlbnNvcih2LG51bWVyaWMuZG90KHYsQikpO1xuICAgICAgICBmb3IoaT0wO2k8MztpKyspIHsgSGkgPSBIW2ldOyBDaSA9IENbaV07IGZvcihrPTA7azxtO2srKykgSGlba10gLT0gMipDaVtrXTsgfVxuICAgICAgICBCID0gbnVtZXJpYy5nZXRCbG9jayhILCBbMCwwXSxbbS0xLDJdKTtcbiAgICAgICAgQyA9IG51bWVyaWMudGVuc29yKG51bWVyaWMuZG90KEIsdiksdik7XG4gICAgICAgIGZvcihpPTA7aTxtO2krKykgeyBIaSA9IEhbaV07IENpID0gQ1tpXTsgZm9yKGs9MDtrPDM7aysrKSBIaVtrXSAtPSAyKkNpW2tdOyB9XG4gICAgICAgIEIgPSBbUVswXSxRWzFdLFFbMl1dO1xuICAgICAgICBDID0gbnVtZXJpYy50ZW5zb3IodixudW1lcmljLmRvdCh2LEIpKTtcbiAgICAgICAgZm9yKGk9MDtpPDM7aSsrKSB7IFFpID0gUVtpXTsgQ2kgPSBDW2ldOyBmb3Ioaz0wO2s8bTtrKyspIFFpW2tdIC09IDIqQ2lba107IH1cbiAgICAgICAgdmFyIEo7XG4gICAgICAgIGZvcihqPTA7ajxtLTI7aisrKSB7XG4gICAgICAgICAgICBmb3Ioaz1qO2s8PWorMTtrKyspIHtcbiAgICAgICAgICAgICAgICBpZihNYXRoLmFicyhIW2srMV1ba10pIDwgZXBzaWxvbiooTWF0aC5hYnMoSFtrXVtrXSkrTWF0aC5hYnMoSFtrKzFdW2srMV0pKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgUUgxID0gbnVtZXJpYy5RUkZyYW5jaXMobnVtZXJpYy5nZXRCbG9jayhILFswLDBdLFtrLGtdKSxtYXhpdGVyKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIFFIMiA9IG51bWVyaWMuUVJGcmFuY2lzKG51bWVyaWMuZ2V0QmxvY2soSCxbaysxLGsrMV0sW20tMSxtLTFdKSxtYXhpdGVyKTtcbiAgICAgICAgICAgICAgICAgICAgQiA9IEFycmF5KGsrMSk7XG4gICAgICAgICAgICAgICAgICAgIGZvcihpPTA7aTw9aztpKyspIHsgQltpXSA9IFFbaV07IH1cbiAgICAgICAgICAgICAgICAgICAgQyA9IG51bWVyaWMuZG90KFFIMS5RLEIpO1xuICAgICAgICAgICAgICAgICAgICBmb3IoaT0wO2k8PWs7aSsrKSB7IFFbaV0gPSBDW2ldOyB9XG4gICAgICAgICAgICAgICAgICAgIEIgPSBBcnJheShtLWstMSk7XG4gICAgICAgICAgICAgICAgICAgIGZvcihpPWsrMTtpPG07aSsrKSB7IEJbaS1rLTFdID0gUVtpXTsgfVxuICAgICAgICAgICAgICAgICAgICBDID0gbnVtZXJpYy5kb3QoUUgyLlEsQik7XG4gICAgICAgICAgICAgICAgICAgIGZvcihpPWsrMTtpPG07aSsrKSB7IFFbaV0gPSBDW2ktay0xXTsgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1E6USxCOlFIMS5CLmNvbmNhdChudW1lcmljLmFkZChRSDIuQixrKzEpKX07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgSiA9IE1hdGgubWluKG0tMSxqKzMpO1xuICAgICAgICAgICAgeCA9IEFycmF5KEotaik7XG4gICAgICAgICAgICBmb3IoaT1qKzE7aTw9SjtpKyspIHsgeFtpLWotMV0gPSBIW2ldW2pdOyB9XG4gICAgICAgICAgICB2ID0gbnVtZXJpYy5ob3VzZSh4KTtcbiAgICAgICAgICAgIEIgPSBudW1lcmljLmdldEJsb2NrKEgsIFtqKzEsal0sW0osbS0xXSk7XG4gICAgICAgICAgICBDID0gbnVtZXJpYy50ZW5zb3IodixudW1lcmljLmRvdCh2LEIpKTtcbiAgICAgICAgICAgIGZvcihpPWorMTtpPD1KO2krKykgeyBIaSA9IEhbaV07IENpID0gQ1tpLWotMV07IGZvcihrPWo7azxtO2srKykgSGlba10gLT0gMipDaVtrLWpdOyB9XG4gICAgICAgICAgICBCID0gbnVtZXJpYy5nZXRCbG9jayhILCBbMCxqKzFdLFttLTEsSl0pO1xuICAgICAgICAgICAgQyA9IG51bWVyaWMudGVuc29yKG51bWVyaWMuZG90KEIsdiksdik7XG4gICAgICAgICAgICBmb3IoaT0wO2k8bTtpKyspIHsgSGkgPSBIW2ldOyBDaSA9IENbaV07IGZvcihrPWorMTtrPD1KO2srKykgSGlba10gLT0gMipDaVtrLWotMV07IH1cbiAgICAgICAgICAgIEIgPSBBcnJheShKLWopO1xuICAgICAgICAgICAgZm9yKGk9aisxO2k8PUo7aSsrKSBCW2ktai0xXSA9IFFbaV07XG4gICAgICAgICAgICBDID0gbnVtZXJpYy50ZW5zb3IodixudW1lcmljLmRvdCh2LEIpKTtcbiAgICAgICAgICAgIGZvcihpPWorMTtpPD1KO2krKykgeyBRaSA9IFFbaV07IENpID0gQ1tpLWotMV07IGZvcihrPTA7azxtO2srKykgUWlba10gLT0gMipDaVtrXTsgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcignbnVtZXJpYzogZWlnZW52YWx1ZSBpdGVyYXRpb24gZG9lcyBub3QgY29udmVyZ2UgLS0gaW5jcmVhc2UgbWF4aXRlcj8nKTtcbn1cblxubnVtZXJpYy5laWcgPSBmdW5jdGlvbiBlaWcoQSxtYXhpdGVyKSB7XG4gICAgdmFyIFFIID0gbnVtZXJpYy50b1VwcGVySGVzc2VuYmVyZyhBKTtcbiAgICB2YXIgUUIgPSBudW1lcmljLlFSRnJhbmNpcyhRSC5ILG1heGl0ZXIpO1xuICAgIHZhciBUID0gbnVtZXJpYy5UO1xuICAgIHZhciBuID0gQS5sZW5ndGgsaSxrLGZsYWcgPSBmYWxzZSxCID0gUUIuQixIID0gbnVtZXJpYy5kb3QoUUIuUSxudW1lcmljLmRvdChRSC5ILG51bWVyaWMudHJhbnNwb3NlKFFCLlEpKSk7XG4gICAgdmFyIFEgPSBuZXcgVChudW1lcmljLmRvdChRQi5RLFFILlEpKSxRMDtcbiAgICB2YXIgbSA9IEIubGVuZ3RoLGo7XG4gICAgdmFyIGEsYixjLGQscDEscDIsZGlzYyx4LHkscCxxLG4xLG4yO1xuICAgIHZhciBzcXJ0ID0gTWF0aC5zcXJ0O1xuICAgIGZvcihrPTA7azxtO2srKykge1xuICAgICAgICBpID0gQltrXVswXTtcbiAgICAgICAgaWYoaSA9PT0gQltrXVsxXSkge1xuICAgICAgICAgICAgLy8gbm90aGluZ1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaiA9IGkrMTtcbiAgICAgICAgICAgIGEgPSBIW2ldW2ldO1xuICAgICAgICAgICAgYiA9IEhbaV1bal07XG4gICAgICAgICAgICBjID0gSFtqXVtpXTtcbiAgICAgICAgICAgIGQgPSBIW2pdW2pdO1xuICAgICAgICAgICAgaWYoYiA9PT0gMCAmJiBjID09PSAwKSBjb250aW51ZTtcbiAgICAgICAgICAgIHAxID0gLWEtZDtcbiAgICAgICAgICAgIHAyID0gYSpkLWIqYztcbiAgICAgICAgICAgIGRpc2MgPSBwMSpwMS00KnAyO1xuICAgICAgICAgICAgaWYoZGlzYz49MCkge1xuICAgICAgICAgICAgICAgIGlmKHAxPDApIHggPSAtMC41KihwMS1zcXJ0KGRpc2MpKTtcbiAgICAgICAgICAgICAgICBlbHNlICAgICB4ID0gLTAuNSoocDErc3FydChkaXNjKSk7XG4gICAgICAgICAgICAgICAgbjEgPSAoYS14KSooYS14KStiKmI7XG4gICAgICAgICAgICAgICAgbjIgPSBjKmMrKGQteCkqKGQteCk7XG4gICAgICAgICAgICAgICAgaWYobjE+bjIpIHtcbiAgICAgICAgICAgICAgICAgICAgbjEgPSBzcXJ0KG4xKTtcbiAgICAgICAgICAgICAgICAgICAgcCA9IChhLXgpL24xO1xuICAgICAgICAgICAgICAgICAgICBxID0gYi9uMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBuMiA9IHNxcnQobjIpO1xuICAgICAgICAgICAgICAgICAgICBwID0gYy9uMjtcbiAgICAgICAgICAgICAgICAgICAgcSA9IChkLXgpL24yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBRMCA9IG5ldyBUKFtbcSwtcF0sW3AscV1dKTtcbiAgICAgICAgICAgICAgICBRLnNldFJvd3MoaSxqLFEwLmRvdChRLmdldFJvd3MoaSxqKSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB4ID0gLTAuNSpwMTtcbiAgICAgICAgICAgICAgICB5ID0gMC41KnNxcnQoLWRpc2MpO1xuICAgICAgICAgICAgICAgIG4xID0gKGEteCkqKGEteCkrYipiO1xuICAgICAgICAgICAgICAgIG4yID0gYypjKyhkLXgpKihkLXgpO1xuICAgICAgICAgICAgICAgIGlmKG4xPm4yKSB7XG4gICAgICAgICAgICAgICAgICAgIG4xID0gc3FydChuMSt5KnkpO1xuICAgICAgICAgICAgICAgICAgICBwID0gKGEteCkvbjE7XG4gICAgICAgICAgICAgICAgICAgIHEgPSBiL24xO1xuICAgICAgICAgICAgICAgICAgICB4ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgeSAvPSBuMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBuMiA9IHNxcnQobjIreSp5KTtcbiAgICAgICAgICAgICAgICAgICAgcCA9IGMvbjI7XG4gICAgICAgICAgICAgICAgICAgIHEgPSAoZC14KS9uMjtcbiAgICAgICAgICAgICAgICAgICAgeCA9IHkvbjI7XG4gICAgICAgICAgICAgICAgICAgIHkgPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBRMCA9IG5ldyBUKFtbcSwtcF0sW3AscV1dLFtbeCx5XSxbeSwteF1dKTtcbiAgICAgICAgICAgICAgICBRLnNldFJvd3MoaSxqLFEwLmRvdChRLmdldFJvd3MoaSxqKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHZhciBSID0gUS5kb3QoQSkuZG90KFEudHJhbnNqdWdhdGUoKSksIG4gPSBBLmxlbmd0aCwgRSA9IG51bWVyaWMuVC5pZGVudGl0eShuKTtcbiAgICBmb3Ioaj0wO2o8bjtqKyspIHtcbiAgICAgICAgaWYoaj4wKSB7XG4gICAgICAgICAgICBmb3Ioaz1qLTE7az49MDtrLS0pIHtcbiAgICAgICAgICAgICAgICB2YXIgUmsgPSBSLmdldChbayxrXSksIFJqID0gUi5nZXQoW2osal0pO1xuICAgICAgICAgICAgICAgIGlmKG51bWVyaWMubmVxKFJrLngsUmoueCkgfHwgbnVtZXJpYy5uZXEoUmsueSxSai55KSkge1xuICAgICAgICAgICAgICAgICAgICB4ID0gUi5nZXRSb3coaykuZ2V0QmxvY2soW2tdLFtqLTFdKTtcbiAgICAgICAgICAgICAgICAgICAgeSA9IEUuZ2V0Um93KGopLmdldEJsb2NrKFtrXSxbai0xXSk7XG4gICAgICAgICAgICAgICAgICAgIEUuc2V0KFtqLGtdLChSLmdldChbayxqXSkubmVnKCkuc3ViKHguZG90KHkpKSkuZGl2KFJrLnN1YihSaikpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBFLnNldFJvdyhqLEUuZ2V0Um93KGspKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGZvcihqPTA7ajxuO2orKykge1xuICAgICAgICB4ID0gRS5nZXRSb3coaik7XG4gICAgICAgIEUuc2V0Um93KGoseC5kaXYoeC5ub3JtMigpKSk7XG4gICAgfVxuICAgIEUgPSBFLnRyYW5zcG9zZSgpO1xuICAgIEUgPSBRLnRyYW5zanVnYXRlKCkuZG90KEUpO1xuICAgIHJldHVybiB7IGxhbWJkYTpSLmdldERpYWcoKSwgRTpFIH07XG59O1xuXG4vLyA1LiBDb21wcmVzc2VkIENvbHVtbiBTdG9yYWdlIG1hdHJpY2VzXG5udW1lcmljLmNjc1NwYXJzZSA9IGZ1bmN0aW9uIGNjc1NwYXJzZShBKSB7XG4gICAgdmFyIG0gPSBBLmxlbmd0aCxuLGZvbywgaSxqLCBjb3VudHMgPSBbXTtcbiAgICBmb3IoaT1tLTE7aSE9PS0xOy0taSkge1xuICAgICAgICBmb28gPSBBW2ldO1xuICAgICAgICBmb3IoaiBpbiBmb28pIHtcbiAgICAgICAgICAgIGogPSBwYXJzZUludChqKTtcbiAgICAgICAgICAgIHdoaWxlKGo+PWNvdW50cy5sZW5ndGgpIGNvdW50c1tjb3VudHMubGVuZ3RoXSA9IDA7XG4gICAgICAgICAgICBpZihmb29bal0hPT0wKSBjb3VudHNbal0rKztcbiAgICAgICAgfVxuICAgIH1cbiAgICB2YXIgbiA9IGNvdW50cy5sZW5ndGg7XG4gICAgdmFyIEFpID0gQXJyYXkobisxKTtcbiAgICBBaVswXSA9IDA7XG4gICAgZm9yKGk9MDtpPG47KytpKSBBaVtpKzFdID0gQWlbaV0gKyBjb3VudHNbaV07XG4gICAgdmFyIEFqID0gQXJyYXkoQWlbbl0pLCBBdiA9IEFycmF5KEFpW25dKTtcbiAgICBmb3IoaT1tLTE7aSE9PS0xOy0taSkge1xuICAgICAgICBmb28gPSBBW2ldO1xuICAgICAgICBmb3IoaiBpbiBmb28pIHtcbiAgICAgICAgICAgIGlmKGZvb1tqXSE9PTApIHtcbiAgICAgICAgICAgICAgICBjb3VudHNbal0tLTtcbiAgICAgICAgICAgICAgICBBaltBaVtqXStjb3VudHNbal1dID0gaTtcbiAgICAgICAgICAgICAgICBBdltBaVtqXStjb3VudHNbal1dID0gZm9vW2pdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbQWksQWosQXZdO1xufVxubnVtZXJpYy5jY3NGdWxsID0gZnVuY3Rpb24gY2NzRnVsbChBKSB7XG4gICAgdmFyIEFpID0gQVswXSwgQWogPSBBWzFdLCBBdiA9IEFbMl0sIHMgPSBudW1lcmljLmNjc0RpbShBKSwgbSA9IHNbMF0sIG4gPSBzWzFdLCBpLGosajAsajEsaztcbiAgICB2YXIgQiA9IG51bWVyaWMucmVwKFttLG5dLDApO1xuICAgIGZvcihpPTA7aTxuO2krKykge1xuICAgICAgICBqMCA9IEFpW2ldO1xuICAgICAgICBqMSA9IEFpW2krMV07XG4gICAgICAgIGZvcihqPWowO2o8ajE7KytqKSB7IEJbQWpbal1dW2ldID0gQXZbal07IH1cbiAgICB9XG4gICAgcmV0dXJuIEI7XG59XG5udW1lcmljLmNjc1RTb2x2ZSA9IGZ1bmN0aW9uIGNjc1RTb2x2ZShBLGIseCxiaix4aikge1xuICAgIHZhciBBaSA9IEFbMF0sIEFqID0gQVsxXSwgQXYgPSBBWzJdLG0gPSBBaS5sZW5ndGgtMSwgbWF4ID0gTWF0aC5tYXgsbj0wO1xuICAgIGlmKHR5cGVvZiBiaiA9PT0gXCJ1bmRlZmluZWRcIikgeCA9IG51bWVyaWMucmVwKFttXSwwKTtcbiAgICBpZih0eXBlb2YgYmogPT09IFwidW5kZWZpbmVkXCIpIGJqID0gbnVtZXJpYy5saW5zcGFjZSgwLHgubGVuZ3RoLTEpO1xuICAgIGlmKHR5cGVvZiB4aiA9PT0gXCJ1bmRlZmluZWRcIikgeGogPSBbXTtcbiAgICBmdW5jdGlvbiBkZnMoaikge1xuICAgICAgICB2YXIgaztcbiAgICAgICAgaWYoeFtqXSAhPT0gMCkgcmV0dXJuO1xuICAgICAgICB4W2pdID0gMTtcbiAgICAgICAgZm9yKGs9QWlbal07azxBaVtqKzFdOysraykgZGZzKEFqW2tdKTtcbiAgICAgICAgeGpbbl0gPSBqO1xuICAgICAgICArK247XG4gICAgfVxuICAgIHZhciBpLGosajAsajEsayxsLGwwLGwxLGE7XG4gICAgZm9yKGk9YmoubGVuZ3RoLTE7aSE9PS0xOy0taSkgeyBkZnMoYmpbaV0pOyB9XG4gICAgeGoubGVuZ3RoID0gbjtcbiAgICBmb3IoaT14ai5sZW5ndGgtMTtpIT09LTE7LS1pKSB7IHhbeGpbaV1dID0gMDsgfVxuICAgIGZvcihpPWJqLmxlbmd0aC0xO2khPT0tMTstLWkpIHsgaiA9IGJqW2ldOyB4W2pdID0gYltqXTsgfVxuICAgIGZvcihpPXhqLmxlbmd0aC0xO2khPT0tMTstLWkpIHtcbiAgICAgICAgaiA9IHhqW2ldO1xuICAgICAgICBqMCA9IEFpW2pdO1xuICAgICAgICBqMSA9IG1heChBaVtqKzFdLGowKTtcbiAgICAgICAgZm9yKGs9ajA7ayE9PWoxOysraykgeyBpZihBaltrXSA9PT0gaikgeyB4W2pdIC89IEF2W2tdOyBicmVhazsgfSB9XG4gICAgICAgIGEgPSB4W2pdO1xuICAgICAgICBmb3Ioaz1qMDtrIT09ajE7KytrKSB7XG4gICAgICAgICAgICBsID0gQWpba107XG4gICAgICAgICAgICBpZihsICE9PSBqKSB4W2xdIC09IGEqQXZba107XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHg7XG59XG5udW1lcmljLmNjc0RGUyA9IGZ1bmN0aW9uIGNjc0RGUyhuKSB7XG4gICAgdGhpcy5rID0gQXJyYXkobik7XG4gICAgdGhpcy5rMSA9IEFycmF5KG4pO1xuICAgIHRoaXMuaiA9IEFycmF5KG4pO1xufVxubnVtZXJpYy5jY3NERlMucHJvdG90eXBlLmRmcyA9IGZ1bmN0aW9uIGRmcyhKLEFpLEFqLHgseGosUGludikge1xuICAgIHZhciBtID0gMCxmb28sbj14ai5sZW5ndGg7XG4gICAgdmFyIGsgPSB0aGlzLmssIGsxID0gdGhpcy5rMSwgaiA9IHRoaXMuaixrbSxrMTE7XG4gICAgaWYoeFtKXSE9PTApIHJldHVybjtcbiAgICB4W0pdID0gMTtcbiAgICBqWzBdID0gSjtcbiAgICBrWzBdID0ga20gPSBBaVtKXTtcbiAgICBrMVswXSA9IGsxMSA9IEFpW0orMV07XG4gICAgd2hpbGUoMSkge1xuICAgICAgICBpZihrbSA+PSBrMTEpIHtcbiAgICAgICAgICAgIHhqW25dID0galttXTtcbiAgICAgICAgICAgIGlmKG09PT0wKSByZXR1cm47XG4gICAgICAgICAgICArK247XG4gICAgICAgICAgICAtLW07XG4gICAgICAgICAgICBrbSA9IGtbbV07XG4gICAgICAgICAgICBrMTEgPSBrMVttXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvbyA9IFBpbnZbQWpba21dXTtcbiAgICAgICAgICAgIGlmKHhbZm9vXSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHhbZm9vXSA9IDE7XG4gICAgICAgICAgICAgICAga1ttXSA9IGttO1xuICAgICAgICAgICAgICAgICsrbTtcbiAgICAgICAgICAgICAgICBqW21dID0gZm9vO1xuICAgICAgICAgICAgICAgIGttID0gQWlbZm9vXTtcbiAgICAgICAgICAgICAgICBrMVttXSA9IGsxMSA9IEFpW2ZvbysxXTtcbiAgICAgICAgICAgIH0gZWxzZSArK2ttO1xuICAgICAgICB9XG4gICAgfVxufVxubnVtZXJpYy5jY3NMUFNvbHZlID0gZnVuY3Rpb24gY2NzTFBTb2x2ZShBLEIseCx4aixJLFBpbnYsZGZzKSB7XG4gICAgdmFyIEFpID0gQVswXSwgQWogPSBBWzFdLCBBdiA9IEFbMl0sbSA9IEFpLmxlbmd0aC0xLCBuPTA7XG4gICAgdmFyIEJpID0gQlswXSwgQmogPSBCWzFdLCBCdiA9IEJbMl07XG4gICAgXG4gICAgdmFyIGksaTAsaTEsaixKLGowLGoxLGssbCxsMCxsMSxhO1xuICAgIGkwID0gQmlbSV07XG4gICAgaTEgPSBCaVtJKzFdO1xuICAgIHhqLmxlbmd0aCA9IDA7XG4gICAgZm9yKGk9aTA7aTxpMTsrK2kpIHsgZGZzLmRmcyhQaW52W0JqW2ldXSxBaSxBaix4LHhqLFBpbnYpOyB9XG4gICAgZm9yKGk9eGoubGVuZ3RoLTE7aSE9PS0xOy0taSkgeyB4W3hqW2ldXSA9IDA7IH1cbiAgICBmb3IoaT1pMDtpIT09aTE7KytpKSB7IGogPSBQaW52W0JqW2ldXTsgeFtqXSA9IEJ2W2ldOyB9XG4gICAgZm9yKGk9eGoubGVuZ3RoLTE7aSE9PS0xOy0taSkge1xuICAgICAgICBqID0geGpbaV07XG4gICAgICAgIGowID0gQWlbal07XG4gICAgICAgIGoxID0gQWlbaisxXTtcbiAgICAgICAgZm9yKGs9ajA7azxqMTsrK2spIHsgaWYoUGludltBaltrXV0gPT09IGopIHsgeFtqXSAvPSBBdltrXTsgYnJlYWs7IH0gfVxuICAgICAgICBhID0geFtqXTtcbiAgICAgICAgZm9yKGs9ajA7azxqMTsrK2spIHtcbiAgICAgICAgICAgIGwgPSBQaW52W0FqW2tdXTtcbiAgICAgICAgICAgIGlmKGwgIT09IGopIHhbbF0gLT0gYSpBdltrXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geDtcbn1cbm51bWVyaWMuY2NzTFVQMSA9IGZ1bmN0aW9uIGNjc0xVUDEoQSx0aHJlc2hvbGQpIHtcbiAgICB2YXIgbSA9IEFbMF0ubGVuZ3RoLTE7XG4gICAgdmFyIEwgPSBbbnVtZXJpYy5yZXAoW20rMV0sMCksW10sW11dLCBVID0gW251bWVyaWMucmVwKFttKzFdLCAwKSxbXSxbXV07XG4gICAgdmFyIExpID0gTFswXSwgTGogPSBMWzFdLCBMdiA9IExbMl0sIFVpID0gVVswXSwgVWogPSBVWzFdLCBVdiA9IFVbMl07XG4gICAgdmFyIHggPSBudW1lcmljLnJlcChbbV0sMCksIHhqID0gbnVtZXJpYy5yZXAoW21dLDApO1xuICAgIHZhciBpLGosayxqMCxqMSxhLGUsYyxkLEs7XG4gICAgdmFyIHNvbCA9IG51bWVyaWMuY2NzTFBTb2x2ZSwgbWF4ID0gTWF0aC5tYXgsIGFicyA9IE1hdGguYWJzO1xuICAgIHZhciBQID0gbnVtZXJpYy5saW5zcGFjZSgwLG0tMSksUGludiA9IG51bWVyaWMubGluc3BhY2UoMCxtLTEpO1xuICAgIHZhciBkZnMgPSBuZXcgbnVtZXJpYy5jY3NERlMobSk7XG4gICAgaWYodHlwZW9mIHRocmVzaG9sZCA9PT0gXCJ1bmRlZmluZWRcIikgeyB0aHJlc2hvbGQgPSAxOyB9XG4gICAgZm9yKGk9MDtpPG07KytpKSB7XG4gICAgICAgIHNvbChMLEEseCx4aixpLFBpbnYsZGZzKTtcbiAgICAgICAgYSA9IC0xO1xuICAgICAgICBlID0gLTE7XG4gICAgICAgIGZvcihqPXhqLmxlbmd0aC0xO2ohPT0tMTstLWopIHtcbiAgICAgICAgICAgIGsgPSB4altqXTtcbiAgICAgICAgICAgIGlmKGsgPD0gaSkgY29udGludWU7XG4gICAgICAgICAgICBjID0gYWJzKHhba10pO1xuICAgICAgICAgICAgaWYoYyA+IGEpIHsgZSA9IGs7IGEgPSBjOyB9XG4gICAgICAgIH1cbiAgICAgICAgaWYoYWJzKHhbaV0pPHRocmVzaG9sZCphKSB7XG4gICAgICAgICAgICBqID0gUFtpXTtcbiAgICAgICAgICAgIGEgPSBQW2VdO1xuICAgICAgICAgICAgUFtpXSA9IGE7IFBpbnZbYV0gPSBpO1xuICAgICAgICAgICAgUFtlXSA9IGo7IFBpbnZbal0gPSBlO1xuICAgICAgICAgICAgYSA9IHhbaV07IHhbaV0gPSB4W2VdOyB4W2VdID0gYTtcbiAgICAgICAgfVxuICAgICAgICBhID0gTGlbaV07XG4gICAgICAgIGUgPSBVaVtpXTtcbiAgICAgICAgZCA9IHhbaV07XG4gICAgICAgIExqW2FdID0gUFtpXTtcbiAgICAgICAgTHZbYV0gPSAxO1xuICAgICAgICArK2E7XG4gICAgICAgIGZvcihqPXhqLmxlbmd0aC0xO2ohPT0tMTstLWopIHtcbiAgICAgICAgICAgIGsgPSB4altqXTtcbiAgICAgICAgICAgIGMgPSB4W2tdO1xuICAgICAgICAgICAgeGpbal0gPSAwO1xuICAgICAgICAgICAgeFtrXSA9IDA7XG4gICAgICAgICAgICBpZihrPD1pKSB7IFVqW2VdID0gazsgVXZbZV0gPSBjOyAgICsrZTsgfVxuICAgICAgICAgICAgZWxzZSAgICAgeyBMalthXSA9IFBba107IEx2W2FdID0gYy9kOyArK2E7IH1cbiAgICAgICAgfVxuICAgICAgICBMaVtpKzFdID0gYTtcbiAgICAgICAgVWlbaSsxXSA9IGU7XG4gICAgfVxuICAgIGZvcihqPUxqLmxlbmd0aC0xO2ohPT0tMTstLWopIHsgTGpbal0gPSBQaW52W0xqW2pdXTsgfVxuICAgIHJldHVybiB7TDpMLCBVOlUsIFA6UCwgUGludjpQaW52fTtcbn1cbm51bWVyaWMuY2NzREZTMCA9IGZ1bmN0aW9uIGNjc0RGUzAobikge1xuICAgIHRoaXMuayA9IEFycmF5KG4pO1xuICAgIHRoaXMuazEgPSBBcnJheShuKTtcbiAgICB0aGlzLmogPSBBcnJheShuKTtcbn1cbm51bWVyaWMuY2NzREZTMC5wcm90b3R5cGUuZGZzID0gZnVuY3Rpb24gZGZzKEosQWksQWoseCx4aixQaW52LFApIHtcbiAgICB2YXIgbSA9IDAsZm9vLG49eGoubGVuZ3RoO1xuICAgIHZhciBrID0gdGhpcy5rLCBrMSA9IHRoaXMuazEsIGogPSB0aGlzLmosa20sazExO1xuICAgIGlmKHhbSl0hPT0wKSByZXR1cm47XG4gICAgeFtKXSA9IDE7XG4gICAgalswXSA9IEo7XG4gICAga1swXSA9IGttID0gQWlbUGludltKXV07XG4gICAgazFbMF0gPSBrMTEgPSBBaVtQaW52W0pdKzFdO1xuICAgIHdoaWxlKDEpIHtcbiAgICAgICAgaWYoaXNOYU4oa20pKSB0aHJvdyBuZXcgRXJyb3IoXCJPdyFcIik7XG4gICAgICAgIGlmKGttID49IGsxMSkge1xuICAgICAgICAgICAgeGpbbl0gPSBQaW52W2pbbV1dO1xuICAgICAgICAgICAgaWYobT09PTApIHJldHVybjtcbiAgICAgICAgICAgICsrbjtcbiAgICAgICAgICAgIC0tbTtcbiAgICAgICAgICAgIGttID0ga1ttXTtcbiAgICAgICAgICAgIGsxMSA9IGsxW21dO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9vID0gQWpba21dO1xuICAgICAgICAgICAgaWYoeFtmb29dID09PSAwKSB7XG4gICAgICAgICAgICAgICAgeFtmb29dID0gMTtcbiAgICAgICAgICAgICAgICBrW21dID0ga207XG4gICAgICAgICAgICAgICAgKyttO1xuICAgICAgICAgICAgICAgIGpbbV0gPSBmb287XG4gICAgICAgICAgICAgICAgZm9vID0gUGludltmb29dO1xuICAgICAgICAgICAgICAgIGttID0gQWlbZm9vXTtcbiAgICAgICAgICAgICAgICBrMVttXSA9IGsxMSA9IEFpW2ZvbysxXTtcbiAgICAgICAgICAgIH0gZWxzZSArK2ttO1xuICAgICAgICB9XG4gICAgfVxufVxubnVtZXJpYy5jY3NMUFNvbHZlMCA9IGZ1bmN0aW9uIGNjc0xQU29sdmUwKEEsQix5LHhqLEksUGludixQLGRmcykge1xuICAgIHZhciBBaSA9IEFbMF0sIEFqID0gQVsxXSwgQXYgPSBBWzJdLG0gPSBBaS5sZW5ndGgtMSwgbj0wO1xuICAgIHZhciBCaSA9IEJbMF0sIEJqID0gQlsxXSwgQnYgPSBCWzJdO1xuICAgIFxuICAgIHZhciBpLGkwLGkxLGosSixqMCxqMSxrLGwsbDAsbDEsYTtcbiAgICBpMCA9IEJpW0ldO1xuICAgIGkxID0gQmlbSSsxXTtcbiAgICB4ai5sZW5ndGggPSAwO1xuICAgIGZvcihpPWkwO2k8aTE7KytpKSB7IGRmcy5kZnMoQmpbaV0sQWksQWoseSx4aixQaW52LFApOyB9XG4gICAgZm9yKGk9eGoubGVuZ3RoLTE7aSE9PS0xOy0taSkgeyBqID0geGpbaV07IHlbUFtqXV0gPSAwOyB9XG4gICAgZm9yKGk9aTA7aSE9PWkxOysraSkgeyBqID0gQmpbaV07IHlbal0gPSBCdltpXTsgfVxuICAgIGZvcihpPXhqLmxlbmd0aC0xO2khPT0tMTstLWkpIHtcbiAgICAgICAgaiA9IHhqW2ldO1xuICAgICAgICBsID0gUFtqXTtcbiAgICAgICAgajAgPSBBaVtqXTtcbiAgICAgICAgajEgPSBBaVtqKzFdO1xuICAgICAgICBmb3Ioaz1qMDtrPGoxOysraykgeyBpZihBaltrXSA9PT0gbCkgeyB5W2xdIC89IEF2W2tdOyBicmVhazsgfSB9XG4gICAgICAgIGEgPSB5W2xdO1xuICAgICAgICBmb3Ioaz1qMDtrPGoxOysraykgeVtBaltrXV0gLT0gYSpBdltrXTtcbiAgICAgICAgeVtsXSA9IGE7XG4gICAgfVxufVxubnVtZXJpYy5jY3NMVVAwID0gZnVuY3Rpb24gY2NzTFVQMChBLHRocmVzaG9sZCkge1xuICAgIHZhciBtID0gQVswXS5sZW5ndGgtMTtcbiAgICB2YXIgTCA9IFtudW1lcmljLnJlcChbbSsxXSwwKSxbXSxbXV0sIFUgPSBbbnVtZXJpYy5yZXAoW20rMV0sIDApLFtdLFtdXTtcbiAgICB2YXIgTGkgPSBMWzBdLCBMaiA9IExbMV0sIEx2ID0gTFsyXSwgVWkgPSBVWzBdLCBVaiA9IFVbMV0sIFV2ID0gVVsyXTtcbiAgICB2YXIgeSA9IG51bWVyaWMucmVwKFttXSwwKSwgeGogPSBudW1lcmljLnJlcChbbV0sMCk7XG4gICAgdmFyIGksaixrLGowLGoxLGEsZSxjLGQsSztcbiAgICB2YXIgc29sID0gbnVtZXJpYy5jY3NMUFNvbHZlMCwgbWF4ID0gTWF0aC5tYXgsIGFicyA9IE1hdGguYWJzO1xuICAgIHZhciBQID0gbnVtZXJpYy5saW5zcGFjZSgwLG0tMSksUGludiA9IG51bWVyaWMubGluc3BhY2UoMCxtLTEpO1xuICAgIHZhciBkZnMgPSBuZXcgbnVtZXJpYy5jY3NERlMwKG0pO1xuICAgIGlmKHR5cGVvZiB0aHJlc2hvbGQgPT09IFwidW5kZWZpbmVkXCIpIHsgdGhyZXNob2xkID0gMTsgfVxuICAgIGZvcihpPTA7aTxtOysraSkge1xuICAgICAgICBzb2woTCxBLHkseGosaSxQaW52LFAsZGZzKTtcbiAgICAgICAgYSA9IC0xO1xuICAgICAgICBlID0gLTE7XG4gICAgICAgIGZvcihqPXhqLmxlbmd0aC0xO2ohPT0tMTstLWopIHtcbiAgICAgICAgICAgIGsgPSB4altqXTtcbiAgICAgICAgICAgIGlmKGsgPD0gaSkgY29udGludWU7XG4gICAgICAgICAgICBjID0gYWJzKHlbUFtrXV0pO1xuICAgICAgICAgICAgaWYoYyA+IGEpIHsgZSA9IGs7IGEgPSBjOyB9XG4gICAgICAgIH1cbiAgICAgICAgaWYoYWJzKHlbUFtpXV0pPHRocmVzaG9sZCphKSB7XG4gICAgICAgICAgICBqID0gUFtpXTtcbiAgICAgICAgICAgIGEgPSBQW2VdO1xuICAgICAgICAgICAgUFtpXSA9IGE7IFBpbnZbYV0gPSBpO1xuICAgICAgICAgICAgUFtlXSA9IGo7IFBpbnZbal0gPSBlO1xuICAgICAgICB9XG4gICAgICAgIGEgPSBMaVtpXTtcbiAgICAgICAgZSA9IFVpW2ldO1xuICAgICAgICBkID0geVtQW2ldXTtcbiAgICAgICAgTGpbYV0gPSBQW2ldO1xuICAgICAgICBMdlthXSA9IDE7XG4gICAgICAgICsrYTtcbiAgICAgICAgZm9yKGo9eGoubGVuZ3RoLTE7aiE9PS0xOy0taikge1xuICAgICAgICAgICAgayA9IHhqW2pdO1xuICAgICAgICAgICAgYyA9IHlbUFtrXV07XG4gICAgICAgICAgICB4altqXSA9IDA7XG4gICAgICAgICAgICB5W1Bba11dID0gMDtcbiAgICAgICAgICAgIGlmKGs8PWkpIHsgVWpbZV0gPSBrOyBVdltlXSA9IGM7ICAgKytlOyB9XG4gICAgICAgICAgICBlbHNlICAgICB7IExqW2FdID0gUFtrXTsgTHZbYV0gPSBjL2Q7ICsrYTsgfVxuICAgICAgICB9XG4gICAgICAgIExpW2krMV0gPSBhO1xuICAgICAgICBVaVtpKzFdID0gZTtcbiAgICB9XG4gICAgZm9yKGo9TGoubGVuZ3RoLTE7aiE9PS0xOy0taikgeyBMaltqXSA9IFBpbnZbTGpbal1dOyB9XG4gICAgcmV0dXJuIHtMOkwsIFU6VSwgUDpQLCBQaW52OlBpbnZ9O1xufVxubnVtZXJpYy5jY3NMVVAgPSBudW1lcmljLmNjc0xVUDA7XG5cbm51bWVyaWMuY2NzRGltID0gZnVuY3Rpb24gY2NzRGltKEEpIHsgcmV0dXJuIFtudW1lcmljLnN1cChBWzFdKSsxLEFbMF0ubGVuZ3RoLTFdOyB9XG5udW1lcmljLmNjc0dldEJsb2NrID0gZnVuY3Rpb24gY2NzR2V0QmxvY2soQSxpLGopIHtcbiAgICB2YXIgcyA9IG51bWVyaWMuY2NzRGltKEEpLG09c1swXSxuPXNbMV07XG4gICAgaWYodHlwZW9mIGkgPT09IFwidW5kZWZpbmVkXCIpIHsgaSA9IG51bWVyaWMubGluc3BhY2UoMCxtLTEpOyB9XG4gICAgZWxzZSBpZih0eXBlb2YgaSA9PT0gXCJudW1iZXJcIikgeyBpID0gW2ldOyB9XG4gICAgaWYodHlwZW9mIGogPT09IFwidW5kZWZpbmVkXCIpIHsgaiA9IG51bWVyaWMubGluc3BhY2UoMCxuLTEpOyB9XG4gICAgZWxzZSBpZih0eXBlb2YgaiA9PT0gXCJudW1iZXJcIikgeyBqID0gW2pdOyB9XG4gICAgdmFyIHAscDAscDEsUCA9IGkubGVuZ3RoLHEsUSA9IGoubGVuZ3RoLHIsanEsaXA7XG4gICAgdmFyIEJpID0gbnVtZXJpYy5yZXAoW25dLDApLCBCaj1bXSwgQnY9W10sIEIgPSBbQmksQmosQnZdO1xuICAgIHZhciBBaSA9IEFbMF0sIEFqID0gQVsxXSwgQXYgPSBBWzJdO1xuICAgIHZhciB4ID0gbnVtZXJpYy5yZXAoW21dLDApLGNvdW50PTAsZmxhZ3MgPSBudW1lcmljLnJlcChbbV0sMCk7XG4gICAgZm9yKHE9MDtxPFE7KytxKSB7XG4gICAgICAgIGpxID0galtxXTtcbiAgICAgICAgdmFyIHEwID0gQWlbanFdO1xuICAgICAgICB2YXIgcTEgPSBBaVtqcSsxXTtcbiAgICAgICAgZm9yKHA9cTA7cDxxMTsrK3ApIHtcbiAgICAgICAgICAgIHIgPSBBaltwXTtcbiAgICAgICAgICAgIGZsYWdzW3JdID0gMTtcbiAgICAgICAgICAgIHhbcl0gPSBBdltwXTtcbiAgICAgICAgfVxuICAgICAgICBmb3IocD0wO3A8UDsrK3ApIHtcbiAgICAgICAgICAgIGlwID0gaVtwXTtcbiAgICAgICAgICAgIGlmKGZsYWdzW2lwXSkge1xuICAgICAgICAgICAgICAgIEJqW2NvdW50XSA9IHA7XG4gICAgICAgICAgICAgICAgQnZbY291bnRdID0geFtpW3BdXTtcbiAgICAgICAgICAgICAgICArK2NvdW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvcihwPXEwO3A8cTE7KytwKSB7XG4gICAgICAgICAgICByID0gQWpbcF07XG4gICAgICAgICAgICBmbGFnc1tyXSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgQmlbcSsxXSA9IGNvdW50O1xuICAgIH1cbiAgICByZXR1cm4gQjtcbn1cblxubnVtZXJpYy5jY3NEb3QgPSBmdW5jdGlvbiBjY3NEb3QoQSxCKSB7XG4gICAgdmFyIEFpID0gQVswXSwgQWogPSBBWzFdLCBBdiA9IEFbMl07XG4gICAgdmFyIEJpID0gQlswXSwgQmogPSBCWzFdLCBCdiA9IEJbMl07XG4gICAgdmFyIHNBID0gbnVtZXJpYy5jY3NEaW0oQSksIHNCID0gbnVtZXJpYy5jY3NEaW0oQik7XG4gICAgdmFyIG0gPSBzQVswXSwgbiA9IHNBWzFdLCBvID0gc0JbMV07XG4gICAgdmFyIHggPSBudW1lcmljLnJlcChbbV0sMCksIGZsYWdzID0gbnVtZXJpYy5yZXAoW21dLDApLCB4aiA9IEFycmF5KG0pO1xuICAgIHZhciBDaSA9IG51bWVyaWMucmVwKFtvXSwwKSwgQ2ogPSBbXSwgQ3YgPSBbXSwgQyA9IFtDaSxDaixDdl07XG4gICAgdmFyIGksaixrLGowLGoxLGkwLGkxLGwscCxhLGI7XG4gICAgZm9yKGs9MDtrIT09bzsrK2spIHtcbiAgICAgICAgajAgPSBCaVtrXTtcbiAgICAgICAgajEgPSBCaVtrKzFdO1xuICAgICAgICBwID0gMDtcbiAgICAgICAgZm9yKGo9ajA7ajxqMTsrK2opIHtcbiAgICAgICAgICAgIGEgPSBCaltqXTtcbiAgICAgICAgICAgIGIgPSBCdltqXTtcbiAgICAgICAgICAgIGkwID0gQWlbYV07XG4gICAgICAgICAgICBpMSA9IEFpW2ErMV07XG4gICAgICAgICAgICBmb3IoaT1pMDtpPGkxOysraSkge1xuICAgICAgICAgICAgICAgIGwgPSBBaltpXTtcbiAgICAgICAgICAgICAgICBpZihmbGFnc1tsXT09PTApIHtcbiAgICAgICAgICAgICAgICAgICAgeGpbcF0gPSBsO1xuICAgICAgICAgICAgICAgICAgICBmbGFnc1tsXSA9IDE7XG4gICAgICAgICAgICAgICAgICAgIHAgPSBwKzE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHhbbF0gPSB4W2xdICsgQXZbaV0qYjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBqMCA9IENpW2tdO1xuICAgICAgICBqMSA9IGowK3A7XG4gICAgICAgIENpW2srMV0gPSBqMTtcbiAgICAgICAgZm9yKGo9cC0xO2ohPT0tMTstLWopIHtcbiAgICAgICAgICAgIGIgPSBqMCtqO1xuICAgICAgICAgICAgaSA9IHhqW2pdO1xuICAgICAgICAgICAgQ2pbYl0gPSBpO1xuICAgICAgICAgICAgQ3ZbYl0gPSB4W2ldO1xuICAgICAgICAgICAgZmxhZ3NbaV0gPSAwO1xuICAgICAgICAgICAgeFtpXSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgQ2lbaysxXSA9IENpW2tdK3A7XG4gICAgfVxuICAgIHJldHVybiBDO1xufVxuXG5udW1lcmljLmNjc0xVUFNvbHZlID0gZnVuY3Rpb24gY2NzTFVQU29sdmUoTFVQLEIpIHtcbiAgICB2YXIgTCA9IExVUC5MLCBVID0gTFVQLlUsIFAgPSBMVVAuUDtcbiAgICB2YXIgQmkgPSBCWzBdO1xuICAgIHZhciBmbGFnID0gZmFsc2U7XG4gICAgaWYodHlwZW9mIEJpICE9PSBcIm9iamVjdFwiKSB7IEIgPSBbWzAsQi5sZW5ndGhdLG51bWVyaWMubGluc3BhY2UoMCxCLmxlbmd0aC0xKSxCXTsgQmkgPSBCWzBdOyBmbGFnID0gdHJ1ZTsgfVxuICAgIHZhciBCaiA9IEJbMV0sIEJ2ID0gQlsyXTtcbiAgICB2YXIgbiA9IExbMF0ubGVuZ3RoLTEsIG0gPSBCaS5sZW5ndGgtMTtcbiAgICB2YXIgeCA9IG51bWVyaWMucmVwKFtuXSwwKSwgeGogPSBBcnJheShuKTtcbiAgICB2YXIgYiA9IG51bWVyaWMucmVwKFtuXSwwKSwgYmogPSBBcnJheShuKTtcbiAgICB2YXIgWGkgPSBudW1lcmljLnJlcChbbSsxXSwwKSwgWGogPSBbXSwgWHYgPSBbXTtcbiAgICB2YXIgc29sID0gbnVtZXJpYy5jY3NUU29sdmU7XG4gICAgdmFyIGksaixqMCxqMSxrLEosTj0wO1xuICAgIGZvcihpPTA7aTxtOysraSkge1xuICAgICAgICBrID0gMDtcbiAgICAgICAgajAgPSBCaVtpXTtcbiAgICAgICAgajEgPSBCaVtpKzFdO1xuICAgICAgICBmb3Ioaj1qMDtqPGoxOysraikgeyBcbiAgICAgICAgICAgIEogPSBMVVAuUGludltCaltqXV07XG4gICAgICAgICAgICBialtrXSA9IEo7XG4gICAgICAgICAgICBiW0pdID0gQnZbal07XG4gICAgICAgICAgICArK2s7XG4gICAgICAgIH1cbiAgICAgICAgYmoubGVuZ3RoID0gaztcbiAgICAgICAgc29sKEwsYix4LGJqLHhqKTtcbiAgICAgICAgZm9yKGo9YmoubGVuZ3RoLTE7aiE9PS0xOy0taikgYltialtqXV0gPSAwO1xuICAgICAgICBzb2woVSx4LGIseGosYmopO1xuICAgICAgICBpZihmbGFnKSByZXR1cm4gYjtcbiAgICAgICAgZm9yKGo9eGoubGVuZ3RoLTE7aiE9PS0xOy0taikgeFt4altqXV0gPSAwO1xuICAgICAgICBmb3Ioaj1iai5sZW5ndGgtMTtqIT09LTE7LS1qKSB7XG4gICAgICAgICAgICBKID0gYmpbal07XG4gICAgICAgICAgICBYaltOXSA9IEo7XG4gICAgICAgICAgICBYdltOXSA9IGJbSl07XG4gICAgICAgICAgICBiW0pdID0gMDtcbiAgICAgICAgICAgICsrTjtcbiAgICAgICAgfVxuICAgICAgICBYaVtpKzFdID0gTjtcbiAgICB9XG4gICAgcmV0dXJuIFtYaSxYaixYdl07XG59XG5cbm51bWVyaWMuY2NzYmlub3AgPSBmdW5jdGlvbiBjY3NiaW5vcChib2R5LHNldHVwKSB7XG4gICAgaWYodHlwZW9mIHNldHVwID09PSBcInVuZGVmaW5lZFwiKSBzZXR1cD0nJztcbiAgICByZXR1cm4gRnVuY3Rpb24oJ1gnLCdZJyxcbiAgICAgICAgICAgICd2YXIgWGkgPSBYWzBdLCBYaiA9IFhbMV0sIFh2ID0gWFsyXTtcXG4nK1xuICAgICAgICAgICAgJ3ZhciBZaSA9IFlbMF0sIFlqID0gWVsxXSwgWXYgPSBZWzJdO1xcbicrXG4gICAgICAgICAgICAndmFyIG4gPSBYaS5sZW5ndGgtMSxtID0gTWF0aC5tYXgobnVtZXJpYy5zdXAoWGopLG51bWVyaWMuc3VwKFlqKSkrMTtcXG4nK1xuICAgICAgICAgICAgJ3ZhciBaaSA9IG51bWVyaWMucmVwKFtuKzFdLDApLCBaaiA9IFtdLCBadiA9IFtdO1xcbicrXG4gICAgICAgICAgICAndmFyIHggPSBudW1lcmljLnJlcChbbV0sMCkseSA9IG51bWVyaWMucmVwKFttXSwwKTtcXG4nK1xuICAgICAgICAgICAgJ3ZhciB4ayx5ayx6aztcXG4nK1xuICAgICAgICAgICAgJ3ZhciBpLGosajAsajEsayxwPTA7XFxuJytcbiAgICAgICAgICAgIHNldHVwK1xuICAgICAgICAgICAgJ2ZvcihpPTA7aTxuOysraSkge1xcbicrXG4gICAgICAgICAgICAnICBqMCA9IFhpW2ldOyBqMSA9IFhpW2krMV07XFxuJytcbiAgICAgICAgICAgICcgIGZvcihqPWowO2ohPT1qMTsrK2opIHtcXG4nK1xuICAgICAgICAgICAgJyAgICBrID0gWGpbal07XFxuJytcbiAgICAgICAgICAgICcgICAgeFtrXSA9IDE7XFxuJytcbiAgICAgICAgICAgICcgICAgWmpbcF0gPSBrO1xcbicrXG4gICAgICAgICAgICAnICAgICsrcDtcXG4nK1xuICAgICAgICAgICAgJyAgfVxcbicrXG4gICAgICAgICAgICAnICBqMCA9IFlpW2ldOyBqMSA9IFlpW2krMV07XFxuJytcbiAgICAgICAgICAgICcgIGZvcihqPWowO2ohPT1qMTsrK2opIHtcXG4nK1xuICAgICAgICAgICAgJyAgICBrID0gWWpbal07XFxuJytcbiAgICAgICAgICAgICcgICAgeVtrXSA9IFl2W2pdO1xcbicrXG4gICAgICAgICAgICAnICAgIGlmKHhba10gPT09IDApIHtcXG4nK1xuICAgICAgICAgICAgJyAgICAgIFpqW3BdID0gaztcXG4nK1xuICAgICAgICAgICAgJyAgICAgICsrcDtcXG4nK1xuICAgICAgICAgICAgJyAgICB9XFxuJytcbiAgICAgICAgICAgICcgIH1cXG4nK1xuICAgICAgICAgICAgJyAgWmlbaSsxXSA9IHA7XFxuJytcbiAgICAgICAgICAgICcgIGowID0gWGlbaV07IGoxID0gWGlbaSsxXTtcXG4nK1xuICAgICAgICAgICAgJyAgZm9yKGo9ajA7aiE9PWoxOysraikgeFtYaltqXV0gPSBYdltqXTtcXG4nK1xuICAgICAgICAgICAgJyAgajAgPSBaaVtpXTsgajEgPSBaaVtpKzFdO1xcbicrXG4gICAgICAgICAgICAnICBmb3Ioaj1qMDtqIT09ajE7KytqKSB7XFxuJytcbiAgICAgICAgICAgICcgICAgayA9IFpqW2pdO1xcbicrXG4gICAgICAgICAgICAnICAgIHhrID0geFtrXTtcXG4nK1xuICAgICAgICAgICAgJyAgICB5ayA9IHlba107XFxuJytcbiAgICAgICAgICAgIGJvZHkrJ1xcbicrXG4gICAgICAgICAgICAnICAgIFp2W2pdID0gems7XFxuJytcbiAgICAgICAgICAgICcgIH1cXG4nK1xuICAgICAgICAgICAgJyAgajAgPSBYaVtpXTsgajEgPSBYaVtpKzFdO1xcbicrXG4gICAgICAgICAgICAnICBmb3Ioaj1qMDtqIT09ajE7KytqKSB4W1hqW2pdXSA9IDA7XFxuJytcbiAgICAgICAgICAgICcgIGowID0gWWlbaV07IGoxID0gWWlbaSsxXTtcXG4nK1xuICAgICAgICAgICAgJyAgZm9yKGo9ajA7aiE9PWoxOysraikgeVtZaltqXV0gPSAwO1xcbicrXG4gICAgICAgICAgICAnfVxcbicrXG4gICAgICAgICAgICAncmV0dXJuIFtaaSxaaixadl07J1xuICAgICAgICAgICAgKTtcbn07XG5cbihmdW5jdGlvbigpIHtcbiAgICB2YXIgayxBLEIsQztcbiAgICBmb3IoayBpbiBudW1lcmljLm9wczIpIHtcbiAgICAgICAgaWYoaXNGaW5pdGUoZXZhbCgnMScrbnVtZXJpYy5vcHMyW2tdKycwJykpKSBBID0gJ1tZWzBdLFlbMV0sbnVtZXJpYy4nK2srJyhYLFlbMl0pXSc7XG4gICAgICAgIGVsc2UgQSA9ICdOYU4nO1xuICAgICAgICBpZihpc0Zpbml0ZShldmFsKCcwJytudW1lcmljLm9wczJba10rJzEnKSkpIEIgPSAnW1hbMF0sWFsxXSxudW1lcmljLicraysnKFhbMl0sWSldJztcbiAgICAgICAgZWxzZSBCID0gJ05hTic7XG4gICAgICAgIGlmKGlzRmluaXRlKGV2YWwoJzEnK251bWVyaWMub3BzMltrXSsnMCcpKSAmJiBpc0Zpbml0ZShldmFsKCcwJytudW1lcmljLm9wczJba10rJzEnKSkpIEMgPSAnbnVtZXJpYy5jY3MnK2srJ01NKFgsWSknO1xuICAgICAgICBlbHNlIEMgPSAnTmFOJztcbiAgICAgICAgbnVtZXJpY1snY2NzJytrKydNTSddID0gbnVtZXJpYy5jY3NiaW5vcCgnemsgPSB4ayAnK251bWVyaWMub3BzMltrXSsneWs7Jyk7XG4gICAgICAgIG51bWVyaWNbJ2Njcycra10gPSBGdW5jdGlvbignWCcsJ1knLFxuICAgICAgICAgICAgICAgICdpZih0eXBlb2YgWCA9PT0gXCJudW1iZXJcIikgcmV0dXJuICcrQSsnO1xcbicrXG4gICAgICAgICAgICAgICAgJ2lmKHR5cGVvZiBZID09PSBcIm51bWJlclwiKSByZXR1cm4gJytCKyc7XFxuJytcbiAgICAgICAgICAgICAgICAncmV0dXJuICcrQysnO1xcbidcbiAgICAgICAgICAgICAgICApO1xuICAgIH1cbn0oKSk7XG5cbm51bWVyaWMuY2NzU2NhdHRlciA9IGZ1bmN0aW9uIGNjc1NjYXR0ZXIoQSkge1xuICAgIHZhciBBaSA9IEFbMF0sIEFqID0gQVsxXSwgQXYgPSBBWzJdO1xuICAgIHZhciBuID0gbnVtZXJpYy5zdXAoQWopKzEsbT1BaS5sZW5ndGg7XG4gICAgdmFyIFJpID0gbnVtZXJpYy5yZXAoW25dLDApLFJqPUFycmF5KG0pLCBSdiA9IEFycmF5KG0pO1xuICAgIHZhciBjb3VudHMgPSBudW1lcmljLnJlcChbbl0sMCksaTtcbiAgICBmb3IoaT0wO2k8bTsrK2kpIGNvdW50c1tBaltpXV0rKztcbiAgICBmb3IoaT0wO2k8bjsrK2kpIFJpW2krMV0gPSBSaVtpXSArIGNvdW50c1tpXTtcbiAgICB2YXIgcHRyID0gUmkuc2xpY2UoMCksayxBaWk7XG4gICAgZm9yKGk9MDtpPG07KytpKSB7XG4gICAgICAgIEFpaSA9IEFqW2ldO1xuICAgICAgICBrID0gcHRyW0FpaV07XG4gICAgICAgIFJqW2tdID0gQWlbaV07XG4gICAgICAgIFJ2W2tdID0gQXZbaV07XG4gICAgICAgIHB0cltBaWldPXB0cltBaWldKzE7XG4gICAgfVxuICAgIHJldHVybiBbUmksUmosUnZdO1xufVxuXG5udW1lcmljLmNjc0dhdGhlciA9IGZ1bmN0aW9uIGNjc0dhdGhlcihBKSB7XG4gICAgdmFyIEFpID0gQVswXSwgQWogPSBBWzFdLCBBdiA9IEFbMl07XG4gICAgdmFyIG4gPSBBaS5sZW5ndGgtMSxtID0gQWoubGVuZ3RoO1xuICAgIHZhciBSaSA9IEFycmF5KG0pLCBSaiA9IEFycmF5KG0pLCBSdiA9IEFycmF5KG0pO1xuICAgIHZhciBpLGosajAsajEscDtcbiAgICBwPTA7XG4gICAgZm9yKGk9MDtpPG47KytpKSB7XG4gICAgICAgIGowID0gQWlbaV07XG4gICAgICAgIGoxID0gQWlbaSsxXTtcbiAgICAgICAgZm9yKGo9ajA7aiE9PWoxOysraikge1xuICAgICAgICAgICAgUmpbcF0gPSBpO1xuICAgICAgICAgICAgUmlbcF0gPSBBaltqXTtcbiAgICAgICAgICAgIFJ2W3BdID0gQXZbal07XG4gICAgICAgICAgICArK3A7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFtSaSxSaixSdl07XG59XG5cbi8vIFRoZSBmb2xsb3dpbmcgc3BhcnNlIGxpbmVhciBhbGdlYnJhIHJvdXRpbmVzIGFyZSBkZXByZWNhdGVkLlxuXG5udW1lcmljLnNkaW0gPSBmdW5jdGlvbiBkaW0oQSxyZXQsaykge1xuICAgIGlmKHR5cGVvZiByZXQgPT09IFwidW5kZWZpbmVkXCIpIHsgcmV0ID0gW107IH1cbiAgICBpZih0eXBlb2YgQSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIHJldDtcbiAgICBpZih0eXBlb2YgayA9PT0gXCJ1bmRlZmluZWRcIikgeyBrPTA7IH1cbiAgICBpZighKGsgaW4gcmV0KSkgeyByZXRba10gPSAwOyB9XG4gICAgaWYoQS5sZW5ndGggPiByZXRba10pIHJldFtrXSA9IEEubGVuZ3RoO1xuICAgIHZhciBpO1xuICAgIGZvcihpIGluIEEpIHtcbiAgICAgICAgaWYoQS5oYXNPd25Qcm9wZXJ0eShpKSkgZGltKEFbaV0scmV0LGsrMSk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG59O1xuXG5udW1lcmljLnNjbG9uZSA9IGZ1bmN0aW9uIGNsb25lKEEsayxuKSB7XG4gICAgaWYodHlwZW9mIGsgPT09IFwidW5kZWZpbmVkXCIpIHsgaz0wOyB9XG4gICAgaWYodHlwZW9mIG4gPT09IFwidW5kZWZpbmVkXCIpIHsgbiA9IG51bWVyaWMuc2RpbShBKS5sZW5ndGg7IH1cbiAgICB2YXIgaSxyZXQgPSBBcnJheShBLmxlbmd0aCk7XG4gICAgaWYoayA9PT0gbi0xKSB7XG4gICAgICAgIGZvcihpIGluIEEpIHsgaWYoQS5oYXNPd25Qcm9wZXJ0eShpKSkgcmV0W2ldID0gQVtpXTsgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbiAgICBmb3IoaSBpbiBBKSB7XG4gICAgICAgIGlmKEEuaGFzT3duUHJvcGVydHkoaSkpIHJldFtpXSA9IGNsb25lKEFbaV0saysxLG4pO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xufVxuXG5udW1lcmljLnNkaWFnID0gZnVuY3Rpb24gZGlhZyhkKSB7XG4gICAgdmFyIG4gPSBkLmxlbmd0aCxpLHJldCA9IEFycmF5KG4pLGkxLGkyLGkzO1xuICAgIGZvcihpPW4tMTtpPj0xO2ktPTIpIHtcbiAgICAgICAgaTEgPSBpLTE7XG4gICAgICAgIHJldFtpXSA9IFtdOyByZXRbaV1baV0gPSBkW2ldO1xuICAgICAgICByZXRbaTFdID0gW107IHJldFtpMV1baTFdID0gZFtpMV07XG4gICAgfVxuICAgIGlmKGk9PT0wKSB7IHJldFswXSA9IFtdOyByZXRbMF1bMF0gPSBkW2ldOyB9XG4gICAgcmV0dXJuIHJldDtcbn1cblxubnVtZXJpYy5zaWRlbnRpdHkgPSBmdW5jdGlvbiBpZGVudGl0eShuKSB7IHJldHVybiBudW1lcmljLnNkaWFnKG51bWVyaWMucmVwKFtuXSwxKSk7IH1cblxubnVtZXJpYy5zdHJhbnNwb3NlID0gZnVuY3Rpb24gdHJhbnNwb3NlKEEpIHtcbiAgICB2YXIgcmV0ID0gW10sIG4gPSBBLmxlbmd0aCwgaSxqLEFpO1xuICAgIGZvcihpIGluIEEpIHtcbiAgICAgICAgaWYoIShBLmhhc093blByb3BlcnR5KGkpKSkgY29udGludWU7XG4gICAgICAgIEFpID0gQVtpXTtcbiAgICAgICAgZm9yKGogaW4gQWkpIHtcbiAgICAgICAgICAgIGlmKCEoQWkuaGFzT3duUHJvcGVydHkoaikpKSBjb250aW51ZTtcbiAgICAgICAgICAgIGlmKHR5cGVvZiByZXRbal0gIT09IFwib2JqZWN0XCIpIHsgcmV0W2pdID0gW107IH1cbiAgICAgICAgICAgIHJldFtqXVtpXSA9IEFpW2pdO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG59XG5cbm51bWVyaWMuc0xVUCA9IGZ1bmN0aW9uIExVUChBLHRvbCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBmdW5jdGlvbiBudW1lcmljLnNMVVAgaGFkIGEgYnVnIGluIGl0IGFuZCBoYXMgYmVlbiByZW1vdmVkLiBQbGVhc2UgdXNlIHRoZSBuZXcgbnVtZXJpYy5jY3NMVVAgZnVuY3Rpb24gaW5zdGVhZC5cIik7XG59O1xuXG5udW1lcmljLnNkb3RNTSA9IGZ1bmN0aW9uIGRvdE1NKEEsQikge1xuICAgIHZhciBwID0gQS5sZW5ndGgsIHEgPSBCLmxlbmd0aCwgQlQgPSBudW1lcmljLnN0cmFuc3Bvc2UoQiksIHIgPSBCVC5sZW5ndGgsIEFpLCBCVGs7XG4gICAgdmFyIGksaixrLGFjY3VtO1xuICAgIHZhciByZXQgPSBBcnJheShwKSxyZXRpO1xuICAgIGZvcihpPXAtMTtpPj0wO2ktLSkge1xuICAgICAgICByZXRpID0gW107XG4gICAgICAgIEFpID0gQVtpXTtcbiAgICAgICAgZm9yKGs9ci0xO2s+PTA7ay0tKSB7XG4gICAgICAgICAgICBhY2N1bSA9IDA7XG4gICAgICAgICAgICBCVGsgPSBCVFtrXTtcbiAgICAgICAgICAgIGZvcihqIGluIEFpKSB7XG4gICAgICAgICAgICAgICAgaWYoIShBaS5oYXNPd25Qcm9wZXJ0eShqKSkpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGlmKGogaW4gQlRrKSB7IGFjY3VtICs9IEFpW2pdKkJUa1tqXTsgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoYWNjdW0pIHJldGlba10gPSBhY2N1bTtcbiAgICAgICAgfVxuICAgICAgICByZXRbaV0gPSByZXRpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xufVxuXG5udW1lcmljLnNkb3RNViA9IGZ1bmN0aW9uIGRvdE1WKEEseCkge1xuICAgIHZhciBwID0gQS5sZW5ndGgsIEFpLCBpLGo7XG4gICAgdmFyIHJldCA9IEFycmF5KHApLCBhY2N1bTtcbiAgICBmb3IoaT1wLTE7aT49MDtpLS0pIHtcbiAgICAgICAgQWkgPSBBW2ldO1xuICAgICAgICBhY2N1bSA9IDA7XG4gICAgICAgIGZvcihqIGluIEFpKSB7XG4gICAgICAgICAgICBpZighKEFpLmhhc093blByb3BlcnR5KGopKSkgY29udGludWU7XG4gICAgICAgICAgICBpZih4W2pdKSBhY2N1bSArPSBBaVtqXSp4W2pdO1xuICAgICAgICB9XG4gICAgICAgIGlmKGFjY3VtKSByZXRbaV0gPSBhY2N1bTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbn1cblxubnVtZXJpYy5zZG90Vk0gPSBmdW5jdGlvbiBkb3RNVih4LEEpIHtcbiAgICB2YXIgaSxqLEFpLGFscGhhO1xuICAgIHZhciByZXQgPSBbXSwgYWNjdW07XG4gICAgZm9yKGkgaW4geCkge1xuICAgICAgICBpZigheC5oYXNPd25Qcm9wZXJ0eShpKSkgY29udGludWU7XG4gICAgICAgIEFpID0gQVtpXTtcbiAgICAgICAgYWxwaGEgPSB4W2ldO1xuICAgICAgICBmb3IoaiBpbiBBaSkge1xuICAgICAgICAgICAgaWYoIUFpLmhhc093blByb3BlcnR5KGopKSBjb250aW51ZTtcbiAgICAgICAgICAgIGlmKCFyZXRbal0pIHsgcmV0W2pdID0gMDsgfVxuICAgICAgICAgICAgcmV0W2pdICs9IGFscGhhKkFpW2pdO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG59XG5cbm51bWVyaWMuc2RvdFZWID0gZnVuY3Rpb24gZG90VlYoeCx5KSB7XG4gICAgdmFyIGkscmV0PTA7XG4gICAgZm9yKGkgaW4geCkgeyBpZih4W2ldICYmIHlbaV0pIHJldCs9IHhbaV0qeVtpXTsgfVxuICAgIHJldHVybiByZXQ7XG59XG5cbm51bWVyaWMuc2RvdCA9IGZ1bmN0aW9uIGRvdChBLEIpIHtcbiAgICB2YXIgbSA9IG51bWVyaWMuc2RpbShBKS5sZW5ndGgsIG4gPSBudW1lcmljLnNkaW0oQikubGVuZ3RoO1xuICAgIHZhciBrID0gbSoxMDAwK247XG4gICAgc3dpdGNoKGspIHtcbiAgICBjYXNlIDA6IHJldHVybiBBKkI7XG4gICAgY2FzZSAxMDAxOiByZXR1cm4gbnVtZXJpYy5zZG90VlYoQSxCKTtcbiAgICBjYXNlIDIwMDE6IHJldHVybiBudW1lcmljLnNkb3RNVihBLEIpO1xuICAgIGNhc2UgMTAwMjogcmV0dXJuIG51bWVyaWMuc2RvdFZNKEEsQik7XG4gICAgY2FzZSAyMDAyOiByZXR1cm4gbnVtZXJpYy5zZG90TU0oQSxCKTtcbiAgICBkZWZhdWx0OiB0aHJvdyBuZXcgRXJyb3IoJ251bWVyaWMuc2RvdCBub3QgaW1wbGVtZW50ZWQgZm9yIHRlbnNvcnMgb2Ygb3JkZXIgJyttKycgYW5kICcrbik7XG4gICAgfVxufVxuXG5udW1lcmljLnNzY2F0dGVyID0gZnVuY3Rpb24gc2NhdHRlcihWKSB7XG4gICAgdmFyIG4gPSBWWzBdLmxlbmd0aCwgVmlqLCBpLCBqLCBtID0gVi5sZW5ndGgsIEEgPSBbXSwgQWo7XG4gICAgZm9yKGk9bi0xO2k+PTA7LS1pKSB7XG4gICAgICAgIGlmKCFWW20tMV1baV0pIGNvbnRpbnVlO1xuICAgICAgICBBaiA9IEE7XG4gICAgICAgIGZvcihqPTA7ajxtLTI7aisrKSB7XG4gICAgICAgICAgICBWaWogPSBWW2pdW2ldO1xuICAgICAgICAgICAgaWYoIUFqW1Zpal0pIEFqW1Zpal0gPSBbXTtcbiAgICAgICAgICAgIEFqID0gQWpbVmlqXTtcbiAgICAgICAgfVxuICAgICAgICBBaltWW2pdW2ldXSA9IFZbaisxXVtpXTtcbiAgICB9XG4gICAgcmV0dXJuIEE7XG59XG5cbm51bWVyaWMuc2dhdGhlciA9IGZ1bmN0aW9uIGdhdGhlcihBLHJldCxrKSB7XG4gICAgaWYodHlwZW9mIHJldCA9PT0gXCJ1bmRlZmluZWRcIikgcmV0ID0gW107XG4gICAgaWYodHlwZW9mIGsgPT09IFwidW5kZWZpbmVkXCIpIGsgPSBbXTtcbiAgICB2YXIgbixpLEFpO1xuICAgIG4gPSBrLmxlbmd0aDtcbiAgICBmb3IoaSBpbiBBKSB7XG4gICAgICAgIGlmKEEuaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgICAgIGtbbl0gPSBwYXJzZUludChpKTtcbiAgICAgICAgICAgIEFpID0gQVtpXTtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBBaSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICAgIGlmKEFpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKHJldC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcihpPW4rMTtpPj0wOy0taSkgcmV0W2ldID0gW107XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZm9yKGk9bjtpPj0wOy0taSkgcmV0W2ldLnB1c2goa1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIHJldFtuKzFdLnB1c2goQWkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBnYXRoZXIoQWkscmV0LGspO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmKGsubGVuZ3RoPm4pIGsucG9wKCk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLy8gNi4gQ29vcmRpbmF0ZSBtYXRyaWNlc1xubnVtZXJpYy5jTFUgPSBmdW5jdGlvbiBMVShBKSB7XG4gICAgdmFyIEkgPSBBWzBdLCBKID0gQVsxXSwgViA9IEFbMl07XG4gICAgdmFyIHAgPSBJLmxlbmd0aCwgbT0wLCBpLGosayxhLGIsYztcbiAgICBmb3IoaT0wO2k8cDtpKyspIGlmKElbaV0+bSkgbT1JW2ldO1xuICAgIG0rKztcbiAgICB2YXIgTCA9IEFycmF5KG0pLCBVID0gQXJyYXkobSksIGxlZnQgPSBudW1lcmljLnJlcChbbV0sSW5maW5pdHkpLCByaWdodCA9IG51bWVyaWMucmVwKFttXSwtSW5maW5pdHkpO1xuICAgIHZhciBVaSwgVWosYWxwaGE7XG4gICAgZm9yKGs9MDtrPHA7aysrKSB7XG4gICAgICAgIGkgPSBJW2tdO1xuICAgICAgICBqID0gSltrXTtcbiAgICAgICAgaWYoajxsZWZ0W2ldKSBsZWZ0W2ldID0gajtcbiAgICAgICAgaWYoaj5yaWdodFtpXSkgcmlnaHRbaV0gPSBqO1xuICAgIH1cbiAgICBmb3IoaT0wO2k8bS0xO2krKykgeyBpZihyaWdodFtpXSA+IHJpZ2h0W2krMV0pIHJpZ2h0W2krMV0gPSByaWdodFtpXTsgfVxuICAgIGZvcihpPW0tMTtpPj0xO2ktLSkgeyBpZihsZWZ0W2ldPGxlZnRbaS0xXSkgbGVmdFtpLTFdID0gbGVmdFtpXTsgfVxuICAgIHZhciBjb3VudEwgPSAwLCBjb3VudFUgPSAwO1xuICAgIGZvcihpPTA7aTxtO2krKykge1xuICAgICAgICBVW2ldID0gbnVtZXJpYy5yZXAoW3JpZ2h0W2ldLWxlZnRbaV0rMV0sMCk7XG4gICAgICAgIExbaV0gPSBudW1lcmljLnJlcChbaS1sZWZ0W2ldXSwwKTtcbiAgICAgICAgY291bnRMICs9IGktbGVmdFtpXSsxO1xuICAgICAgICBjb3VudFUgKz0gcmlnaHRbaV0taSsxO1xuICAgIH1cbiAgICBmb3Ioaz0wO2s8cDtrKyspIHsgaSA9IElba107IFVbaV1bSltrXS1sZWZ0W2ldXSA9IFZba107IH1cbiAgICBmb3IoaT0wO2k8bS0xO2krKykge1xuICAgICAgICBhID0gaS1sZWZ0W2ldO1xuICAgICAgICBVaSA9IFVbaV07XG4gICAgICAgIGZvcihqPWkrMTtsZWZ0W2pdPD1pICYmIGo8bTtqKyspIHtcbiAgICAgICAgICAgIGIgPSBpLWxlZnRbal07XG4gICAgICAgICAgICBjID0gcmlnaHRbaV0taTtcbiAgICAgICAgICAgIFVqID0gVVtqXTtcbiAgICAgICAgICAgIGFscGhhID0gVWpbYl0vVWlbYV07XG4gICAgICAgICAgICBpZihhbHBoYSkge1xuICAgICAgICAgICAgICAgIGZvcihrPTE7azw9YztrKyspIHsgVWpbaytiXSAtPSBhbHBoYSpVaVtrK2FdOyB9XG4gICAgICAgICAgICAgICAgTFtqXVtpLWxlZnRbal1dID0gYWxwaGE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgdmFyIFVpID0gW10sIFVqID0gW10sIFV2ID0gW10sIExpID0gW10sIExqID0gW10sIEx2ID0gW107XG4gICAgdmFyIHAscSxmb287XG4gICAgcD0wOyBxPTA7XG4gICAgZm9yKGk9MDtpPG07aSsrKSB7XG4gICAgICAgIGEgPSBsZWZ0W2ldO1xuICAgICAgICBiID0gcmlnaHRbaV07XG4gICAgICAgIGZvbyA9IFVbaV07XG4gICAgICAgIGZvcihqPWk7ajw9YjtqKyspIHtcbiAgICAgICAgICAgIGlmKGZvb1tqLWFdKSB7XG4gICAgICAgICAgICAgICAgVWlbcF0gPSBpO1xuICAgICAgICAgICAgICAgIFVqW3BdID0gajtcbiAgICAgICAgICAgICAgICBVdltwXSA9IGZvb1tqLWFdO1xuICAgICAgICAgICAgICAgIHArKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb28gPSBMW2ldO1xuICAgICAgICBmb3Ioaj1hO2o8aTtqKyspIHtcbiAgICAgICAgICAgIGlmKGZvb1tqLWFdKSB7XG4gICAgICAgICAgICAgICAgTGlbcV0gPSBpO1xuICAgICAgICAgICAgICAgIExqW3FdID0gajtcbiAgICAgICAgICAgICAgICBMdltxXSA9IGZvb1tqLWFdO1xuICAgICAgICAgICAgICAgIHErKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBMaVtxXSA9IGk7XG4gICAgICAgIExqW3FdID0gaTtcbiAgICAgICAgTHZbcV0gPSAxO1xuICAgICAgICBxKys7XG4gICAgfVxuICAgIHJldHVybiB7VTpbVWksVWosVXZdLCBMOltMaSxMaixMdl19O1xufTtcblxubnVtZXJpYy5jTFVzb2x2ZSA9IGZ1bmN0aW9uIExVc29sdmUobHUsYikge1xuICAgIHZhciBMID0gbHUuTCwgVSA9IGx1LlUsIHJldCA9IG51bWVyaWMuY2xvbmUoYik7XG4gICAgdmFyIExpID0gTFswXSwgTGogPSBMWzFdLCBMdiA9IExbMl07XG4gICAgdmFyIFVpID0gVVswXSwgVWogPSBVWzFdLCBVdiA9IFVbMl07XG4gICAgdmFyIHAgPSBVaS5sZW5ndGgsIHEgPSBMaS5sZW5ndGg7XG4gICAgdmFyIG0gPSByZXQubGVuZ3RoLGksaixrO1xuICAgIGsgPSAwO1xuICAgIGZvcihpPTA7aTxtO2krKykge1xuICAgICAgICB3aGlsZShMaltrXSA8IGkpIHtcbiAgICAgICAgICAgIHJldFtpXSAtPSBMdltrXSpyZXRbTGpba11dO1xuICAgICAgICAgICAgaysrO1xuICAgICAgICB9XG4gICAgICAgIGsrKztcbiAgICB9XG4gICAgayA9IHAtMTtcbiAgICBmb3IoaT1tLTE7aT49MDtpLS0pIHtcbiAgICAgICAgd2hpbGUoVWpba10gPiBpKSB7XG4gICAgICAgICAgICByZXRbaV0gLT0gVXZba10qcmV0W1VqW2tdXTtcbiAgICAgICAgICAgIGstLTtcbiAgICAgICAgfVxuICAgICAgICByZXRbaV0gLz0gVXZba107XG4gICAgICAgIGstLTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbn07XG5cbm51bWVyaWMuY2dyaWQgPSBmdW5jdGlvbiBncmlkKG4sc2hhcGUpIHtcbiAgICBpZih0eXBlb2YgbiA9PT0gXCJudW1iZXJcIikgbiA9IFtuLG5dO1xuICAgIHZhciByZXQgPSBudW1lcmljLnJlcChuLC0xKTtcbiAgICB2YXIgaSxqLGNvdW50O1xuICAgIGlmKHR5cGVvZiBzaGFwZSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHN3aXRjaChzaGFwZSkge1xuICAgICAgICBjYXNlICdMJzpcbiAgICAgICAgICAgIHNoYXBlID0gZnVuY3Rpb24oaSxqKSB7IHJldHVybiAoaT49blswXS8yIHx8IGo8blsxXS8yKTsgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBzaGFwZSA9IGZ1bmN0aW9uKGksaikgeyByZXR1cm4gdHJ1ZTsgfTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNvdW50PTA7XG4gICAgZm9yKGk9MTtpPG5bMF0tMTtpKyspIGZvcihqPTE7ajxuWzFdLTE7aisrKSBcbiAgICAgICAgaWYoc2hhcGUoaSxqKSkge1xuICAgICAgICAgICAgcmV0W2ldW2pdID0gY291bnQ7XG4gICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICB9XG4gICAgcmV0dXJuIHJldDtcbn1cblxubnVtZXJpYy5jZGVsc3EgPSBmdW5jdGlvbiBkZWxzcShnKSB7XG4gICAgdmFyIGRpciA9IFtbLTEsMF0sWzAsLTFdLFswLDFdLFsxLDBdXTtcbiAgICB2YXIgcyA9IG51bWVyaWMuZGltKGcpLCBtID0gc1swXSwgbiA9IHNbMV0sIGksaixrLHAscTtcbiAgICB2YXIgTGkgPSBbXSwgTGogPSBbXSwgTHYgPSBbXTtcbiAgICBmb3IoaT0xO2k8bS0xO2krKykgZm9yKGo9MTtqPG4tMTtqKyspIHtcbiAgICAgICAgaWYoZ1tpXVtqXTwwKSBjb250aW51ZTtcbiAgICAgICAgZm9yKGs9MDtrPDQ7aysrKSB7XG4gICAgICAgICAgICBwID0gaStkaXJba11bMF07XG4gICAgICAgICAgICBxID0gaitkaXJba11bMV07XG4gICAgICAgICAgICBpZihnW3BdW3FdPDApIGNvbnRpbnVlO1xuICAgICAgICAgICAgTGkucHVzaChnW2ldW2pdKTtcbiAgICAgICAgICAgIExqLnB1c2goZ1twXVtxXSk7XG4gICAgICAgICAgICBMdi5wdXNoKC0xKTtcbiAgICAgICAgfVxuICAgICAgICBMaS5wdXNoKGdbaV1bal0pO1xuICAgICAgICBMai5wdXNoKGdbaV1bal0pO1xuICAgICAgICBMdi5wdXNoKDQpO1xuICAgIH1cbiAgICByZXR1cm4gW0xpLExqLEx2XTtcbn1cblxubnVtZXJpYy5jZG90TVYgPSBmdW5jdGlvbiBkb3RNVihBLHgpIHtcbiAgICB2YXIgcmV0LCBBaSA9IEFbMF0sIEFqID0gQVsxXSwgQXYgPSBBWzJdLGsscD1BaS5sZW5ndGgsTjtcbiAgICBOPTA7XG4gICAgZm9yKGs9MDtrPHA7aysrKSB7IGlmKEFpW2tdPk4pIE4gPSBBaVtrXTsgfVxuICAgIE4rKztcbiAgICByZXQgPSBudW1lcmljLnJlcChbTl0sMCk7XG4gICAgZm9yKGs9MDtrPHA7aysrKSB7IHJldFtBaVtrXV0rPUF2W2tdKnhbQWpba11dOyB9XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLy8gNy4gU3BsaW5lc1xuXG5udW1lcmljLlNwbGluZSA9IGZ1bmN0aW9uIFNwbGluZSh4LHlsLHlyLGtsLGtyKSB7IHRoaXMueCA9IHg7IHRoaXMueWwgPSB5bDsgdGhpcy55ciA9IHlyOyB0aGlzLmtsID0ga2w7IHRoaXMua3IgPSBrcjsgfVxubnVtZXJpYy5TcGxpbmUucHJvdG90eXBlLl9hdCA9IGZ1bmN0aW9uIF9hdCh4MSxwKSB7XG4gICAgdmFyIHggPSB0aGlzLng7XG4gICAgdmFyIHlsID0gdGhpcy55bDtcbiAgICB2YXIgeXIgPSB0aGlzLnlyO1xuICAgIHZhciBrbCA9IHRoaXMua2w7XG4gICAgdmFyIGtyID0gdGhpcy5rcjtcbiAgICB2YXIgeDEsYSxiLHQ7XG4gICAgdmFyIGFkZCA9IG51bWVyaWMuYWRkLCBzdWIgPSBudW1lcmljLnN1YiwgbXVsID0gbnVtZXJpYy5tdWw7XG4gICAgYSA9IHN1YihtdWwoa2xbcF0seFtwKzFdLXhbcF0pLHN1Yih5cltwKzFdLHlsW3BdKSk7XG4gICAgYiA9IGFkZChtdWwoa3JbcCsxXSx4W3BdLXhbcCsxXSksc3ViKHlyW3ArMV0seWxbcF0pKTtcbiAgICB0ID0gKHgxLXhbcF0pLyh4W3ArMV0teFtwXSk7XG4gICAgdmFyIHMgPSB0KigxLXQpO1xuICAgIHJldHVybiBhZGQoYWRkKGFkZChtdWwoMS10LHlsW3BdKSxtdWwodCx5cltwKzFdKSksbXVsKGEscyooMS10KSkpLG11bChiLHMqdCkpO1xufVxubnVtZXJpYy5TcGxpbmUucHJvdG90eXBlLmF0ID0gZnVuY3Rpb24gYXQoeDApIHtcbiAgICBpZih0eXBlb2YgeDAgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgdmFyIHggPSB0aGlzLng7XG4gICAgICAgIHZhciBuID0geC5sZW5ndGg7XG4gICAgICAgIHZhciBwLHEsbWlkLGZsb29yID0gTWF0aC5mbG9vcixhLGIsdDtcbiAgICAgICAgcCA9IDA7XG4gICAgICAgIHEgPSBuLTE7XG4gICAgICAgIHdoaWxlKHEtcD4xKSB7XG4gICAgICAgICAgICBtaWQgPSBmbG9vcigocCtxKS8yKTtcbiAgICAgICAgICAgIGlmKHhbbWlkXSA8PSB4MCkgcCA9IG1pZDtcbiAgICAgICAgICAgIGVsc2UgcSA9IG1pZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fYXQoeDAscCk7XG4gICAgfVxuICAgIHZhciBuID0geDAubGVuZ3RoLCBpLCByZXQgPSBBcnJheShuKTtcbiAgICBmb3IoaT1uLTE7aSE9PS0xOy0taSkgcmV0W2ldID0gdGhpcy5hdCh4MFtpXSk7XG4gICAgcmV0dXJuIHJldDtcbn1cbm51bWVyaWMuU3BsaW5lLnByb3RvdHlwZS5kaWZmID0gZnVuY3Rpb24gZGlmZigpIHtcbiAgICB2YXIgeCA9IHRoaXMueDtcbiAgICB2YXIgeWwgPSB0aGlzLnlsO1xuICAgIHZhciB5ciA9IHRoaXMueXI7XG4gICAgdmFyIGtsID0gdGhpcy5rbDtcbiAgICB2YXIga3IgPSB0aGlzLmtyO1xuICAgIHZhciBuID0geWwubGVuZ3RoO1xuICAgIHZhciBpLGR4LGR5O1xuICAgIHZhciB6bCA9IGtsLCB6ciA9IGtyLCBwbCA9IEFycmF5KG4pLCBwciA9IEFycmF5KG4pO1xuICAgIHZhciBhZGQgPSBudW1lcmljLmFkZCwgbXVsID0gbnVtZXJpYy5tdWwsIGRpdiA9IG51bWVyaWMuZGl2LCBzdWIgPSBudW1lcmljLnN1YjtcbiAgICBmb3IoaT1uLTE7aSE9PS0xOy0taSkge1xuICAgICAgICBkeCA9IHhbaSsxXS14W2ldO1xuICAgICAgICBkeSA9IHN1Yih5cltpKzFdLHlsW2ldKTtcbiAgICAgICAgcGxbaV0gPSBkaXYoYWRkKG11bChkeSwgNiksbXVsKGtsW2ldLC00KmR4KSxtdWwoa3JbaSsxXSwtMipkeCkpLGR4KmR4KTtcbiAgICAgICAgcHJbaSsxXSA9IGRpdihhZGQobXVsKGR5LC02KSxtdWwoa2xbaV0sIDIqZHgpLG11bChrcltpKzFdLCA0KmR4KSksZHgqZHgpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IG51bWVyaWMuU3BsaW5lKHgsemwsenIscGwscHIpO1xufVxubnVtZXJpYy5TcGxpbmUucHJvdG90eXBlLnJvb3RzID0gZnVuY3Rpb24gcm9vdHMoKSB7XG4gICAgZnVuY3Rpb24gc3FyKHgpIHsgcmV0dXJuIHgqeDsgfVxuICAgIGZ1bmN0aW9uIGhldmFsKHkwLHkxLGswLGsxLHgpIHtcbiAgICAgICAgdmFyIEEgPSBrMCoyLSh5MS15MCk7XG4gICAgICAgIHZhciBCID0gLWsxKjIrKHkxLXkwKTtcbiAgICAgICAgdmFyIHQgPSAoeCsxKSowLjU7XG4gICAgICAgIHZhciBzID0gdCooMS10KTtcbiAgICAgICAgcmV0dXJuICgxLXQpKnkwK3QqeTErQSpzKigxLXQpK0Iqcyp0O1xuICAgIH1cbiAgICB2YXIgcmV0ID0gW107XG4gICAgdmFyIHggPSB0aGlzLngsIHlsID0gdGhpcy55bCwgeXIgPSB0aGlzLnlyLCBrbCA9IHRoaXMua2wsIGtyID0gdGhpcy5rcjtcbiAgICBpZih0eXBlb2YgeWxbMF0gPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgeWwgPSBbeWxdO1xuICAgICAgICB5ciA9IFt5cl07XG4gICAgICAgIGtsID0gW2tsXTtcbiAgICAgICAga3IgPSBba3JdO1xuICAgIH1cbiAgICB2YXIgbSA9IHlsLmxlbmd0aCxuPXgubGVuZ3RoLTEsaSxqLGsseSxzLHQ7XG4gICAgdmFyIGFpLGJpLGNpLGRpLCByZXQgPSBBcnJheShtKSxyaSxrMCxrMSx5MCx5MSxBLEIsRCxkeCxjeCxzdG9wcyx6MCx6MSx6bSx0MCx0MSx0bTtcbiAgICB2YXIgc3FydCA9IE1hdGguc3FydDtcbiAgICBmb3IoaT0wO2khPT1tOysraSkge1xuICAgICAgICBhaSA9IHlsW2ldO1xuICAgICAgICBiaSA9IHlyW2ldO1xuICAgICAgICBjaSA9IGtsW2ldO1xuICAgICAgICBkaSA9IGtyW2ldO1xuICAgICAgICByaSA9IFtdO1xuICAgICAgICBmb3Ioaj0wO2ohPT1uO2orKykge1xuICAgICAgICAgICAgaWYoaj4wICYmIGJpW2pdKmFpW2pdPDApIHJpLnB1c2goeFtqXSk7XG4gICAgICAgICAgICBkeCA9ICh4W2orMV0teFtqXSk7XG4gICAgICAgICAgICBjeCA9IHhbal07XG4gICAgICAgICAgICB5MCA9IGFpW2pdO1xuICAgICAgICAgICAgeTEgPSBiaVtqKzFdO1xuICAgICAgICAgICAgazAgPSBjaVtqXS9keDtcbiAgICAgICAgICAgIGsxID0gZGlbaisxXS9keDtcbiAgICAgICAgICAgIEQgPSBzcXIoazAtazErMyooeTAteTEpKSArIDEyKmsxKnkwO1xuICAgICAgICAgICAgQSA9IGsxKzMqeTArMiprMC0zKnkxO1xuICAgICAgICAgICAgQiA9IDMqKGsxK2swKzIqKHkwLXkxKSk7XG4gICAgICAgICAgICBpZihEPD0wKSB7XG4gICAgICAgICAgICAgICAgejAgPSBBL0I7XG4gICAgICAgICAgICAgICAgaWYoejA+eFtqXSAmJiB6MDx4W2orMV0pIHN0b3BzID0gW3hbal0sejAseFtqKzFdXTtcbiAgICAgICAgICAgICAgICBlbHNlIHN0b3BzID0gW3hbal0seFtqKzFdXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgejAgPSAoQS1zcXJ0KEQpKS9CO1xuICAgICAgICAgICAgICAgIHoxID0gKEErc3FydChEKSkvQjtcbiAgICAgICAgICAgICAgICBzdG9wcyA9IFt4W2pdXTtcbiAgICAgICAgICAgICAgICBpZih6MD54W2pdICYmIHowPHhbaisxXSkgc3RvcHMucHVzaCh6MCk7XG4gICAgICAgICAgICAgICAgaWYoejE+eFtqXSAmJiB6MTx4W2orMV0pIHN0b3BzLnB1c2goejEpO1xuICAgICAgICAgICAgICAgIHN0b3BzLnB1c2goeFtqKzFdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHQwID0gc3RvcHNbMF07XG4gICAgICAgICAgICB6MCA9IHRoaXMuX2F0KHQwLGopO1xuICAgICAgICAgICAgZm9yKGs9MDtrPHN0b3BzLmxlbmd0aC0xO2srKykge1xuICAgICAgICAgICAgICAgIHQxID0gc3RvcHNbaysxXTtcbiAgICAgICAgICAgICAgICB6MSA9IHRoaXMuX2F0KHQxLGopO1xuICAgICAgICAgICAgICAgIGlmKHowID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJpLnB1c2godDApOyBcbiAgICAgICAgICAgICAgICAgICAgdDAgPSB0MTtcbiAgICAgICAgICAgICAgICAgICAgejAgPSB6MTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmKHoxID09PSAwIHx8IHowKnoxPjApIHtcbiAgICAgICAgICAgICAgICAgICAgdDAgPSB0MTtcbiAgICAgICAgICAgICAgICAgICAgejAgPSB6MTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBzaWRlID0gMDtcbiAgICAgICAgICAgICAgICB3aGlsZSgxKSB7XG4gICAgICAgICAgICAgICAgICAgIHRtID0gKHowKnQxLXoxKnQwKS8oejAtejEpO1xuICAgICAgICAgICAgICAgICAgICBpZih0bSA8PSB0MCB8fCB0bSA+PSB0MSkgeyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICB6bSA9IHRoaXMuX2F0KHRtLGopO1xuICAgICAgICAgICAgICAgICAgICBpZih6bSp6MT4wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0MSA9IHRtO1xuICAgICAgICAgICAgICAgICAgICAgICAgejEgPSB6bTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHNpZGUgPT09IC0xKSB6MCo9MC41O1xuICAgICAgICAgICAgICAgICAgICAgICAgc2lkZSA9IC0xO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYoem0qejA+MCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdDAgPSB0bTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHowID0gem07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihzaWRlID09PSAxKSB6MSo9MC41O1xuICAgICAgICAgICAgICAgICAgICAgICAgc2lkZSA9IDE7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmkucHVzaCh0bSk7XG4gICAgICAgICAgICAgICAgdDAgPSBzdG9wc1trKzFdO1xuICAgICAgICAgICAgICAgIHowID0gdGhpcy5fYXQodDAsIGopO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoejEgPT09IDApIHJpLnB1c2godDEpO1xuICAgICAgICB9XG4gICAgICAgIHJldFtpXSA9IHJpO1xuICAgIH1cbiAgICBpZih0eXBlb2YgdGhpcy55bFswXSA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHJldFswXTtcbiAgICByZXR1cm4gcmV0O1xufVxubnVtZXJpYy5zcGxpbmUgPSBmdW5jdGlvbiBzcGxpbmUoeCx5LGsxLGtuKSB7XG4gICAgdmFyIG4gPSB4Lmxlbmd0aCwgYiA9IFtdLCBkeCA9IFtdLCBkeSA9IFtdO1xuICAgIHZhciBpO1xuICAgIHZhciBzdWIgPSBudW1lcmljLnN1YixtdWwgPSBudW1lcmljLm11bCxhZGQgPSBudW1lcmljLmFkZDtcbiAgICBmb3IoaT1uLTI7aT49MDtpLS0pIHsgZHhbaV0gPSB4W2krMV0teFtpXTsgZHlbaV0gPSBzdWIoeVtpKzFdLHlbaV0pOyB9XG4gICAgaWYodHlwZW9mIGsxID09PSBcInN0cmluZ1wiIHx8IHR5cGVvZiBrbiA9PT0gXCJzdHJpbmdcIikgeyBcbiAgICAgICAgazEgPSBrbiA9IFwicGVyaW9kaWNcIjtcbiAgICB9XG4gICAgLy8gQnVpbGQgc3BhcnNlIHRyaWRpYWdvbmFsIHN5c3RlbVxuICAgIHZhciBUID0gW1tdLFtdLFtdXTtcbiAgICBzd2l0Y2godHlwZW9mIGsxKSB7XG4gICAgY2FzZSBcInVuZGVmaW5lZFwiOlxuICAgICAgICBiWzBdID0gbXVsKDMvKGR4WzBdKmR4WzBdKSxkeVswXSk7XG4gICAgICAgIFRbMF0ucHVzaCgwLDApO1xuICAgICAgICBUWzFdLnB1c2goMCwxKTtcbiAgICAgICAgVFsyXS5wdXNoKDIvZHhbMF0sMS9keFswXSk7XG4gICAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgICAgYlswXSA9IGFkZChtdWwoMy8oZHhbbi0yXSpkeFtuLTJdKSxkeVtuLTJdKSxtdWwoMy8oZHhbMF0qZHhbMF0pLGR5WzBdKSk7XG4gICAgICAgIFRbMF0ucHVzaCgwLDAsMCk7XG4gICAgICAgIFRbMV0ucHVzaChuLTIsMCwxKTtcbiAgICAgICAgVFsyXS5wdXNoKDEvZHhbbi0yXSwyL2R4W24tMl0rMi9keFswXSwxL2R4WzBdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgICAgYlswXSA9IGsxO1xuICAgICAgICBUWzBdLnB1c2goMCk7XG4gICAgICAgIFRbMV0ucHVzaCgwKTtcbiAgICAgICAgVFsyXS5wdXNoKDEpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgZm9yKGk9MTtpPG4tMTtpKyspIHtcbiAgICAgICAgYltpXSA9IGFkZChtdWwoMy8oZHhbaS0xXSpkeFtpLTFdKSxkeVtpLTFdKSxtdWwoMy8oZHhbaV0qZHhbaV0pLGR5W2ldKSk7XG4gICAgICAgIFRbMF0ucHVzaChpLGksaSk7XG4gICAgICAgIFRbMV0ucHVzaChpLTEsaSxpKzEpO1xuICAgICAgICBUWzJdLnB1c2goMS9keFtpLTFdLDIvZHhbaS0xXSsyL2R4W2ldLDEvZHhbaV0pO1xuICAgIH1cbiAgICBzd2l0Y2godHlwZW9mIGtuKSB7XG4gICAgY2FzZSBcInVuZGVmaW5lZFwiOlxuICAgICAgICBiW24tMV0gPSBtdWwoMy8oZHhbbi0yXSpkeFtuLTJdKSxkeVtuLTJdKTtcbiAgICAgICAgVFswXS5wdXNoKG4tMSxuLTEpO1xuICAgICAgICBUWzFdLnB1c2gobi0yLG4tMSk7XG4gICAgICAgIFRbMl0ucHVzaCgxL2R4W24tMl0sMi9keFtuLTJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgICBUWzFdW1RbMV0ubGVuZ3RoLTFdID0gMDtcbiAgICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgICAgYltuLTFdID0ga247XG4gICAgICAgIFRbMF0ucHVzaChuLTEpO1xuICAgICAgICBUWzFdLnB1c2gobi0xKTtcbiAgICAgICAgVFsyXS5wdXNoKDEpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgaWYodHlwZW9mIGJbMF0gIT09IFwibnVtYmVyXCIpIGIgPSBudW1lcmljLnRyYW5zcG9zZShiKTtcbiAgICBlbHNlIGIgPSBbYl07XG4gICAgdmFyIGsgPSBBcnJheShiLmxlbmd0aCk7XG4gICAgaWYodHlwZW9mIGsxID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIGZvcihpPWsubGVuZ3RoLTE7aSE9PS0xOy0taSkge1xuICAgICAgICAgICAga1tpXSA9IG51bWVyaWMuY2NzTFVQU29sdmUobnVtZXJpYy5jY3NMVVAobnVtZXJpYy5jY3NTY2F0dGVyKFQpKSxiW2ldKTtcbiAgICAgICAgICAgIGtbaV1bbi0xXSA9IGtbaV1bMF07XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBmb3IoaT1rLmxlbmd0aC0xO2khPT0tMTstLWkpIHtcbiAgICAgICAgICAgIGtbaV0gPSBudW1lcmljLmNMVXNvbHZlKG51bWVyaWMuY0xVKFQpLGJbaV0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmKHR5cGVvZiB5WzBdID09PSBcIm51bWJlclwiKSBrID0ga1swXTtcbiAgICBlbHNlIGsgPSBudW1lcmljLnRyYW5zcG9zZShrKTtcbiAgICByZXR1cm4gbmV3IG51bWVyaWMuU3BsaW5lKHgseSx5LGssayk7XG59XG5cbi8vIDguIEZGVFxubnVtZXJpYy5mZnRwb3cyID0gZnVuY3Rpb24gZmZ0cG93Mih4LHkpIHtcbiAgICB2YXIgbiA9IHgubGVuZ3RoO1xuICAgIGlmKG4gPT09IDEpIHJldHVybjtcbiAgICB2YXIgY29zID0gTWF0aC5jb3MsIHNpbiA9IE1hdGguc2luLCBpLGo7XG4gICAgdmFyIHhlID0gQXJyYXkobi8yKSwgeWUgPSBBcnJheShuLzIpLCB4byA9IEFycmF5KG4vMiksIHlvID0gQXJyYXkobi8yKTtcbiAgICBqID0gbi8yO1xuICAgIGZvcihpPW4tMTtpIT09LTE7LS1pKSB7XG4gICAgICAgIC0tajtcbiAgICAgICAgeG9bal0gPSB4W2ldO1xuICAgICAgICB5b1tqXSA9IHlbaV07XG4gICAgICAgIC0taTtcbiAgICAgICAgeGVbal0gPSB4W2ldO1xuICAgICAgICB5ZVtqXSA9IHlbaV07XG4gICAgfVxuICAgIGZmdHBvdzIoeGUseWUpO1xuICAgIGZmdHBvdzIoeG8seW8pO1xuICAgIGogPSBuLzI7XG4gICAgdmFyIHQsayA9ICgtNi4yODMxODUzMDcxNzk1ODY0NzY5MjUyODY3NjY1NTkwMDU3NjgzOTQzMzg3OTg3NTAyMTE2NDE5L24pLGNpLHNpO1xuICAgIGZvcihpPW4tMTtpIT09LTE7LS1pKSB7XG4gICAgICAgIC0tajtcbiAgICAgICAgaWYoaiA9PT0gLTEpIGogPSBuLzItMTtcbiAgICAgICAgdCA9IGsqaTtcbiAgICAgICAgY2kgPSBjb3ModCk7XG4gICAgICAgIHNpID0gc2luKHQpO1xuICAgICAgICB4W2ldID0geGVbal0gKyBjaSp4b1tqXSAtIHNpKnlvW2pdO1xuICAgICAgICB5W2ldID0geWVbal0gKyBjaSp5b1tqXSArIHNpKnhvW2pdO1xuICAgIH1cbn1cbm51bWVyaWMuX2lmZnRwb3cyID0gZnVuY3Rpb24gX2lmZnRwb3cyKHgseSkge1xuICAgIHZhciBuID0geC5sZW5ndGg7XG4gICAgaWYobiA9PT0gMSkgcmV0dXJuO1xuICAgIHZhciBjb3MgPSBNYXRoLmNvcywgc2luID0gTWF0aC5zaW4sIGksajtcbiAgICB2YXIgeGUgPSBBcnJheShuLzIpLCB5ZSA9IEFycmF5KG4vMiksIHhvID0gQXJyYXkobi8yKSwgeW8gPSBBcnJheShuLzIpO1xuICAgIGogPSBuLzI7XG4gICAgZm9yKGk9bi0xO2khPT0tMTstLWkpIHtcbiAgICAgICAgLS1qO1xuICAgICAgICB4b1tqXSA9IHhbaV07XG4gICAgICAgIHlvW2pdID0geVtpXTtcbiAgICAgICAgLS1pO1xuICAgICAgICB4ZVtqXSA9IHhbaV07XG4gICAgICAgIHllW2pdID0geVtpXTtcbiAgICB9XG4gICAgX2lmZnRwb3cyKHhlLHllKTtcbiAgICBfaWZmdHBvdzIoeG8seW8pO1xuICAgIGogPSBuLzI7XG4gICAgdmFyIHQsayA9ICg2LjI4MzE4NTMwNzE3OTU4NjQ3NjkyNTI4Njc2NjU1OTAwNTc2ODM5NDMzODc5ODc1MDIxMTY0MTkvbiksY2ksc2k7XG4gICAgZm9yKGk9bi0xO2khPT0tMTstLWkpIHtcbiAgICAgICAgLS1qO1xuICAgICAgICBpZihqID09PSAtMSkgaiA9IG4vMi0xO1xuICAgICAgICB0ID0gayppO1xuICAgICAgICBjaSA9IGNvcyh0KTtcbiAgICAgICAgc2kgPSBzaW4odCk7XG4gICAgICAgIHhbaV0gPSB4ZVtqXSArIGNpKnhvW2pdIC0gc2kqeW9bal07XG4gICAgICAgIHlbaV0gPSB5ZVtqXSArIGNpKnlvW2pdICsgc2kqeG9bal07XG4gICAgfVxufVxubnVtZXJpYy5pZmZ0cG93MiA9IGZ1bmN0aW9uIGlmZnRwb3cyKHgseSkge1xuICAgIG51bWVyaWMuX2lmZnRwb3cyKHgseSk7XG4gICAgbnVtZXJpYy5kaXZlcSh4LHgubGVuZ3RoKTtcbiAgICBudW1lcmljLmRpdmVxKHkseS5sZW5ndGgpO1xufVxubnVtZXJpYy5jb252cG93MiA9IGZ1bmN0aW9uIGNvbnZwb3cyKGF4LGF5LGJ4LGJ5KSB7XG4gICAgbnVtZXJpYy5mZnRwb3cyKGF4LGF5KTtcbiAgICBudW1lcmljLmZmdHBvdzIoYngsYnkpO1xuICAgIHZhciBpLG4gPSBheC5sZW5ndGgsYXhpLGJ4aSxheWksYnlpO1xuICAgIGZvcihpPW4tMTtpIT09LTE7LS1pKSB7XG4gICAgICAgIGF4aSA9IGF4W2ldOyBheWkgPSBheVtpXTsgYnhpID0gYnhbaV07IGJ5aSA9IGJ5W2ldO1xuICAgICAgICBheFtpXSA9IGF4aSpieGktYXlpKmJ5aTtcbiAgICAgICAgYXlbaV0gPSBheGkqYnlpK2F5aSpieGk7XG4gICAgfVxuICAgIG51bWVyaWMuaWZmdHBvdzIoYXgsYXkpO1xufVxubnVtZXJpYy5ULnByb3RvdHlwZS5mZnQgPSBmdW5jdGlvbiBmZnQoKSB7XG4gICAgdmFyIHggPSB0aGlzLngsIHkgPSB0aGlzLnk7XG4gICAgdmFyIG4gPSB4Lmxlbmd0aCwgbG9nID0gTWF0aC5sb2csIGxvZzIgPSBsb2coMiksXG4gICAgICAgIHAgPSBNYXRoLmNlaWwobG9nKDIqbi0xKS9sb2cyKSwgbSA9IE1hdGgucG93KDIscCk7XG4gICAgdmFyIGN4ID0gbnVtZXJpYy5yZXAoW21dLDApLCBjeSA9IG51bWVyaWMucmVwKFttXSwwKSwgY29zID0gTWF0aC5jb3MsIHNpbiA9IE1hdGguc2luO1xuICAgIHZhciBrLCBjID0gKC0zLjE0MTU5MjY1MzU4OTc5MzIzODQ2MjY0MzM4MzI3OTUwMjg4NDE5NzE2OTM5OTM3NTEwNTgyMC9uKSx0O1xuICAgIHZhciBhID0gbnVtZXJpYy5yZXAoW21dLDApLCBiID0gbnVtZXJpYy5yZXAoW21dLDApLG5oYWxmID0gTWF0aC5mbG9vcihuLzIpO1xuICAgIGZvcihrPTA7azxuO2srKykgYVtrXSA9IHhba107XG4gICAgaWYodHlwZW9mIHkgIT09IFwidW5kZWZpbmVkXCIpIGZvcihrPTA7azxuO2srKykgYltrXSA9IHlba107XG4gICAgY3hbMF0gPSAxO1xuICAgIGZvcihrPTE7azw9bS8yO2srKykge1xuICAgICAgICB0ID0gYyprKms7XG4gICAgICAgIGN4W2tdID0gY29zKHQpO1xuICAgICAgICBjeVtrXSA9IHNpbih0KTtcbiAgICAgICAgY3hbbS1rXSA9IGNvcyh0KTtcbiAgICAgICAgY3lbbS1rXSA9IHNpbih0KVxuICAgIH1cbiAgICB2YXIgWCA9IG5ldyBudW1lcmljLlQoYSxiKSwgWSA9IG5ldyBudW1lcmljLlQoY3gsY3kpO1xuICAgIFggPSBYLm11bChZKTtcbiAgICBudW1lcmljLmNvbnZwb3cyKFgueCxYLnksbnVtZXJpYy5jbG9uZShZLngpLG51bWVyaWMubmVnKFkueSkpO1xuICAgIFggPSBYLm11bChZKTtcbiAgICBYLngubGVuZ3RoID0gbjtcbiAgICBYLnkubGVuZ3RoID0gbjtcbiAgICByZXR1cm4gWDtcbn1cbm51bWVyaWMuVC5wcm90b3R5cGUuaWZmdCA9IGZ1bmN0aW9uIGlmZnQoKSB7XG4gICAgdmFyIHggPSB0aGlzLngsIHkgPSB0aGlzLnk7XG4gICAgdmFyIG4gPSB4Lmxlbmd0aCwgbG9nID0gTWF0aC5sb2csIGxvZzIgPSBsb2coMiksXG4gICAgICAgIHAgPSBNYXRoLmNlaWwobG9nKDIqbi0xKS9sb2cyKSwgbSA9IE1hdGgucG93KDIscCk7XG4gICAgdmFyIGN4ID0gbnVtZXJpYy5yZXAoW21dLDApLCBjeSA9IG51bWVyaWMucmVwKFttXSwwKSwgY29zID0gTWF0aC5jb3MsIHNpbiA9IE1hdGguc2luO1xuICAgIHZhciBrLCBjID0gKDMuMTQxNTkyNjUzNTg5NzkzMjM4NDYyNjQzMzgzMjc5NTAyODg0MTk3MTY5Mzk5Mzc1MTA1ODIwL24pLHQ7XG4gICAgdmFyIGEgPSBudW1lcmljLnJlcChbbV0sMCksIGIgPSBudW1lcmljLnJlcChbbV0sMCksbmhhbGYgPSBNYXRoLmZsb29yKG4vMik7XG4gICAgZm9yKGs9MDtrPG47aysrKSBhW2tdID0geFtrXTtcbiAgICBpZih0eXBlb2YgeSAhPT0gXCJ1bmRlZmluZWRcIikgZm9yKGs9MDtrPG47aysrKSBiW2tdID0geVtrXTtcbiAgICBjeFswXSA9IDE7XG4gICAgZm9yKGs9MTtrPD1tLzI7aysrKSB7XG4gICAgICAgIHQgPSBjKmsqaztcbiAgICAgICAgY3hba10gPSBjb3ModCk7XG4gICAgICAgIGN5W2tdID0gc2luKHQpO1xuICAgICAgICBjeFttLWtdID0gY29zKHQpO1xuICAgICAgICBjeVttLWtdID0gc2luKHQpXG4gICAgfVxuICAgIHZhciBYID0gbmV3IG51bWVyaWMuVChhLGIpLCBZID0gbmV3IG51bWVyaWMuVChjeCxjeSk7XG4gICAgWCA9IFgubXVsKFkpO1xuICAgIG51bWVyaWMuY29udnBvdzIoWC54LFgueSxudW1lcmljLmNsb25lKFkueCksbnVtZXJpYy5uZWcoWS55KSk7XG4gICAgWCA9IFgubXVsKFkpO1xuICAgIFgueC5sZW5ndGggPSBuO1xuICAgIFgueS5sZW5ndGggPSBuO1xuICAgIHJldHVybiBYLmRpdihuKTtcbn1cblxuLy85LiBVbmNvbnN0cmFpbmVkIG9wdGltaXphdGlvblxubnVtZXJpYy5ncmFkaWVudCA9IGZ1bmN0aW9uIGdyYWRpZW50KGYseCkge1xuICAgIHZhciBuID0geC5sZW5ndGg7XG4gICAgdmFyIGYwID0gZih4KTtcbiAgICBpZihpc05hTihmMCkpIHRocm93IG5ldyBFcnJvcignZ3JhZGllbnQ6IGYoeCkgaXMgYSBOYU4hJyk7XG4gICAgdmFyIG1heCA9IE1hdGgubWF4O1xuICAgIHZhciBpLHgwID0gbnVtZXJpYy5jbG9uZSh4KSxmMSxmMiwgSiA9IEFycmF5KG4pO1xuICAgIHZhciBkaXYgPSBudW1lcmljLmRpdiwgc3ViID0gbnVtZXJpYy5zdWIsZXJyZXN0LHJvdW5kb2ZmLG1heCA9IE1hdGgubWF4LGVwcyA9IDFlLTMsYWJzID0gTWF0aC5hYnMsIG1pbiA9IE1hdGgubWluO1xuICAgIHZhciB0MCx0MSx0MixpdD0wLGQxLGQyLE47XG4gICAgZm9yKGk9MDtpPG47aSsrKSB7XG4gICAgICAgIHZhciBoID0gbWF4KDFlLTYqZjAsMWUtOCk7XG4gICAgICAgIHdoaWxlKDEpIHtcbiAgICAgICAgICAgICsraXQ7XG4gICAgICAgICAgICBpZihpdD4yMCkgeyB0aHJvdyBuZXcgRXJyb3IoXCJOdW1lcmljYWwgZ3JhZGllbnQgZmFpbHNcIik7IH1cbiAgICAgICAgICAgIHgwW2ldID0geFtpXStoO1xuICAgICAgICAgICAgZjEgPSBmKHgwKTtcbiAgICAgICAgICAgIHgwW2ldID0geFtpXS1oO1xuICAgICAgICAgICAgZjIgPSBmKHgwKTtcbiAgICAgICAgICAgIHgwW2ldID0geFtpXTtcbiAgICAgICAgICAgIGlmKGlzTmFOKGYxKSB8fCBpc05hTihmMikpIHsgaC89MTY7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICBKW2ldID0gKGYxLWYyKS8oMipoKTtcbiAgICAgICAgICAgIHQwID0geFtpXS1oO1xuICAgICAgICAgICAgdDEgPSB4W2ldO1xuICAgICAgICAgICAgdDIgPSB4W2ldK2g7XG4gICAgICAgICAgICBkMSA9IChmMS1mMCkvaDtcbiAgICAgICAgICAgIGQyID0gKGYwLWYyKS9oO1xuICAgICAgICAgICAgTiA9IG1heChhYnMoSltpXSksYWJzKGYwKSxhYnMoZjEpLGFicyhmMiksYWJzKHQwKSxhYnModDEpLGFicyh0MiksMWUtOCk7XG4gICAgICAgICAgICBlcnJlc3QgPSBtaW4obWF4KGFicyhkMS1KW2ldKSxhYnMoZDItSltpXSksYWJzKGQxLWQyKSkvTixoL04pO1xuICAgICAgICAgICAgaWYoZXJyZXN0PmVwcykgeyBoLz0xNjsgfVxuICAgICAgICAgICAgZWxzZSBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIEo7XG59XG5cbm51bWVyaWMudW5jbWluID0gZnVuY3Rpb24gdW5jbWluKGYseDAsdG9sLGdyYWRpZW50LG1heGl0LGNhbGxiYWNrLG9wdGlvbnMpIHtcbiAgICB2YXIgZ3JhZCA9IG51bWVyaWMuZ3JhZGllbnQ7XG4gICAgaWYodHlwZW9mIG9wdGlvbnMgPT09IFwidW5kZWZpbmVkXCIpIHsgb3B0aW9ucyA9IHt9OyB9XG4gICAgaWYodHlwZW9mIHRvbCA9PT0gXCJ1bmRlZmluZWRcIikgeyB0b2wgPSAxZS04OyB9XG4gICAgaWYodHlwZW9mIGdyYWRpZW50ID09PSBcInVuZGVmaW5lZFwiKSB7IGdyYWRpZW50ID0gZnVuY3Rpb24oeCkgeyByZXR1cm4gZ3JhZChmLHgpOyB9OyB9XG4gICAgaWYodHlwZW9mIG1heGl0ID09PSBcInVuZGVmaW5lZFwiKSBtYXhpdCA9IDEwMDA7XG4gICAgeDAgPSBudW1lcmljLmNsb25lKHgwKTtcbiAgICB2YXIgbiA9IHgwLmxlbmd0aDtcbiAgICB2YXIgZjAgPSBmKHgwKSxmMSxkZjA7XG4gICAgaWYoaXNOYU4oZjApKSB0aHJvdyBuZXcgRXJyb3IoJ3VuY21pbjogZih4MCkgaXMgYSBOYU4hJyk7XG4gICAgdmFyIG1heCA9IE1hdGgubWF4LCBub3JtMiA9IG51bWVyaWMubm9ybTI7XG4gICAgdG9sID0gbWF4KHRvbCxudW1lcmljLmVwc2lsb24pO1xuICAgIHZhciBzdGVwLGcwLGcxLEgxID0gb3B0aW9ucy5IaW52IHx8IG51bWVyaWMuaWRlbnRpdHkobik7XG4gICAgdmFyIGRvdCA9IG51bWVyaWMuZG90LCBpbnYgPSBudW1lcmljLmludiwgc3ViID0gbnVtZXJpYy5zdWIsIGFkZCA9IG51bWVyaWMuYWRkLCB0ZW4gPSBudW1lcmljLnRlbnNvciwgZGl2ID0gbnVtZXJpYy5kaXYsIG11bCA9IG51bWVyaWMubXVsO1xuICAgIHZhciBhbGwgPSBudW1lcmljLmFsbCwgaXNmaW5pdGUgPSBudW1lcmljLmlzRmluaXRlLCBuZWcgPSBudW1lcmljLm5lZztcbiAgICB2YXIgaXQ9MCxpLHMseDEseSxIeSxIcyx5cyxpMCx0LG5zdGVwLHQxLHQyO1xuICAgIHZhciBtc2cgPSBcIlwiO1xuICAgIGcwID0gZ3JhZGllbnQoeDApO1xuICAgIHdoaWxlKGl0PG1heGl0KSB7XG4gICAgICAgIGlmKHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7IGlmKGNhbGxiYWNrKGl0LHgwLGYwLGcwLEgxKSkgeyBtc2cgPSBcIkNhbGxiYWNrIHJldHVybmVkIHRydWVcIjsgYnJlYWs7IH0gfVxuICAgICAgICBpZighYWxsKGlzZmluaXRlKGcwKSkpIHsgbXNnID0gXCJHcmFkaWVudCBoYXMgSW5maW5pdHkgb3IgTmFOXCI7IGJyZWFrOyB9XG4gICAgICAgIHN0ZXAgPSBuZWcoZG90KEgxLGcwKSk7XG4gICAgICAgIGlmKCFhbGwoaXNmaW5pdGUoc3RlcCkpKSB7IG1zZyA9IFwiU2VhcmNoIGRpcmVjdGlvbiBoYXMgSW5maW5pdHkgb3IgTmFOXCI7IGJyZWFrOyB9XG4gICAgICAgIG5zdGVwID0gbm9ybTIoc3RlcCk7XG4gICAgICAgIGlmKG5zdGVwIDwgdG9sKSB7IG1zZz1cIk5ld3RvbiBzdGVwIHNtYWxsZXIgdGhhbiB0b2xcIjsgYnJlYWs7IH1cbiAgICAgICAgdCA9IDE7XG4gICAgICAgIGRmMCA9IGRvdChnMCxzdGVwKTtcbiAgICAgICAgLy8gbGluZSBzZWFyY2hcbiAgICAgICAgeDEgPSB4MDtcbiAgICAgICAgd2hpbGUoaXQgPCBtYXhpdCkge1xuICAgICAgICAgICAgaWYodCpuc3RlcCA8IHRvbCkgeyBicmVhazsgfVxuICAgICAgICAgICAgcyA9IG11bChzdGVwLHQpO1xuICAgICAgICAgICAgeDEgPSBhZGQoeDAscyk7XG4gICAgICAgICAgICBmMSA9IGYoeDEpO1xuICAgICAgICAgICAgaWYoZjEtZjAgPj0gMC4xKnQqZGYwIHx8IGlzTmFOKGYxKSkge1xuICAgICAgICAgICAgICAgIHQgKj0gMC41O1xuICAgICAgICAgICAgICAgICsraXQ7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZih0Km5zdGVwIDwgdG9sKSB7IG1zZyA9IFwiTGluZSBzZWFyY2ggc3RlcCBzaXplIHNtYWxsZXIgdGhhbiB0b2xcIjsgYnJlYWs7IH1cbiAgICAgICAgaWYoaXQgPT09IG1heGl0KSB7IG1zZyA9IFwibWF4aXQgcmVhY2hlZCBkdXJpbmcgbGluZSBzZWFyY2hcIjsgYnJlYWs7IH1cbiAgICAgICAgZzEgPSBncmFkaWVudCh4MSk7XG4gICAgICAgIHkgPSBzdWIoZzEsZzApO1xuICAgICAgICB5cyA9IGRvdCh5LHMpO1xuICAgICAgICBIeSA9IGRvdChIMSx5KTtcbiAgICAgICAgSDEgPSBzdWIoYWRkKEgxLFxuICAgICAgICAgICAgICAgIG11bChcbiAgICAgICAgICAgICAgICAgICAgICAgICh5cytkb3QoeSxIeSkpLyh5cyp5cyksXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW4ocyxzKSAgICApKSxcbiAgICAgICAgICAgICAgICBkaXYoYWRkKHRlbihIeSxzKSx0ZW4ocyxIeSkpLHlzKSk7XG4gICAgICAgIHgwID0geDE7XG4gICAgICAgIGYwID0gZjE7XG4gICAgICAgIGcwID0gZzE7XG4gICAgICAgICsraXQ7XG4gICAgfVxuICAgIHJldHVybiB7c29sdXRpb246IHgwLCBmOiBmMCwgZ3JhZGllbnQ6IGcwLCBpbnZIZXNzaWFuOiBIMSwgaXRlcmF0aW9uczppdCwgbWVzc2FnZTogbXNnfTtcbn1cblxuLy8gMTAuIE9kZSBzb2x2ZXIgKERvcm1hbmQtUHJpbmNlKVxubnVtZXJpYy5Eb3ByaSA9IGZ1bmN0aW9uIERvcHJpKHgseSxmLHltaWQsaXRlcmF0aW9ucyxtc2csZXZlbnRzKSB7XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuICAgIHRoaXMuZiA9IGY7XG4gICAgdGhpcy55bWlkID0geW1pZDtcbiAgICB0aGlzLml0ZXJhdGlvbnMgPSBpdGVyYXRpb25zO1xuICAgIHRoaXMuZXZlbnRzID0gZXZlbnRzO1xuICAgIHRoaXMubWVzc2FnZSA9IG1zZztcbn1cbm51bWVyaWMuRG9wcmkucHJvdG90eXBlLl9hdCA9IGZ1bmN0aW9uIF9hdCh4aSxqKSB7XG4gICAgZnVuY3Rpb24gc3FyKHgpIHsgcmV0dXJuIHgqeDsgfVxuICAgIHZhciBzb2wgPSB0aGlzO1xuICAgIHZhciB4cyA9IHNvbC54O1xuICAgIHZhciB5cyA9IHNvbC55O1xuICAgIHZhciBrMSA9IHNvbC5mO1xuICAgIHZhciB5bWlkID0gc29sLnltaWQ7XG4gICAgdmFyIG4gPSB4cy5sZW5ndGg7XG4gICAgdmFyIHgwLHgxLHhoLHkwLHkxLHloLHhpO1xuICAgIHZhciBmbG9vciA9IE1hdGguZmxvb3IsaDtcbiAgICB2YXIgYyA9IDAuNTtcbiAgICB2YXIgYWRkID0gbnVtZXJpYy5hZGQsIG11bCA9IG51bWVyaWMubXVsLHN1YiA9IG51bWVyaWMuc3ViLCBwLHEsdztcbiAgICB4MCA9IHhzW2pdO1xuICAgIHgxID0geHNbaisxXTtcbiAgICB5MCA9IHlzW2pdO1xuICAgIHkxID0geXNbaisxXTtcbiAgICBoICA9IHgxLXgwO1xuICAgIHhoID0geDArYypoO1xuICAgIHloID0geW1pZFtqXTtcbiAgICBwID0gc3ViKGsxW2ogIF0sbXVsKHkwLDEvKHgwLXhoKSsyLyh4MC14MSkpKTtcbiAgICBxID0gc3ViKGsxW2orMV0sbXVsKHkxLDEvKHgxLXhoKSsyLyh4MS14MCkpKTtcbiAgICB3ID0gW3Nxcih4aSAtIHgxKSAqICh4aSAtIHhoKSAvIHNxcih4MCAtIHgxKSAvICh4MCAtIHhoKSxcbiAgICAgICAgIHNxcih4aSAtIHgwKSAqIHNxcih4aSAtIHgxKSAvIHNxcih4MCAtIHhoKSAvIHNxcih4MSAtIHhoKSxcbiAgICAgICAgIHNxcih4aSAtIHgwKSAqICh4aSAtIHhoKSAvIHNxcih4MSAtIHgwKSAvICh4MSAtIHhoKSxcbiAgICAgICAgICh4aSAtIHgwKSAqIHNxcih4aSAtIHgxKSAqICh4aSAtIHhoKSAvIHNxcih4MC14MSkgLyAoeDAgLSB4aCksXG4gICAgICAgICAoeGkgLSB4MSkgKiBzcXIoeGkgLSB4MCkgKiAoeGkgLSB4aCkgLyBzcXIoeDAteDEpIC8gKHgxIC0geGgpXTtcbiAgICByZXR1cm4gYWRkKGFkZChhZGQoYWRkKG11bCh5MCx3WzBdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG11bCh5aCx3WzFdKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBtdWwoeTEsd1syXSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgbXVsKCBwLHdbM10pKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG11bCggcSx3WzRdKSk7XG59XG5udW1lcmljLkRvcHJpLnByb3RvdHlwZS5hdCA9IGZ1bmN0aW9uIGF0KHgpIHtcbiAgICB2YXIgaSxqLGssZmxvb3IgPSBNYXRoLmZsb29yO1xuICAgIGlmKHR5cGVvZiB4ICE9PSBcIm51bWJlclwiKSB7XG4gICAgICAgIHZhciBuID0geC5sZW5ndGgsIHJldCA9IEFycmF5KG4pO1xuICAgICAgICBmb3IoaT1uLTE7aSE9PS0xOy0taSkge1xuICAgICAgICAgICAgcmV0W2ldID0gdGhpcy5hdCh4W2ldKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbiAgICB2YXIgeDAgPSB0aGlzLng7XG4gICAgaSA9IDA7IGogPSB4MC5sZW5ndGgtMTtcbiAgICB3aGlsZShqLWk+MSkge1xuICAgICAgICBrID0gZmxvb3IoMC41KihpK2opKTtcbiAgICAgICAgaWYoeDBba10gPD0geCkgaSA9IGs7XG4gICAgICAgIGVsc2UgaiA9IGs7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9hdCh4LGkpO1xufVxuXG5udW1lcmljLmRvcHJpID0gZnVuY3Rpb24gZG9wcmkoeDAseDEseTAsZix0b2wsbWF4aXQsZXZlbnQpIHtcbiAgICBpZih0eXBlb2YgdG9sID09PSBcInVuZGVmaW5lZFwiKSB7IHRvbCA9IDFlLTY7IH1cbiAgICBpZih0eXBlb2YgbWF4aXQgPT09IFwidW5kZWZpbmVkXCIpIHsgbWF4aXQgPSAxMDAwOyB9XG4gICAgdmFyIHhzID0gW3gwXSwgeXMgPSBbeTBdLCBrMSA9IFtmKHgwLHkwKV0sIGsyLGszLGs0LGs1LGs2LGs3LCB5bWlkID0gW107XG4gICAgdmFyIEEyID0gMS81O1xuICAgIHZhciBBMyA9IFszLzQwLDkvNDBdO1xuICAgIHZhciBBNCA9IFs0NC80NSwtNTYvMTUsMzIvOV07XG4gICAgdmFyIEE1ID0gWzE5MzcyLzY1NjEsLTI1MzYwLzIxODcsNjQ0NDgvNjU2MSwtMjEyLzcyOV07XG4gICAgdmFyIEE2ID0gWzkwMTcvMzE2OCwtMzU1LzMzLDQ2NzMyLzUyNDcsNDkvMTc2LC01MTAzLzE4NjU2XTtcbiAgICB2YXIgYiA9IFszNS8zODQsMCw1MDAvMTExMywxMjUvMTkyLC0yMTg3LzY3ODQsMTEvODRdO1xuICAgIHZhciBibSA9IFswLjUqNjAyNTE5Mjc0My8zMDA4NTU1MzE1MixcbiAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgMC41KjUxMjUyMjkyOTI1LzY1NDAwODIxNTk4LFxuICAgICAgICAgICAgICAwLjUqLTI2OTE4Njg5MjUvNDUxMjgzMjk3MjgsXG4gICAgICAgICAgICAgIDAuNSoxODc5NDAzNzIwNjcvMTU5NDUzNDMxNzA1NixcbiAgICAgICAgICAgICAgMC41Ki0xNzc2MDk0MzMxLzE5NzQzNjQ0MjU2LFxuICAgICAgICAgICAgICAwLjUqMTEyMzcwOTkvMjM1MDQzMzg0XTtcbiAgICB2YXIgYyA9IFsxLzUsMy8xMCw0LzUsOC85LDEsMV07XG4gICAgdmFyIGUgPSBbLTcxLzU3NjAwLDAsNzEvMTY2OTUsLTcxLzE5MjAsMTcyNTMvMzM5MjAwLC0yMi81MjUsMS80MF07XG4gICAgdmFyIGkgPSAwLGVyLGo7XG4gICAgdmFyIGggPSAoeDEteDApLzEwO1xuICAgIHZhciBpdCA9IDA7XG4gICAgdmFyIGFkZCA9IG51bWVyaWMuYWRkLCBtdWwgPSBudW1lcmljLm11bCwgeTEsZXJpbmY7XG4gICAgdmFyIG1heCA9IE1hdGgubWF4LCBtaW4gPSBNYXRoLm1pbiwgYWJzID0gTWF0aC5hYnMsIG5vcm1pbmYgPSBudW1lcmljLm5vcm1pbmYscG93ID0gTWF0aC5wb3c7XG4gICAgdmFyIGFueSA9IG51bWVyaWMuYW55LCBsdCA9IG51bWVyaWMubHQsIGFuZCA9IG51bWVyaWMuYW5kLCBzdWIgPSBudW1lcmljLnN1YjtcbiAgICB2YXIgZTAsIGUxLCBldjtcbiAgICB2YXIgcmV0ID0gbmV3IG51bWVyaWMuRG9wcmkoeHMseXMsazEseW1pZCwtMSxcIlwiKTtcbiAgICBpZih0eXBlb2YgZXZlbnQgPT09IFwiZnVuY3Rpb25cIikgZTAgPSBldmVudCh4MCx5MCk7XG4gICAgd2hpbGUoeDA8eDEgJiYgaXQ8bWF4aXQpIHtcbiAgICAgICAgKytpdDtcbiAgICAgICAgaWYoeDAraD54MSkgaCA9IHgxLXgwO1xuICAgICAgICBrMiA9IGYoeDArY1swXSpoLCAgICAgICAgICAgICAgICBhZGQoeTAsbXVsKCAgIEEyKmgsazFbaV0pKSk7XG4gICAgICAgIGszID0gZih4MCtjWzFdKmgsICAgICAgICAgICAgYWRkKGFkZCh5MCxtdWwoQTNbMF0qaCxrMVtpXSkpLG11bChBM1sxXSpoLGsyKSkpO1xuICAgICAgICBrNCA9IGYoeDArY1syXSpoLCAgICAgICAgYWRkKGFkZChhZGQoeTAsbXVsKEE0WzBdKmgsazFbaV0pKSxtdWwoQTRbMV0qaCxrMikpLG11bChBNFsyXSpoLGszKSkpO1xuICAgICAgICBrNSA9IGYoeDArY1szXSpoLCAgICBhZGQoYWRkKGFkZChhZGQoeTAsbXVsKEE1WzBdKmgsazFbaV0pKSxtdWwoQTVbMV0qaCxrMikpLG11bChBNVsyXSpoLGszKSksbXVsKEE1WzNdKmgsazQpKSk7XG4gICAgICAgIGs2ID0gZih4MCtjWzRdKmgsYWRkKGFkZChhZGQoYWRkKGFkZCh5MCxtdWwoQTZbMF0qaCxrMVtpXSkpLG11bChBNlsxXSpoLGsyKSksbXVsKEE2WzJdKmgsazMpKSxtdWwoQTZbM10qaCxrNCkpLG11bChBNls0XSpoLGs1KSkpO1xuICAgICAgICB5MSA9IGFkZChhZGQoYWRkKGFkZChhZGQoeTAsbXVsKGsxW2ldLGgqYlswXSkpLG11bChrMyxoKmJbMl0pKSxtdWwoazQsaCpiWzNdKSksbXVsKGs1LGgqYls0XSkpLG11bChrNixoKmJbNV0pKTtcbiAgICAgICAgazcgPSBmKHgwK2gseTEpO1xuICAgICAgICBlciA9IGFkZChhZGQoYWRkKGFkZChhZGQobXVsKGsxW2ldLGgqZVswXSksbXVsKGszLGgqZVsyXSkpLG11bChrNCxoKmVbM10pKSxtdWwoazUsaCplWzRdKSksbXVsKGs2LGgqZVs1XSkpLG11bChrNyxoKmVbNl0pKTtcbiAgICAgICAgaWYodHlwZW9mIGVyID09PSBcIm51bWJlclwiKSBlcmluZiA9IGFicyhlcik7XG4gICAgICAgIGVsc2UgZXJpbmYgPSBub3JtaW5mKGVyKTtcbiAgICAgICAgaWYoZXJpbmYgPiB0b2wpIHsgLy8gcmVqZWN0XG4gICAgICAgICAgICBoID0gMC4yKmgqcG93KHRvbC9lcmluZiwwLjI1KTtcbiAgICAgICAgICAgIGlmKHgwK2ggPT09IHgwKSB7XG4gICAgICAgICAgICAgICAgcmV0Lm1zZyA9IFwiU3RlcCBzaXplIGJlY2FtZSB0b28gc21hbGxcIjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHltaWRbaV0gPSBhZGQoYWRkKGFkZChhZGQoYWRkKGFkZCh5MCxcbiAgICAgICAgICAgICAgICBtdWwoazFbaV0saCpibVswXSkpLFxuICAgICAgICAgICAgICAgIG11bChrMyAgICxoKmJtWzJdKSksXG4gICAgICAgICAgICAgICAgbXVsKGs0ICAgLGgqYm1bM10pKSxcbiAgICAgICAgICAgICAgICBtdWwoazUgICAsaCpibVs0XSkpLFxuICAgICAgICAgICAgICAgIG11bChrNiAgICxoKmJtWzVdKSksXG4gICAgICAgICAgICAgICAgbXVsKGs3ICAgLGgqYm1bNl0pKTtcbiAgICAgICAgKytpO1xuICAgICAgICB4c1tpXSA9IHgwK2g7XG4gICAgICAgIHlzW2ldID0geTE7XG4gICAgICAgIGsxW2ldID0gazc7XG4gICAgICAgIGlmKHR5cGVvZiBldmVudCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICB2YXIgeWkseGwgPSB4MCx4ciA9IHgwKzAuNSpoLHhpO1xuICAgICAgICAgICAgZTEgPSBldmVudCh4cix5bWlkW2ktMV0pO1xuICAgICAgICAgICAgZXYgPSBhbmQobHQoZTAsMCksbHQoMCxlMSkpO1xuICAgICAgICAgICAgaWYoIWFueShldikpIHsgeGwgPSB4cjsgeHIgPSB4MCtoOyBlMCA9IGUxOyBlMSA9IGV2ZW50KHhyLHkxKTsgZXYgPSBhbmQobHQoZTAsMCksbHQoMCxlMSkpOyB9XG4gICAgICAgICAgICBpZihhbnkoZXYpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHhjLCB5YywgZW4sZWk7XG4gICAgICAgICAgICAgICAgdmFyIHNpZGU9MCwgc2wgPSAxLjAsIHNyID0gMS4wO1xuICAgICAgICAgICAgICAgIHdoaWxlKDEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mIGUwID09PSBcIm51bWJlclwiKSB4aSA9IChzciplMSp4bC1zbCplMCp4cikvKHNyKmUxLXNsKmUwKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB4aSA9IHhyO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGo9ZTAubGVuZ3RoLTE7aiE9PS0xOy0taikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGUwW2pdPDAgJiYgZTFbal0+MCkgeGkgPSBtaW4oeGksKHNyKmUxW2pdKnhsLXNsKmUwW2pdKnhyKS8oc3IqZTFbal0tc2wqZTBbal0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZih4aSA8PSB4bCB8fCB4aSA+PSB4cikgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIHlpID0gcmV0Ll9hdCh4aSwgaS0xKTtcbiAgICAgICAgICAgICAgICAgICAgZWkgPSBldmVudCh4aSx5aSk7XG4gICAgICAgICAgICAgICAgICAgIGVuID0gYW5kKGx0KGUwLDApLGx0KDAsZWkpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYoYW55KGVuKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgeHIgPSB4aTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUxID0gZWk7XG4gICAgICAgICAgICAgICAgICAgICAgICBldiA9IGVuO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3IgPSAxLjA7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihzaWRlID09PSAtMSkgc2wgKj0gMC41O1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBzbCA9IDEuMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZGUgPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHhsID0geGk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlMCA9IGVpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2wgPSAxLjA7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihzaWRlID09PSAxKSBzciAqPSAwLjU7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHNyID0gMS4wO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2lkZSA9IDE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgeTEgPSByZXQuX2F0KDAuNSooeDAreGkpLGktMSk7XG4gICAgICAgICAgICAgICAgcmV0LmZbaV0gPSBmKHhpLHlpKTtcbiAgICAgICAgICAgICAgICByZXQueFtpXSA9IHhpO1xuICAgICAgICAgICAgICAgIHJldC55W2ldID0geWk7XG4gICAgICAgICAgICAgICAgcmV0LnltaWRbaS0xXSA9IHkxO1xuICAgICAgICAgICAgICAgIHJldC5ldmVudHMgPSBldjtcbiAgICAgICAgICAgICAgICByZXQuaXRlcmF0aW9ucyA9IGl0O1xuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgeDAgKz0gaDtcbiAgICAgICAgeTAgPSB5MTtcbiAgICAgICAgZTAgPSBlMTtcbiAgICAgICAgaCA9IG1pbigwLjgqaCpwb3codG9sL2VyaW5mLDAuMjUpLDQqaCk7XG4gICAgfVxuICAgIHJldC5pdGVyYXRpb25zID0gaXQ7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLy8gMTEuIEF4ID0gYlxubnVtZXJpYy5MVSA9IGZ1bmN0aW9uKEEsIGZhc3QpIHtcbiAgZmFzdCA9IGZhc3QgfHwgZmFsc2U7XG5cbiAgdmFyIGFicyA9IE1hdGguYWJzO1xuICB2YXIgaSwgaiwgaywgYWJzQWprLCBBa2ssIEFrLCBQaywgQWk7XG4gIHZhciBtYXg7XG4gIHZhciBuID0gQS5sZW5ndGgsIG4xID0gbi0xO1xuICB2YXIgUCA9IG5ldyBBcnJheShuKTtcbiAgaWYoIWZhc3QpIEEgPSBudW1lcmljLmNsb25lKEEpO1xuXG4gIGZvciAoayA9IDA7IGsgPCBuOyArK2spIHtcbiAgICBQayA9IGs7XG4gICAgQWsgPSBBW2tdO1xuICAgIG1heCA9IGFicyhBa1trXSk7XG4gICAgZm9yIChqID0gayArIDE7IGogPCBuOyArK2opIHtcbiAgICAgIGFic0FqayA9IGFicyhBW2pdW2tdKTtcbiAgICAgIGlmIChtYXggPCBhYnNBamspIHtcbiAgICAgICAgbWF4ID0gYWJzQWprO1xuICAgICAgICBQayA9IGo7XG4gICAgICB9XG4gICAgfVxuICAgIFBba10gPSBQaztcblxuICAgIGlmIChQayAhPSBrKSB7XG4gICAgICBBW2tdID0gQVtQa107XG4gICAgICBBW1BrXSA9IEFrO1xuICAgICAgQWsgPSBBW2tdO1xuICAgIH1cblxuICAgIEFrayA9IEFrW2tdO1xuXG4gICAgZm9yIChpID0gayArIDE7IGkgPCBuOyArK2kpIHtcbiAgICAgIEFbaV1ba10gLz0gQWtrO1xuICAgIH1cblxuICAgIGZvciAoaSA9IGsgKyAxOyBpIDwgbjsgKytpKSB7XG4gICAgICBBaSA9IEFbaV07XG4gICAgICBmb3IgKGogPSBrICsgMTsgaiA8IG4xOyArK2opIHtcbiAgICAgICAgQWlbal0gLT0gQWlba10gKiBBa1tqXTtcbiAgICAgICAgKytqO1xuICAgICAgICBBaVtqXSAtPSBBaVtrXSAqIEFrW2pdO1xuICAgICAgfVxuICAgICAgaWYoaj09PW4xKSBBaVtqXSAtPSBBaVtrXSAqIEFrW2pdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgTFU6IEEsXG4gICAgUDogIFBcbiAgfTtcbn1cblxubnVtZXJpYy5MVXNvbHZlID0gZnVuY3Rpb24gTFVzb2x2ZShMVVAsIGIpIHtcbiAgdmFyIGksIGo7XG4gIHZhciBMVSA9IExVUC5MVTtcbiAgdmFyIG4gICA9IExVLmxlbmd0aDtcbiAgdmFyIHggPSBudW1lcmljLmNsb25lKGIpO1xuICB2YXIgUCAgID0gTFVQLlA7XG4gIHZhciBQaSwgTFVpLCBMVWlpLCB0bXA7XG5cbiAgZm9yIChpPW4tMTtpIT09LTE7LS1pKSB4W2ldID0gYltpXTtcbiAgZm9yIChpID0gMDsgaSA8IG47ICsraSkge1xuICAgIFBpID0gUFtpXTtcbiAgICBpZiAoUFtpXSAhPT0gaSkge1xuICAgICAgdG1wID0geFtpXTtcbiAgICAgIHhbaV0gPSB4W1BpXTtcbiAgICAgIHhbUGldID0gdG1wO1xuICAgIH1cblxuICAgIExVaSA9IExVW2ldO1xuICAgIGZvciAoaiA9IDA7IGogPCBpOyArK2opIHtcbiAgICAgIHhbaV0gLT0geFtqXSAqIExVaVtqXTtcbiAgICB9XG4gIH1cblxuICBmb3IgKGkgPSBuIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICBMVWkgPSBMVVtpXTtcbiAgICBmb3IgKGogPSBpICsgMTsgaiA8IG47ICsraikge1xuICAgICAgeFtpXSAtPSB4W2pdICogTFVpW2pdO1xuICAgIH1cblxuICAgIHhbaV0gLz0gTFVpW2ldO1xuICB9XG5cbiAgcmV0dXJuIHg7XG59XG5cbm51bWVyaWMuc29sdmUgPSBmdW5jdGlvbiBzb2x2ZShBLGIsZmFzdCkgeyByZXR1cm4gbnVtZXJpYy5MVXNvbHZlKG51bWVyaWMuTFUoQSxmYXN0KSwgYik7IH1cblxuLy8gMTIuIExpbmVhciBwcm9ncmFtbWluZ1xubnVtZXJpYy5lY2hlbG9uaXplID0gZnVuY3Rpb24gZWNoZWxvbml6ZShBKSB7XG4gICAgdmFyIHMgPSBudW1lcmljLmRpbShBKSwgbSA9IHNbMF0sIG4gPSBzWzFdO1xuICAgIHZhciBJID0gbnVtZXJpYy5pZGVudGl0eShtKTtcbiAgICB2YXIgUCA9IEFycmF5KG0pO1xuICAgIHZhciBpLGosayxsLEFpLElpLFosYTtcbiAgICB2YXIgYWJzID0gTWF0aC5hYnM7XG4gICAgdmFyIGRpdmVxID0gbnVtZXJpYy5kaXZlcTtcbiAgICBBID0gbnVtZXJpYy5jbG9uZShBKTtcbiAgICBmb3IoaT0wO2k8bTsrK2kpIHtcbiAgICAgICAgayA9IDA7XG4gICAgICAgIEFpID0gQVtpXTtcbiAgICAgICAgSWkgPSBJW2ldO1xuICAgICAgICBmb3Ioaj0xO2o8bjsrK2opIGlmKGFicyhBaVtrXSk8YWJzKEFpW2pdKSkgaz1qO1xuICAgICAgICBQW2ldID0gaztcbiAgICAgICAgZGl2ZXEoSWksQWlba10pO1xuICAgICAgICBkaXZlcShBaSxBaVtrXSk7XG4gICAgICAgIGZvcihqPTA7ajxtOysraikgaWYoaiE9PWkpIHtcbiAgICAgICAgICAgIFogPSBBW2pdOyBhID0gWltrXTtcbiAgICAgICAgICAgIGZvcihsPW4tMTtsIT09LTE7LS1sKSBaW2xdIC09IEFpW2xdKmE7XG4gICAgICAgICAgICBaID0gSVtqXTtcbiAgICAgICAgICAgIGZvcihsPW0tMTtsIT09LTE7LS1sKSBaW2xdIC09IElpW2xdKmE7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHtJOkksIEE6QSwgUDpQfTtcbn1cblxubnVtZXJpYy5fX3NvbHZlTFAgPSBmdW5jdGlvbiBfX3NvbHZlTFAoYyxBLGIsdG9sLG1heGl0LHgsZmxhZykge1xuICAgIHZhciBzdW0gPSBudW1lcmljLnN1bSwgbG9nID0gbnVtZXJpYy5sb2csIG11bCA9IG51bWVyaWMubXVsLCBzdWIgPSBudW1lcmljLnN1YiwgZG90ID0gbnVtZXJpYy5kb3QsIGRpdiA9IG51bWVyaWMuZGl2LCBhZGQgPSBudW1lcmljLmFkZDtcbiAgICB2YXIgbSA9IGMubGVuZ3RoLCBuID0gYi5sZW5ndGgseTtcbiAgICB2YXIgdW5ib3VuZGVkID0gZmFsc2UsIGNiLGkwPTA7XG4gICAgdmFyIGFscGhhID0gMS4wO1xuICAgIHZhciBmMCxkZjAsQVQgPSBudW1lcmljLnRyYW5zcG9zZShBKSwgc3ZkID0gbnVtZXJpYy5zdmQsdHJhbnNwb3NlID0gbnVtZXJpYy50cmFuc3Bvc2UsbGVxID0gbnVtZXJpYy5sZXEsIHNxcnQgPSBNYXRoLnNxcnQsIGFicyA9IE1hdGguYWJzO1xuICAgIHZhciBtdWxlcSA9IG51bWVyaWMubXVsZXE7XG4gICAgdmFyIG5vcm0gPSBudW1lcmljLm5vcm1pbmYsIGFueSA9IG51bWVyaWMuYW55LG1pbiA9IE1hdGgubWluO1xuICAgIHZhciBhbGwgPSBudW1lcmljLmFsbCwgZ3QgPSBudW1lcmljLmd0O1xuICAgIHZhciBwID0gQXJyYXkobSksIEEwID0gQXJyYXkobiksZT1udW1lcmljLnJlcChbbl0sMSksIEg7XG4gICAgdmFyIHNvbHZlID0gbnVtZXJpYy5zb2x2ZSwgeiA9IHN1YihiLGRvdChBLHgpKSxjb3VudDtcbiAgICB2YXIgZG90Y2MgPSBkb3QoYyxjKTtcbiAgICB2YXIgZztcbiAgICBmb3IoY291bnQ9aTA7Y291bnQ8bWF4aXQ7Kytjb3VudCkge1xuICAgICAgICB2YXIgaSxqLGQ7XG4gICAgICAgIGZvcihpPW4tMTtpIT09LTE7LS1pKSBBMFtpXSA9IGRpdihBW2ldLHpbaV0pO1xuICAgICAgICB2YXIgQTEgPSB0cmFuc3Bvc2UoQTApO1xuICAgICAgICBmb3IoaT1tLTE7aSE9PS0xOy0taSkgcFtpXSA9ICgvKnhbaV0rKi9zdW0oQTFbaV0pKTtcbiAgICAgICAgYWxwaGEgPSAwLjI1KmFicyhkb3RjYy9kb3QoYyxwKSk7XG4gICAgICAgIHZhciBhMSA9IDEwMCpzcXJ0KGRvdGNjL2RvdChwLHApKTtcbiAgICAgICAgaWYoIWlzRmluaXRlKGFscGhhKSB8fCBhbHBoYT5hMSkgYWxwaGEgPSBhMTtcbiAgICAgICAgZyA9IGFkZChjLG11bChhbHBoYSxwKSk7XG4gICAgICAgIEggPSBkb3QoQTEsQTApO1xuICAgICAgICBmb3IoaT1tLTE7aSE9PS0xOy0taSkgSFtpXVtpXSArPSAxO1xuICAgICAgICBkID0gc29sdmUoSCxkaXYoZyxhbHBoYSksdHJ1ZSk7XG4gICAgICAgIHZhciB0MCA9IGRpdih6LGRvdChBLGQpKTtcbiAgICAgICAgdmFyIHQgPSAxLjA7XG4gICAgICAgIGZvcihpPW4tMTtpIT09LTE7LS1pKSBpZih0MFtpXTwwKSB0ID0gbWluKHQsLTAuOTk5KnQwW2ldKTtcbiAgICAgICAgeSA9IHN1Yih4LG11bChkLHQpKTtcbiAgICAgICAgeiA9IHN1YihiLGRvdChBLHkpKTtcbiAgICAgICAgaWYoIWFsbChndCh6LDApKSkgcmV0dXJuIHsgc29sdXRpb246IHgsIG1lc3NhZ2U6IFwiXCIsIGl0ZXJhdGlvbnM6IGNvdW50IH07XG4gICAgICAgIHggPSB5O1xuICAgICAgICBpZihhbHBoYTx0b2wpIHJldHVybiB7IHNvbHV0aW9uOiB5LCBtZXNzYWdlOiBcIlwiLCBpdGVyYXRpb25zOiBjb3VudCB9O1xuICAgICAgICBpZihmbGFnKSB7XG4gICAgICAgICAgICB2YXIgcyA9IGRvdChjLGcpLCBBZyA9IGRvdChBLGcpO1xuICAgICAgICAgICAgdW5ib3VuZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvcihpPW4tMTtpIT09LTE7LS1pKSBpZihzKkFnW2ldPDApIHsgdW5ib3VuZGVkID0gZmFsc2U7IGJyZWFrOyB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZih4W20tMV0+PTApIHVuYm91bmRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgZWxzZSB1bmJvdW5kZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmKHVuYm91bmRlZCkgcmV0dXJuIHsgc29sdXRpb246IHksIG1lc3NhZ2U6IFwiVW5ib3VuZGVkXCIsIGl0ZXJhdGlvbnM6IGNvdW50IH07XG4gICAgfVxuICAgIHJldHVybiB7IHNvbHV0aW9uOiB4LCBtZXNzYWdlOiBcIm1heGltdW0gaXRlcmF0aW9uIGNvdW50IGV4Y2VlZGVkXCIsIGl0ZXJhdGlvbnM6Y291bnQgfTtcbn1cblxubnVtZXJpYy5fc29sdmVMUCA9IGZ1bmN0aW9uIF9zb2x2ZUxQKGMsQSxiLHRvbCxtYXhpdCkge1xuICAgIHZhciBtID0gYy5sZW5ndGgsIG4gPSBiLmxlbmd0aCx5O1xuICAgIHZhciBzdW0gPSBudW1lcmljLnN1bSwgbG9nID0gbnVtZXJpYy5sb2csIG11bCA9IG51bWVyaWMubXVsLCBzdWIgPSBudW1lcmljLnN1YiwgZG90ID0gbnVtZXJpYy5kb3QsIGRpdiA9IG51bWVyaWMuZGl2LCBhZGQgPSBudW1lcmljLmFkZDtcbiAgICB2YXIgYzAgPSBudW1lcmljLnJlcChbbV0sMCkuY29uY2F0KFsxXSk7XG4gICAgdmFyIEogPSBudW1lcmljLnJlcChbbiwxXSwtMSk7XG4gICAgdmFyIEEwID0gbnVtZXJpYy5ibG9ja01hdHJpeChbW0EgICAgICAgICAgICAgICAgICAgLCAgIEogIF1dKTtcbiAgICB2YXIgYjAgPSBiO1xuICAgIHZhciB5ID0gbnVtZXJpYy5yZXAoW21dLDApLmNvbmNhdChNYXRoLm1heCgwLG51bWVyaWMuc3VwKG51bWVyaWMubmVnKGIpKSkrMSk7XG4gICAgdmFyIHgwID0gbnVtZXJpYy5fX3NvbHZlTFAoYzAsQTAsYjAsdG9sLG1heGl0LHksZmFsc2UpO1xuICAgIHZhciB4ID0gbnVtZXJpYy5jbG9uZSh4MC5zb2x1dGlvbik7XG4gICAgeC5sZW5ndGggPSBtO1xuICAgIHZhciBmb28gPSBudW1lcmljLmluZihzdWIoYixkb3QoQSx4KSkpO1xuICAgIGlmKGZvbzwwKSB7IHJldHVybiB7IHNvbHV0aW9uOiBOYU4sIG1lc3NhZ2U6IFwiSW5mZWFzaWJsZVwiLCBpdGVyYXRpb25zOiB4MC5pdGVyYXRpb25zIH07IH1cbiAgICB2YXIgcmV0ID0gbnVtZXJpYy5fX3NvbHZlTFAoYywgQSwgYiwgdG9sLCBtYXhpdC14MC5pdGVyYXRpb25zLCB4LCB0cnVlKTtcbiAgICByZXQuaXRlcmF0aW9ucyArPSB4MC5pdGVyYXRpb25zO1xuICAgIHJldHVybiByZXQ7XG59O1xuXG5udW1lcmljLnNvbHZlTFAgPSBmdW5jdGlvbiBzb2x2ZUxQKGMsQSxiLEFlcSxiZXEsdG9sLG1heGl0KSB7XG4gICAgaWYodHlwZW9mIG1heGl0ID09PSBcInVuZGVmaW5lZFwiKSBtYXhpdCA9IDEwMDA7XG4gICAgaWYodHlwZW9mIHRvbCA9PT0gXCJ1bmRlZmluZWRcIikgdG9sID0gbnVtZXJpYy5lcHNpbG9uO1xuICAgIGlmKHR5cGVvZiBBZXEgPT09IFwidW5kZWZpbmVkXCIpIHJldHVybiBudW1lcmljLl9zb2x2ZUxQKGMsQSxiLHRvbCxtYXhpdCk7XG4gICAgdmFyIG0gPSBBZXEubGVuZ3RoLCBuID0gQWVxWzBdLmxlbmd0aCwgbyA9IEEubGVuZ3RoO1xuICAgIHZhciBCID0gbnVtZXJpYy5lY2hlbG9uaXplKEFlcSk7XG4gICAgdmFyIGZsYWdzID0gbnVtZXJpYy5yZXAoW25dLDApO1xuICAgIHZhciBQID0gQi5QO1xuICAgIHZhciBRID0gW107XG4gICAgdmFyIGk7XG4gICAgZm9yKGk9UC5sZW5ndGgtMTtpIT09LTE7LS1pKSBmbGFnc1tQW2ldXSA9IDE7XG4gICAgZm9yKGk9bi0xO2khPT0tMTstLWkpIGlmKGZsYWdzW2ldPT09MCkgUS5wdXNoKGkpO1xuICAgIHZhciBnID0gbnVtZXJpYy5nZXRSYW5nZTtcbiAgICB2YXIgSSA9IG51bWVyaWMubGluc3BhY2UoMCxtLTEpLCBKID0gbnVtZXJpYy5saW5zcGFjZSgwLG8tMSk7XG4gICAgdmFyIEFlcTIgPSBnKEFlcSxJLFEpLCBBMSA9IGcoQSxKLFApLCBBMiA9IGcoQSxKLFEpLCBkb3QgPSBudW1lcmljLmRvdCwgc3ViID0gbnVtZXJpYy5zdWI7XG4gICAgdmFyIEEzID0gZG90KEExLEIuSSk7XG4gICAgdmFyIEE0ID0gc3ViKEEyLGRvdChBMyxBZXEyKSksIGI0ID0gc3ViKGIsZG90KEEzLGJlcSkpO1xuICAgIHZhciBjMSA9IEFycmF5KFAubGVuZ3RoKSwgYzIgPSBBcnJheShRLmxlbmd0aCk7XG4gICAgZm9yKGk9UC5sZW5ndGgtMTtpIT09LTE7LS1pKSBjMVtpXSA9IGNbUFtpXV07XG4gICAgZm9yKGk9US5sZW5ndGgtMTtpIT09LTE7LS1pKSBjMltpXSA9IGNbUVtpXV07XG4gICAgdmFyIGM0ID0gc3ViKGMyLGRvdChjMSxkb3QoQi5JLEFlcTIpKSk7XG4gICAgdmFyIFMgPSBudW1lcmljLl9zb2x2ZUxQKGM0LEE0LGI0LHRvbCxtYXhpdCk7XG4gICAgdmFyIHgyID0gUy5zb2x1dGlvbjtcbiAgICBpZih4MiE9PXgyKSByZXR1cm4gUztcbiAgICB2YXIgeDEgPSBkb3QoQi5JLHN1YihiZXEsZG90KEFlcTIseDIpKSk7XG4gICAgdmFyIHggPSBBcnJheShjLmxlbmd0aCk7XG4gICAgZm9yKGk9UC5sZW5ndGgtMTtpIT09LTE7LS1pKSB4W1BbaV1dID0geDFbaV07XG4gICAgZm9yKGk9US5sZW5ndGgtMTtpIT09LTE7LS1pKSB4W1FbaV1dID0geDJbaV07XG4gICAgcmV0dXJuIHsgc29sdXRpb246IHgsIG1lc3NhZ2U6Uy5tZXNzYWdlLCBpdGVyYXRpb25zOiBTLml0ZXJhdGlvbnMgfTtcbn1cblxubnVtZXJpYy5NUFN0b0xQID0gZnVuY3Rpb24gTVBTdG9MUChNUFMpIHtcbiAgICBpZihNUFMgaW5zdGFuY2VvZiBTdHJpbmcpIHsgTVBTLnNwbGl0KCdcXG4nKTsgfVxuICAgIHZhciBzdGF0ZSA9IDA7XG4gICAgdmFyIHN0YXRlcyA9IFsnSW5pdGlhbCBzdGF0ZScsJ05BTUUnLCdST1dTJywnQ09MVU1OUycsJ1JIUycsJ0JPVU5EUycsJ0VOREFUQSddO1xuICAgIHZhciBuID0gTVBTLmxlbmd0aDtcbiAgICB2YXIgaSxqLHosTj0wLHJvd3MgPSB7fSwgc2lnbiA9IFtdLCBybCA9IDAsIHZhcnMgPSB7fSwgbnYgPSAwO1xuICAgIHZhciBuYW1lO1xuICAgIHZhciBjID0gW10sIEEgPSBbXSwgYiA9IFtdO1xuICAgIGZ1bmN0aW9uIGVycihlKSB7IHRocm93IG5ldyBFcnJvcignTVBTdG9MUDogJytlKydcXG5MaW5lICcraSsnOiAnK01QU1tpXSsnXFxuQ3VycmVudCBzdGF0ZTogJytzdGF0ZXNbc3RhdGVdKydcXG4nKTsgfVxuICAgIGZvcihpPTA7aTxuOysraSkge1xuICAgICAgICB6ID0gTVBTW2ldO1xuICAgICAgICB2YXIgdzAgPSB6Lm1hdGNoKC9cXFMqL2cpO1xuICAgICAgICB2YXIgdyA9IFtdO1xuICAgICAgICBmb3Ioaj0wO2o8dzAubGVuZ3RoOysraikgaWYodzBbal0hPT1cIlwiKSB3LnB1c2godzBbal0pO1xuICAgICAgICBpZih3Lmxlbmd0aCA9PT0gMCkgY29udGludWU7XG4gICAgICAgIGZvcihqPTA7ajxzdGF0ZXMubGVuZ3RoOysraikgaWYoei5zdWJzdHIoMCxzdGF0ZXNbal0ubGVuZ3RoKSA9PT0gc3RhdGVzW2pdKSBicmVhaztcbiAgICAgICAgaWYoajxzdGF0ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBzdGF0ZSA9IGo7XG4gICAgICAgICAgICBpZihqPT09MSkgeyBuYW1lID0gd1sxXTsgfVxuICAgICAgICAgICAgaWYoaj09PTYpIHJldHVybiB7IG5hbWU6bmFtZSwgYzpjLCBBOm51bWVyaWMudHJhbnNwb3NlKEEpLCBiOmIsIHJvd3M6cm93cywgdmFyczp2YXJzIH07XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2goc3RhdGUpIHtcbiAgICAgICAgY2FzZSAwOiBjYXNlIDE6IGVycignVW5leHBlY3RlZCBsaW5lJyk7XG4gICAgICAgIGNhc2UgMjogXG4gICAgICAgICAgICBzd2l0Y2god1swXSkge1xuICAgICAgICAgICAgY2FzZSAnTic6IGlmKE49PT0wKSBOID0gd1sxXTsgZWxzZSBlcnIoJ1R3byBvciBtb3JlIE4gcm93cycpOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ0wnOiByb3dzW3dbMV1dID0gcmw7IHNpZ25bcmxdID0gMTsgYltybF0gPSAwOyArK3JsOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ0cnOiByb3dzW3dbMV1dID0gcmw7IHNpZ25bcmxdID0gLTE7YltybF0gPSAwOyArK3JsOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ0UnOiByb3dzW3dbMV1dID0gcmw7IHNpZ25bcmxdID0gMDtiW3JsXSA9IDA7ICsrcmw7IGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDogZXJyKCdQYXJzZSBlcnJvciAnK251bWVyaWMucHJldHR5UHJpbnQodykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIGlmKCF2YXJzLmhhc093blByb3BlcnR5KHdbMF0pKSB7IHZhcnNbd1swXV0gPSBudjsgY1tudl0gPSAwOyBBW252XSA9IG51bWVyaWMucmVwKFtybF0sMCk7ICsrbnY7IH1cbiAgICAgICAgICAgIHZhciBwID0gdmFyc1t3WzBdXTtcbiAgICAgICAgICAgIGZvcihqPTE7ajx3Lmxlbmd0aDtqKz0yKSB7XG4gICAgICAgICAgICAgICAgaWYod1tqXSA9PT0gTikgeyBjW3BdID0gcGFyc2VGbG9hdCh3W2orMV0pOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgIHZhciBxID0gcm93c1t3W2pdXTtcbiAgICAgICAgICAgICAgICBBW3BdW3FdID0gKHNpZ25bcV08MD8tMToxKSpwYXJzZUZsb2F0KHdbaisxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgZm9yKGo9MTtqPHcubGVuZ3RoO2orPTIpIGJbcm93c1t3W2pdXV0gPSAoc2lnbltyb3dzW3dbal1dXTwwPy0xOjEpKnBhcnNlRmxvYXQod1tqKzFdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDU6IC8qRklYTUUqLyBicmVhaztcbiAgICAgICAgY2FzZSA2OiBlcnIoJ0ludGVybmFsIGVycm9yJyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZXJyKCdSZWFjaGVkIGVuZCBvZiBmaWxlIHdpdGhvdXQgRU5EQVRBJyk7XG59XG4vLyBzZWVkcmFuZG9tLmpzIHZlcnNpb24gMi4wLlxuLy8gQXV0aG9yOiBEYXZpZCBCYXUgNC8yLzIwMTFcbi8vXG4vLyBEZWZpbmVzIGEgbWV0aG9kIE1hdGguc2VlZHJhbmRvbSgpIHRoYXQsIHdoZW4gY2FsbGVkLCBzdWJzdGl0dXRlc1xuLy8gYW4gZXhwbGljaXRseSBzZWVkZWQgUkM0LWJhc2VkIGFsZ29yaXRobSBmb3IgTWF0aC5yYW5kb20oKS4gIEFsc29cbi8vIHN1cHBvcnRzIGF1dG9tYXRpYyBzZWVkaW5nIGZyb20gbG9jYWwgb3IgbmV0d29yayBzb3VyY2VzIG9mIGVudHJvcHkuXG4vL1xuLy8gVXNhZ2U6XG4vL1xuLy8gICA8c2NyaXB0IHNyYz1odHRwOi8vZGF2aWRiYXUuY29tL2VuY29kZS9zZWVkcmFuZG9tLW1pbi5qcz48L3NjcmlwdD5cbi8vXG4vLyAgIE1hdGguc2VlZHJhbmRvbSgneWlwZWUnKTsgU2V0cyBNYXRoLnJhbmRvbSB0byBhIGZ1bmN0aW9uIHRoYXQgaXNcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbml0aWFsaXplZCB1c2luZyB0aGUgZ2l2ZW4gZXhwbGljaXQgc2VlZC5cbi8vXG4vLyAgIE1hdGguc2VlZHJhbmRvbSgpOyAgICAgICAgU2V0cyBNYXRoLnJhbmRvbSB0byBhIGZ1bmN0aW9uIHRoYXQgaXNcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWVkZWQgdXNpbmcgdGhlIGN1cnJlbnQgdGltZSwgZG9tIHN0YXRlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZCBvdGhlciBhY2N1bXVsYXRlZCBsb2NhbCBlbnRyb3B5LlxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRoZSBnZW5lcmF0ZWQgc2VlZCBzdHJpbmcgaXMgcmV0dXJuZWQuXG4vL1xuLy8gICBNYXRoLnNlZWRyYW5kb20oJ3lvd3phJywgdHJ1ZSk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2VlZHMgdXNpbmcgdGhlIGdpdmVuIGV4cGxpY2l0IHNlZWQgbWl4ZWRcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2dldGhlciB3aXRoIGFjY3VtdWxhdGVkIGVudHJvcHkuXG4vL1xuLy8gICA8c2NyaXB0IHNyYz1cImh0dHA6Ly9iaXQubHkvc3JhbmRvbS01MTJcIj48L3NjcmlwdD5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTZWVkcyB1c2luZyBwaHlzaWNhbCByYW5kb20gYml0cyBkb3dubG9hZGVkXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSByYW5kb20ub3JnLlxuLy9cbi8vICAgPHNjcmlwdCBzcmM9XCJodHRwczovL2pzb25saWIuYXBwc3BvdC5jb20vdXJhbmRvbT9jYWxsYmFjaz1NYXRoLnNlZWRyYW5kb21cIj5cbi8vICAgPC9zY3JpcHQ+ICAgICAgICAgICAgICAgICBTZWVkcyB1c2luZyB1cmFuZG9tIGJpdHMgZnJvbSBjYWxsLmpzb25saWIuY29tLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaWNoIGlzIGZhc3RlciB0aGFuIHJhbmRvbS5vcmcuXG4vL1xuLy8gRXhhbXBsZXM6XG4vL1xuLy8gICBNYXRoLnNlZWRyYW5kb20oXCJoZWxsb1wiKTsgICAgICAgICAgICAvLyBVc2UgXCJoZWxsb1wiIGFzIHRoZSBzZWVkLlxuLy8gICBkb2N1bWVudC53cml0ZShNYXRoLnJhbmRvbSgpKTsgICAgICAgLy8gQWx3YXlzIDAuNTQ2MzY2Mzc2ODE0MDczNFxuLy8gICBkb2N1bWVudC53cml0ZShNYXRoLnJhbmRvbSgpKTsgICAgICAgLy8gQWx3YXlzIDAuNDM5NzM3OTM3NzA1OTIyMzRcbi8vICAgdmFyIHJuZzEgPSBNYXRoLnJhbmRvbTsgICAgICAgICAgICAgIC8vIFJlbWVtYmVyIHRoZSBjdXJyZW50IHBybmcuXG4vL1xuLy8gICB2YXIgYXV0b3NlZWQgPSBNYXRoLnNlZWRyYW5kb20oKTsgICAgLy8gTmV3IHBybmcgd2l0aCBhbiBhdXRvbWF0aWMgc2VlZC5cbi8vICAgZG9jdW1lbnQud3JpdGUoTWF0aC5yYW5kb20oKSk7ICAgICAgIC8vIFByZXR0eSBtdWNoIHVucHJlZGljdGFibGUuXG4vL1xuLy8gICBNYXRoLnJhbmRvbSA9IHJuZzE7ICAgICAgICAgICAgICAgICAgLy8gQ29udGludWUgXCJoZWxsb1wiIHBybmcgc2VxdWVuY2UuXG4vLyAgIGRvY3VtZW50LndyaXRlKE1hdGgucmFuZG9tKCkpOyAgICAgICAvLyBBbHdheXMgMC41NTQ3Njk0MzI0NzM0NTVcbi8vXG4vLyAgIE1hdGguc2VlZHJhbmRvbShhdXRvc2VlZCk7ICAgICAgICAgICAvLyBSZXN0YXJ0IGF0IHRoZSBwcmV2aW91cyBzZWVkLlxuLy8gICBkb2N1bWVudC53cml0ZShNYXRoLnJhbmRvbSgpKTsgICAgICAgLy8gUmVwZWF0IHRoZSAndW5wcmVkaWN0YWJsZScgdmFsdWUuXG4vL1xuLy8gTm90ZXM6XG4vL1xuLy8gRWFjaCB0aW1lIHNlZWRyYW5kb20oJ2FyZycpIGlzIGNhbGxlZCwgZW50cm9weSBmcm9tIHRoZSBwYXNzZWQgc2VlZFxuLy8gaXMgYWNjdW11bGF0ZWQgaW4gYSBwb29sIHRvIGhlbHAgZ2VuZXJhdGUgZnV0dXJlIHNlZWRzIGZvciB0aGVcbi8vIHplcm8tYXJndW1lbnQgZm9ybSBvZiBNYXRoLnNlZWRyYW5kb20sIHNvIGVudHJvcHkgY2FuIGJlIGluamVjdGVkIG92ZXJcbi8vIHRpbWUgYnkgY2FsbGluZyBzZWVkcmFuZG9tIHdpdGggZXhwbGljaXQgZGF0YSByZXBlYXRlZGx5LlxuLy9cbi8vIE9uIHNwZWVkIC0gVGhpcyBqYXZhc2NyaXB0IGltcGxlbWVudGF0aW9uIG9mIE1hdGgucmFuZG9tKCkgaXMgYWJvdXRcbi8vIDMtMTB4IHNsb3dlciB0aGFuIHRoZSBidWlsdC1pbiBNYXRoLnJhbmRvbSgpIGJlY2F1c2UgaXQgaXMgbm90IG5hdGl2ZVxuLy8gY29kZSwgYnV0IHRoaXMgaXMgdHlwaWNhbGx5IGZhc3QgZW5vdWdoIGFueXdheS4gIFNlZWRpbmcgaXMgbW9yZSBleHBlbnNpdmUsXG4vLyBlc3BlY2lhbGx5IGlmIHlvdSB1c2UgYXV0by1zZWVkaW5nLiAgU29tZSBkZXRhaWxzICh0aW1pbmdzIG9uIENocm9tZSA0KTpcbi8vXG4vLyBPdXIgTWF0aC5yYW5kb20oKSAgICAgICAgICAgIC0gYXZnIGxlc3MgdGhhbiAwLjAwMiBtaWxsaXNlY29uZHMgcGVyIGNhbGxcbi8vIHNlZWRyYW5kb20oJ2V4cGxpY2l0JykgICAgICAgLSBhdmcgbGVzcyB0aGFuIDAuNSBtaWxsaXNlY29uZHMgcGVyIGNhbGxcbi8vIHNlZWRyYW5kb20oJ2V4cGxpY2l0JywgdHJ1ZSkgLSBhdmcgbGVzcyB0aGFuIDIgbWlsbGlzZWNvbmRzIHBlciBjYWxsXG4vLyBzZWVkcmFuZG9tKCkgICAgICAgICAgICAgICAgIC0gYXZnIGFib3V0IDM4IG1pbGxpc2Vjb25kcyBwZXIgY2FsbFxuLy9cbi8vIExJQ0VOU0UgKEJTRCk6XG4vL1xuLy8gQ29weXJpZ2h0IDIwMTAgRGF2aWQgQmF1LCBhbGwgcmlnaHRzIHJlc2VydmVkLlxuLy9cbi8vIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dFxuLy8gbW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XG4vLyBcbi8vICAgMS4gUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHRcbi8vICAgICAgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxuLy9cbi8vICAgMi4gUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHRcbi8vICAgICAgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZVxuLy8gICAgICBkb2N1bWVudGF0aW9uIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxuLy8gXG4vLyAgIDMuIE5laXRoZXIgdGhlIG5hbWUgb2YgdGhpcyBtb2R1bGUgbm9yIHRoZSBuYW1lcyBvZiBpdHMgY29udHJpYnV0b3JzIG1heVxuLy8gICAgICBiZSB1c2VkIHRvIGVuZG9yc2Ugb3IgcHJvbW90ZSBwcm9kdWN0cyBkZXJpdmVkIGZyb20gdGhpcyBzb2Z0d2FyZVxuLy8gICAgICB3aXRob3V0IHNwZWNpZmljIHByaW9yIHdyaXR0ZW4gcGVybWlzc2lvbi5cbi8vIFxuLy8gVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SU1xuLy8gXCJBUyBJU1wiIEFORCBBTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVFxuLy8gTElNSVRFRCBUTywgVEhFIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MgRk9SXG4vLyBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBUkUgRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIENPUFlSSUdIVFxuLy8gT1dORVIgT1IgQ09OVFJJQlVUT1JTIEJFIExJQUJMRSBGT1IgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsXG4vLyBTUEVDSUFMLCBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyAoSU5DTFVESU5HLCBCVVQgTk9UXG4vLyBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFIEdPT0RTIE9SIFNFUlZJQ0VTOyBMT1NTIE9GIFVTRSxcbi8vIERBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EIE9OIEFOWVxuLy8gVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVFxuLy8gKElOQ0xVRElORyBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSkgQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFXG4vLyBPRiBUSElTIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgT0YgVEhFIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxuLy9cbi8qKlxuICogQWxsIGNvZGUgaXMgaW4gYW4gYW5vbnltb3VzIGNsb3N1cmUgdG8ga2VlcCB0aGUgZ2xvYmFsIG5hbWVzcGFjZSBjbGVhbi5cbiAqXG4gKiBAcGFyYW0ge251bWJlcj19IG92ZXJmbG93IFxuICogQHBhcmFtIHtudW1iZXI9fSBzdGFydGRlbm9tXG4gKi9cblxuLy8gUGF0Y2hlZCBieSBTZWIgc28gdGhhdCBzZWVkcmFuZG9tLmpzIGRvZXMgbm90IHBvbGx1dGUgdGhlIE1hdGggb2JqZWN0LlxuLy8gTXkgdGVzdHMgc3VnZ2VzdCB0aGF0IGRvaW5nIE1hdGgudHJvdWJsZSA9IDEgbWFrZXMgTWF0aCBsb29rdXBzIGFib3V0IDUlXG4vLyBzbG93ZXIuXG5udW1lcmljLnNlZWRyYW5kb20gPSB7IHBvdzpNYXRoLnBvdywgcmFuZG9tOk1hdGgucmFuZG9tIH07XG5cbihmdW5jdGlvbiAocG9vbCwgbWF0aCwgd2lkdGgsIGNodW5rcywgc2lnbmlmaWNhbmNlLCBvdmVyZmxvdywgc3RhcnRkZW5vbSkge1xuXG5cbi8vXG4vLyBzZWVkcmFuZG9tKClcbi8vIFRoaXMgaXMgdGhlIHNlZWRyYW5kb20gZnVuY3Rpb24gZGVzY3JpYmVkIGFib3ZlLlxuLy9cbm1hdGhbJ3NlZWRyYW5kb20nXSA9IGZ1bmN0aW9uIHNlZWRyYW5kb20oc2VlZCwgdXNlX2VudHJvcHkpIHtcbiAgdmFyIGtleSA9IFtdO1xuICB2YXIgYXJjNDtcblxuICAvLyBGbGF0dGVuIHRoZSBzZWVkIHN0cmluZyBvciBidWlsZCBvbmUgZnJvbSBsb2NhbCBlbnRyb3B5IGlmIG5lZWRlZC5cbiAgc2VlZCA9IG1peGtleShmbGF0dGVuKFxuICAgIHVzZV9lbnRyb3B5ID8gW3NlZWQsIHBvb2xdIDpcbiAgICBhcmd1bWVudHMubGVuZ3RoID8gc2VlZCA6XG4gICAgW25ldyBEYXRlKCkuZ2V0VGltZSgpLCBwb29sLCB3aW5kb3ddLCAzKSwga2V5KTtcblxuICAvLyBVc2UgdGhlIHNlZWQgdG8gaW5pdGlhbGl6ZSBhbiBBUkM0IGdlbmVyYXRvci5cbiAgYXJjNCA9IG5ldyBBUkM0KGtleSk7XG5cbiAgLy8gTWl4IHRoZSByYW5kb21uZXNzIGludG8gYWNjdW11bGF0ZWQgZW50cm9weS5cbiAgbWl4a2V5KGFyYzQuUywgcG9vbCk7XG5cbiAgLy8gT3ZlcnJpZGUgTWF0aC5yYW5kb21cblxuICAvLyBUaGlzIGZ1bmN0aW9uIHJldHVybnMgYSByYW5kb20gZG91YmxlIGluIFswLCAxKSB0aGF0IGNvbnRhaW5zXG4gIC8vIHJhbmRvbW5lc3MgaW4gZXZlcnkgYml0IG9mIHRoZSBtYW50aXNzYSBvZiB0aGUgSUVFRSA3NTQgdmFsdWUuXG5cbiAgbWF0aFsncmFuZG9tJ10gPSBmdW5jdGlvbiByYW5kb20oKSB7ICAvLyBDbG9zdXJlIHRvIHJldHVybiBhIHJhbmRvbSBkb3VibGU6XG4gICAgdmFyIG4gPSBhcmM0LmcoY2h1bmtzKTsgICAgICAgICAgICAgLy8gU3RhcnQgd2l0aCBhIG51bWVyYXRvciBuIDwgMiBeIDQ4XG4gICAgdmFyIGQgPSBzdGFydGRlbm9tOyAgICAgICAgICAgICAgICAgLy8gICBhbmQgZGVub21pbmF0b3IgZCA9IDIgXiA0OC5cbiAgICB2YXIgeCA9IDA7ICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIGFuZCBubyAnZXh0cmEgbGFzdCBieXRlJy5cbiAgICB3aGlsZSAobiA8IHNpZ25pZmljYW5jZSkgeyAgICAgICAgICAvLyBGaWxsIHVwIGFsbCBzaWduaWZpY2FudCBkaWdpdHMgYnlcbiAgICAgIG4gPSAobiArIHgpICogd2lkdGg7ICAgICAgICAgICAgICAvLyAgIHNoaWZ0aW5nIG51bWVyYXRvciBhbmRcbiAgICAgIGQgKj0gd2lkdGg7ICAgICAgICAgICAgICAgICAgICAgICAvLyAgIGRlbm9taW5hdG9yIGFuZCBnZW5lcmF0aW5nIGFcbiAgICAgIHggPSBhcmM0LmcoMSk7ICAgICAgICAgICAgICAgICAgICAvLyAgIG5ldyBsZWFzdC1zaWduaWZpY2FudC1ieXRlLlxuICAgIH1cbiAgICB3aGlsZSAobiA+PSBvdmVyZmxvdykgeyAgICAgICAgICAgICAvLyBUbyBhdm9pZCByb3VuZGluZyB1cCwgYmVmb3JlIGFkZGluZ1xuICAgICAgbiAvPSAyOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgbGFzdCBieXRlLCBzaGlmdCBldmVyeXRoaW5nXG4gICAgICBkIC89IDI7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICByaWdodCB1c2luZyBpbnRlZ2VyIG1hdGggdW50aWxcbiAgICAgIHggPj4+PSAxOyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIHdlIGhhdmUgZXhhY3RseSB0aGUgZGVzaXJlZCBiaXRzLlxuICAgIH1cbiAgICByZXR1cm4gKG4gKyB4KSAvIGQ7ICAgICAgICAgICAgICAgICAvLyBGb3JtIHRoZSBudW1iZXIgd2l0aGluIFswLCAxKS5cbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIHNlZWQgdGhhdCB3YXMgdXNlZFxuICByZXR1cm4gc2VlZDtcbn07XG5cbi8vXG4vLyBBUkM0XG4vL1xuLy8gQW4gQVJDNCBpbXBsZW1lbnRhdGlvbi4gIFRoZSBjb25zdHJ1Y3RvciB0YWtlcyBhIGtleSBpbiB0aGUgZm9ybSBvZlxuLy8gYW4gYXJyYXkgb2YgYXQgbW9zdCAod2lkdGgpIGludGVnZXJzIHRoYXQgc2hvdWxkIGJlIDAgPD0geCA8ICh3aWR0aCkuXG4vL1xuLy8gVGhlIGcoY291bnQpIG1ldGhvZCByZXR1cm5zIGEgcHNldWRvcmFuZG9tIGludGVnZXIgdGhhdCBjb25jYXRlbmF0ZXNcbi8vIHRoZSBuZXh0IChjb3VudCkgb3V0cHV0cyBmcm9tIEFSQzQuICBJdHMgcmV0dXJuIHZhbHVlIGlzIGEgbnVtYmVyIHhcbi8vIHRoYXQgaXMgaW4gdGhlIHJhbmdlIDAgPD0geCA8ICh3aWR0aCBeIGNvdW50KS5cbi8vXG4vKiogQGNvbnN0cnVjdG9yICovXG5mdW5jdGlvbiBBUkM0KGtleSkge1xuICB2YXIgdCwgdSwgbWUgPSB0aGlzLCBrZXlsZW4gPSBrZXkubGVuZ3RoO1xuICB2YXIgaSA9IDAsIGogPSBtZS5pID0gbWUuaiA9IG1lLm0gPSAwO1xuICBtZS5TID0gW107XG4gIG1lLmMgPSBbXTtcblxuICAvLyBUaGUgZW1wdHkga2V5IFtdIGlzIHRyZWF0ZWQgYXMgWzBdLlxuICBpZiAoIWtleWxlbikgeyBrZXkgPSBba2V5bGVuKytdOyB9XG5cbiAgLy8gU2V0IHVwIFMgdXNpbmcgdGhlIHN0YW5kYXJkIGtleSBzY2hlZHVsaW5nIGFsZ29yaXRobS5cbiAgd2hpbGUgKGkgPCB3aWR0aCkgeyBtZS5TW2ldID0gaSsrOyB9XG4gIGZvciAoaSA9IDA7IGkgPCB3aWR0aDsgaSsrKSB7XG4gICAgdCA9IG1lLlNbaV07XG4gICAgaiA9IGxvd2JpdHMoaiArIHQgKyBrZXlbaSAlIGtleWxlbl0pO1xuICAgIHUgPSBtZS5TW2pdO1xuICAgIG1lLlNbaV0gPSB1O1xuICAgIG1lLlNbal0gPSB0O1xuICB9XG5cbiAgLy8gVGhlIFwiZ1wiIG1ldGhvZCByZXR1cm5zIHRoZSBuZXh0IChjb3VudCkgb3V0cHV0cyBhcyBvbmUgbnVtYmVyLlxuICBtZS5nID0gZnVuY3Rpb24gZ2V0bmV4dChjb3VudCkge1xuICAgIHZhciBzID0gbWUuUztcbiAgICB2YXIgaSA9IGxvd2JpdHMobWUuaSArIDEpOyB2YXIgdCA9IHNbaV07XG4gICAgdmFyIGogPSBsb3diaXRzKG1lLmogKyB0KTsgdmFyIHUgPSBzW2pdO1xuICAgIHNbaV0gPSB1O1xuICAgIHNbal0gPSB0O1xuICAgIHZhciByID0gc1tsb3diaXRzKHQgKyB1KV07XG4gICAgd2hpbGUgKC0tY291bnQpIHtcbiAgICAgIGkgPSBsb3diaXRzKGkgKyAxKTsgdCA9IHNbaV07XG4gICAgICBqID0gbG93Yml0cyhqICsgdCk7IHUgPSBzW2pdO1xuICAgICAgc1tpXSA9IHU7XG4gICAgICBzW2pdID0gdDtcbiAgICAgIHIgPSByICogd2lkdGggKyBzW2xvd2JpdHModCArIHUpXTtcbiAgICB9XG4gICAgbWUuaSA9IGk7XG4gICAgbWUuaiA9IGo7XG4gICAgcmV0dXJuIHI7XG4gIH07XG4gIC8vIEZvciByb2J1c3QgdW5wcmVkaWN0YWJpbGl0eSBkaXNjYXJkIGFuIGluaXRpYWwgYmF0Y2ggb2YgdmFsdWVzLlxuICAvLyBTZWUgaHR0cDovL3d3dy5yc2EuY29tL3JzYWxhYnMvbm9kZS5hc3A/aWQ9MjAwOVxuICBtZS5nKHdpZHRoKTtcbn1cblxuLy9cbi8vIGZsYXR0ZW4oKVxuLy8gQ29udmVydHMgYW4gb2JqZWN0IHRyZWUgdG8gbmVzdGVkIGFycmF5cyBvZiBzdHJpbmdzLlxuLy9cbi8qKiBAcGFyYW0ge09iamVjdD19IHJlc3VsdCBcbiAgKiBAcGFyYW0ge3N0cmluZz19IHByb3BcbiAgKiBAcGFyYW0ge3N0cmluZz19IHR5cCAqL1xuZnVuY3Rpb24gZmxhdHRlbihvYmosIGRlcHRoLCByZXN1bHQsIHByb3AsIHR5cCkge1xuICByZXN1bHQgPSBbXTtcbiAgdHlwID0gdHlwZW9mKG9iaik7XG4gIGlmIChkZXB0aCAmJiB0eXAgPT0gJ29iamVjdCcpIHtcbiAgICBmb3IgKHByb3AgaW4gb2JqKSB7XG4gICAgICBpZiAocHJvcC5pbmRleE9mKCdTJykgPCA1KSB7ICAgIC8vIEF2b2lkIEZGMyBidWcgKGxvY2FsL3Nlc3Npb25TdG9yYWdlKVxuICAgICAgICB0cnkgeyByZXN1bHQucHVzaChmbGF0dGVuKG9ialtwcm9wXSwgZGVwdGggLSAxKSk7IH0gY2F0Y2ggKGUpIHt9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiAocmVzdWx0Lmxlbmd0aCA/IHJlc3VsdCA6IG9iaiArICh0eXAgIT0gJ3N0cmluZycgPyAnXFwwJyA6ICcnKSk7XG59XG5cbi8vXG4vLyBtaXhrZXkoKVxuLy8gTWl4ZXMgYSBzdHJpbmcgc2VlZCBpbnRvIGEga2V5IHRoYXQgaXMgYW4gYXJyYXkgb2YgaW50ZWdlcnMsIGFuZFxuLy8gcmV0dXJucyBhIHNob3J0ZW5lZCBzdHJpbmcgc2VlZCB0aGF0IGlzIGVxdWl2YWxlbnQgdG8gdGhlIHJlc3VsdCBrZXkuXG4vL1xuLyoqIEBwYXJhbSB7bnVtYmVyPX0gc21lYXIgXG4gICogQHBhcmFtIHtudW1iZXI9fSBqICovXG5mdW5jdGlvbiBtaXhrZXkoc2VlZCwga2V5LCBzbWVhciwgaikge1xuICBzZWVkICs9ICcnOyAgICAgICAgICAgICAgICAgICAgICAgICAvLyBFbnN1cmUgdGhlIHNlZWQgaXMgYSBzdHJpbmdcbiAgc21lYXIgPSAwO1xuICBmb3IgKGogPSAwOyBqIDwgc2VlZC5sZW5ndGg7IGorKykge1xuICAgIGtleVtsb3diaXRzKGopXSA9XG4gICAgICBsb3diaXRzKChzbWVhciBePSBrZXlbbG93Yml0cyhqKV0gKiAxOSkgKyBzZWVkLmNoYXJDb2RlQXQoaikpO1xuICB9XG4gIHNlZWQgPSAnJztcbiAgZm9yIChqIGluIGtleSkgeyBzZWVkICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoa2V5W2pdKTsgfVxuICByZXR1cm4gc2VlZDtcbn1cblxuLy9cbi8vIGxvd2JpdHMoKVxuLy8gQSBxdWljayBcIm4gbW9kIHdpZHRoXCIgZm9yIHdpZHRoIGEgcG93ZXIgb2YgMi5cbi8vXG5mdW5jdGlvbiBsb3diaXRzKG4pIHsgcmV0dXJuIG4gJiAod2lkdGggLSAxKTsgfVxuXG4vL1xuLy8gVGhlIGZvbGxvd2luZyBjb25zdGFudHMgYXJlIHJlbGF0ZWQgdG8gSUVFRSA3NTQgbGltaXRzLlxuLy9cbnN0YXJ0ZGVub20gPSBtYXRoLnBvdyh3aWR0aCwgY2h1bmtzKTtcbnNpZ25pZmljYW5jZSA9IG1hdGgucG93KDIsIHNpZ25pZmljYW5jZSk7XG5vdmVyZmxvdyA9IHNpZ25pZmljYW5jZSAqIDI7XG5cbi8vXG4vLyBXaGVuIHNlZWRyYW5kb20uanMgaXMgbG9hZGVkLCB3ZSBpbW1lZGlhdGVseSBtaXggYSBmZXcgYml0c1xuLy8gZnJvbSB0aGUgYnVpbHQtaW4gUk5HIGludG8gdGhlIGVudHJvcHkgcG9vbC4gIEJlY2F1c2Ugd2UgZG9cbi8vIG5vdCB3YW50IHRvIGludGVmZXJlIHdpdGggZGV0ZXJtaW5zdGljIFBSTkcgc3RhdGUgbGF0ZXIsXG4vLyBzZWVkcmFuZG9tIHdpbGwgbm90IGNhbGwgbWF0aC5yYW5kb20gb24gaXRzIG93biBhZ2FpbiBhZnRlclxuLy8gaW5pdGlhbGl6YXRpb24uXG4vL1xubWl4a2V5KG1hdGgucmFuZG9tKCksIHBvb2wpO1xuXG4vLyBFbmQgYW5vbnltb3VzIHNjb3BlLCBhbmQgcGFzcyBpbml0aWFsIHZhbHVlcy5cbn0oXG4gIFtdLCAgIC8vIHBvb2w6IGVudHJvcHkgcG9vbCBzdGFydHMgZW1wdHlcbiAgbnVtZXJpYy5zZWVkcmFuZG9tLCAvLyBtYXRoOiBwYWNrYWdlIGNvbnRhaW5pbmcgcmFuZG9tLCBwb3csIGFuZCBzZWVkcmFuZG9tXG4gIDI1NiwgIC8vIHdpZHRoOiBlYWNoIFJDNCBvdXRwdXQgaXMgMCA8PSB4IDwgMjU2XG4gIDYsICAgIC8vIGNodW5rczogYXQgbGVhc3Qgc2l4IFJDNCBvdXRwdXRzIGZvciBlYWNoIGRvdWJsZVxuICA1MiAgICAvLyBzaWduaWZpY2FuY2U6IHRoZXJlIGFyZSA1MiBzaWduaWZpY2FudCBkaWdpdHMgaW4gYSBkb3VibGVcbiAgKSk7XG4vKiBUaGlzIGZpbGUgaXMgYSBzbGlnaHRseSBtb2RpZmllZCB2ZXJzaW9uIG9mIHF1YWRwcm9nLmpzIGZyb20gQWxiZXJ0byBTYW50aW5pLlxuICogSXQgaGFzIGJlZW4gc2xpZ2h0bHkgbW9kaWZpZWQgYnkgU8OpYmFzdGllbiBMb2lzZWwgdG8gbWFrZSBzdXJlIHRoYXQgaXQgaGFuZGxlc1xuICogMC1iYXNlZCBBcnJheXMgaW5zdGVhZCBvZiAxLWJhc2VkIEFycmF5cy5cbiAqIExpY2Vuc2UgaXMgaW4gcmVzb3VyY2VzL0xJQ0VOU0UucXVhZHByb2cgKi9cbihmdW5jdGlvbihleHBvcnRzKSB7XG5cbmZ1bmN0aW9uIGJhc2UwdG8xKEEpIHtcbiAgICBpZih0eXBlb2YgQSAhPT0gXCJvYmplY3RcIikgeyByZXR1cm4gQTsgfVxuICAgIHZhciByZXQgPSBbXSwgaSxuPUEubGVuZ3RoO1xuICAgIGZvcihpPTA7aTxuO2krKykgcmV0W2krMV0gPSBiYXNlMHRvMShBW2ldKTtcbiAgICByZXR1cm4gcmV0O1xufVxuZnVuY3Rpb24gYmFzZTF0bzAoQSkge1xuICAgIGlmKHR5cGVvZiBBICE9PSBcIm9iamVjdFwiKSB7IHJldHVybiBBOyB9XG4gICAgdmFyIHJldCA9IFtdLCBpLG49QS5sZW5ndGg7XG4gICAgZm9yKGk9MTtpPG47aSsrKSByZXRbaS0xXSA9IGJhc2UxdG8wKEFbaV0pO1xuICAgIHJldHVybiByZXQ7XG59XG5cbmZ1bmN0aW9uIGRwb3JpKGEsIGxkYSwgbikge1xuICAgIHZhciBpLCBqLCBrLCBrcDEsIHQ7XG5cbiAgICBmb3IgKGsgPSAxOyBrIDw9IG47IGsgPSBrICsgMSkge1xuICAgICAgICBhW2tdW2tdID0gMSAvIGFba11ba107XG4gICAgICAgIHQgPSAtYVtrXVtrXTtcbiAgICAgICAgLy9+IGRzY2FsKGsgLSAxLCB0LCBhWzFdW2tdLCAxKTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IGs7IGkgPSBpICsgMSkge1xuICAgICAgICAgICAgYVtpXVtrXSA9IHQgKiBhW2ldW2tdO1xuICAgICAgICB9XG5cbiAgICAgICAga3AxID0gayArIDE7XG4gICAgICAgIGlmIChuIDwga3AxKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGogPSBrcDE7IGogPD0gbjsgaiA9IGogKyAxKSB7XG4gICAgICAgICAgICB0ID0gYVtrXVtqXTtcbiAgICAgICAgICAgIGFba11bal0gPSAwO1xuICAgICAgICAgICAgLy9+IGRheHB5KGssIHQsIGFbMV1ba10sIDEsIGFbMV1bal0sIDEpO1xuICAgICAgICAgICAgZm9yIChpID0gMTsgaSA8PSBrOyBpID0gaSArIDEpIHtcbiAgICAgICAgICAgICAgICBhW2ldW2pdID0gYVtpXVtqXSArICh0ICogYVtpXVtrXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuZnVuY3Rpb24gZHBvc2woYSwgbGRhLCBuLCBiKSB7XG4gICAgdmFyIGksIGssIGtiLCB0O1xuXG4gICAgZm9yIChrID0gMTsgayA8PSBuOyBrID0gayArIDEpIHtcbiAgICAgICAgLy9+IHQgPSBkZG90KGsgLSAxLCBhWzFdW2tdLCAxLCBiWzFdLCAxKTtcbiAgICAgICAgdCA9IDA7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBrOyBpID0gaSArIDEpIHtcbiAgICAgICAgICAgIHQgPSB0ICsgKGFbaV1ba10gKiBiW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJba10gPSAoYltrXSAtIHQpIC8gYVtrXVtrXTtcbiAgICB9XG5cbiAgICBmb3IgKGtiID0gMTsga2IgPD0gbjsga2IgPSBrYiArIDEpIHtcbiAgICAgICAgayA9IG4gKyAxIC0ga2I7XG4gICAgICAgIGJba10gPSBiW2tdIC8gYVtrXVtrXTtcbiAgICAgICAgdCA9IC1iW2tdO1xuICAgICAgICAvL34gZGF4cHkoayAtIDEsIHQsIGFbMV1ba10sIDEsIGJbMV0sIDEpO1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgazsgaSA9IGkgKyAxKSB7XG4gICAgICAgICAgICBiW2ldID0gYltpXSArICh0ICogYVtpXVtrXSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRwb2ZhKGEsIGxkYSwgbiwgaW5mbykge1xuICAgIHZhciBpLCBqLCBqbTEsIGssIHQsIHM7XG5cbiAgICBmb3IgKGogPSAxOyBqIDw9IG47IGogPSBqICsgMSkge1xuICAgICAgICBpbmZvWzFdID0gajtcbiAgICAgICAgcyA9IDA7XG4gICAgICAgIGptMSA9IGogLSAxO1xuICAgICAgICBpZiAoam0xIDwgMSkge1xuICAgICAgICAgICAgcyA9IGFbal1bal0gLSBzO1xuICAgICAgICAgICAgaWYgKHMgPD0gMCkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYVtqXVtqXSA9IE1hdGguc3FydChzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAoayA9IDE7IGsgPD0gam0xOyBrID0gayArIDEpIHtcbiAgICAgICAgICAgICAgICAvL34gdCA9IGFba11bal0gLSBkZG90KGsgLSAxLCBhWzFdW2tdLCAxLCBhWzFdW2pdLCAxKTtcbiAgICAgICAgICAgICAgICB0ID0gYVtrXVtqXTtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAxOyBpIDwgazsgaSA9IGkgKyAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHQgPSB0IC0gKGFbaV1bal0gKiBhW2ldW2tdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdCA9IHQgLyBhW2tdW2tdO1xuICAgICAgICAgICAgICAgIGFba11bal0gPSB0O1xuICAgICAgICAgICAgICAgIHMgPSBzICsgdCAqIHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzID0gYVtqXVtqXSAtIHM7XG4gICAgICAgICAgICBpZiAocyA8PSAwKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhW2pdW2pdID0gTWF0aC5zcXJ0KHMpO1xuICAgICAgICB9XG4gICAgICAgIGluZm9bMV0gPSAwO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gcXBnZW4yKGRtYXQsIGR2ZWMsIGZkZG1hdCwgbiwgc29sLCBjcnZhbCwgYW1hdCxcbiAgICBidmVjLCBmZGFtYXQsIHEsIG1lcSwgaWFjdCwgbmFjdCwgaXRlciwgd29yaywgaWVycikge1xuXG4gICAgdmFyIGksIGosIGwsIGwxLCBpbmZvLCBpdDEsIGl3enYsIGl3cnYsIGl3cm0sIGl3c3YsIGl3dXYsIG52bCwgciwgaXduYnYsXG4gICAgICAgIHRlbXAsIHN1bSwgdDEsIHR0LCBnYywgZ3MsIG51LFxuICAgICAgICB0MWluZiwgdDJtaW4sXG4gICAgICAgIHZzbWFsbCwgdG1wYSwgdG1wYixcbiAgICAgICAgZ287XG5cbiAgICByID0gTWF0aC5taW4obiwgcSk7XG4gICAgbCA9IDIgKiBuICsgKHIgKiAociArIDUpKSAvIDIgKyAyICogcSArIDE7XG5cbiAgICB2c21hbGwgPSAxLjBlLTYwO1xuICAgIGRvIHtcbiAgICAgICAgdnNtYWxsID0gdnNtYWxsICsgdnNtYWxsO1xuICAgICAgICB0bXBhID0gMSArIDAuMSAqIHZzbWFsbDtcbiAgICAgICAgdG1wYiA9IDEgKyAwLjIgKiB2c21hbGw7XG4gICAgfSB3aGlsZSAodG1wYSA8PSAxIHx8IHRtcGIgPD0gMSk7XG5cbiAgICBmb3IgKGkgPSAxOyBpIDw9IG47IGkgPSBpICsgMSkge1xuICAgICAgICB3b3JrW2ldID0gZHZlY1tpXTtcbiAgICB9XG4gICAgZm9yIChpID0gbiArIDE7IGkgPD0gbDsgaSA9IGkgKyAxKSB7XG4gICAgICAgIHdvcmtbaV0gPSAwO1xuICAgIH1cbiAgICBmb3IgKGkgPSAxOyBpIDw9IHE7IGkgPSBpICsgMSkge1xuICAgICAgICBpYWN0W2ldID0gMDtcbiAgICB9XG5cbiAgICBpbmZvID0gW107XG5cbiAgICBpZiAoaWVyclsxXSA9PT0gMCkge1xuICAgICAgICBkcG9mYShkbWF0LCBmZGRtYXQsIG4sIGluZm8pO1xuICAgICAgICBpZiAoaW5mb1sxXSAhPT0gMCkge1xuICAgICAgICAgICAgaWVyclsxXSA9IDI7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZHBvc2woZG1hdCwgZmRkbWF0LCBuLCBkdmVjKTtcbiAgICAgICAgZHBvcmkoZG1hdCwgZmRkbWF0LCBuKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGogPSAxOyBqIDw9IG47IGogPSBqICsgMSkge1xuICAgICAgICAgICAgc29sW2pdID0gMDtcbiAgICAgICAgICAgIGZvciAoaSA9IDE7IGkgPD0gajsgaSA9IGkgKyAxKSB7XG4gICAgICAgICAgICAgICAgc29sW2pdID0gc29sW2pdICsgZG1hdFtpXVtqXSAqIGR2ZWNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChqID0gMTsgaiA8PSBuOyBqID0gaiArIDEpIHtcbiAgICAgICAgICAgIGR2ZWNbal0gPSAwO1xuICAgICAgICAgICAgZm9yIChpID0gajsgaSA8PSBuOyBpID0gaSArIDEpIHtcbiAgICAgICAgICAgICAgICBkdmVjW2pdID0gZHZlY1tqXSArIGRtYXRbal1baV0gKiBzb2xbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcnZhbFsxXSA9IDA7XG4gICAgZm9yIChqID0gMTsgaiA8PSBuOyBqID0gaiArIDEpIHtcbiAgICAgICAgc29sW2pdID0gZHZlY1tqXTtcbiAgICAgICAgY3J2YWxbMV0gPSBjcnZhbFsxXSArIHdvcmtbal0gKiBzb2xbal07XG4gICAgICAgIHdvcmtbal0gPSAwO1xuICAgICAgICBmb3IgKGkgPSBqICsgMTsgaSA8PSBuOyBpID0gaSArIDEpIHtcbiAgICAgICAgICAgIGRtYXRbaV1bal0gPSAwO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNydmFsWzFdID0gLWNydmFsWzFdIC8gMjtcbiAgICBpZXJyWzFdID0gMDtcblxuICAgIGl3enYgPSBuO1xuICAgIGl3cnYgPSBpd3p2ICsgbjtcbiAgICBpd3V2ID0gaXdydiArIHI7XG4gICAgaXdybSA9IGl3dXYgKyByICsgMTtcbiAgICBpd3N2ID0gaXdybSArIChyICogKHIgKyAxKSkgLyAyO1xuICAgIGl3bmJ2ID0gaXdzdiArIHE7XG5cbiAgICBmb3IgKGkgPSAxOyBpIDw9IHE7IGkgPSBpICsgMSkge1xuICAgICAgICBzdW0gPSAwO1xuICAgICAgICBmb3IgKGogPSAxOyBqIDw9IG47IGogPSBqICsgMSkge1xuICAgICAgICAgICAgc3VtID0gc3VtICsgYW1hdFtqXVtpXSAqIGFtYXRbal1baV07XG4gICAgICAgIH1cbiAgICAgICAgd29ya1tpd25idiArIGldID0gTWF0aC5zcXJ0KHN1bSk7XG4gICAgfVxuICAgIG5hY3QgPSAwO1xuICAgIGl0ZXJbMV0gPSAwO1xuICAgIGl0ZXJbMl0gPSAwO1xuXG4gICAgZnVuY3Rpb24gZm5fZ290b181MCgpIHtcbiAgICAgICAgaXRlclsxXSA9IGl0ZXJbMV0gKyAxO1xuXG4gICAgICAgIGwgPSBpd3N2O1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDw9IHE7IGkgPSBpICsgMSkge1xuICAgICAgICAgICAgbCA9IGwgKyAxO1xuICAgICAgICAgICAgc3VtID0gLWJ2ZWNbaV07XG4gICAgICAgICAgICBmb3IgKGogPSAxOyBqIDw9IG47IGogPSBqICsgMSkge1xuICAgICAgICAgICAgICAgIHN1bSA9IHN1bSArIGFtYXRbal1baV0gKiBzb2xbal07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMoc3VtKSA8IHZzbWFsbCkge1xuICAgICAgICAgICAgICAgIHN1bSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaSA+IG1lcSkge1xuICAgICAgICAgICAgICAgIHdvcmtbbF0gPSBzdW07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHdvcmtbbF0gPSAtTWF0aC5hYnMoc3VtKTtcbiAgICAgICAgICAgICAgICBpZiAoc3VtID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGogPSAxOyBqIDw9IG47IGogPSBqICsgMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYW1hdFtqXVtpXSA9IC1hbWF0W2pdW2ldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJ2ZWNbaV0gPSAtYnZlY1tpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAxOyBpIDw9IG5hY3Q7IGkgPSBpICsgMSkge1xuICAgICAgICAgICAgd29ya1tpd3N2ICsgaWFjdFtpXV0gPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgbnZsID0gMDtcbiAgICAgICAgdGVtcCA9IDA7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPD0gcTsgaSA9IGkgKyAxKSB7XG4gICAgICAgICAgICBpZiAod29ya1tpd3N2ICsgaV0gPCB0ZW1wICogd29ya1tpd25idiArIGldKSB7XG4gICAgICAgICAgICAgICAgbnZsID0gaTtcbiAgICAgICAgICAgICAgICB0ZW1wID0gd29ya1tpd3N2ICsgaV0gLyB3b3JrW2l3bmJ2ICsgaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG52bCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIDk5OTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZuX2dvdG9fNTUoKSB7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPD0gbjsgaSA9IGkgKyAxKSB7XG4gICAgICAgICAgICBzdW0gPSAwO1xuICAgICAgICAgICAgZm9yIChqID0gMTsgaiA8PSBuOyBqID0gaiArIDEpIHtcbiAgICAgICAgICAgICAgICBzdW0gPSBzdW0gKyBkbWF0W2pdW2ldICogYW1hdFtqXVtudmxdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd29ya1tpXSA9IHN1bTtcbiAgICAgICAgfVxuXG4gICAgICAgIGwxID0gaXd6djtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8PSBuOyBpID0gaSArIDEpIHtcbiAgICAgICAgICAgIHdvcmtbbDEgKyBpXSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChqID0gbmFjdCArIDE7IGogPD0gbjsgaiA9IGogKyAxKSB7XG4gICAgICAgICAgICBmb3IgKGkgPSAxOyBpIDw9IG47IGkgPSBpICsgMSkge1xuICAgICAgICAgICAgICAgIHdvcmtbbDEgKyBpXSA9IHdvcmtbbDEgKyBpXSArIGRtYXRbaV1bal0gKiB3b3JrW2pdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdDFpbmYgPSB0cnVlO1xuICAgICAgICBmb3IgKGkgPSBuYWN0OyBpID49IDE7IGkgPSBpIC0gMSkge1xuICAgICAgICAgICAgc3VtID0gd29ya1tpXTtcbiAgICAgICAgICAgIGwgPSBpd3JtICsgKGkgKiAoaSArIDMpKSAvIDI7XG4gICAgICAgICAgICBsMSA9IGwgLSBpO1xuICAgICAgICAgICAgZm9yIChqID0gaSArIDE7IGogPD0gbmFjdDsgaiA9IGogKyAxKSB7XG4gICAgICAgICAgICAgICAgc3VtID0gc3VtIC0gd29ya1tsXSAqIHdvcmtbaXdydiArIGpdO1xuICAgICAgICAgICAgICAgIGwgPSBsICsgajtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN1bSA9IHN1bSAvIHdvcmtbbDFdO1xuICAgICAgICAgICAgd29ya1tpd3J2ICsgaV0gPSBzdW07XG4gICAgICAgICAgICBpZiAoaWFjdFtpXSA8IG1lcSkge1xuICAgICAgICAgICAgICAgIC8vIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHN1bSA8IDApIHtcbiAgICAgICAgICAgICAgICAvLyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHQxaW5mID0gZmFsc2U7XG4gICAgICAgICAgICBpdDEgPSBpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0MWluZikge1xuICAgICAgICAgICAgdDEgPSB3b3JrW2l3dXYgKyBpdDFdIC8gd29ya1tpd3J2ICsgaXQxXTtcbiAgICAgICAgICAgIGZvciAoaSA9IDE7IGkgPD0gbmFjdDsgaSA9IGkgKyAxKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlhY3RbaV0gPCBtZXEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAod29ya1tpd3J2ICsgaV0gPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGVtcCA9IHdvcmtbaXd1diArIGldIC8gd29ya1tpd3J2ICsgaV07XG4gICAgICAgICAgICAgICAgaWYgKHRlbXAgPCB0MSkge1xuICAgICAgICAgICAgICAgICAgICB0MSA9IHRlbXA7XG4gICAgICAgICAgICAgICAgICAgIGl0MSA9IGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3VtID0gMDtcbiAgICAgICAgZm9yIChpID0gaXd6diArIDE7IGkgPD0gaXd6diArIG47IGkgPSBpICsgMSkge1xuICAgICAgICAgICAgc3VtID0gc3VtICsgd29ya1tpXSAqIHdvcmtbaV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKE1hdGguYWJzKHN1bSkgPD0gdnNtYWxsKSB7XG4gICAgICAgICAgICBpZiAodDFpbmYpIHtcbiAgICAgICAgICAgICAgICBpZXJyWzFdID0gMTtcbiAgICAgICAgICAgICAgICAvLyBHT1RPIDk5OVxuICAgICAgICAgICAgICAgIHJldHVybiA5OTk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDE7IGkgPD0gbmFjdDsgaSA9IGkgKyAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHdvcmtbaXd1diArIGldID0gd29ya1tpd3V2ICsgaV0gLSB0MSAqIHdvcmtbaXdydiArIGldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB3b3JrW2l3dXYgKyBuYWN0ICsgMV0gPSB3b3JrW2l3dXYgKyBuYWN0ICsgMV0gKyB0MTtcbiAgICAgICAgICAgICAgICAvLyBHT1RPIDcwMFxuICAgICAgICAgICAgICAgIHJldHVybiA3MDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdW0gPSAwO1xuICAgICAgICAgICAgZm9yIChpID0gMTsgaSA8PSBuOyBpID0gaSArIDEpIHtcbiAgICAgICAgICAgICAgICBzdW0gPSBzdW0gKyB3b3JrW2l3enYgKyBpXSAqIGFtYXRbaV1bbnZsXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHR0ID0gLXdvcmtbaXdzdiArIG52bF0gLyBzdW07XG4gICAgICAgICAgICB0Mm1pbiA9IHRydWU7XG4gICAgICAgICAgICBpZiAoIXQxaW5mKSB7XG4gICAgICAgICAgICAgICAgaWYgKHQxIDwgdHQpIHtcbiAgICAgICAgICAgICAgICAgICAgdHQgPSB0MTtcbiAgICAgICAgICAgICAgICAgICAgdDJtaW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAoaSA9IDE7IGkgPD0gbjsgaSA9IGkgKyAxKSB7XG4gICAgICAgICAgICAgICAgc29sW2ldID0gc29sW2ldICsgdHQgKiB3b3JrW2l3enYgKyBpXTtcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoc29sW2ldKSA8IHZzbWFsbCkge1xuICAgICAgICAgICAgICAgICAgICBzb2xbaV0gPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY3J2YWxbMV0gPSBjcnZhbFsxXSArIHR0ICogc3VtICogKHR0IC8gMiArIHdvcmtbaXd1diArIG5hY3QgKyAxXSk7XG4gICAgICAgICAgICBmb3IgKGkgPSAxOyBpIDw9IG5hY3Q7IGkgPSBpICsgMSkge1xuICAgICAgICAgICAgICAgIHdvcmtbaXd1diArIGldID0gd29ya1tpd3V2ICsgaV0gLSB0dCAqIHdvcmtbaXdydiArIGldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd29ya1tpd3V2ICsgbmFjdCArIDFdID0gd29ya1tpd3V2ICsgbmFjdCArIDFdICsgdHQ7XG5cbiAgICAgICAgICAgIGlmICh0Mm1pbikge1xuICAgICAgICAgICAgICAgIG5hY3QgPSBuYWN0ICsgMTtcbiAgICAgICAgICAgICAgICBpYWN0W25hY3RdID0gbnZsO1xuXG4gICAgICAgICAgICAgICAgbCA9IGl3cm0gKyAoKG5hY3QgLSAxKSAqIG5hY3QpIC8gMiArIDE7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMTsgaSA8PSBuYWN0IC0gMTsgaSA9IGkgKyAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHdvcmtbbF0gPSB3b3JrW2ldO1xuICAgICAgICAgICAgICAgICAgICBsID0gbCArIDE7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG5hY3QgPT09IG4pIHtcbiAgICAgICAgICAgICAgICAgICAgd29ya1tsXSA9IHdvcmtbbl07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gbjsgaSA+PSBuYWN0ICsgMTsgaSA9IGkgLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAod29ya1tpXSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZ2MgPSBNYXRoLm1heChNYXRoLmFicyh3b3JrW2kgLSAxXSksIE1hdGguYWJzKHdvcmtbaV0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdzID0gTWF0aC5taW4oTWF0aC5hYnMod29ya1tpIC0gMV0pLCBNYXRoLmFicyh3b3JrW2ldKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAod29ya1tpIC0gMV0gPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXAgPSBNYXRoLmFicyhnYyAqIE1hdGguc3FydCgxICsgZ3MgKiBncyAvIChnYyAqIGdjKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wID0gLU1hdGguYWJzKGdjICogTWF0aC5zcXJ0KDEgKyBncyAqIGdzIC8gKGdjICogZ2MpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBnYyA9IHdvcmtbaSAtIDFdIC8gdGVtcDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdzID0gd29ya1tpXSAvIHRlbXA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChnYyA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdjID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd29ya1tpIC0gMV0gPSBncyAqIHRlbXA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChqID0gMTsgaiA8PSBuOyBqID0gaiArIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcCA9IGRtYXRbal1baSAtIDFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkbWF0W2pdW2kgLSAxXSA9IGRtYXRbal1baV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRtYXRbal1baV0gPSB0ZW1wO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd29ya1tpIC0gMV0gPSB0ZW1wO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51ID0gZ3MgLyAoMSArIGdjKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGogPSAxOyBqIDw9IG47IGogPSBqICsgMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wID0gZ2MgKiBkbWF0W2pdW2kgLSAxXSArIGdzICogZG1hdFtqXVtpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG1hdFtqXVtpXSA9IG51ICogKGRtYXRbal1baSAtIDFdICsgdGVtcCkgLSBkbWF0W2pdW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkbWF0W2pdW2kgLSAxXSA9IHRlbXA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgd29ya1tsXSA9IHdvcmtbbmFjdF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdW0gPSAtYnZlY1tudmxdO1xuICAgICAgICAgICAgICAgIGZvciAoaiA9IDE7IGogPD0gbjsgaiA9IGogKyAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1bSA9IHN1bSArIHNvbFtqXSAqIGFtYXRbal1bbnZsXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG52bCA+IG1lcSkge1xuICAgICAgICAgICAgICAgICAgICB3b3JrW2l3c3YgKyBudmxdID0gc3VtO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHdvcmtbaXdzdiArIG52bF0gPSAtTWF0aC5hYnMoc3VtKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN1bSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaiA9IDE7IGogPD0gbjsgaiA9IGogKyAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW1hdFtqXVtudmxdID0gLWFtYXRbal1bbnZsXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJ2ZWNbbnZsXSA9IC1idmVjW252bF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gR09UTyA3MDBcbiAgICAgICAgICAgICAgICByZXR1cm4gNzAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm5fZ290b183OTcoKSB7XG4gICAgICAgIGwgPSBpd3JtICsgKGl0MSAqIChpdDEgKyAxKSkgLyAyICsgMTtcbiAgICAgICAgbDEgPSBsICsgaXQxO1xuICAgICAgICBpZiAod29ya1tsMV0gPT09IDApIHtcbiAgICAgICAgICAgIC8vIEdPVE8gNzk4XG4gICAgICAgICAgICByZXR1cm4gNzk4O1xuICAgICAgICB9XG4gICAgICAgIGdjID0gTWF0aC5tYXgoTWF0aC5hYnMod29ya1tsMSAtIDFdKSwgTWF0aC5hYnMod29ya1tsMV0pKTtcbiAgICAgICAgZ3MgPSBNYXRoLm1pbihNYXRoLmFicyh3b3JrW2wxIC0gMV0pLCBNYXRoLmFicyh3b3JrW2wxXSkpO1xuICAgICAgICBpZiAod29ya1tsMSAtIDFdID49IDApIHtcbiAgICAgICAgICAgIHRlbXAgPSBNYXRoLmFicyhnYyAqIE1hdGguc3FydCgxICsgZ3MgKiBncyAvIChnYyAqIGdjKSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGVtcCA9IC1NYXRoLmFicyhnYyAqIE1hdGguc3FydCgxICsgZ3MgKiBncyAvIChnYyAqIGdjKSkpO1xuICAgICAgICB9XG4gICAgICAgIGdjID0gd29ya1tsMSAtIDFdIC8gdGVtcDtcbiAgICAgICAgZ3MgPSB3b3JrW2wxXSAvIHRlbXA7XG5cbiAgICAgICAgaWYgKGdjID09PSAxKSB7XG4gICAgICAgICAgICAvLyBHT1RPIDc5OFxuICAgICAgICAgICAgcmV0dXJuIDc5ODtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZ2MgPT09IDApIHtcbiAgICAgICAgICAgIGZvciAoaSA9IGl0MSArIDE7IGkgPD0gbmFjdDsgaSA9IGkgKyAxKSB7XG4gICAgICAgICAgICAgICAgdGVtcCA9IHdvcmtbbDEgLSAxXTtcbiAgICAgICAgICAgICAgICB3b3JrW2wxIC0gMV0gPSB3b3JrW2wxXTtcbiAgICAgICAgICAgICAgICB3b3JrW2wxXSA9IHRlbXA7XG4gICAgICAgICAgICAgICAgbDEgPSBsMSArIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGkgPSAxOyBpIDw9IG47IGkgPSBpICsgMSkge1xuICAgICAgICAgICAgICAgIHRlbXAgPSBkbWF0W2ldW2l0MV07XG4gICAgICAgICAgICAgICAgZG1hdFtpXVtpdDFdID0gZG1hdFtpXVtpdDEgKyAxXTtcbiAgICAgICAgICAgICAgICBkbWF0W2ldW2l0MSArIDFdID0gdGVtcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG51ID0gZ3MgLyAoMSArIGdjKTtcbiAgICAgICAgICAgIGZvciAoaSA9IGl0MSArIDE7IGkgPD0gbmFjdDsgaSA9IGkgKyAxKSB7XG4gICAgICAgICAgICAgICAgdGVtcCA9IGdjICogd29ya1tsMSAtIDFdICsgZ3MgKiB3b3JrW2wxXTtcbiAgICAgICAgICAgICAgICB3b3JrW2wxXSA9IG51ICogKHdvcmtbbDEgLSAxXSArIHRlbXApIC0gd29ya1tsMV07XG4gICAgICAgICAgICAgICAgd29ya1tsMSAtIDFdID0gdGVtcDtcbiAgICAgICAgICAgICAgICBsMSA9IGwxICsgaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoaSA9IDE7IGkgPD0gbjsgaSA9IGkgKyAxKSB7XG4gICAgICAgICAgICAgICAgdGVtcCA9IGdjICogZG1hdFtpXVtpdDFdICsgZ3MgKiBkbWF0W2ldW2l0MSArIDFdO1xuICAgICAgICAgICAgICAgIGRtYXRbaV1baXQxICsgMV0gPSBudSAqIChkbWF0W2ldW2l0MV0gKyB0ZW1wKSAtIGRtYXRbaV1baXQxICsgMV07XG4gICAgICAgICAgICAgICAgZG1hdFtpXVtpdDFdID0gdGVtcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZuX2dvdG9fNzk4KCkge1xuICAgICAgICBsMSA9IGwgLSBpdDE7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPD0gaXQxOyBpID0gaSArIDEpIHtcbiAgICAgICAgICAgIHdvcmtbbDFdID0gd29ya1tsXTtcbiAgICAgICAgICAgIGwgPSBsICsgMTtcbiAgICAgICAgICAgIGwxID0gbDEgKyAxO1xuICAgICAgICB9XG5cbiAgICAgICAgd29ya1tpd3V2ICsgaXQxXSA9IHdvcmtbaXd1diArIGl0MSArIDFdO1xuICAgICAgICBpYWN0W2l0MV0gPSBpYWN0W2l0MSArIDFdO1xuICAgICAgICBpdDEgPSBpdDEgKyAxO1xuICAgICAgICBpZiAoaXQxIDwgbmFjdCkge1xuICAgICAgICAgICAgLy8gR09UTyA3OTdcbiAgICAgICAgICAgIHJldHVybiA3OTc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmbl9nb3RvXzc5OSgpIHtcbiAgICAgICAgd29ya1tpd3V2ICsgbmFjdF0gPSB3b3JrW2l3dXYgKyBuYWN0ICsgMV07XG4gICAgICAgIHdvcmtbaXd1diArIG5hY3QgKyAxXSA9IDA7XG4gICAgICAgIGlhY3RbbmFjdF0gPSAwO1xuICAgICAgICBuYWN0ID0gbmFjdCAtIDE7XG4gICAgICAgIGl0ZXJbMl0gPSBpdGVyWzJdICsgMTtcblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBnbyA9IDA7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgZ28gPSBmbl9nb3RvXzUwKCk7XG4gICAgICAgIGlmIChnbyA9PT0gOTk5KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgIGdvID0gZm5fZ290b181NSgpO1xuICAgICAgICAgICAgaWYgKGdvID09PSAwKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZ28gPT09IDk5OSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChnbyA9PT0gNzAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKGl0MSA9PT0gbmFjdCkge1xuICAgICAgICAgICAgICAgICAgICBmbl9nb3RvXzc5OSgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmbl9nb3RvXzc5NygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ28gPSBmbl9nb3RvXzc5OCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdvICE9PSA3OTcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmbl9nb3RvXzc5OSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxufVxuXG5mdW5jdGlvbiBzb2x2ZVFQKERtYXQsIGR2ZWMsIEFtYXQsIGJ2ZWMsIG1lcSwgZmFjdG9yaXplZCkge1xuICAgIERtYXQgPSBiYXNlMHRvMShEbWF0KTtcbiAgICBkdmVjID0gYmFzZTB0bzEoZHZlYyk7XG4gICAgQW1hdCA9IGJhc2UwdG8xKEFtYXQpO1xuICAgIHZhciBpLCBuLCBxLFxuICAgICAgICBuYWN0LCByLFxuICAgICAgICBjcnZhbCA9IFtdLCBpYWN0ID0gW10sIHNvbCA9IFtdLCB3b3JrID0gW10sIGl0ZXIgPSBbXSxcbiAgICAgICAgbWVzc2FnZTtcblxuICAgIG1lcSA9IG1lcSB8fCAwO1xuICAgIGZhY3Rvcml6ZWQgPSBmYWN0b3JpemVkID8gYmFzZTB0bzEoZmFjdG9yaXplZCkgOiBbdW5kZWZpbmVkLCAwXTtcbiAgICBidmVjID0gYnZlYyA/IGJhc2UwdG8xKGJ2ZWMpIDogW107XG5cbiAgICAvLyBJbiBGb3J0cmFuIHRoZSBhcnJheSBpbmRleCBzdGFydHMgZnJvbSAxXG4gICAgbiA9IERtYXQubGVuZ3RoIC0gMTtcbiAgICBxID0gQW1hdFsxXS5sZW5ndGggLSAxO1xuXG4gICAgaWYgKCFidmVjKSB7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPD0gcTsgaSA9IGkgKyAxKSB7XG4gICAgICAgICAgICBidmVjW2ldID0gMDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGkgPSAxOyBpIDw9IHE7IGkgPSBpICsgMSkge1xuICAgICAgICBpYWN0W2ldID0gMDtcbiAgICB9XG4gICAgbmFjdCA9IDA7XG4gICAgciA9IE1hdGgubWluKG4sIHEpO1xuICAgIGZvciAoaSA9IDE7IGkgPD0gbjsgaSA9IGkgKyAxKSB7XG4gICAgICAgIHNvbFtpXSA9IDA7XG4gICAgfVxuICAgIGNydmFsWzFdID0gMDtcbiAgICBmb3IgKGkgPSAxOyBpIDw9ICgyICogbiArIChyICogKHIgKyA1KSkgLyAyICsgMiAqIHEgKyAxKTsgaSA9IGkgKyAxKSB7XG4gICAgICAgIHdvcmtbaV0gPSAwO1xuICAgIH1cbiAgICBmb3IgKGkgPSAxOyBpIDw9IDI7IGkgPSBpICsgMSkge1xuICAgICAgICBpdGVyW2ldID0gMDtcbiAgICB9XG5cbiAgICBxcGdlbjIoRG1hdCwgZHZlYywgbiwgbiwgc29sLCBjcnZhbCwgQW1hdCxcbiAgICAgICAgYnZlYywgbiwgcSwgbWVxLCBpYWN0LCBuYWN0LCBpdGVyLCB3b3JrLCBmYWN0b3JpemVkKTtcblxuICAgIG1lc3NhZ2UgPSBcIlwiO1xuICAgIGlmIChmYWN0b3JpemVkWzFdID09PSAxKSB7XG4gICAgICAgIG1lc3NhZ2UgPSBcImNvbnN0cmFpbnRzIGFyZSBpbmNvbnNpc3RlbnQsIG5vIHNvbHV0aW9uIVwiO1xuICAgIH1cbiAgICBpZiAoZmFjdG9yaXplZFsxXSA9PT0gMikge1xuICAgICAgICBtZXNzYWdlID0gXCJtYXRyaXggRCBpbiBxdWFkcmF0aWMgZnVuY3Rpb24gaXMgbm90IHBvc2l0aXZlIGRlZmluaXRlIVwiO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIHNvbHV0aW9uOiBiYXNlMXRvMChzb2wpLFxuICAgICAgICB2YWx1ZTogYmFzZTF0bzAoY3J2YWwpLFxuICAgICAgICB1bmNvbnN0cmFpbmVkX3NvbHV0aW9uOiBiYXNlMXRvMChkdmVjKSxcbiAgICAgICAgaXRlcmF0aW9uczogYmFzZTF0bzAoaXRlciksXG4gICAgICAgIGlhY3Q6IGJhc2UxdG8wKGlhY3QpLFxuICAgICAgICBtZXNzYWdlOiBtZXNzYWdlXG4gICAgfTtcbn1cbmV4cG9ydHMuc29sdmVRUCA9IHNvbHZlUVA7XG59KG51bWVyaWMpKTtcbi8qXHJcblNoYW50aSBSYW8gc2VudCBtZSB0aGlzIHJvdXRpbmUgYnkgcHJpdmF0ZSBlbWFpbC4gSSBoYWQgdG8gbW9kaWZ5IGl0XHJcbnNsaWdodGx5IHRvIHdvcmsgb24gQXJyYXlzIGluc3RlYWQgb2YgdXNpbmcgYSBNYXRyaXggb2JqZWN0LlxyXG5JdCBpcyBhcHBhcmVudGx5IHRyYW5zbGF0ZWQgZnJvbSBodHRwOi8vc3RpdGNocGFub3JhbWEuc291cmNlZm9yZ2UubmV0L1B5dGhvbi9zdmQucHlcclxuKi9cclxuXHJcbm51bWVyaWMuc3ZkPSBmdW5jdGlvbiBzdmQoQSkge1xyXG4gICAgdmFyIHRlbXA7XHJcbi8vQ29tcHV0ZSB0aGUgdGhpbiBTVkQgZnJvbSBHLiBILiBHb2x1YiBhbmQgQy4gUmVpbnNjaCwgTnVtZXIuIE1hdGguIDE0LCA0MDMtNDIwICgxOTcwKVxyXG5cdHZhciBwcmVjPSBudW1lcmljLmVwc2lsb247IC8vTWF0aC5wb3coMiwtNTIpIC8vIGFzc3VtZXMgZG91YmxlIHByZWNcclxuXHR2YXIgdG9sZXJhbmNlPSAxLmUtNjQvcHJlYztcclxuXHR2YXIgaXRtYXg9IDUwO1xyXG5cdHZhciBjPTA7XHJcblx0dmFyIGk9MDtcclxuXHR2YXIgaj0wO1xyXG5cdHZhciBrPTA7XHJcblx0dmFyIGw9MDtcclxuXHRcclxuXHR2YXIgdT0gbnVtZXJpYy5jbG9uZShBKTtcclxuXHR2YXIgbT0gdS5sZW5ndGg7XHJcblx0XHJcblx0dmFyIG49IHVbMF0ubGVuZ3RoO1xyXG5cdFxyXG5cdGlmIChtIDwgbikgdGhyb3cgXCJOZWVkIG1vcmUgcm93cyB0aGFuIGNvbHVtbnNcIlxyXG5cdFxyXG5cdHZhciBlID0gbmV3IEFycmF5KG4pO1xyXG5cdHZhciBxID0gbmV3IEFycmF5KG4pO1xyXG5cdGZvciAoaT0wOyBpPG47IGkrKykgZVtpXSA9IHFbaV0gPSAwLjA7XHJcblx0dmFyIHYgPSBudW1lcmljLnJlcChbbixuXSwwKTtcclxuLy9cdHYuemVybygpO1xyXG5cdFxyXG4gXHRmdW5jdGlvbiBweXRoYWcoYSxiKVxyXG4gXHR7XHJcblx0XHRhID0gTWF0aC5hYnMoYSlcclxuXHRcdGIgPSBNYXRoLmFicyhiKVxyXG5cdFx0aWYgKGEgPiBiKVxyXG5cdFx0XHRyZXR1cm4gYSpNYXRoLnNxcnQoMS4wKyhiKmIvYS9hKSlcclxuXHRcdGVsc2UgaWYgKGIgPT0gMC4wKSBcclxuXHRcdFx0cmV0dXJuIGFcclxuXHRcdHJldHVybiBiKk1hdGguc3FydCgxLjArKGEqYS9iL2IpKVxyXG5cdH1cclxuXHJcblx0Ly9Ib3VzZWhvbGRlcidzIHJlZHVjdGlvbiB0byBiaWRpYWdvbmFsIGZvcm1cclxuXHJcblx0dmFyIGY9IDAuMDtcclxuXHR2YXIgZz0gMC4wO1xyXG5cdHZhciBoPSAwLjA7XHJcblx0dmFyIHg9IDAuMDtcclxuXHR2YXIgeT0gMC4wO1xyXG5cdHZhciB6PSAwLjA7XHJcblx0dmFyIHM9IDAuMDtcclxuXHRcclxuXHRmb3IgKGk9MDsgaSA8IG47IGkrKylcclxuXHR7XHRcclxuXHRcdGVbaV09IGc7XHJcblx0XHRzPSAwLjA7XHJcblx0XHRsPSBpKzE7XHJcblx0XHRmb3IgKGo9aTsgaiA8IG07IGorKykgXHJcblx0XHRcdHMgKz0gKHVbal1baV0qdVtqXVtpXSk7XHJcblx0XHRpZiAocyA8PSB0b2xlcmFuY2UpXHJcblx0XHRcdGc9IDAuMDtcclxuXHRcdGVsc2VcclxuXHRcdHtcdFxyXG5cdFx0XHRmPSB1W2ldW2ldO1xyXG5cdFx0XHRnPSBNYXRoLnNxcnQocyk7XHJcblx0XHRcdGlmIChmID49IDAuMCkgZz0gLWc7XHJcblx0XHRcdGg9IGYqZy1zXHJcblx0XHRcdHVbaV1baV09Zi1nO1xyXG5cdFx0XHRmb3IgKGo9bDsgaiA8IG47IGorKylcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHM9IDAuMFxyXG5cdFx0XHRcdGZvciAoaz1pOyBrIDwgbTsgaysrKSBcclxuXHRcdFx0XHRcdHMgKz0gdVtrXVtpXSp1W2tdW2pdXHJcblx0XHRcdFx0Zj0gcy9oXHJcblx0XHRcdFx0Zm9yIChrPWk7IGsgPCBtOyBrKyspIFxyXG5cdFx0XHRcdFx0dVtrXVtqXSs9Zip1W2tdW2ldXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHFbaV09IGdcclxuXHRcdHM9IDAuMFxyXG5cdFx0Zm9yIChqPWw7IGogPCBuOyBqKyspIFxyXG5cdFx0XHRzPSBzICsgdVtpXVtqXSp1W2ldW2pdXHJcblx0XHRpZiAocyA8PSB0b2xlcmFuY2UpXHJcblx0XHRcdGc9IDAuMFxyXG5cdFx0ZWxzZVxyXG5cdFx0e1x0XHJcblx0XHRcdGY9IHVbaV1baSsxXVxyXG5cdFx0XHRnPSBNYXRoLnNxcnQocylcclxuXHRcdFx0aWYgKGYgPj0gMC4wKSBnPSAtZ1xyXG5cdFx0XHRoPSBmKmcgLSBzXHJcblx0XHRcdHVbaV1baSsxXSA9IGYtZztcclxuXHRcdFx0Zm9yIChqPWw7IGogPCBuOyBqKyspIGVbal09IHVbaV1bal0vaFxyXG5cdFx0XHRmb3IgKGo9bDsgaiA8IG07IGorKylcclxuXHRcdFx0e1x0XHJcblx0XHRcdFx0cz0wLjBcclxuXHRcdFx0XHRmb3IgKGs9bDsgayA8IG47IGsrKykgXHJcblx0XHRcdFx0XHRzICs9ICh1W2pdW2tdKnVbaV1ba10pXHJcblx0XHRcdFx0Zm9yIChrPWw7IGsgPCBuOyBrKyspIFxyXG5cdFx0XHRcdFx0dVtqXVtrXSs9cyplW2tdXHJcblx0XHRcdH1cdFxyXG5cdFx0fVxyXG5cdFx0eT0gTWF0aC5hYnMocVtpXSkrTWF0aC5hYnMoZVtpXSlcclxuXHRcdGlmICh5PngpIFxyXG5cdFx0XHR4PXlcclxuXHR9XHJcblx0XHJcblx0Ly8gYWNjdW11bGF0aW9uIG9mIHJpZ2h0IGhhbmQgZ3RyYW5zZm9ybWF0aW9uc1xyXG5cdGZvciAoaT1uLTE7IGkgIT0gLTE7IGkrPSAtMSlcclxuXHR7XHRcclxuXHRcdGlmIChnICE9IDAuMClcclxuXHRcdHtcclxuXHRcdCBcdGg9IGcqdVtpXVtpKzFdXHJcblx0XHRcdGZvciAoaj1sOyBqIDwgbjsgaisrKSBcclxuXHRcdFx0XHR2W2pdW2ldPXVbaV1bal0vaFxyXG5cdFx0XHRmb3IgKGo9bDsgaiA8IG47IGorKylcclxuXHRcdFx0e1x0XHJcblx0XHRcdFx0cz0wLjBcclxuXHRcdFx0XHRmb3IgKGs9bDsgayA8IG47IGsrKykgXHJcblx0XHRcdFx0XHRzICs9IHVbaV1ba10qdltrXVtqXVxyXG5cdFx0XHRcdGZvciAoaz1sOyBrIDwgbjsgaysrKSBcclxuXHRcdFx0XHRcdHZba11bal0rPShzKnZba11baV0pXHJcblx0XHRcdH1cdFxyXG5cdFx0fVxyXG5cdFx0Zm9yIChqPWw7IGogPCBuOyBqKyspXHJcblx0XHR7XHJcblx0XHRcdHZbaV1bal0gPSAwO1xyXG5cdFx0XHR2W2pdW2ldID0gMDtcclxuXHRcdH1cclxuXHRcdHZbaV1baV0gPSAxO1xyXG5cdFx0Zz0gZVtpXVxyXG5cdFx0bD0gaVxyXG5cdH1cclxuXHRcclxuXHQvLyBhY2N1bXVsYXRpb24gb2YgbGVmdCBoYW5kIHRyYW5zZm9ybWF0aW9uc1xyXG5cdGZvciAoaT1uLTE7IGkgIT0gLTE7IGkrPSAtMSlcclxuXHR7XHRcclxuXHRcdGw9IGkrMVxyXG5cdFx0Zz0gcVtpXVxyXG5cdFx0Zm9yIChqPWw7IGogPCBuOyBqKyspIFxyXG5cdFx0XHR1W2ldW2pdID0gMDtcclxuXHRcdGlmIChnICE9IDAuMClcclxuXHRcdHtcclxuXHRcdFx0aD0gdVtpXVtpXSpnXHJcblx0XHRcdGZvciAoaj1sOyBqIDwgbjsgaisrKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0cz0wLjBcclxuXHRcdFx0XHRmb3IgKGs9bDsgayA8IG07IGsrKykgcyArPSB1W2tdW2ldKnVba11bal07XHJcblx0XHRcdFx0Zj0gcy9oXHJcblx0XHRcdFx0Zm9yIChrPWk7IGsgPCBtOyBrKyspIHVba11bal0rPWYqdVtrXVtpXTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmb3IgKGo9aTsgaiA8IG07IGorKykgdVtqXVtpXSA9IHVbal1baV0vZztcclxuXHRcdH1cclxuXHRcdGVsc2VcclxuXHRcdFx0Zm9yIChqPWk7IGogPCBtOyBqKyspIHVbal1baV0gPSAwO1xyXG5cdFx0dVtpXVtpXSArPSAxO1xyXG5cdH1cclxuXHRcclxuXHQvLyBkaWFnb25hbGl6YXRpb24gb2YgdGhlIGJpZGlhZ29uYWwgZm9ybVxyXG5cdHByZWM9IHByZWMqeFxyXG5cdGZvciAoaz1uLTE7IGsgIT0gLTE7IGsrPSAtMSlcclxuXHR7XHJcblx0XHRmb3IgKHZhciBpdGVyYXRpb249MDsgaXRlcmF0aW9uIDwgaXRtYXg7IGl0ZXJhdGlvbisrKVxyXG5cdFx0e1x0Ly8gdGVzdCBmIHNwbGl0dGluZ1xyXG5cdFx0XHR2YXIgdGVzdF9jb252ZXJnZW5jZSA9IGZhbHNlXHJcblx0XHRcdGZvciAobD1rOyBsICE9IC0xOyBsKz0gLTEpXHJcblx0XHRcdHtcdFxyXG5cdFx0XHRcdGlmIChNYXRoLmFicyhlW2xdKSA8PSBwcmVjKVxyXG5cdFx0XHRcdHtcdHRlc3RfY29udmVyZ2VuY2U9IHRydWVcclxuXHRcdFx0XHRcdGJyZWFrIFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoTWF0aC5hYnMocVtsLTFdKSA8PSBwcmVjKVxyXG5cdFx0XHRcdFx0YnJlYWsgXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCF0ZXN0X2NvbnZlcmdlbmNlKVxyXG5cdFx0XHR7XHQvLyBjYW5jZWxsYXRpb24gb2YgZVtsXSBpZiBsPjBcclxuXHRcdFx0XHRjPSAwLjBcclxuXHRcdFx0XHRzPSAxLjBcclxuXHRcdFx0XHR2YXIgbDE9IGwtMVxyXG5cdFx0XHRcdGZvciAoaSA9bDsgaTxrKzE7IGkrKylcclxuXHRcdFx0XHR7XHRcclxuXHRcdFx0XHRcdGY9IHMqZVtpXVxyXG5cdFx0XHRcdFx0ZVtpXT0gYyplW2ldXHJcblx0XHRcdFx0XHRpZiAoTWF0aC5hYnMoZikgPD0gcHJlYylcclxuXHRcdFx0XHRcdFx0YnJlYWtcclxuXHRcdFx0XHRcdGc9IHFbaV1cclxuXHRcdFx0XHRcdGg9IHB5dGhhZyhmLGcpXHJcblx0XHRcdFx0XHRxW2ldPSBoXHJcblx0XHRcdFx0XHRjPSBnL2hcclxuXHRcdFx0XHRcdHM9IC1mL2hcclxuXHRcdFx0XHRcdGZvciAoaj0wOyBqIDwgbTsgaisrKVxyXG5cdFx0XHRcdFx0e1x0XHJcblx0XHRcdFx0XHRcdHk9IHVbal1bbDFdXHJcblx0XHRcdFx0XHRcdHo9IHVbal1baV1cclxuXHRcdFx0XHRcdFx0dVtqXVtsMV0gPSAgeSpjKyh6KnMpXHJcblx0XHRcdFx0XHRcdHVbal1baV0gPSAteSpzKyh6KmMpXHJcblx0XHRcdFx0XHR9IFxyXG5cdFx0XHRcdH1cdFxyXG5cdFx0XHR9XHJcblx0XHRcdC8vIHRlc3QgZiBjb252ZXJnZW5jZVxyXG5cdFx0XHR6PSBxW2tdXHJcblx0XHRcdGlmIChsPT0gaylcclxuXHRcdFx0e1x0Ly9jb252ZXJnZW5jZVxyXG5cdFx0XHRcdGlmICh6PDAuMClcclxuXHRcdFx0XHR7XHQvL3Fba10gaXMgbWFkZSBub24tbmVnYXRpdmVcclxuXHRcdFx0XHRcdHFba109IC16XHJcblx0XHRcdFx0XHRmb3IgKGo9MDsgaiA8IG47IGorKylcclxuXHRcdFx0XHRcdFx0dltqXVtrXSA9IC12W2pdW2tdXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGJyZWFrICAvL2JyZWFrIG91dCBvZiBpdGVyYXRpb24gbG9vcCBhbmQgbW92ZSBvbiB0byBuZXh0IGsgdmFsdWVcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoaXRlcmF0aW9uID49IGl0bWF4LTEpXHJcblx0XHRcdFx0dGhyb3cgJ0Vycm9yOiBubyBjb252ZXJnZW5jZS4nXHJcblx0XHRcdC8vIHNoaWZ0IGZyb20gYm90dG9tIDJ4MiBtaW5vclxyXG5cdFx0XHR4PSBxW2xdXHJcblx0XHRcdHk9IHFbay0xXVxyXG5cdFx0XHRnPSBlW2stMV1cclxuXHRcdFx0aD0gZVtrXVxyXG5cdFx0XHRmPSAoKHkteikqKHkreikrKGctaCkqKGcraCkpLygyLjAqaCp5KVxyXG5cdFx0XHRnPSBweXRoYWcoZiwxLjApXHJcblx0XHRcdGlmIChmIDwgMC4wKVxyXG5cdFx0XHRcdGY9ICgoeC16KSooeCt6KStoKih5LyhmLWcpLWgpKS94XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRmPSAoKHgteikqKHgreikraCooeS8oZitnKS1oKSkveFxyXG5cdFx0XHQvLyBuZXh0IFFSIHRyYW5zZm9ybWF0aW9uXHJcblx0XHRcdGM9IDEuMFxyXG5cdFx0XHRzPSAxLjBcclxuXHRcdFx0Zm9yIChpPWwrMTsgaTwgaysxOyBpKyspXHJcblx0XHRcdHtcdFxyXG5cdFx0XHRcdGc9IGVbaV1cclxuXHRcdFx0XHR5PSBxW2ldXHJcblx0XHRcdFx0aD0gcypnXHJcblx0XHRcdFx0Zz0gYypnXHJcblx0XHRcdFx0ej0gcHl0aGFnKGYsaClcclxuXHRcdFx0XHRlW2ktMV09IHpcclxuXHRcdFx0XHRjPSBmL3pcclxuXHRcdFx0XHRzPSBoL3pcclxuXHRcdFx0XHRmPSB4KmMrZypzXHJcblx0XHRcdFx0Zz0gLXgqcytnKmNcclxuXHRcdFx0XHRoPSB5KnNcclxuXHRcdFx0XHR5PSB5KmNcclxuXHRcdFx0XHRmb3IgKGo9MDsgaiA8IG47IGorKylcclxuXHRcdFx0XHR7XHRcclxuXHRcdFx0XHRcdHg9IHZbal1baS0xXVxyXG5cdFx0XHRcdFx0ej0gdltqXVtpXVxyXG5cdFx0XHRcdFx0dltqXVtpLTFdID0geCpjK3oqc1xyXG5cdFx0XHRcdFx0dltqXVtpXSA9IC14KnMreipjXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHo9IHB5dGhhZyhmLGgpXHJcblx0XHRcdFx0cVtpLTFdPSB6XHJcblx0XHRcdFx0Yz0gZi96XHJcblx0XHRcdFx0cz0gaC96XHJcblx0XHRcdFx0Zj0gYypnK3MqeVxyXG5cdFx0XHRcdHg9IC1zKmcrYyp5XHJcblx0XHRcdFx0Zm9yIChqPTA7IGogPCBtOyBqKyspXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0eT0gdVtqXVtpLTFdXHJcblx0XHRcdFx0XHR6PSB1W2pdW2ldXHJcblx0XHRcdFx0XHR1W2pdW2ktMV0gPSB5KmMreipzXHJcblx0XHRcdFx0XHR1W2pdW2ldID0gLXkqcyt6KmNcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZVtsXT0gMC4wXHJcblx0XHRcdGVba109IGZcclxuXHRcdFx0cVtrXT0geFxyXG5cdFx0fSBcclxuXHR9XHJcblx0XHRcclxuXHQvL3Z0PSB0cmFuc3Bvc2UodilcclxuXHQvL3JldHVybiAodSxxLHZ0KVxyXG5cdGZvciAoaT0wO2k8cS5sZW5ndGg7IGkrKykgXHJcblx0ICBpZiAocVtpXSA8IHByZWMpIHFbaV0gPSAwXHJcblx0ICBcclxuXHQvL3NvcnQgZWlnZW52YWx1ZXNcdFxyXG5cdGZvciAoaT0wOyBpPCBuOyBpKyspXHJcblx0e1x0IFxyXG5cdC8vd3JpdGVsbihxKVxyXG5cdCBmb3IgKGo9aS0xOyBqID49IDA7IGotLSlcclxuXHQge1xyXG5cdCAgaWYgKHFbal0gPCBxW2ldKVxyXG5cdCAge1xyXG5cdC8vICB3cml0ZWxuKGksJy0nLGopXHJcblx0ICAgYyA9IHFbal1cclxuXHQgICBxW2pdID0gcVtpXVxyXG5cdCAgIHFbaV0gPSBjXHJcblx0ICAgZm9yKGs9MDtrPHUubGVuZ3RoO2srKykgeyB0ZW1wID0gdVtrXVtpXTsgdVtrXVtpXSA9IHVba11bal07IHVba11bal0gPSB0ZW1wOyB9XHJcblx0ICAgZm9yKGs9MDtrPHYubGVuZ3RoO2srKykgeyB0ZW1wID0gdltrXVtpXTsgdltrXVtpXSA9IHZba11bal07IHZba11bal0gPSB0ZW1wOyB9XHJcbi8vXHQgICB1LnN3YXBDb2xzKGksailcclxuLy9cdCAgIHYuc3dhcENvbHMoaSxqKVxyXG5cdCAgIGkgPSBqXHQgICBcclxuXHQgIH1cclxuXHQgfVx0XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB7VTp1LFM6cSxWOnZ9XHJcbn07XHJcblxyXG4iXX0=
