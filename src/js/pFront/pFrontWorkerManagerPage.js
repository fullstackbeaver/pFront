/**
 * store all pages in order they had been shown (WORKER side)
 * @type {Array}
 */
self.history = [];

/**
 * the actual page (WORKER side)
 * @type {Object}
 */
self.page    = {};

/**
 * create a new page or change the actual page to another one
 * @function
 * @param  {String} newPage page name to create. 
 * @return {void}
 */
self.makePage = function(newPage, options={}){
  // if (loaded.pages.indexOf(newPage) === -1 ){
  //  importScripts(`../../pages/${newPage}/${newPage}.js`);
  //  loaded.pages.push(newPage);
  // }
  
  // removeUselessComponents
  // console.log(newPage);
  // console.log(self.components);

  let previousComponents = [];
  for (let key of Object.entries(self.components)) {
    previousComponents.push(key[0]);
  }
  
  let todo = `new ${newPage.firstUpper()}(`;
  if (Object.entries(options).length !== 0) todo += "options";
  todo += ")";
  self.page = eval(todo);

  for (let key of previousComponents) {
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

self.changePage = self.makePage;