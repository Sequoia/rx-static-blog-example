console.log('==============\n==============\n\n\n\n');
const Rx = require('rxjs');
const debug = require('debug');
const noop = ()=>{};

const readFile = require('fs').readFile;
const readFileAsObservable = Rx.Observable.bindNodeCallback(readFile);

const chokidar = require('chokidar');
const dirWatcher = chokidar.watch('./_data/*.md');
dirWatcher.on('all', function(event, name){ console.log('>> RAW >>', event, name); });

const newFiles     = Rx.Observable.fromEvent(dirWatcher, 'add');
const changedFiles = Rx.Observable.fromEvent(dirWatcher, 'change');

//WORKS for just 1x of the file
const fileObservers = newFiles.map(filename => {
  return changedFiles
    .filter(changed => changed === filename)
    .merge(Rx.Observable.of(filename));
    // .map(file => readFileAsObservable(file, 'utf-8'));
});

fileObservers
  .do(function(x){ debug('doing')(x); }, noop, debug('DONE'))
  .concatAll()
  .subscribe(
    debug('fileconsumer'),
    console.error,
    () => debug('stop')('fileobservsers: DONE')
  );