//------pFront release remove------
self.importScripts(
  "pFrontComponent.js",
  "pFrontPage.js",
  "pFrontWorkerManagerComponent.js",
  "pFrontWorkerManagerDOM.js",
  "pFrontWorkerManagerPage.js"
);
//----end pFront release remove----

String.prototype.firstUpper = function(str){
  if ( ! str ) str = this;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

String.prototype.firstLower = function(str){
  if ( ! str ) str = this;
  return str.charAt(0).toLowerCase() + str.slice(1);
};

/**
 * disptach action to do when receiving a message
 * @function
 * @param  {message.event} event
 * @return {void}
 */
onmessage = function(event) {
  if (event.data.recipient !== undefined ){ //on cible un composant
    if (event.data.recipient === "page"){
      for (let key in event.data) {
        if (key == "recipient") continue;
        this.page[key](event.data[key]);
      }
      return;
    }
    if (this.components[event.data.recipient] === undefined) {
      console.warn(`${event.data.recipient} recipient doesn't exist`);
      return;
    }
  }

  for (let key in event.data) {
    // console.log("key",key)
    if (key == "recipient") continue;
    // console.log(`${name} received ${key} : ${event.data[key]}`);
    let score = 0;
    if (event.data.recipient !== undefined){
      if (typeof this.components[event.data.recipient][key] === "function") score += 2;
    }
    if (typeof this[key] === "function") score += 1;
    switch(score){
      case 0 : 
        console.warn(`the function ${key} doesn't exist`);
        break;
      case 1 : 
        this[key](event.data[key], event.data.recipient);
        break;
      default :
        this.components[event.data.recipient][key](event.data[key]);
        break;
    }
  }
};

//------pFront production remove------
/**
 * import external Libraries. Only for the dev version, it is removed when compiling
 * @param  {Array} list a list of file to import
 * @return {void}
 */
self.importLibraries = function(list){
  const nList = list.length;
  for( let i=0; i< nList; i++ ){
    self.importScripts(list[i]);
  }
};
//----end pFront production remove----

/**
 * [set description]
 * @todo faire le commentaire
 * @param {JSON}   msg    [description]
 * @param {String} target a component name
 * @return {void}
 */
self.set = function(msg, target){
  if (target === undefined) {
    for (let [key, value] of Object.entries(msg)) {
      this[key] = value;
    }
  }
  else {
    for (let [key, value] of Object.entries(msg)) {
      self.shared[target][key].value = value;
    }
    // console.log("shared List",self.shared);
  }
};