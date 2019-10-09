import inquirer from "inquirer";

export function cli(args) {
  switch (args[2]){
    case "--create" : 
      create(args);
      break;
    case "-c" : 
      create(args);
      break;
    case "--edit" : 
      edit(args);
      break;
    case "-e" : 
      edit(args);
      break;
    case "--init" : 
      init();
      break;
    case "-i" : 
      init();
      break;
    case "--remove" : 
      console.log("---->remove");
      break;
    case "-r" : 
      console.log("---->remove");
      break;
    default : 
      console.warn("command not defined");
      break;
  }
}

String.prototype.firstUpper = function(str){
  if ( ! str ) str = this;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const type = {
  check : function(element) {
    if (this.list.indexOf(element) >= 0 ) return true;
    return false;
  },
  list : [
    "page",
    "component",
    "transition"
  ]
};

const ask = {
  css : {
    type    : "confirm",
    name    : "css",
    message : "Will it have its own CSS",
  },
  extends : {
    type    : "confirm",
    name    : "extends",
    message : "Will it extends",
  },
  name : {
    type     : "input",
    name     : "name",
    message  : "What is its name",
    validate : (input)=>{
      //todo : vérifier que le nom n'est pas présent dans les éléments déjà existant
      if (input.length === 0) return false;
      return true;
    }
  },
  questions : function(questions, action, data={}, refresh=true){
    if (refresh) console.clear();
    inquirer
      .prompt(questions)
      .then(answers => {
        data = {...data, ...answers};
        eval(action)(data);
      });
  },
  type :{
    type    : "rawlist",
    name    : "type",
    message : "What kind of element you would create",
    choices : type.list,
    default : "component"
  }
};

const edit = function(){};

const create = function (args, refresh=true){
  // --create type name extends css
  let data = {
    "css"     : toBoolean(args[6]),
    "extends" : toBoolean(args[5]),
    "name"    : args[4] || null,
    "type"    : args[3] || null,
  };

  if ( type.check(data.type) ){
    let questions = [];
    
    if (data.name    === null) questions.push( ask.name );
    if (data.extends === null) questions.push( ask.extends );
    if (data.css     === null) questions.push( ask.css );

    if (questions.length === 0) create(data);
    else ask.questions(questions, "create"+data.type.firstUpper(), data, refresh);
  }
  else {
    console.log(type);
    ask.questions( [ ask.type ], "createAfterDefineType" );
  }
};

const createAfterDefineType = function(data){
  type.selected = data.type;
  create([,,,data.type], false);
};

const createComponent = function(data){};

const createPage = function(data){
  console.log("create page : ",data);
};

const createTransition = function(data){};

const init = function(){};

const toBoolean = function(element = null){
  if (element === null) return null;
  element = element.toLowerCase();
  if (element === "true")  return true;
  if (element === "false") return false;
  return null;
};