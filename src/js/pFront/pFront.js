/**
 * class PFront is the main class of the framework. It launch the process
 * @class PFront
 */
class PFront{

  /**
   * @param  {JSON}    specs                      all arguments needed in order to initialyze the framework
   * @param  {JSON}    [specs.boot]               ordered boot sequence
   * @param  {JSON}    [specs.boot.makeObject]    allow to create an object following this structure "name" : class
   * @param  {JSON}    specs.classesMapping       a collection of needed objet to create them dynamically
   * @param  {JSON}    specs.paths                paths
   * @param  {String}  specs.paths.library        path where to load pFront's library files
   * @param  {String}  specs.paths.components     path where to load user's components files. Define ony if there is component that will extends pFrontComponent
   * @return {void}  
   */
  constructor(specs){
    this.components      = {};
    this.specs           = specs;

    // shortcuts
    window.pAction = this.pAction;
    window.pFront  = this;
    window.pMsg    = this.pMsg;

    this.workerManager = new Worker(specs.pFrontWorker, {"name":"pFrontWorkerManager"});
    this.workerManager.onmessage = function(event){
      // console.log("DOMpFront  receive :", event.data);
      // console.log(event.data.header.sender, pFront.components[event.data.header.sender]);
      for (let [key, value] of Object.entries(event.data)) {
        this[key](value);
      }
    }.bind(this);

    window.addEventListener("load", window.pFront.init.bind(this));
  }

  addEventListener(args){
    document
      .getElementById(args.recipient)
      .addEventListener(
        args.event, 
        postMessage({
          "eventUpdate" : {
            "recipient" : args.recipient,
            "function"  : args.function
          }
        })
      );    
  }

  /**
   * function that observe and dispatch inforation about DOM's modifications
   * 
   * @function
   * @param  {array} mutationsList list of MutationRecord
   * @return {void}
   */
  callbackObsverver(mutationsList) {
    for(var mutation of mutationsList) {
      if (mutation.type == "childList") {
        if( mutation.addedNodes.length > 0){
          if (mutation.addedNodes[0].id == "transition"){
            alert("to page transition");
            // this.page.transitionIn.ready();
          }
        }
      }
      else if (mutation.type == "attributes") {
        console.log(`L'attribut ${mutation.attributeName} de ${mutation.target.tagName}#${mutation.target.id}.${mutation.target.className} a été modifié.`);
      }
    }
  }

  /**
   * this functions has been made i order to get values from DOM for example document.body.clientWidth
   * @param  {JSON}   args           a JSON containig information
   * @param  {Array}  args.functions an array containig a list of functions to evaluate
   * @params {String} args.recipient the name of the object where to send the answer
   * @params {String} args.callBack  the name of the function where send the answer
   * @return {void}      send a post message
   */
  DOMfunctions(args){
    let msg = {
      "recipient" : args.recipient
    };
    msg[args.callBack] = {};
    const nFunctions = args.functions.length;
    for (let i=0; i<nFunctions; i++){
      msg[args.callBack][args.functions[i]] = eval(args.functions[i]);
    }
    window.pFront.workerManager.postMessage(msg);
  }

  /**
   * get all inputs values from a component
   * @param  {JSON}   args                JSON which include the component name and the function name to call on succeed
   * @param  {String} args.componentName  the name of the component
   * @param  {String} args.callBack       the name of the function to call
   * @return nothing : send a postmessage
   */
  getFormValues(args){
    let answer = {};
    let elms   = document.getElementById(args.componentName).querySelectorAll("input");
    for (let elm of Object.entries(elms)) {
      switch (elm[1].type){
        case "checkbox" :
          answer[elm[1].name] = document.getElementById(elm[1].id).checked;
          break; 
        default : 
          answer[elm[1].name] = elm[1].value;
          break;
      }
    }
    elms   = document.getElementById(args.componentName).querySelectorAll("select");
    for (let elm of Object.entries(elms)) {
      answer[elm[1].name] = elm[1].options[elm[1].selectedIndex].value;
    }
    let msg= {
      "recipient" : args.componentName
    };
    msg[args.callBack] = answer;
    this.workerManager.postMessage(msg);
  }

