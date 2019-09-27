/**
 * store all pages in order they had been shown (WORKER side)
 * @type {Array}
 */
const history = [];

/**
 * the actual page (WORKER side)
 * @type {Object}
 */
const page    = {};

/**
 * create a new page or change the actual page to another one
 * @function
 * @param  {String} newPage page name to create. 
 * @return {void}
 */
const makePage = function(newPage, options={}){
  // if (loaded.pages.indexOf(newPage) === -1 ){
  //  importScripts(`../../pages/${newPage}/${newPage}.js`);
  //  loaded.pages.push(newPage);
  // }
  
  // removeUselessComponents
  // console.log(newPage);
  // console.log(self.components);

  let previousComponents = [];
  for (let [key, value] of Object.entries(self.components)) {
    previousComponents.push(key);
  }
  
  let todo = `new ${newPage.firstUpper()}(`;
  if (Object.entries(options).length !== 0) todo += "options";
  todo += ")";
  let page = eval(todo);

  for (let [key, value] of previousComponents) {
    if (page.keep.indexOf(key) == -1) delete self.components[key];
  }
  postMessage({
    "updatePage" : {
      "name"         : newPage,
      "html"         : page.html,
      "tagContainer" : page.tagContainer,
      "title"        : page.title,
    }
  });
  history.push(newPage);
};

const changePage = makePage;