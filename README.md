resourceMessagesLiveEditor
==========================

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
 * the view at all ;-)

 
