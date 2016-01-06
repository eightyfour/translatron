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

