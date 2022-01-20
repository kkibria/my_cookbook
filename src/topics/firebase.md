---
title: Firebase matters
---

# {{ page.title }}

* TOC
{:toc}

## Firebase Auth sample
* YouTube [Flutter Web - Firebase Authentication for your web apps](https://youtu.be/qtJU5T0tF-M).
  Github [link](https://github.com/rajayogan/flutterweb-firebaseauth) used in this video.

## Firebase Auth articles
* Cross-Origin Resource Sharing (CORS) article, [Do you really know CORS?](https://dzone.com/articles/do-you-really-know-cors).
* Using function api- [How to Build a Role-based API with Firebase Authentication](https://www.toptal.com/firebase/role-based-firebase-authentication), sources in [github](https://github.com/joaqcid/firebase-user-role-api).
* [Controlling Data Access Using Firebase Auth Custom Claims (Firecasts)](https://youtu.be/3hj_r_N0qMs)

## Email link sign in
* Article [Firebase Email Link Authentication](https://medium.com/@huzaifa.ameen229/firebase-email-link-authentication-ac2504068562).
* Article [Working with Firebase Dynamic links](https://medium.com/mindorks/working-with-firebase-dynamic-links-a581df8fee6f).
* We have to whitelist dynamic link domain, article [Firebase says “Domain not whitelisted” for a link that is whitelisted
](https://stackoverflow.com/questions/51374411/.firebase-says-domain-not-whitelisted-for-a-link-that-is-whitelisted)

## Google sign in
Enable the google sign-in in the authentication tab in firebase console for the project. In the enable dialog, expand the web SDK config.
Copy the Web client ID and save setting.  Lets say this value is ``somerandomstuff.apps.googleusercontent.com``. Now copy the client ID value into the ``web/index.html`` file in a meta tag.

```html
<head>
  ...
  <meta name="google-signin-client_id" content="somerandomstuff.apps.googleusercontent.com" />
  ...
  <title>my awesome pwa app</title>
  <link rel="manifest" href="/manifest.json">
  ...
</head>
```

## Stack Overflow
* Google api problem [Firebase: 403 PERMISSION_DENIED](https://stackoverflow.com/questions/58495985/firebase-403-permission-denied-firebaseerror-installations-requests-are-blo/58496014#58496014)

## Firebase security videos
* [Security Rules](https://youtu.be/DBKB6r5BFqo)
* [Firebase Database Rules Tutorial](https://youtu.be/qLrDWBKTUZo)
* Youtube [Firestore Security Rules - How to Hack a Firebase App](https://youtu.be/b7PUm7LmAOw)
* [Firestore Rules Testing with the Emulator - New Feature](https://youtu.be/Rx4pVS1vPGY)
* [Security Rules! 🔑 | Get to Know Cloud Firestore #6](https://youtu.be/eW5MdE3ZcAw)

## Firebase database rule generator
* [bolt](https://github.com/FirebaseExtended/bolt)

## Cloud Firestore rule generator
* [fireward](https://github.com/bijoutrouvaille/fireward)

## Firestore
* [Firestore Security Rules Cookbook](https://fireship.io/snippets/firestore-rules-recipes/)


### firestore rules common functions
```javascript
service cloud.firestore {
  match /databases/{database}/documents {

    function isSignedIn() {
      return request.auth != null;
    }
    function emailVerified() {
      return request.auth.token.email_verified;
    }
    function userExists() {
      return exists(/databases/$(database)/documents/users/$(request.auth.uid));
    }

    // [READ] Data that exists on the Firestore document
    function existingData() {
      return resource.data;
    }
    // [WRITE] Data that is sent to a Firestore document
    function incomingData() {
      return request.resource.data;
    }

    // Does the logged-in user match the requested userId?
    function isUser(userId) {
      return request.auth.uid == userId;
    }

    // Fetch a user from Firestore
    function getUserData() {
      return get(/databases/$(database)/documents/accounts/$(request.auth.uid)).data
    }

    // Fetch a user-specific field from Firestore
    function userEmail(userId) {
      return get(/databases/$(database)/documents/users/$(userId)).data.email;
    }


    // example application for functions
    match /orders/{orderId} {
      allow create: if isSignedIn() && emailVerified() && isUser(incomingData().userId);
      allow read, list, update, delete: if isSignedIn() && isUser(existingData().userId);
    }

  }
}
```

### firestore rules data validation

```javascript
function isValidProduct() {
  return incomingData().price > 10 && 
         incomingData().name.size() < 50 &&
         incomingData().category in ['widgets', 'things'] &&
         existingData().locked == false && 
         getUserData().admin == true
}
```

