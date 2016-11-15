console.log('==============\n==============\n\n\n\n');
const Rx = require('rxjs');
const debug = require('debug');
const noop = ()=>{};
const {of, range, interval} = Rx.Observable;

function bug(name){
  return { next: debug(`x:${name}:next`), error: debug(`x:${name}:error`), complete: debug(`x:${name}:done`) };
}

const numbersOverTime = Rx.Observable.interval(1000)
  .takeUntil(Rx.Observable.timer(6500));

const delayed6 = Rx.Observable.from([2,2])
  .delay(3000);

const numbers = Rx.Observable.range(1,4)
  // .merge(delayed6);

const doubles = numbersOverTime.map(x => x * 2);

const changesPlusCreation1 = numbers.map(filename => {
  // return Rx.Observable.of(filename);
  return doubles
    .filter(name => name === filename)
    .startWith(`START: ${filename}`);
}).mergeAll();

// doubles.subscribe(  debug('x:doubles:next'), debug('x:doubles:error'), debug('x:doubles:done'));
// changesPlusCreation1.subscribe(  debug('x:changesPlusCreation1:next'), debug('x:changesPlusCreation1:error'), debug('x:changesPlusCreation1:done'));


//Does a delay in a startWith delay every subsequent item?
// ==> NO
// ==> HOWEVER if you start with a delayed value it blocks the whole stream (if you concat)
const onetwothreeDELAYsix = range(1,3)
  .merge(of(6).delay(1000));

// onetwothreeDELAYsix.subscribe(bug('delayedRange'));


Rx.Observable.prototype.flatTap = function(project) {
  return this.flatMap(
    project,
    function resultSelector(input){ return input; }
  );
};

of(range(1,3))
  .merge(of(range(4,3)))
  // .startWith(of(0).delay(1000))
  .mergeAll()
  .flatTap(
    function project(number){ return of(number).delay(1000).map(x => console.log('ENTER ' + x)); }
  )
  // .flatMap(
  //   function project(number){ return of(number).delay(1000).map(x => console.log('ENTER ' + x)); },
  //   function resultSelector(input){ return input; }
  // )
  .flatMap(
    function project(number){ return of(number).delay(1000).map(x => console.log('EXIT ' + x)); },
    function resultSelector(input){ return input; }
  )
  // .subscribe(bug('straightrange'));

  of(range(1,3))
  .merge(of(range(4,3)))
  // .startWith(of(0).delay(1000))
  .mergeAll()
  .flatTap(number => of(number).delay(1000).do(x => console.log('ENTER ' + x)))
  .flatTap(number => of(number).delay(1000).do(x => console.log('EXIT ' + x)))
  .subscribe(bug('straightrange2'));

//??? Why then is changesPlusCreation1 above delaying subsequent 6's?