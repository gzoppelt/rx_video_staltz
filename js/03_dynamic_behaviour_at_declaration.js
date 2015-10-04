console.clear();

// RsJS allows you to specify the "dynamic behaviour" of a value
// completely at the time of declaration,
// meaning when a changes, b will change as well:

var a = 3;
var b = 10 * a; // 30
console.log('a = ', a);
console.log('b = ', b, '(10 * a)');
a = 4;
console.log('a = ', a);
console.log('b = ', b, '(b is still 10 * a but behaviour will not change unles b=10*a is called again.'); // still 30

var streamA = Rx.Observable.of(3, 4);   //future change of a is described at declaration
var streamB = streamA.map(a => 10 * a);

streamB.subscribe(b => console.log('b = ', b, 'stream.map a => 10*a, for a=(3, 4)'));
