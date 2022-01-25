---
title: Native library for Rust in Raspberry Pi
---

# {{ page.title }}

We will look into problems that we face in getting native library for cross compiling
rust for pi here. This will clear your understanding of how the wsl cross compile tool
helps us dealing with those. As we mentioned before dbus based project will be a good
case study to shed light
into rust cross compiling issues related to using native library in raspberry pi. 

## A simple dbus project for testing 

To see how to set up the DBus crate for cross compilation,
we will create a new project for it. Create an empty directory somewhere
run the following,

Bash
```
# Initialize a new Rust project in the current folder.
cargo init
```

this produces following layout
```
.
├── Cargo.toml
├── build.rs
└── src
    └── main.rs
```

The crate's build script is specified in Cargo.toml and is normally executed at every build.

Change the contents of main.rs to the following. This is just so that we actually use something
from the DBus crate, otherwise there would be no reference to it in the final executable and nothing for the linker to do.

`main.rs`
```
use dbus::{BusType, Connection, Interface, Member};
use std::error::Error;

fn main() -> Result<(), Box<dyn Error>> {
    let conn = Connection::get_private(BusType::System)?;
    let obj = conn.with_path("org.freedesktop.DBus", "/", 5000);
    let msg = obj.method_call_with_args(
        &Interface::from(&"org.freedesktop.DBus".to_owned()),
        &Member::from(&"ListNames".to_owned()),
        |_| (),
    )?;
    let names: Vec<String> = msg.get1().unwrap_or(Vec::new());
    for name in names {
        println!("{}", name);
    }
    Ok(())
}
```
Next, add the DBus crate as an dependency by editing Cargo.toml.

Cargo.toml
```
[dependencies]
dbus = "0.6"
```

If you try building the project at this point, you will an error
message indicating linking failure. We have to find find and download
the native arm libraries required by DBus.

## Problem statement 1: Details on getting missing libraries 
How do you even find out which of the native packages are required?
If you take a look at this line in the DBus build script, you see that 
it is looking for "dbus-1", which means libdbus-1.

OK, now which version of libdbus-1 is required? If you have your target system at hand,
you can connect to it and run apt show libdbus-1* on it, which should show something like this.

libdbus-1 Information
```
Package: libdbus-1-3
Version: 1.12.16-1
...
Depends: libc6 (>= 2.28), libsystemd0
...
```
If you do not have the target system at hand, there is still a way:
If you are using the Raspbian release based on Debian buster, head to
this link (this is a huge file!) and search for Package: libdbus-1 inside there.
You should see the same information.

Now we know that we have to download libdbus1-3 version 1.12.16-1 and it
depends on libc6 (which is provided by the cross compilation toolchain)
and libsystemd0 (which is not and which we also have to download).

In total, you have to download the following packages (the .deb files).
This list contains the versions for the Raspbian release based on Debian buster.
They may have changed since, check the versions installed on your target system.
Click each of the package names below and download the correct file.

```
libdbus-1-3 is at version 1.12.16-1
libgcrypt20 is at version 1.8.4-5
libgpg-error0 is at version 1.35-1
liblz4-1 is at version 1.8.3-1
liblzma5 is at version 5.2.4-1
libpcre3 is at version 2:8.39-12
libselinux1 is at version 2.8-1+b1
libsystemd0 is at version 241-5+rpi1
```
Next, you have to extract each of these downloaded .deb files separately into an empty folder.

Bash
```
dpkg-deb -x /path/to/package.deb /path/to/empty/folder
```

**Solution: See [Use **libget** to get the required libraries](pirust.md#use-libget-to-get-the-required-libraries)**.

## Problem statement 2: Links to library for rust
Enter the folder you have extracted the package into and take a look at the files.
The folder structure can be ./lib/arm-linux-gnueabihf or even 
./usr/lib/arm-linux-gnueabihf inside this folder. 
The relevant files are the .so files. Some libraries however have another 
number after the .so, for example library.so.3. In this case, you have to add 
a symlink to library.so because that's where the GCC linker will look for it. 
The symlink must be in the same directory as the file it points to. 
To create a symlink called library.so that points to library.so.3, 
you would use the following command.

```bash
ln -s library.so.3 library.so
```

in our case,
for dbus, we will create links
```
pushd /lib/arm-linux-gnueabihf
ln -sf libdbus-1.so.3 libdbus-1.so
ln -sf libgcrypt.so.20 libgcrypt.so
ln -sf libgpg-error.so.0 libgpg-error.so
ln -sf liblz4.so.1 liblz4.so
ln -sf libpcre.so.3 libpcre.so
ln -sf liblzma.so.5 liblzma.so
ln -sf libpthread.so.0 libpthread.so
ln -sf libdl.so.2 libdl.so
ln -sf libselinux.so.1 libselinux.so
ln -sf libsystemd.so.0 libsystemd.so
popd
```

Then take all the contents of the folder you extracted the package into and move them into another folder called libraries, which you create at the root of your Rust project. This is the location we directed the GCC linker to look for the libraries.

Repeat the extraction, symlinking and moving for all the other libraries.

Finally, after all this is done, your libraries folder should look something like this (the version numbers may differ):
```
./lib/arm-linux-gnueabihf/libdbus-1.so
./lib/arm-linux-gnueabihf/libdbus-1.so.3
./lib/arm-linux-gnueabihf/libdbus-1.so.3.14.15
./lib/arm-linux-gnueabihf/libgcrypt.so
...
./usr/lib/arm-linux-gnueabihf/liblz4.so
./usr/lib/arm-linux-gnueabihf/liblz4.so.1
...
```

**Solution: See [Use **liblink** to make links to library for rust](pirust.md#use-liblink-to-make-links-to-library-for-rust)**.

## Problem statement 3: Specifying library search path
We have to provide the `cargo:rustc-link-search` key to
make sure all the needed libraries are found. 

There are two ways we can provide any key to Cargo:
* In a Cargo config file.
* In our own build script.

We need to know how Cargo handles relative paths
in rustc-link-search:
They are resolved relative to the location of the extracted crate,
not relative to a project.

So the takeaway is, we would have to specify the absolute library search paths if we
don't want a crate relative path. How do we provide project relative search path
if thats what we need? 
In such case, we can use build script
to convert project relative paths to absolute library search paths.

Following is an example when we have native libraries 
inside a "libraries" folder within the project,
`build.rs`
```
use std::env::var;

fn main() {
    // The manifest dir points to the root of the project containing this file.
    let manifest_dir = var("CARGO_MANIFEST_DIR").unwrap();
    // We tell Cargo that our native libraries are inside a "libraries" folder.
    println!("cargo:rustc-link-search={}/libraries/lib/arm-linux-gnueabihf", manifest_dir);
    println!("cargo:rustc-link-search={}/libraries/usr/lib/arm-linux-gnueabihf", manifest_dir);
}
```

Anyways, installing dbus crate libraries in a fixed location is what we need
in this case to keep thing simple and reusable.
This way we can simply use an absolute path in `~/.cargo/config`.

**Solution: See [Add the library search path for dbus libraries](pirust.md#add-the-library-search-path-for-dbus-libraries)**.

## Cross compile
Finally, you will be able to cross compile the test project without error messages.

Bash
```
cargo build
#    Should print something like: 
# Finished dev [unoptimized + debuginfo] target(s) in 0.57s
```

