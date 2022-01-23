---
title: Rust in Raspberry Pi
---

# {{ page.title }}

## Notes

* <https://github.com/diwic/dbus-rs/blob/master/libdbus-sys/cross_compile.md>
* <https://github.com/diwic/dbus-rs/issues/184#issuecomment-520228758>


## Setup wsl2 for cross compile
First install cross compile toolchain from <https://github.com/kkibria/raspi-toolchain> in wsl2. 
The toolchain install will create a temporary download area, which will contain the Raspbian image file. 
Save the file image file of save the download area as we will need this to install additional
libraries if required.

## Setup wsl2 for rust
Now install rust and setup rust,
```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
. ~/.bashrc
rustc --version
rustup target add arm-unknown-linux-gnueabihf
```
We need to add our build target to ``~/.cargo/config`` by adding the following lines, so that rust knows which linker to use.
```
[build]
# Specifies that the default target is ARM.
target = "arm-unknown-linux-gnueabihf"
rustflags = ["-L", "/lib/arm-linux-gnueabihf"]

[target.arm-unknown-linux-gnueabihf]
linker = "arm-linux-gnueabihf-gcc"

[target.arm-unknown-linux-gnueabihf.dbus]
# Specifies the library search paths. Since they cannot be relative paths,
# we use a build script to provide them.
rustc-link-search = [
    # Provided by the build script.
]

# Specifies the names of the native libraries that are required to build DBus.
rustc-link-lib = [
    "dbus-1",
    "gcrypt",
    "gpg-error",
    "lz4",
    "lzma",
    "pcre",
    "selinux",
    "systemd",
]
```

Now you have a working Rust cross-compilation toolchain set up. Next, we need to configure the DBus crate for cross compilation.

Configuring the DBus crate for cross compilation
The DBus crate uses a build script that uses pkg_config to locate the native dbus libraries. This works well when compiling for the host system, but not when cross compiling. In this case, we have to do what the Cargo book tells us and generate the output of the build script ourselves.

The crate's build script is specified in Cargo.toml and is normally executed at every build. There are two Cargo keys that have to be returned by us:

layout
```
.
├── Cargo.toml
├── build.rs
└── src
    └── main.rs
```

`cargo:rustc-link-search`, which is the library search path.
`cargo:rust-link-lib`, which is the name of a library to link.
There are two ways we can provide these keys to Cargo:

* In a Cargo config file.
* In our own build script.
Usually a Cargo config file should be enough, just specify the names of the libraries and the paths to them and we should be good to go, right? Not so fast. Currently, there is an issue with how Cargo handles relative paths in rustc-link-search: They are resolved relative to the location of the extracted crate, not relative to our project! So we would have to specify the library search paths absolute for the config file to work. Since it is a bit ridiculous to require the repository to be at the same location for each user, we can additionally use another build script to provide the library search paths.

Enough talk, to action! To see how to set up the DBus crate for cross compilation, we create a new project for it. Create an empty directory somewhere and start a terminal in it. Then execute the following commands.

Bash
```
# Initialize a new Rust project in the current folder.
cargo init
```
Change the contents of main.rs to the following. This is just so that we actually use something from the DBus crate, otherwise there would be no reference to it in the final executable and nothing for the linker to do.

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
Create a Cargo configuration file, which has to be in a `.cargo` folder at the root of the repository, that specifies that the default target is ARMv7 and lists all the native ARMv7 libraries that are required to build DBus.

Create the build script that will provide the library search paths. The build script will be named `build.rs` (which is the default) and lives at the root of the project, next to `Cargo.toml`.

