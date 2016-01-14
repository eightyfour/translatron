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
to be notified about changes (see [events>callbacks](#trade-callbacks)).

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
 
