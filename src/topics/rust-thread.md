---
title: Rust Multithreading
---

# {{ page.title }}


Rust's ownership and borrow checking at compile time makes it easy to use
threads. However sharing data between threads requires some consideration.

## Sharing data
Let's say we have two threads. One for gui, another for processing. We need to
share a big data structure which is modified in gui thread. But they are
accessed in the processing thread which could perform lengthy processing. How do
we achieve this?

Accessing shared data between threads can be tricky, especially when the data is
large and frequently modified. In such Read-copy-update can be considered.

## Read copy update

Sharing data with read copy update (RCU) is a technique used in concurrent
programming to allow multiple threads or processes to access a shared data
structure simultaneously without the need for explicit locking. The RCU
technique is commonly used in high-performance computing environments where lock
contention can be a significant bottleneck.

The basic idea behind RCU is to maintain multiple versions of the shared data
structure simultaneously, with each version accessible by a different thread or
process. When a thread wants to read the shared data, it simply accesses the
current version. When a thread wants to modify the shared data, it creates a new
version of the data structure, modifies it, and then updates a global pointer to
indicate that the new version is now the current version.

The RCU technique provides fast read access because readers do not need to
acquire locks or wait for other threads to release locks. Instead, they simply
access the current version of the shared data. The write operations are
serialized using some other synchronization mechanism such as atomic operations
or locks, but the read operations are not blocked by these write operations.

In the read-copy-update technique, a process or thread requesting to modify the
shared data structure can create a copy of the data structure and work on it in
isolation. Other threads that are still using the old version of the data
structure can continue to use it without locking or blocking. The updated data
structure is made available only when the current users are no longer using the
old data structure. This process of sharing old data and allowing read-only
access to it while a copy is modified is called copy-on-write.

RCU is particularly useful for shared data structures that are read frequently
but updated infrequently, or where lock contention is a bottleneck. However, it
requires careful design and implementation to ensure that the different versions
of the shared data are correctly managed and that updates to the data structure
do not result in inconsistencies or race conditions.

## Rust data sharing 

In Rust we can share by using, 
- `Arc` (atomic reference counting) and `Mutex` (mutual exclusion) types.
- Message passing. 
- Combination of both.

Following cases are not exhaustive use cases but shows some common uses.


## Using Mutex
Wrap your data structure in an `Arc<Mutex<T>>`. This will allow multiple threads
to share the data structure and access it safely.
```rust
use std::sync::{Arc, Mutex};

// Define your data structure.
struct MyDataStructure {
    // ...
}

// Wrap it in an Arc<Mutex<T>>.
let shared_data = Arc::new(Mutex::new(MyDataStructure { /* ... */ }));
```

In the gui thread, when you need to modify the data structure, you can acquire a
lock on the `Mutex` using the `lock()` method. This will give you a mutable
reference to the data structure that you can modify.

```rust
let mut data = shared_data.lock().unwrap();
// Modify the data structure as needed.
data.modify_something();
```
In the processing thread, when you need to access the data structure, you can
also acquire a lock on the `Mutex` using the `lock()` method. This will give you
an immutable reference to the data structure that you can safely access.

```rust
let data = shared_data.lock().unwrap();
// Access the data structure as needed.
let value = data.get_something();
```

Note that calling `lock()` on a `Mutex` can block if another thread has already
acquired the lock. To avoid deadlocks, be sure to acquire locks on the `Mutex`
in a consistent order across all threads that access it.

Also, keep in mind that accessing shared data across threads can have
performance implications, especially if the data structure is large and
frequently modified. You may want to consider other strategies such as message
passing to minimize the need for shared mutable state.

## Message passing
Using message passing can be a good way to minimize the need for shared mutable
state, especially for large data structures. Instead of sharing the data
structure directly, you can send messages between threads to communicate changes
to the data.

Here's an example of how you could use message passing to modify a large data
structure between two threads:

Define your data structure and a message type that can be used to modify it.

```rust
// Define your data structure.
struct MyDataStructure {
    // ...
}

// Define a message type that can modify the data structure.
enum Message {
    ModifyDataStructure(Box<dyn FnOnce(&mut MyDataStructure) + Send + 'static>),
}
```
Create a channel for sending messages between the gui and processing threads.

```rust
use std::sync::mpsc::{channel, Sender, Receiver};

// Create a channel for sending messages between threads.
let (sender, receiver): (Sender<Message>, Receiver<Message>) = channel();
```

In the gui thread, when you need to modify the data structure, create a closure
that modifies the data structure and send it as a message to the processing
thread.

```rust
// Create a closure that modifies the data structure.
let modify_data = Box::new(|data: &mut MyDataStructure| {
    // Modify the data structure as needed.
    data.modify_something();
});

// Send the closure as a message to the processing thread.
let message = Message::ModifyDataStructure(modify_data);
sender.send(message).unwrap();
```

In the processing thread, receive messages from the channel and apply them to
the data structure.
```rust 
// Receive messages from the channel and apply them to the data structure.
loop {
    match receiver.recv() {
        Ok(message) => {
            match message {
                Message::ModifyDataStructure(modify_data) => {
                    // Acquire a lock on the data structure and apply the closure.
                    let mut data = shared_data.lock().unwrap();
                    modify_data(&mut data);
                },
            }
        },
        Err(_) => break,
    }
}
```