`build.rs` (we don't really need this but this one shows if we needed additional search paths)
```
use std::env::var;

fn main() {
    // The manifest dir points to the root of the project containing this file.
    let manifest_dir = var("CARGO_MANIFEST_DIR").unwrap();
    // We tell Cargo that our native ARMv7 libraries are inside a "libraries" folder.
    println!("cargo:rustc-link-search={}/libraries/lib/arm-linux-gnueabihf", manifest_dir);
    println!("cargo:rustc-link-search={}/libraries/usr/lib/arm-linux-gnueabihf", manifest_dir);
}
```

If you tried building the project at this point, you should get a rather long error message with this at the top: linking with arm-linux-gnueabihf-gcc failed. The final (and most tedious) step is finding and downloading the native ARMv7 libraries required by DBus.


## Details on getting libraries
How do you even find out which of the native packages are required? If you take a look at this line in the DBus build script, you see that it is looking for "dbus-1", which means libdbus-1.

OK, now which version of libdbus-1 is required? If you have your target system at hand, you can connect to it and run apt show libdbus-1* on it, which should show something like this.

libdbus-1 Information
```
Package: libdbus-1-3
Version: 1.12.16-1
...
Depends: libc6 (>= 2.28), libsystemd0
...
```
If you do not have the target system at hand, there is still a way: If you are using the Raspbian release based on Debian buster, head to this link (this is a huge file!) and search for Package: libdbus-1 inside there. You should see the same information.

Now we know that we have to download libdbus1-3 version 1.12.16-1 and it depends on libc6 (which is provided by the cross compilation toolchain) and libsystemd0 (which is not and which we also have to download).

In total, you have to download the following packages (the .deb files). This list contains the versions for the Raspbian release based on Debian buster. They may have changed since, check the versions installed on your target system. Click each of the package names below and download the correct file.
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

## Use **libget** to get the required libraries
when you installed the toolchain in wsl2, it also installed ``libget``. This automates everything
we discussed in above section. this will install the libraries in ``~/rootfs``. 
We can add the libraries to our root file system from ~/rootfs using `rsync`
```
pushd ~/rootfs
rsync -vR --progress -rl --delete-after --safe-links {etc,lib,sbin,usr,var} $HOME/rpi/rootfs
popd
```

## Details on links to library for rust
Enter the folder you have extracted the package into and take a look at the files. The folder structure can be ./lib/arm-linux-gnueabihf or even ./usr/lib/arm-linux-gnueabihf inside this folder. The relevant files are the .so files. Some libraries however have another number after the .so, for example library.so.3. In this case, you have to add a symlink to library.so because that's where the GCC linker will look for it. The symlink must be in the same directory as the file it points to. To create a symlink called library.so that points to library.so.3, you would use the following command.

Bash
```
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

## Use **liblink** to make links to library for rust

When you installed the toolchain in wsl2, it also installed ``liblink``. This automates everything
we discussed in above section. This will install the links in ``~/liblink`` folder. 


```
liblink dbus-1 gcrypt gpg-error lz4 pcre lzma pthread dl selinux systemd
```

> ``~/liblink`` is
not inside the rust project folder. As a result, we can simply choose to make
rust use this folder directly for linking. In such case, we will specify 
the absolute path of ``~/liblink``
in `~/.cargo/config` search link section, `rustc-link-search` without 
using `build.rs`.


## Cross compile
Finally, you will be able to cross compile the project without error messages.

Bash
```
cargo build
# Should print something like: Finished dev [unoptimized + debuginfo] target(s) in 0.57s
```

## Note on getting dbus interfaces

> Lot of the followings have been actually updated, check <https://github.com/kkibria/dbus-dev>

the xml files were generated in raspberry pi
```bash
dbus-send --system --dest=fi.w1.wpa_supplicant1 \
  --type=method_call --print-reply=literal /fi/w1/wpa_supplicant1 \
  org.freedesktop.DBus.Introspectable.Introspect > wpa.xml

dbus-send --system --dest=org.freedesktop.timedate1 \
  --type=method_call --print-reply=literal /org/freedesktop/timedate1 \
  org.freedesktop.DBus.Introspectable.Introspect > timedate.xml
```
and copied in the project.

then on wsl we can use the xml files
```bash
dbus-codegen-rust -s -f org.freedesktop.timedate1 < timedate.xml > src/timedate.rs
dbus-codegen-rust -s -f fi.w1.wpa_supplicant1 < wpa.xml > src/wpa.rs
```

alternatively we can use dbus-codegen-rust on pi to generate rust files directly and copy to rust project

put it all together in ``get-pi-rs.sh``
```bash
#assuming RPI is already exported in .bashrc
ssh $RPI 'bash -s' <<-"EOF"
 export PATH=$HOME/.cargo/bin:$PATH
 rm -rf temp-wsl
 mkdir temp-wsl
 pushd temp-wsl
 dbus-codegen-rust -s -d org.freedesktop.timedate1 -p "/org/freedesktop/timedate1" -f org.freedesktop.timedate1 > timedate.rs
 dbus-codegen-rust -s -d fi.w1.wpa_supplicant1 -p "/fi/w1/wpa_supplicant1" -f fi.w1.wpa_supplicant1 > wpa.rs
 popd
EOF
rcp $RPI:temp-wsl/*.rs src
```



<https://android.googlesource.com/platform/external/wpa_supplicant_8/+/master/wpa_supplicant/examples/wpas-dbus-new.py>