  getParent(domElm){
    return domElm.parentNode;
  }
  
  init(){
    window.removeEventListener("load", window.pFront.init);


    /**
     * object that observe dom's modifications
     * @type {MutationObserver}
     */
    this.observer = new MutationObserver(this.callbackObsverver.bind(this));
    this.observer.observe(document.body, { attributes: true, childList: true } );

    //import needed libraries
    // if (this.specs.hasOwnProperty("importLibraries")) {
    if (this.specs.importLibraries !== undefined) {
      this.workerManager.postMessage({
        "importLibraries": this.specs.importLibraries
      });
    }
    // if (this.specs.hasOwnProperty("importDOMcomponentsLibraries")) {
    //   let nScript = this.specs.importDOMcomponentsLibraries.length;
    //   let script  = document.createElement('script');
    //   script.type = 'text/javascript';
    //   for (let i = 0; i < nScript; i++) {
    //     script.src = this.specs.importDOMcomponentsLibraries[i];
    //     document.getElementsByTagName('head')[0].appendChild(script);
    //   }
    // }

    //launch boot options
    // if (this.specs.hasOwnProperty("boot")) {
    if (this.specs.boot !== undefined) {
      this.workerManager.postMessage(this.specs.boot);
    }

    //replace existing element
    if (this.specs.boot.makePage === undefined) window.pFront.replaceItems(document.querySelectorAll("[data-pFront]"));

    delete this.replaceItems;
    delete this.specs;
  }

  insertDOM(args){
    document.querySelector(args.DOMcontainer).innerHTML += args.DOMcontent;
  }


  /**
   * Create a page. Function used when pFront is started from scracth and not from a rendered page by a server
   * @param  {String} page the page name (same as the object which is based on)
   * @return {void}
   */
  makePage(page){
    this.changePage(page); 
  }

  pAction(component, functionCallBackName){
    window.pFront.components[component][functionCallBackName]();
  }

  /**
   * send message to pFrontWorkerManager
   * @function
   * @param  {String} recipient [description]
   * @param  {String} action    [description]
   * @param  {JSON}   args      [description]
   * @return {void}
   */
  pMsg(recipient, action, args){
    let msg = {
      "recipient" : recipient
    };
    msg[action] = args;
    window.pFront.workerManager.postMessage(msg);
  }

  replaceItems (list){
    if (list.length === 0) return;
    let nItems = list.length;
    let tmp;
    for (let i=0; i<nItems; i++){
      tmp        = JSON.parse(list[i].dataset.pFront);
      tmp.dom    = list[i];
      tmp.method = "replaceInner";
      tmp.name   = list[i].id;
      delete list[i].dataset.pFront;
      new this.classesMapping[tmp.component](tmp);
    }

    //PFrontWorkerManager set history -> document.querySelector('[data-pFront-page]').dataset.pFrontPage
  }


  updateDOMcomponent(args){
    let target = document.querySelector(args.recipient);
    if ( args.update.container !== undefined ){
      for (let [key, value] of Object.entries(args.update.container)) {
        target.setAttribute(key,value);
      }
    }
    if ( args.update.content !== undefined ) target.innerHTML = args.update.content;
  }

  updatePage(args){
    let target;
    if (args.tagContainer !== undefined) target = document.querySelector(args.tagContainer);
    console.log("updatePage",target, args);
    for (let [key, value] of Object.entries(args)) {
      switch (key){
        case "name" :
          document.body.className = value;
          break;
        case "title" :
          document.title = value;
          break;
        case "html" :
          target.innerHTML = value;
          break;
      }
    }
  }

  updateStyleProperties(args){
    for (let [key, value] of Object.entries(args)) {
      document.documentElement.style.setProperty(key, value);
    }
  }

}

export default PFront;