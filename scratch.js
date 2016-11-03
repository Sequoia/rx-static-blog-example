console.log('==============\n==============\n\n\n\n');
const Rx = require('rxjs');
const debug = require('debug');
const noop = ()=>{};

const chokidar = require('chokidar');
const dirWatcher = chokidar.watch('./_data/*.md');

const readFile = require('fs').readFile;
const readFileAsObservable = Rx.Observable.bindNodeCallback(readFile);

const newFiles     = Rx.Observable.fromEvent(dirWatcher, 'add');
const changedFiles = Rx.Observable.fromEvent(dirWatcher, 'change');

const changesPlusCreation1 = newFiles.map(filename => {
  return changedFiles
    .filter(name => name === filename)
    .startWith(filename);
}).mergeAll();

const fileContents = changesPlusCreation1.map(f => {
  return Rx.Observable.zip(
    Rx.Observable.of(f),
    readFileAsObservable(f, 'utf-8'),
    function(name, content){
      return {name, content: format(content)};
    }
  );
});

const contentsOfAll = fileContents.concatAll().scan(function(acc, val){
  acc[val.name] = val.content;
  return acc;
}, {});

contentsOfAll.debounceTime(100)
  .subscribe(function writeIndexPage(pages){
    const contents = '\nINDEX\n=====\n';
    const indexPage = Object.keys(pages)
      .map(key => pages[key])
      .reduce((out, cur) => {
        return `${out}* ${cur}`;
      },contents);
    debug('write-index')(indexPage);
  });

function format(cont){
  // debug('formatting')(cont);
  return 'FORMATTED: ' + cont;
}

const changesPlusCreation2 = newFiles.merge(changedFiles);

// const numbersOfAll = doubles.scan()

// const 

//debug subscribers
// doubles.subscribe(  debug('numbers:next'), debug('numbers:error'), debug('numbers:done'));
// newFiles.subscribe( debug('newFiles:next'), debug('newFiles:error'), debug('newFiles:done') );
// fileContents.concatAll().subscribe( debug('fileContents:next'), debug('fileContents:error'), debug('fileContents:done') );
// changesPlusCreation1.subscribe( debug('changesPlusCreation1:next'), debug('changesPlusCreation1:error'), debug('changesPlusCreation1:done') );
// contentsOfAll.subscribe( debug('contentsOfAll:next'), debug('contentsOfAll:error'), debug('contentsOfAll:done') );
// numbersOfAll.subscribe( debug('numbersOfAll:next'), debug('numbersOfAll:error'), debug('numbersOfAll:done') );
// changesPlusCreation2.subscribe( debug('changesPlusCreation2:next'), debug('changesPlusCreation2:error'), debug('changesPlusCreation2:done') );
// changedFiles.subscribe(  debug('changedFiles:next'),  debug('changedFiles:error'),  debug('changedFiles:done'));