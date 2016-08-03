translatron
==========================

<img title="Translatron hero" src="./dist/images/translatron.jpg" width="250px"/> 

Translate, manage and maintain your texts in the browser. Translatron is a server which 
provides you a file structure to manage your translations.

### features
It supports actually the following features:
* translate from a language to a language by key value
* group keys in categories
* group categories in projects
* group projects in folders
* add comments in a description field for keys, categories or projects
* upload images (screen shots) for categories
* [import JSON data into existing projects](https://github.com/gameduell/translatron#notes-on-importing-data-from-json-files)
* [export projects as JSON](https://github.com/gameduell/translatron#json-export-options)
* export projects as message bundle format for each locale
* create, rename and delete categories 
* create, rename, delete and clone keys
* category/key overview menu
* links to keys or categories
* live synchronization to server
* LDAP authentication (optional)
* ...more coming soon

# run in production
If you want use this module in production we offer you to save the project files in a different folder as the translatron installation.
 
You can add translatron as dependency and create you own node file to start the tool.

```js
var translatron = require('translatron'),
    fs = require('fs');

translatron({
    port : 3000, // configure port
    fileStorage : {
        projectFiles : __dirname + '/translations',  // file storage for project fiels
        images : __dirname + '/images'  // file storage for uploaded images
    },
    auth : { // configure the LDAP auth
        url: 'ldaps://example.com:3269',
        bindDn: '...',
        bindCredentials: '...',
        searchBase: '...',
        searchFilter: '...',
        tlsOptions: {
            ca: [
                fs.readFileSync('exampleCertificate.crt')
            ]
        }
    }
});
```

# dev

Clone this project and execute:

```sh
npm install
npm run devsetup
```
All required modules will be installed.

## start
To start the application just execute the app.js with node. Or run
```sh
npm start
```

## test setup
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
npm run buildjs-dev
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
The callback functions passed to these UI module functions will call _trade_ to do the actual work (e.g. calling the server).
 
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
* **onNewDirectoryCreated**: a new directory has been created. Payload is _projectId_ and _parentProjectId_

### Notes on importing data from JSON files

Translatron enables you import translations via uploading JSON files from your local hard disk.

- Open the import dialog/overlay by clicking the beaker-button positioned on the left sidebar's very bottom. 
- Drag a JSON file from your favourite window manager onto the drag area of the overlay.
    - Optionally click on the drag area to open a file dialogue to browse through your computer's folders/files and chose an appropriate JSON.
       
To make sure Translatron can process and merge the data with keys of the existing project it has to be structured as follows:

```
{
    "en": {
        "nameOfCategory_keyName": "Content"
    }
    "de": {
        "nameOfCategory_keyName": "Inhalt"
    }
}
```

whereby the json's top level contains objects named by country-code, like "da", "de", "en", "es", "fr", "nl", "sv" and so on (check/update project-configuration for field availableLanguages).
Furthermore each country's content is defined by key/value pairs where the keys contain information about
   
- a category they belong to (visualized by translatron's project-view) and   
- the actual key id, separated by an underscore.

As of version 0.4.0 you should also be able to import and export JSONs with a slightly different stucture, e.g. 

```
{
    "en": {
        "nameOfCategory": {
            "keyName": "Content"
        }
    }
    "de": {
        "nameOfCategory": {
            "keyName": "Inhalt"
        }
    }
}
```

So categories are rather stored as objects which hold their associated keys within their bodies 
than keys expressing their related category through a prefix (see first example above).
   
### JSON export options

For better readability and easier organization of translation files Translatron's JSON export provides two filter options.
These options are available through appending query parameters to to the project's json url endpoint.
  
##### Filter by language
```
    https://translation.office.gameduell.de/projectID.json?lang=de|en|es|fr|sv...
```
The **lang** query-parameter returns translations for a given language (represented by country code) as long as
the project has stored any data for the requested language. In case it does not you will get back an empty object.

##### Split data by category
```
    https://translation.office.gameduell.de/projectID.json?category=true
```
By setting **category** to true the JSON representation will show categories as objects.
Associated keys will be stored as children of those. 
  
