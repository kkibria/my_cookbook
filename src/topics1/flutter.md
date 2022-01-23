---
title: Flutter Apps
---

# {{ page.title }}

## Setup

* Install git
* Install npm
* Install flutter sdk
* Read carefully the [firebase CLI docs](https://firebase.google.com/docs/cli). Install firebase CLI using npm.

  ```text
  npm install -g firebase-tools
  ```

* log into firebase using the firebase CLI.

  ```text
  firebase login
  # this will test the successful login
  # by listing all your projects
  firebase projects:list
  ```

* Read carefully [flutter web doc](https://flutter.dev/docs/get-started/web). Change channel to dev or beta. Currently I am using dev channel to the latest features.

  ```text
  flutter channel dev
  flutter upgrade
  flutter config --enable-web
  ```

* Set powershell script policy by running in an **admin powershell** for Windows machine. Otherwise firebase commands will not run.

  ```
  Set-ExecutionPolicy RemoteSigned
  ```

## Create a flutter project

Type following flutter cli command in shell to create a starter flutter project.

```text
flutter create <app_name>
cd <app_name>
```
This creates a folder named '`<app_name>`' in the current working directory. Next we change working directory to newly created '`<app_name>`' folder.

Android app, IOS app, and web app target support will be added to the project by the cli command.

## Add git and setup for gitlab

```bash
git init
git add .
git commit -m "initial commit"
git push --set-upstream https://gitlab.com/kkibria/<app_name>.git master
git remote add origin https://gitlab.com/kkibria/<app_name>.git
```

## Add firebase to tha flutter project

### Create a firebase project
* Go to firebase [console](https://console.firebase.google.com).
* Create a new firebase project in firebase console with the `<app_name>` as the project name.
* In the project `Setting > General` tab select Google Cloud Platform (GCP) resource location.
* Select the `Database` tab. Configure the firestore database into Native mode.

### Add the firebase SDK support libraries

Add firebase dart libraries to the `dependencies` section of `pubspec.yaml` file.

```yaml
...

dependencies:
  ...

  # flutter firebase SDK libraries
  # comment out the ones you don't need
  firebase_auth: ^0.15.4
  firebase_messaging: ^6.0.9
  firebase_database: ^3.1.1
  cloud_firestore: ^0.13.2+2
  firebase_storage: ^3.1.1

...
```

## Configure Webapp with PWA
PWA support was already added for web platform by `flutter create` command. We need to connect flutter web target with a firebase web app.
* Add an web app to the firebase project.
* Add a nickname for the `<app_name>_web`.
* Click on firebase hosting option.
* Now click on Register button.
* It will show a javascript snippet that will show how to add firebase javascript SDK to `web/index.html`. For now we wont add the snippet. We will do it later.

## Connect the flutter web target with firebase webapp.

Run following firebase CLI command from inside <app_name> directory.

```text
firebase init
```

Select either `Realtime Database` or `Firestore`, or both as necessary. Both can be used if there is a need but probably not common. Check the rest of the options as necessary as well. Hit enter.

Select `Exiting project` and hit enter. Then select the firebase project you just created.

Note: selecting firestore is giving index trouble, so I selected Realtime.

Select all defaults except for the public directory, type `build/web`.

## Android app from flutter
Todo......

## IOS app from flutter
Todo.....

## Web app from flutter

We have to configure the web template file. When we build the web app, the web template file gets copied over to the `build/web` folder.

### Update the flutter web template
`firebase init` will build an `index.html` file in `build/web` directory. You will see the firebase javascript SDK snippet we saw earlier, is already included in this `index.html`. 

However, every time flutter will build our web app this file will be overridden from a template file.
Therefore, copy the firebase relevant portion in this file to the web template `web/index.html` file to update the template. Next time we build the web target with `flutter build web` command the javascript SDK snippet will persist.

The template will end up looking something like the following,

```html
<head>
  ...
  <title>my awesome pwa app</title>
  <link rel="manifest" href="/manifest.json">
  ...
  <!-- update the version number as needed -->
  <script defer src="/__/firebase/7.8.2/firebase-app.js"></script>
  <!-- include only the Firebase features as you need -->
  <!-- comment out the ones you don't need -->
  <script defer src="/__/firebase/7.8.2/firebase-auth.js"></script>
  <script defer src="/__/firebase/7.8.2/firebase-database.js"></script>
  <script defer src="/__/firebase/7.8.2/firebase-firestore.js"></script>
  <script defer src="/__/firebase/7.8.2/firebase-messaging.js"></script>
  <script defer src="/__/firebase/7.8.2/firebase-storage.js"></script>
  <!-- initialize the SDK after all desired features are loaded -->
  <script defer src="/__/firebase/init.js"></script>
  ...
</head>
```

### Building the web app and host it in firebase server.
* `flutter build web`.
* `firebase serve`
* `firebase deploy`

... to be continued

