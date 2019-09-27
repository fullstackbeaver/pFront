# pFront

pFront is a green JavaScript framework that create a parallel front in webworker before send it to the DOM. It is based on a component architecture.

## Green framework
A green framework is a small framework with a minimum of automatization, in order to avoid useless actions. The goal is to use less memory as possible. That why the library has to be small and frugal 

## pFront Principle
With this library you can create and manage easily page directly through javascript. Pages are constituted by component. Pages and components are invoked in webworker in order to improve performance.
Each component generate it's own view, creating a kind of virual DOM. Component are automatically updated when its state change (like in react).
You can use this library for a project from scratch or on a server rendered page.

## Installation

### for full installation with build tools
Prerequisites : 
* Node.js should already be installed on your machine.
* gulp.js should be installed in global on your machine

Then just install the framework

```bash
npm install pfront
```

### for installation without build tools

## Roadmap
This is the first draft.
Soon it will include transition between pages.

The first release will be the same but minimized.
After will come a build tool in order to optimize performances. 
The build tools will be based oin gulp and will compile all classes in one file (and remove import functions), and combine all css in one.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
![CRAN/METACRAN](https://img.shields.io/cran/l/pack?logo=GPL-3)(https://choosealicense.com/licenses/gpl-3.0/)