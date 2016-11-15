
// const fileContents = changesPlusCreation$.map(f => {
//   return Rx.Observable.zip(
//     Rx.Observable.of(f),
//     readFileAsObservable(f, 'utf-8'),
//     function(name, content){
//       return {name, content: format(content)};
//     }
//   );
// });

// const contentsOfAll = fileContents.concatAll().scan(function(acc, val){
//   acc[val.name] = val.content;
//   return acc;
// }, {});

// contentsOfAll.debounceTime(100)
//   .subscribe(function writeIndexPage(pages){
//     const contents = '\nINDEX\n=====\n';
//     const indexPage = Object.keys(pages)
//       .map(key => pages[key])
//       .reduce((out, cur) => {
//         return `${out}* ${cur}`;
//       },contents);
//     writeIndex(indexPage);
//   });


    // Rx.Observable.of('YO').subscribe(observer);

    // numbers
    // numbers
    //   .subscribe(observer);
      // .filter(changed => changed === filename)
      // .map(function(name){
      //   debug('inside')(filename);
      //   debug('inside')(name);
      //   return name;
      //   // return readFileAsObservable(name, 'utf-8');
      // })
      // .subscribe(observer);
      // .subscribe(()=>{});

    // debug(`fileinner:${filename}`)('calling next');
    // observer.next(filename);


// createdOrChanged.subscribe(function(name){
//   console.log('created or changed: %s', name);
// });

// const filesContents = Rx.Observable.create(function subscribe(observer){

  //add observers to this by filename
  // const fileObservers = {};

  // createdOrChanged.subscribe(function(filename){
  //   if(!fileObservers[filename]){ //new file
  //     console.log('creating new subject');
  //     fileObservers[filename] = new Rx.Subject();
  //     observer.next(fileObservers[filename]);
  //     console.log(Object.keys(fileObservers));
  //   }
  //   fileObservers[filename].next('yo');
  //   fileObservers[filename].concat(readFileAsObservable(filename));
  // });

  // //Cleanup
  // return function unsubscribe(){
  //   console.log('NOT WATCHING ANYMORE!!');
  //   //TODO: halt all other file observers
  //   Object.entries(fileObservers).forEach(observer => observer.complete());
  //   dirWatcher.close();
  // };
  
// });

// const x = filesWatcher.concatAll().subscribe(console.log);
// console.log(filesContents);
// filesContents.subscribe(function(x){
//   console.log('new file observer emitted');
// });
// filesContents.concatAll().subscribe(console.log);
// x.unsubscribe();

const changesPlusCreation$2 = newFiles.merge(changedFiles);

// const numbersOfAll = doubles.scan()

// const 

//debug subscribers
// doubles.subscribe(  debug('numbers:next'), debug('numbers:error'), debug('numbers:done'));
// newFiles.subscribe( debug('newFiles:next'), debug('newFiles:error'), debug('newFiles:done') );
// fileContents.concatAll().subscribe( debug('fileContents:next'), debug('fileContents:error'), debug('fileContents:done') );
// changesPlusCreation$.subscribe( debug('changesPlusCreation$:next'), debug('changesPlusCreation$:error'), debug('changesPlusCreation$:done') );
// contentsOfAll.subscribe( debug('contentsOfAll:next'), debug('contentsOfAll:error'), debug('contentsOfAll:done') );
// numbersOfAll.subscribe( debug('numbersOfAll:next'), debug('numbersOfAll:error'), debug('numbersOfAll:done') );
// changesPlusCreation2.subscribe( debug('changesPlusCreation2:next'), debug('changesPlusCreation2:error'), debug('changesPlusCreation2:done') );
// changedFiles.subscribe(  debug('changedFiles:next'),  debug('changedFiles:error'),  debug('changedFiles:done'));


//from @Dorus
///I didnt test it but i think it'll work :p
Rx.Observable.prototype.doAndAwait = function(fun) {
  return this.delayWhen((x) => fun(x)
    .ignoreElements()
    .concat(Rx.Observable.of(0))
  );
};