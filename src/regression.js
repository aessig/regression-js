/**
* @license
*
* Regression.JS - Regression functions for javascript
* http://tom-alexander.github.com/regression-js/
*
* copyright(c) 2013 Tom Alexander
* Licensed under the MIT license.
*
**/

;(function() {
  'use strict';

  var numeric = require('numeric');

  var gaussianElimination = function(a, o) {
    var i = 0, j = 0, k = 0, maxrow = 0, tmp = 0, n = a.length - 1, x = new Array(o);
    for (i = 0; i < n; i++) {
      maxrow = i;
      for (j = i + 1; j < n; j++) {
        if (Math.abs(a[ i ][ j ]) > Math.abs(a[ i ][ maxrow ])) {
          maxrow = j;
        }
      }

      for (k = i; k < n + 1; k++) {
        tmp = a[ k ][ i ];
        a[ k ][ i ] = a[ k ][ maxrow ];
        a[ k ][ maxrow ] = tmp;
      }

      for (j = i + 1; j < n; j++) {
        for (k = n; k >= i; k--) {
          a[ k ][ j ] -= a[ k ][ i ] * a[ i ][ j ] / a[ i ][ i ];
        }
      }
    }

    for (j = n - 1; j >= 0; j--) {
      tmp = 0;
      for (k = j + 1; k < n; k++) {
        tmp += a[ k ][ j ] * x[ k ];
      }

      x[ j ] = (a[ n ][ j ] - tmp) / a[ j ][ j ];
    }

    return (x);
  };

  var methods = {
    linear: function(data) {
      var sum = [0, 0, 0, 0, 0], n = 0, results = [];

      for (; n < data.length; n++) {
        if (data[ n ][ 1 ] != null) {
          sum[ 0 ] += data[ n ][ 0 ];
          sum[ 1 ] += data[ n ][ 1 ];
          sum[ 2 ] += data[ n ][ 0 ] * data[ n ][ 0 ];
          sum[ 3 ] += data[ n ][ 0 ] * data[ n ][ 1 ];
          sum[ 4 ] += data[ n ][ 1 ] * data[ n ][ 1 ];
        }
      }

      var gradient = (n * sum[ 3 ] - sum[ 0 ] * sum[ 1 ]) / (n * sum[ 2 ] - sum[ 0 ] * sum[ 0 ]);
      var intercept = (sum[ 1 ] / n) - (gradient * sum[ 0 ]) / n;

      for (var i = 0, len = data.length; i < len; i++) {
        var coordinate = [data[ i ][ 0 ], data[ i ][ 0 ] * gradient + intercept];
        results.push(coordinate);
      }

      var string = 'y = ' + Math.round(gradient * 100) / 100 + 'x + ' + Math.round(intercept * 100) / 100;
      return { equation: [gradient, intercept], points: results, string: string };
    },

    linearThroughOrigin: function(data) {
      var sum = [0, 0], n = 0, results = [];

      for (; n < data.length; n++) {
        if (data[ n ][ 1 ] != null) {
          sum[ 0 ] += data[ n ][ 0 ] * data[ n ][ 0 ];
          sum[ 1 ] += data[ n ][ 0 ] * data[ n ][ 1 ]; //sumXY
        }
      }

      var gradient = sum[ 1 ] / sum[ 0 ];

      for (var i = 0, len = data.length; i < len; i++) {
        var coordinate = [data[ i ][ 0 ], data[ i ][ 0 ] * gradient];
        results.push(coordinate);
      }

      var string = 'y = ' + Math.round(gradient * 100) / 100 + 'x';

      return { equation: [gradient], points: results, string: string };
    },

    exponential: function(data) {
      var sum = [0, 0, 0, 0, 0, 0], n = 0, results = [];

      for (len = data.length; n < len; n++) {
        if (data[ n ][ 1 ] != null) {
          sum[ 0 ] += data[ n ][ 0 ];
          sum[ 1 ] += data[ n ][ 1 ];
          sum[ 2 ] += data[ n ][ 0 ] * data[ n ][ 0 ] * data[ n ][ 1 ];
          sum[ 3 ] += data[ n ][ 1 ] * Math.log(data[ n ][ 1 ]);
          sum[ 4 ] += data[ n ][ 0 ] * data[ n ][ 1 ] * Math.log(data[ n ][ 1 ]);
          sum[ 5 ] += data[ n ][ 0 ] * data[ n ][ 1 ];
        }
      }

      var denominator = (sum[ 1 ] * sum[ 2 ] - sum[ 5 ] * sum[ 5 ]);
      var A = Math.pow(Math.E, (sum[ 2 ] * sum[ 3 ] - sum[ 5 ] * sum[ 4 ]) / denominator);
      var B = (sum[ 1 ] * sum[ 4 ] - sum[ 5 ] * sum[ 3 ]) / denominator;

      for (var i = 0, len = data.length; i < len; i++) {
        var coordinate = [data[ i ][ 0 ], A * Math.pow(Math.E, B * data[ i ][ 0 ])];
        results.push(coordinate);
      }

      var string = 'y = ' + Math.round(A * 100) / 100 + 'e^(' + Math.round(B * 100) / 100 + 'x)';

      return { equation: [A, B], points: results, string: string };
    },

    logarithmic: function(data) {
      var sum = [0, 0, 0, 0], n = 0, results = [];

      for (len = data.length; n < len; n++) {
        if (data[ n ][ 1 ] != null) {
          sum[ 0 ] += Math.log(data[ n ][ 0 ]);
          sum[ 1 ] += data[ n ][ 1 ] * Math.log(data[ n ][ 0 ]);
          sum[ 2 ] += data[ n ][ 1 ];
          sum[ 3 ] += Math.pow(Math.log(data[ n ][ 0 ]), 2);
        }
      }

      var B = (n * sum[ 1 ] - sum[ 2 ] * sum[ 0 ]) / (n * sum[ 3 ] - sum[ 0 ] * sum[ 0 ]);
      var A = (sum[ 2 ] - B * sum[ 0 ]) / n;

      for (var i = 0, len = data.length; i < len; i++) {
        var coordinate = [data[ i ][ 0 ], A + B * Math.log(data[ i ][ 0 ])];
        results.push(coordinate);
      }

      var string = 'y = ' + Math.round(A * 100) / 100 + ' + ' + Math.round(B * 100) / 100 + ' ln(x)';

      return { equation: [A, B], points: results, string: string };
    },

    power: function(data) {
      var sum = [0, 0, 0, 0], n = 0, results = [];

      for (len = data.length; n < len; n++) {
        if (data[ n ][ 1 ] != null) {
          sum[ 0 ] += Math.log(data[ n ][ 0 ]);
          sum[ 1 ] += Math.log(data[ n ][ 1 ]) * Math.log(data[ n ][ 0 ]);
          sum[ 2 ] += Math.log(data[ n ][ 1 ]);
          sum[ 3 ] += Math.pow(Math.log(data[ n ][ 0 ]), 2);
        }
      }

      var B = (n * sum[ 1 ] - sum[ 2 ] * sum[ 0 ]) / (n * sum[ 3 ] - sum[ 0 ] * sum[ 0 ]);
      var A = Math.pow(Math.E, (sum[ 2 ] - B * sum[ 0 ]) / n);

      for (var i = 0, len = data.length; i < len; i++) {
        var coordinate = [data[ i ][ 0 ], A * Math.pow(data[ i ][ 0 ], B)];
        results.push(coordinate);
      }

      var string = 'y = ' + Math.round(A * 100) / 100 + 'x^' + Math.round(B * 100) / 100;

      return { equation: [A, B], points: results, string: string };
    },

    polynomial: function(data, order) {
      if (typeof order == 'undefined') {
        order = 2;
      }

      var lhs = [], rhs = [], results = [], a = 0, b = 0, i = 0, k = order + 1;

      for (; i < k; i++) {
        for (var l = 0, len = data.length; l < len; l++) {
          if (data[ l ][ 1 ] != null) {
            a += Math.pow(data[ l ][ 0 ], i) * data[ l ][ 1 ];
          }
        }

        lhs.push(a), a = 0;
        var c = [];
        for (var j = 0; j < k; j++) {
          for (var l = 0, len = data.length; l < len; l++) {
            if (data[ l ][ 1 ] != null) {
              b += Math.pow(data[ l ][ 0 ], i + j);
            }
          }

          c.push(b), b = 0;
        }

        rhs.push(c);
      }

      rhs.push(lhs);

      var equation = gaussianElimination(rhs, k);

      for (var i = 0, len = data.length; i < len; i++) {
        var answer = 0;
        for (var w = 0; w < equation.length; w++) {
          answer += equation[ w ] * Math.pow(data[ i ][ 0 ], w);
        }

        results.push([data[ i ][ 0 ], answer]);
      }

      var string = 'y = ';

      for (var i = equation.length - 1; i >= 0; i--) {
        if (i > 1) string += Math.round(equation[ i ] * Math.pow(10, i)) / Math.pow(10, i)  + 'x^' + i + ' + ';
        else if (i == 1) string += Math.round(equation[ i ] * 100) / 100 + 'x' + ' + ';
        else string += Math.round(equation[ i ] * 100) / 100;
      }

      return { equation: equation, points: results, string: string };
    },

    sigmoid: function(data, order) {

      function onesArray(length, value) {
          return Array.apply(null, Array(length)).map(function() {return value;});
        }

      function mySig(x_array, ymin, ymax, b, xc)  {
          var arr = [];
          for (var i = 0; i < x_array.length; i++) {
            var sub = Math.exp((x_array[ i ] - xc) / b);
            var y = (ymin + (ymax * sub)) / (1 + sub);
            arr.push(y);
          }

          return arr;
        }

      var x_array = data.map(function(d) { return (d[ 0 ]); });

      var y_array = data.map(function(d) { return (d[ 1 ]); });

      var ssq = 99999999;
      var xc_b = 0;
      var b_b = 0;
      var results = [];
      var y_min = Math.min.apply(null, y_array);
      var y_max = Math.max.apply(null, y_array);

      var x_min = Math.min.apply(null, x_array);
      var x_max = Math.max.apply(null, x_array);

      for (var b = -1000; b <= 1000; b += 10) {
        if (b != 0) {
          for (var xc = x_min; xc < x_max; xc += 10) {
            var yfit = mySig(x_array, y_min, y_max, b, xc);
            var tmp = 0;
            data.forEach(function(element, index, array) {
                tmp += Math.pow((yfit[ index ] - y_array[ index ]), 2);
              });

            if (tmp  < ssq) {
              ssq = tmp;
              xc_b = xc;
              b_b = b;
            }
          }
        }
      }

      var theSig = mySig(x_array, y_min, y_max, b_b, xc_b);

      for (var i = 0, len = data.length; i < len; i++) {
        var coordinate = [data[ i ][ 0 ], theSig[ i ]];
        results.push(coordinate);
      }

      var string = 'y = (' + y_min + ' + ' + y_max + '*e^((x-' + xc_b + ')/' + b_b + '))/(1+e^((x-' + xc_b + ')/' + b_b + '))';

      if (typeof order == 'object') {
        var offset = order.offset;
        var xspan = numeric.linspace(x_min - offset, x_max + offset, (x_max - x_min + 2 * offset) / order.grain);
        var yspan = mySig(xspan, y_min, y_max, b_b, xc_b);
        return { equation: [y_min, y_max, b_b, xc_b], points: results, string: string, span: {xspan: xspan, yspan: yspan} };
      }

      return { equation: [y_min, y_max, b_b, xc_b], points: results, string: string };
    },

    lastvalue: function(data) {
        var results = [];
        var lastvalue = null;
        for (var i = 0; i < data.length; i++) {
          if (data[ i ][ 1 ]) {
            lastvalue = data[ i ][ 1 ];
            results.push([data[ i ][ 0 ], data[ i ][ 1 ]]);
          } else {
            results.push([data[ i ][ 0 ], lastvalue]);
          }
        }

        return { equation: [lastvalue], points: results, string: '' + lastvalue };
      },

  };

  var regression = (function(method, data, order) {

    if (typeof method == 'string') {
      return methods[ method ](data, order);
    }
  });

  if (typeof exports !== 'undefined') {
    module.exports = regression;
  } else {
    window.regression = regression;
  }

}());
