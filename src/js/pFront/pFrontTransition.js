class PFrontTransition{

  constructor(){
    this.name = "transition";
  }

  /**
   * change the component's class for transition's beginning
   * @function
   * @return {void}
   */
  start(){
    // this.dom.addEventListener('transitionend', this.waiting.bind(this));
    // this.dom.classList.add(this.startClass);
    postMessage({
      "addEventListener" : {
        "event"     : "transitionend",
        "function"  : "waiting",
        "recipient" : this.name
      },
      "updateDOMcomponent" : {
        "recipient" : this.name,
        "update"    : {
          "container" : {
            "class" : this.startClass
          }
        }
      }
    });
  }

  waiting(){

  }
}