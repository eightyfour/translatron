translatron
==========================
![Translatron hero](./dist/images/translatron.jpg)

<img scr="./dist/images/translatron.jpg" width="200px"/> 

Handle your message resource files in the browser. 
The tool synchronized the texts between the messages bundles and it's possible that more than one translators are working on the same file. The translator will be notified when a other translator change a text or add new one. 


Parameters:
 * bundle -> bundle name for you messages
 * from -> is the language which needs to be translate
 * to -> is the language in to translate 

"admin-mode":

The following URL http://localhost:3000/?bundle=messages&from=de will create a messages_de.properties file. In this mode you can add new keys and edit the texts.

"translation-mode":

The following URL http://localhost:3000/?bundle=messages&from=de&to=fr will create a message bundle like: messages_fr.properties and will read the keys from messages_de.properties
 * in this mode you can add new keys
 * you can't edit "translate from" column
 * you can edit the texts in the "translation to" column


Requirements:
 * You need browserify
 

TODO:
 * add download message bundles (currently you have to downloaded directly from the server)
 * add key editor in admin-mode
 * the view design at all ;-)
 * show all languages at same time (overview about all)
 * save messages as key value (redis - or json files)
 * write a naming convention

## naming convention

First of all you create a new project for the message bundles. Could be a project name or if you don't know the project name just take the translation task number.

The default language is english US.

### keys

a key has the following convention:
```
[contextName]_[textInside]  (if you can't brake it down in smaller use cases)
[contextName]_[specifcName]_[textInside]
```

 *contextName:* is the name that describes a context inside the project. E.g. homepage is the project and aboutGameduell could be the context to summarize the keys
 *specifcName:* e.g. for the homepage project about aboutGameduell_textBox1 and aboutGameduell_textBox1

If you need to brake
  *specifcName:* e.g. for the homepage project about aboutGameduell_textBox1 and aboutGameduell_textBox1
