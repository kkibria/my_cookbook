---
title: Flutter Sign-in for your users
---

# {{ page.title }}

## Google sign in

* Firebase [Google sign in](firebase#google-sign-in)

## Email link sign in
* Article [Flutter: How to implement Password-less login with Firebase](https://medium.com/@ayushsahu_52982/passwordless-login-with-firebase-flutter-f0819209677).
* Article [Flutter : Firebase Dynamic Link](https://medium.com/@diegoveloper/flutter-firebase-dynamic-link-6f1b79278ce0).


## New notes

* <https://proandroiddev.com/flutter-passwordless-authentication-a-guide-for-phone-email-login-6759252f4e>
* <https://medium.com/@ayushsahu_52982/passwordless-login-with-firebase-flutter-f0819209677>
* <https://medium.com/@levimatheri/flutter-email-verification-and-password-reset-db2eed893d1d>
* For WebApps email link login needs to be handled somewhat differently than regular ios or android app,
<https://firebase.google.com/docs/auth/web/email-link-auth>

It is also important to note that email verification and password reset links through email will require similar approach in flutter WebApps. We have to figure out how to handle those in the same dart code for all platforms.


