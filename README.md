translatron
==========================

<img title="Translatron hero" src="./dist/images/translatron.jpg" width="250px"/> 

Translate your texts in the browser. 

#dev

Go to root and execute:

```sh
npm install
```
All required modules will be installed.

#start
To start the application just execute the app.js with node.
```sh
npm start
```

##test setup
There are two types of test:
 
First a Karma setup with phantomjs which tests the client side code. Run it with:

```sh
karma start karma.conf.js
```
(you need to install [karma-cli](https://www.npmjs.com/package/karma-cli))

and second a jasmine unit test to test the server side code (see spec/support/jasmine.json for config). Run it with:

```sh
jasmine
```
(you need to install [jasmine](https://www.npmjs.com/package/jasmine))

Or run both with:

```sh
npm test
```
All test files are in the spec folder separated by client and server folder.

## DEV DOC Client

Please read the following lines to understood the architecture of the translatron code.

### compile
To compile the javascript we use browserify. You can call this in your console:
```sh
browserify lib/client/js/main.js -o dist/js/translatron.js
```

### trade.js

All "web socket" interactions from client to server are managed in here. All controller needs to be registered on trade
to be notified about changes (see [trade callbacks](#trade-callbacks)).

### events

On the client side there exists 3 types of events.

#### trade callbacks

> return object of each controller instance can implement the callbacks

This type of events are only for the actual client which makes the server call. It can be seen as direct 
"callback" which are triggered as answer from the server call.

All controllers can returns a "callback" API which will be registered on the trade. If you send a message via the 
trade websocket connection to the server trade will wait for the callback and notifier all controllers if the message 
was send. 

E.g. a controller triggered a "add new category" event which adds a new category to a language. The module
which managed the statistic to show the number of translated keys needs to be updated. And the category overview module
needs to add a new category to the overview list. This event types will be never triggered if a different client makes some 
changes in his browser. To manages this type of event see next chapter [events](#events).

#### events

> events.js

Server events which are triggered from the server side. Mostly used to inform other users that a prject was updated or somethinkg
has been changed in the view. E.g.: a other user deletes a key from a project so all other "online" users will 
be notified about this changes.

#### ui events

> uiEventManager.js

UI only events are events which are triggered if the user do anything without a server interaction. Like selecting a language 
or open a project.

### Components

#### UI Modules

An UI module contains the logic for a HTML component. A module's public API has functions for
* trigger actions in the UI as response to events arriving at the controller (e.g. _renderXYZList_)
* functions for registering event listeners for events originating in the HTML component (e.g. _onParentDirectorySelected_).

UI modules are registered with _canny_ (in _main.js_). In the implementation for _canny_'s _ready_ callback, UI modules will add event
listeners which in turn execute the callback.

#### UI controllers

A controller is the bridge between an UI module and other components (e.g. _trade_). 

Functions in a controller's public API:
* under normal circumstances, a controller's public functions are only callbacks for events coming from _trade_.

A controller will already register itself at construction time at the corresponding UI module's _onXYZTriggered_ functions. 
 The callback functions passed to these UI module functions will call _trade_ to do the actual work (e.g. calling the 
 server).
 server).
 
#### trade
 
_trade_ is the name of the component which handles all calls going to the server, incl. execution of the callback to the
server call which notifies interested components about the outcome. 
 
Components register themselves at _trade_ using _addController_. _trade_ assumes that all public functions of registered
components are potential callbacks.
  
##### _trade_ callback events
  
_trade_ supports the following events:
* **onNewProjectCreated**: informs about creation of a new project, payload is the project object.
* **onDirectoryChanged**: **Not implemented yet**, informs about a change of the current directory, payload is the path/id of
    the new current directory (replaces **getDirectory** event)

 
