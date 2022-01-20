---
title: Java development
---

# {{ page.title }}

## Maven

Maven is a great build tool, running maven build will compile, do all sorts of tasks and create the project target.

Maven build will store target jar and download all the dependencies (jars, plugin jars, other artifacts) for later use in the local repository. Maven supports 3 types of repository for dependencies:

* **Local** – Repository on local Dev machine.
* **Central** – Repository provided by Maven community.
* **Remote** – Organization owned custom repository.

### The Local Repository

Usually this is a folder named ``.m2`` in users home directory. 
The default path to this folder,

* Windows: ``C:\Users\<User_Name>\.m2`` i.e. ``%UserProfile%\.m2``.
* Linux: ``/home/<User_Name>/.m2`` i.e. ``~/.m2``.
* Mac: ``/Users/<user_name>/.m2``  i.e. ``~/.m2``.

maven config file can change the default. The config file is located at the following path 
``<Maven-install-Path>/conf/settings.xml``.

Reading materials:
* [Simple ways to add and work with a `.jar` file in your local maven setup](https://www.eviltester.com/2017/10/maven-local-dependencies.html).

## Antlr 4

Todo.




