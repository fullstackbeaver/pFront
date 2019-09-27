const components = {};

/**
 * lits of the shared values
 * @type {Object}
 */
const shared = {};

/**
 * add an entry in shared values list and give the desired value to the subscriber
 * @param {String} component  the target component's name
 * @param {String} key        the key that should be observed
 * @param {String} subscriber the component which want to have the update
 */
const addSharedState = function(component, key, subscriber){
  if (shared[component][key] === undefined ) shared[component][key] = [subscriber];
  else                                       shared[component][key].push(subscriber);
  shareState(component, key, subscriber);
};


const checkSharedState = function(component, newState){
  let nSubscribers;
  for (let [key, value] of Object.entries(newState)) {
    if (shared[component] === undefined)      continue;
    if (shared[component][key] === undefined) continue;
    nSubscribers = shared[component][key].length;
    for(let i=0; i< nSubscribers; i++){
      shareState(component, key, shared[component][key][i]);
    }
  }
};

// getHtml = function(componentName, functionToCall="html"){
//   return components[componentName][functionToCall]();
// }

/**
 * import components's class  
 * @function
 * @param  {array}  components   a list of component to download
 * @return {void} 
 */
// importClassComponents = function(components){
//   let component; 
//   let nComponents = components.length;
//   for ( let i=0; i< nComponents; i++ ) {
//     if (loaded.pages.indexOf(components[i]) === -1 ){
//       component = components[i].firstLower();
//       importScripts(`${paths.components}${component}/${component}.js`);
//       loaded.components.push(components[i]);
//     }    
//   }
// }

const makeComponent = function( componentName, component){
  // console.log(componentName, components[componentName]);
  if (components[componentName] === undefined){
    components[componentName]      = component;
    components[componentName].name = componentName;
  }
  // console.log("components:",components);
  return components[componentName].html;
};

const shareState = function(component, key, subscriber){
  // if the subscriber doesn't exist anymore it should be removed for subscriber's list
  if (components[subscriber] === undefined) {
    shared[component][key].splice(shared[component][key].indexOf(subscriber),1);
    return;
  }

  //check if the value exist in component
  if (components[subscriber].state.otherComponents[component] === undefined) components[subscriber].state.otherComponents[component] = {};

  // update subriber
  components[subscriber].state.otherComponents[component][key] = components[component].state[key];
  components[subscriber].updateState();
};

/**
 * allow to a component to follow key from state of another one
 * @function
 * @param  {String}         component  component's name thatyou want to have a state value
 * @param  {String | Array} key        state's key of the component you want to have updates
 * @param  {String}         subscriber the component that wants to have the updates
 * @return {void}                      call the function shareState in order to set the data 
 */
const subscribe = function(component, keys, subscriber){
  if (shared[component] === undefined) shared[component] = {};
  if (typeof keys === "string"){
    console.log("subscribe String");
    addSharedState(component, keys, subscriber);
    return;
  }
  let nKeys = keys.length;
  for(let i=0; i<nKeys; i++){
    addSharedState(component, keys[i], subscriber);
  }  
};