Note that this example is simplified and doesn't handle errors, such as when
sending or receiving messages fails. Also, keep in mind that message passing can
have performance implications, especially for large data structures or frequent
updates. You may want to consider using a combination of message passing and
shared mutable state, depending on your specific requirements and constraints.


## Combination of message passing and shared mutable state

This can be a good way to balance the need for communication and performance.
You can use message passing to communicate high-level changes (small updates) to
the data structure, and shared mutable state to allow for low-level access
(large updates or initial state) and modification.

Here's an example of how you could use a combination of message passing and
shared mutable state to modify a large data structure between two threads:

Define your data structure and a message type that can be used to modify it.
```rust
// Define your data structure.
struct MyDataStructure {
    // ...
}

// Define a message type that can modify the data structure.
enum Message {
    ModifyDataStructure(Box<dyn FnOnce(&mut MyDataStructure) + Send + 'static>),
}

```

Create a channel for sending messages between the gui and processing threads.

```rust
use std::sync::mpsc::{channel, Sender, Receiver};

// Create a channel for sending messages between threads.
let (sender, receiver): (Sender<Message>, Receiver<Message>) = channel();
```

Wrap your data structure in an `Arc<Mutex<T>>`. This will allow multiple threads
to share the data structure and access it safely.
```rust
use std::sync::{Arc, Mutex};

// Wrap your data structure in an Arc<Mutex<T>>.
let shared_data = Arc::new(Mutex::new(MyDataStructure { /* ... */ }));
```
In the gui thread, when you need to modify the data structure, create a closure
that modifies the data structure and send it as a message to the processing
thread.
```rust
// Create a closure that modifies the data structure.
let modify_data = Box::new(|data: &mut MyDataStructure| {
    // Modify the data structure as needed.
    data.modify_something();
});

// Send the closure as a message to the processing thread.
let message = Message::ModifyDataStructure(modify_data);
sender.send(message).unwrap();
```

In the processing thread, receive messages from the channel and apply them to
the data structure. In addition, you can acquire a lock on the Mutex to allow
for low-level access and modification.
```rust
// Receive messages from the channel and apply them to the data structure.
loop {
    match receiver.recv() {
        Ok(message) => {
            match message {
                Message::ModifyDataStructure(modify_data) => {
                    // Acquire a lock on the data structure and apply the closure.
                    let mut data = shared_data.lock().unwrap();
                    modify_data(&mut data);
                },
            }
        },
        Err(_) => break,
    }
}
```
Note that in the processing thread, you can also access the data structure
outside of the messages by acquiring a lock on the Mutex. This will allow for
low-level access and modification, without the overhead of message passing.

```rust
// Acquire a lock on the data structure for low-level access.
let mut data = shared_data.lock().unwrap();
// Modify the data structure as needed.
data.modify_something_else();
```
Using a combination of message passing and shared mutable state can be a
powerful way to balance the need for communication and performance. Keep in mind
that this approach requires careful synchronization and error handling,
especially when modifying the data structure from multiple threads.


## Read only access
Read access has the possibilities of data races.

If you're only reading the data structure, and you don't care about data race,
then you generally don't need to acquire a lock. Otherwise, if you're accessing
the data structure, even if only for reading, you should use a lock to
synchronize access and prevent data races.


## Locking for both read and write 
Following shows both accesses,

```rust
use std::sync::Arc;
use std::sync::Mutex;

// Wrap your data structure in an Arc<Mutex<T>>.
let shared_data = Arc::new(Mutex::new(MyDataStructure { /* ... */ }));

// In the processing thread, receive messages from the channel and read the data structure.
loop {
    match receiver.recv() {
        Ok(message) => {
            match message {
                Message::GetSample => {
                    // Acquire a lock on the data structure for read-only access.
                    let data = shared_data.lock().unwrap();
                    // Read the data structure as needed.
                    let sample = data.get_sample();
                    // Use the sample in the processing thread.
                    // ...
                },
                Message::ModifyDataStructure(modify_data) => {
                    // Acquire a lock on the data structure and apply the closure.
                    let mut data = shared_data.lock().unwrap();
                    modify_data(&mut data);
                },
            }
        },
        Err(_) => break,
    }
}
```

In this example, the processing thread acquires a lock on the data structure for
read-only access when it receives a message to get a sample, but acquires a lock
for write access when it receives a message to modify the data structure. This
ensures safe access to the data structure from multiple threads.

## Links to materials related to data sharing
* <https://youtu.be/a10JpqI-CvU>
* <https://forum.juce.com/t/timur-doumler-talks-on-c-audio-sharing-data-across-threads/26311/1>
* <https://github.com/hogliux/farbot>
* <https://youtu.be/7fKxIZOyBCE>
* <https://cfsamsonbooks.gitbook.io/explaining-atomics-in-rust/>
* <https://github.com/preshing/junction>
* <https://preshing.com/20160726/using-quiescent-states-to-reclaim-memory/>
* <http://www.cs.toronto.edu/~tomhart/papers/tomhart_thesis.pdf>
* <https://codeandbitters.com/learning-rust-crossbeam-epoch/>
* <https://github.com/ericseppanen/epoch_playground>
* <https://aturon.github.io/blog/2015/08/27/epoch/> most comprehensive explanation
* <https://marabos.nl/atomics/> most comprehensive explanation
