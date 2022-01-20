---
title: Firestore matters
---

# {{ page.title }}

## Firestore security
Cloud firestore is a database for a serverless architecture Firebase uses. Followings are notes I took from watching a google firebase team provided youtube playlist [Get to know Cloud Firestore](https://www.youtube.com/playlist?list=PLl-K7zZEsYLluG5MCVEzXAQ7ACZBCuZgZ).

### Notes
Document contains tree structure of information. But document does not contain another document. Maximum size ie 1 meg. Documents can point to a sub-collection. 
```javascript
document = {
    bird_type: "swallow",
    airspeed: 42733,
    coconut_capacity: 0.62,
    isNative: false,
    icon: <binary data>,
    vector: {
        x: 36.4255, 
        y: 25.1442, 
        z: 18.8816
    } distances_traveled: [
        42,
        39,
        12,
        421
    ]
}
```
Collections only contains documents
```javascript
collection = {
    hash1: document1
    hash2: document2 
}
```
At rhe root we will have a collection, so path to a document may look like,
```javascript
var messageRef = firestore.collection('rooms').doc('roomA').collection('messages').doc('message1');
```
Each level fragment pattern will come in pair ``.collection(...).doc(...)``.


Every field in a document is automatically indexed by Firestore. Depending on the search we may have create composite indexes
if a search fails. Firestore will send a link to console
which can be used to create exact composite index that is needed for that specific search.

Note, we will have to copy the composite index it back to our firestore project so that it will be pushed when we deploy next time.
> Question: does the firestore emulator do the same? Answer No.
Emulator will automatically build the indexes if it is missing.
there is no way currently to figure out what are the indexes
it built, although google might add it in the future. 


General rules
* Documents have limits.   
* You can't retrieve a partial document.
* Queries are shallow.
* You're billed by the number of reads and writes you perform.
* Queries find documents in collections.
* Arrays are weird.

```javascript
service cloud.firestore {
    match /databases/{database}/documents {
        match /{document=**} {
            // Completely locked
            allow read, write: if false;
        }
    }
}
```

```javascript
service cloud.f1restore {
    match /databases/{database}/documents {
        match /restaurants/{restaurantID} {
            // restaurantID could be resturant_123
        }
        match /restaurants/{restaurantID}/reviews/{reviewID} {
        }
    }
}
```

wildcard
```javascript
service cloud.f1restore {
    match /databases/{database}/documents {
        match /restaurants/{restOfPath=**} {
            // restOfPath could be resturant_123
            // or could be resturant_123/reviews/review_456
        }
        match /restaurants/{restaurantID}/reviews/{reviewID} {
        }
    }
}
```

```javascript
service cloud.f1restore {
    match /databases/{database}/documents {
        match/restaurants/{restaurantID} {
            // restaurantID = The ID of the restaurant doc is available at this level 
            match /reviews/{reviewID} {
                // restaurantID = The ID of the restaurant doc available at this level
                // reviewID = The ID of the review doc is also available at this level
                allow write: if reviewID == "review_234"
            }
            // private data that only helps queries not to be sent back to client 
            match /private-data/{privateDoc} {
            }
        }
    }
}
```
```javascript
service cloud.f1restore {
    match /databases/{database}/documents {
        match /{document=**} {
            //DO NOT LEAVE THIS IN, this will override everything else, RULES are OR-ED
            allow read, write;
        }
        match /users/{rest0fPath=**} {
            allow read;
        }
        match /users/{userID}/privateData/{privateDoc} {
            //Doesn't do anything
            allow read: if false;
        }
    }
}
```

read [Control Access with Custom Claims and Security Rules](https://firebase.google.com/docs/auth/admin/custom-claims) to enable additional fields in Auth token.

access rule checks
```javascript
// logged in users only 
service cloud.f1restore {
    match /databases/{database}/documents {
        match /myCollection/{docID} {
            allow read: if request.auth!= null;
        }
    }
}
// logged in users with google email
service cloud.f1restore {
    match /databases/{database}/documents {
        match /myCollection/{docID} {
            allow read: if request.auth.token.email.matches('.*google[.]com$');
        }
    }
}
// logged in users with google email and email verified
service cloud.f1restore {
    match /databases/{database}/documents {
        match /myCollection/{docID} {
            allow read: if request.auth.token.email.matches('.*google[.]com$') &&
                request.auth.token.email_verified;
        }
    }
}
// only logged in as albert 
service cloud.f1restore {
    match /databases/{database}/documents {
        match /myCollection/{docID} {
            allow read: if request.auth.uid == "albert_245";
        }
    }
}

// role based access using private collection
allow update: if get(/databases/$(database)/documents/restaurants/$(restaurantID)/private_data/private).data.roles[request.auth.uid] == "editor";

// multiple role access using private collection
allow update: if get(/databases/$(database)/documents/restaurants/$(restaurantID)/private_data/private).data.roles[request.auth.uid] in ["editor", "owner"];
```


using functions
```javascript
// logged in users with google email and email verified
service cloud.f1restore {
    match /databases/{database}/documents {
        match /myCollection/{docID} {
            function doesUserHaveGoogleAccuunt() {
                return request.auth.token.email.matches(
                    '.*google[.]com$')
                    && request.auth.token.email_verified;
                }
            allow read: if doesUserHaveGoogleAccuunt();
        }
    }
}
```

or 
```javascript
service cloud.f1restore {
    match /databases/{database}/documents {
        function userIsRestaurantEditor(restaurantID) {
            return get(/databases/$(database)/documents/restaurants/$(restaurantID)/private_data/private)
                .data.roles[request.auth.uid] in ["editor", "owner"];
        }
        match /restaurants/{restaurantID} {
            // restaurantID = The ID of the restaurant doc is available at this level 
            allow update: if userIsRestaurantEditor(restaurantID);
            match /reviews/{reviewID} {
                // restaurantID = The ID of the restaurant doc available at this level
                // reviewID = The ID of the review doc is also available at this level
            }
            // private data that only helps queries not to be sent back to client 
            match /private-data/{privateDoc} {
            }
        }
    }
}
```

To test rules use cloud firestore emulator.

pagination needs to be used save data transfer cost


```javascript
// first page
myQuery = restaurantRef
    .whereFie1d("city", isEqualTo: "Tokyo")
    .whereFie1d("category", isEqualTo: "tempura")
    .order(by: "rating”, descending: true)
    .limit(to: 20)
// next page
myQuery = restaurantRef
    .whereFie1d("city", isEqualTo: "Tokyo")
    .whereFie1d("category", isEqualTo: "tempura")
    .order(by: "rating”, descending: true)
    .limit(to: 20)
    .start(after: [”Tokyo", “tempura", 4.9)

// or a simpler way, 
myQuery = myQuery.start(after: [”Tokyo", “tempura", 4.9])

// even easier 
myQuery = myQuery.start(after: previousDoc)
```

dont use .offset() because it will still bill you for the skipped data. 
