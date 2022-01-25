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
Save the file image file or save the download area. We will need the image to install additional
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
```
Now you have a working Rust cross-compilation toolchain set up.


## rust projects requiring native library
If you are building the native library yourself then you know what you are doing.
However, what if you are using a library that is available from raspbian apt
repository?  

This might be the case for your project, One such example project is building
something that uses dbus. The same technique can be applied on other projects
needing to use native libraries. So we will explore the dbus case.

## Pi Dbus tooling for rust
We need to configure the DBus crate for cross compilation.
The DBus crate uses a build script that uses pkg_config to locate
the native dbus libraries.

`cargo:rustc-link-search`, which is the library search path.
`cargo:rust-link-lib`, which is the name of a library to link.

For, this we need to add Dbus libraries to ``~/.cargo/config``.
```
[target.arm-unknown-linux-gnueabihf.dbus]
# Specifies the library search paths.
rustc-link-search = [
    # we will have to add the path
    # when we know where the libraries are installed.
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
## Use **libget** to get the required libraries
when you installed the toolchain in wsl2, it also installed ``libget``. This automates everything
we need to do and install the libraries in ``~/rootfs``. 

We can add the libraries to our root file system from ~/rootfs using `rsync`
```
pushd ~/rootfs
rsync -vR --progress -rl --delete-after --safe-links {etc,lib,sbin,usr,var} $HOME/rpi/rootfs
popd
```


## Use **liblink** to make links to library for rust

When you installed the toolchain in wsl2, it also installed ``liblink``. This automates everything
we need to do and install the links in ``~/liblink`` folder. 

```
liblink dbus-1 gcrypt gpg-error lz4 pcre lzma pthread dl selinux systemd
```

## Add the library search path for dbus libraries
``~/liblink`` we created is
not inside the rust project folder. Therefore, we can simply make
rust use this folder for linking. In such case, we will specify 
the absolute path of ``~/liblink``
in `~/.cargo/config` search link section, `rustc-link-search`.

``~/.cargo/config``.
```
[target.arm-unknown-linux-gnueabihf.dbus]
# Specifies the library search paths.
rustc-link-search = [
    # absolute path of ~/liblink
    /home/username/liblink
]
```
