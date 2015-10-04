console.clear();
var source = ['1', '1', 'foo', '2', '3', '5', 'bar', '8', '13'];
var result = source;
console.log('source: ', result);

result = result.map(x => parseInt(x));
console.log("map:    ", result);
result = result.filter(x => !isNaN(x));
console.log('filter: ', result);
result = result.reduce((x, y)=> x + y);
console.log('reduce: ', result);
console.log('array.map.filter.reduce: ',
    source
      .map(x => parseInt(x))
      .filter(x => !isNaN(x))
      .reduce((x, y) => x + y)
);

var source = Rx.Observable
    .interval(300)
    .take(9)
    .map(i => ['1', '1', 'foo', '2', '3', '5', 'bar', '8', '13'][i]);
var result = source
    .map(x => parseInt(x))
    .filter(x => !isNaN(x))
    .reduce((x, y) => x + y);

result.subscribe(x => console.log('rx.map.filter.reduce: ', x));
