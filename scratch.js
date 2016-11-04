console.log('==============\n==============\n\n\n\n');
const Rx = require('rxjs');
const debug = require('debug');
const frontmatter = require('frontmatter');
const noop = ()=>{};
const pug = require('pug');
const md = require('markdown-it')();
const path = require('path');

const renderPost = pug.compileFile(`${__dirname}/templates/post.pug`);
const renderIndex = pug.compileFile(`${__dirname}/templates/index.pug`);

function bug(name){
  return { next: debug(`x:${name}:next`), error: debug(`x:${name}:error`), complete: debug(`x:${name}:done`) };
}

const chokidar = require('chokidar');
const dirWatcher = chokidar.watch('./_data/*.md');

const fs = require('fs');
const readFileAsObservable = Rx.Observable.bindNodeCallback(fs.readFile);
const writeFileAsObservable = Rx.Observable.bindNodeCallback(fs.writeFile);

const newFiles     = Rx.Observable.fromEvent(dirWatcher, 'add');
const changedFiles = Rx.Observable.fromEvent(dirWatcher, 'change');

// for each added file...  
const latestFileContents$ = newFiles.mergeMap(filename => {
  // 1. get a stream of changes (and emit that filename 1x)
  return changedFiles
  // 2. only take those for THIS file,
    .filter(name => name === filename)
  // 3. emit filename once to start (on "add")
    .startWith(filename)
  // 4. read the file contents (as an observable)
    .map(filename => readFileAsObservable(filename, 'utf-8'))
  // 5. Merge the Observable<Observable<file contents>> to Observable<file contents>
    .mergeAll()
  // 6. don't emit unless the file contents actually changed
    .distinctUntilChanged();
});

//
const postsAndMetadata$ = latestFileContents$
  .map(frontmatter);

const metadata$ = postsAndMetadata$
  .pluck('data');

const postsParsed$ = postsAndMetadata$.map(function flattenPostObject(post){
  //merge the post body into the "data" property created by frontmatter
  // in: { data: { title: 'foo' }, content: '...' }
    let data = post.data;
    data.body = post.content;
    return data;
  // out: { title: 'foo', content: '...' }
  })
  .map(function renderAndTemplate(post){
    post.body = md.render(post.body);
    post.rendered = renderPost(post);
    return post;
  });

const postsListing$ = metadata$
  .scan(function(acc, post){
    acc[post.slug] = post;
    return acc;
  }, {})
  .map(function formatForTemplate(postsObject){
    return {
      posts : Object.keys(postsObject)
      .reduce(function(acc, key){
        acc.push(postsObject[key]);
        return acc;
      }, [])
    };
  })
  .distinctUntilChanged((x, y) => {
    return JSON.stringify(x) === JSON.stringify(y);
  })
  .debounceTime(100);
  // .subscribe(bug('indexed'));

postsParsed$
  .subscribe(writePost);

postsListing$
  .map(renderIndex)
  .subscribe(writeIndexPage);

function writePost(post){
  var outfile = path.join(__dirname, 'out', `${post.slug}.html`);
  writeFileAsObservable(outfile, post.rendered)
    .subscribe({
      next: () => console.log('wrote ' + outfile),
      error: console.error
    });
}

function writeIndexPage(indexPage){
  var outfile = path.join(__dirname, 'out', `index.html`);
  writeFileAsObservable(outfile, indexPage)
    .subscribe({
      next: () => console.log('wrote ' + outfile),
      error: console.error
    });
}

// postsParsed$.subscribe(bug('contents'));

//debounce to wait 


//TODO
// x read files
// x distinctUntilChanged
// x read updates
// x parse frontmatter
// x update posts with frontmatter
// x template post
// x parse markdown!!
//   build index info
//   distinctUntilChanged
//   template index
// x write posts
//   write index