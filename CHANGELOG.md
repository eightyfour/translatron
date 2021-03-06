# Changelog

## 0.4.0

- JSON export options
    - filter by language
    - split by category
    
- adapted JSON import
    - accepting data split by category
     
## 0.5.0

- Feature added: Deletion of categories
    
## 0.6.0

- Feature added: Renaming categories

## 0.6.1

- fixed category headline styling
 
## 0.6.2

- fixed anchor menu for Internet Explorer 11

## 0.6.3

- fixed key descriptions for
    - renamed keys
    - cloned keys
    - deleted keys
    - keys affected by renaming categories
    - keys affected by deleting categories

## 0.6.4

- fixed sorting of categories
    - on loading projects
    - inserting newly created categories
     
## 0.6.5

- fixed issues with updating the anchor menu
    - on deletion of categories
    - on creating new project after having opened one before 
    
## 0.7.0

- deletion of projects
    - for LDAP authentication: Enable project deletion only for members of designated user-group
    - enabled by default (e.g. no authentication used)
    
## 0.7.1
    
- deletion of folders
    - only applicable to empty folders
    - for LDAP authentication: Enable folder deletion only for members of designated user-group
    - enabled by default (e.g. no authentication used)
    
## 0.7.2
    
- fixed URL checking regular expression for json and message bundle exporter

## 0.7.3
    
- fixed creation of subdirectories

## 0.7.4

- fixed session deletion on manual logout

## 0.8.0

- added word-count feature
    - display word count for single keys (and language)
    - display word count for categories (and language)
    
# 0.8.1

- fixed alphabetical sorting of translation keys
- remove obsolete data on deletion of categories
    - category related keys in value-object will be deleted 

# 1.0.2
- enhanced range of special characters to be escaped by unicode parser

# 1.0.3
- updated npm-watch dependency due to vulnerability issues

# 1.0.4
- updated regular expression in word counter to not match variables in translations

# 1.0.5
- applied fixed order of language-columns in translation view