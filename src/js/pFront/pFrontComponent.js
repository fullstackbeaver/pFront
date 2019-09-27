/**
 * the class that handle components in WORKER side
 */
class PFrontComponent{

  constructor(){
    this.state = {
      "otherComponents" : {}
    };
    // if (args.method === undefined) this.method = null;
    // else                           this.method = args.method;
  }

  /**
   * return a generated h 
   * @param  {String} functionToCall a function to call. By default it's "content", but you can call alo "container" or whatever function inside the class that generate html
   * @return {String}                the generated html made by the called function
   */
  // html(functionToCall = "content"){
  //   return this[functionToCall];
  // }

  /**
   * update the component's state and check in workerManager if the values is (are) shared with other components
   * @param {JSON} newState the object you want to merge with current state. 
   * @this {PFrontComponent}
   */
  setState(newState){
    this.state = {...this.state, ...newState};
    this.updateState();
    checkSharedState(this.name, newState);
  }

  /**
   * Allow to this component to receive state's update from another component. It call the subribe's function of the workerManager 
   * @param  {String} otherComponent other component's name
   * @param  {String} properties     property's name
   * @return {void}
   */
  subscribe(otherComponent, properties){
    subscribe(otherComponent, properties, this.name);
  }

  /**
   * this function should be redefined in the component with custom rules
   * @return {void}
   */
  updateState(){
    console.warn(`you should define updateState function in ${this.name}'s component`);
  }


  /**
   * udpate a component in the DOM
   * @param  {JSON} thingsToUpdate /!\ todo : to complete 
   * @return {void}                send message to the DOM
   */
  updateDOMcomponent(thingsToUpdate){
    updateDOMcomponent(thingsToUpdate, "#"+this.name)
  }
}