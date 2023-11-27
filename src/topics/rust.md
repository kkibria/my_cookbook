---
title: Rust language
---
# {{ page.title }}

## Learning rust
* [The rust book](https://doc.rust-lang.org/book/). Expand the TOC by pressing the menu icon on the top left of the page.
* [The Rust Lang Book](https://www.youtube.com/playlist?list=PLai5B987bZ9CoVR-QEIN9foz4QCJ0H2Y8).
I like this video series, watch along with the rust book.
* [Rust: A Language for the Next 40 Years - Carol Nichols](https://youtu.be/A3AdN7U24iU).
* [Rust Out Your C by Carol](https://youtu.be/SKGVItFlK3w). The [Slides](https://github.com/carols10cents/rust-out-your-c-talk).
* [Stanford Seminar The Rust Programming Language - The Best Documentary Ever](https://youtu.be/SZvs15hC81U)
* [Traits and You: A Deep Dive — Nell Shamrell-Harrington](https://youtu.be/grU-4u0Okto).
* [Let's Learn Rust: Structs and Traits](https://youtu.be/LKYSl7kM5q8)
* <https://tourofrust.com>
* An excellent article <https://fasterthanli.me/articles/a-half-hour-to-learn-rust>

## rust libraries
* <https://crates.io/>

## desktop app with rust
* <https://tauri.studio>
Most practical application pattern is what they call lockdown pattern (event api) added with rust command api. Uses webview2 for windows.
* <https://tauri.studio/en/docs/guides/command>
* <https://tauri.studio/en/docs/guides/events>
* GUI <https://github.com/vizia/vizia>

## creating books
* <https://github.com/rust-lang/mdBook>

## Using rust in Raspberry pi
* [How to Get Started With Rust on Raspberry Pi](https://www.makeuseof.com/tag/getting-started-rust-raspberry-pi/)
* [Program the real world using Rust on Raspberry Pi](https://opensource.com/article/19/3/physical-computing-rust-raspberry-pi)
* [Cross compiling Rust for Raspberry Pi](https://dev.to/h_ajsf/cross-compiling-rust-for-raspberry-pi-4iai)
* [Cross Compiling Rust for the Raspberry Pi](https://chacin.dev/blog/cross-compiling-rust-for-the-raspberry-pi/)
* [Anyone using Rust on a PI?](https://www.raspberrypi.org/forums/viewtopic.php?t=233928)
* [Learn to write an embedded OS in Rust](https://docs.rust-embedded.org/book/), [github](https://github.com/rust-embedded), [tutorials](https://github.com/rust-embedded/rust-raspberrypi-OS-tutorials).
* [Prebuilt Windows Toolchain for Raspberry Pi](https://gnutoolchains.com/raspberry/). Question: who are these people? Where are the sources for these tools?
* [Cross compiling Rust for ARM (e.g. Raspberry Pi) using any OS!](https://medium.com/@wizofe/cross-compiling-rust-for-arm-e-g-raspberry-pi-using-any-os-11711ebfc52b)
* [“Zero setup” cross compilation and “cross testing” of Rust crates](https://github.com/rust-embedded/cross)
* [Vagrant, Virtual machine for cross development](https://www.vagrantup.com/). I really like this setup, easy to use. Plays well with virtualbox.
* <https://github.com/kunerd/clerk/wiki/How-to-use-HD44780-LCD-from-Rust#setting-up-the-cross-toolchain>
* <https://opensource.com/article/19/3/physical-computing-rust-raspberry-pi>
* <https://github.com/japaric/rust-cross>

## rust GPIO for pi
* May be a kernel module with rust?? Some [work](rust#Linux-kernel-module-with-rust) is ongoing.
* [RPPAL](https://github.com/golemparts/rppal).
* <https://github.com/rust-embedded/rust-sysfs-gpio>.

Most promising seems to be [RPPAL](https://github.com/golemparts/rppal) option.
> I will try this option and do the write up on this.

## Cross compiling rust on ubuntu

Compiling rust on pi will take for ever, cross compiling will save development time. We will use ubuntu for cross compile.

If we are on a windows machine, WSL2 also is a good way to develop for raspberry. check [WSL 2: Getting started](https://www.youtube.com/watch?v=_fntjriRe48). Go ahead install ubuntu to run with WSL2.

Primary problem with cross compiling rust for pi zero is that zero is armv6 but other pis are armv7. At the time of this writing, gcc toolchain only has support for armv7. armv6 compile also produces armv7 image. So the toolchain needs to be installed from pi official tool repo from github which has armv6 support. See more in the following links,

* <https://github.com/rust-embedded/cross/issues/426>
* <https://github.com/japaric/rust-cross/issues/42>
* <https://hub.docker.com/r/mdirkse/rust_armv6>

Using this strategy we will go ahead and setup wsl2 linux detailed in [Rust in Raspberry Pi](pirust).


### QEMU for library dependencies
* [Debootstrap](http://linux-sunxi.org/Debootstrap)
* [Introduction to qemu-debootstrap](http://logan.tw/posts/2017/01/21/introduction-to-qemu-debootstrap/).
* <https://headmelted.com/using-qemu-to-produce-debian-filesystems-for-multiple-architectures-280df41d28eb>.
* [Kernel Recipes 2015 - Speed up your kernel development cycle with QEMU - Stefan Hajnoczi](https://youtu.be/PBY9l97-lto).
* [Debootstrap #1 Creating a Filesystem for Debian install Linux tutorial](https://youtu.be/L_r3z3402do).
* [Creating Ubuntu and Debian container base images, the old and simple way](https://youtu.be/OLFH4Ov6bJQ).
* [Raspberry Pi Emulator for Windows 10 Full Setup Tutorial and Speed Optimization](https://youtu.be/xiQX0YXYuqU).
* [RASPBERRY PI ON QEMU](https://azeria-labs.com/emulate-raspberry-pi-with-qemu/).

## Linux kernel module with rust
* <https://github.com/fishinabarrel/linux-kernel-module-rust>

## rust-wasm
* <https://rustwasm.github.io/>
* [book](https://rustwasm.github.io/docs/book/)
* [Rust in the Browser for JavaScripters: New Frontiers, New Possibilities](https://youtu.be/ohuTy8MmbLc)


## java to rust
* [java to rust](https://github.com/aschoerk/converter-page)
* [online converter](https://jrconverter.appspot.com/index.jsp)

## python to rust
* [Converting a Python library to Rust](https://alantrick.ca/writings/programming/python_to_rust). [Python](https://gitlab.com/alantrick/august-python-old/) and [Rust](https://gitlab.com/alantrick/august/).
* [Transpiling Python to Rust](https://medium.com/@konchunas/transpiling-python-to-rust-766459b6ab8f), [github](https://github.com/konchunas/pyrs).

# using dbus in rust
* <https://github.com/diwic/dbus-rs> dbus crate.
* <https://github.com/diwic/dbus-rs/issues/214> Simple dbus-codegen example.
* <https://github.com/deifactor/ninomiya>
* <https://github.com/diwic/dbus-rs/blob/master/dbus-codegen/examples/adv_server_codegen.rs> server example.
* <https://github.com/diwic/dbus-rs/blob/master/dbus/examples/match_signal.rs> client example using dbus-codegen-rust.
* <https://github.com/kkibria/rustdbuscross>

```
pi dbus
$ dpkg -l | grep dbus
ii  dbus                1.12.16-1 armhf  simple  interprocess messaging system (daemon and utilities)
ii  libdbus-1-3:armhf   1.12.16-1 armhf  simple  interprocess messaging system (library)
ii  libdbus-1-dev:armhf 1.12.16-1 armhf  simple  interprocess messaging system (development headers)
ii  python-dbus         1.2.8-3   armhf  simple  interprocess messaging system (Python interface)
ii  python3-dbus        1.2.8-3   armhf  simple  interprocess messaging system (Python 3 interface)
```
## install dbus-codegen-rust
following will install dbus-codegen-rust CLI.
```bash
cargo install dbus-codegen
```

There are two possibilities
* Write server and client.
* Write client for an exiting installed server.

## Client for an exiting server
example of generated code,
```
dbus-codegen-rust -s -d org.freedesktop.timedate1 -p /org/freedesktop/timedate1 -o src/timedate.rs -i org.freedesktop
```
which will put the code in ``src`` folder.

## cross compile dbus
* <https://github.com/diwic/dbus-rs/blob/master/libdbus-sys/cross_compile.md>
* <https://serverfault.com/questions/892465/starting-systemd-services-sharing-a-session-d-bus-on-headless-system> headless dbus.
* <https://raspberrypi.stackexchange.com/questions/114739/how-to-install-pi-libraries-to-cross-compile-for-pi-zero-in-wsl2>.


The following script downloads and cross-compiles D-Bus and Expat for Raspberry Pi zero: 
```sh
#!/usr/bin/env bash

set -ex

# Clone the D-bus and Expat libraries
[ -d dbus ] || \
    git clone --branch dbus-1.13.18 --single-branch --depth=1 \
        https://gitlab.freedesktop.org/dbus/dbus.git

[ -d libexpat ] || \
    git clone --branch R_2_2_9 --single-branch --depth=1 \
    https://github.com/libexpat/libexpat.git

# Script for building these libraries:
cat << 'EOF' > build-script-docker.sh
#!/usr/bin/env bash

set -ex
cd "$(dirname "${BASH_SOURCE[0]}")"

# Point pkg-config to the sysroot:
. cross-pkg-config

# Directory to install the packages to:
export RPI_STAGING="$PWD/staging"
rm -rf "${RPI_STAGING}"

# libexpat
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

pushd libexpat/expat
./buildconf.sh
mkdir -p build
pushd build
../configure \
    --prefix="/usr/local" \
    --host="${HOST_TRIPLE}" \
    --with-sysroot="${RPI_SYSROOT}"
make -j$(nproc)
make install DESTDIR="${RPI_SYSROOT}"
make install DESTDIR="${RPI_STAGING}"
popd
popd

# dbus
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

pushd dbus
mkdir -p build
pushd build
cmake .. \
    -DCMAKE_TOOLCHAIN_FILE="$HOME/${HOST_TRIPLE}.cmake" \
    -DCMAKE_BUILD_TYPE="Release" \
    -DCMAKE_INSTALL_PREFIX="/usr/local"
make -j$(nproc)
make install DESTDIR="${RPI_SYSROOT}"
make install DESTDIR="${RPI_STAGING}"
popd
popd
EOF

# Start the Docker container with the toolchain and run the build script:
image="tttapa/rpi-cross:armv6-rpi-linux-gnueabihf-dev"
docker run --rm -it -v "$PWD:/tmp/workdir" $image \
    bash "/tmp/workdir/build-script-docker.sh"

```
You'll need to have Docker installed. When finished, the libraries will be in the `staging` folder in the working directory.

The Docker container with the toolchain is one I maintain (https://github.com/tttapa/RPi-Cpp-Toolchain), but the installation process should be similar with the toolchain you're using, you'll just have to install some extra dependencies such as make, autotools, and maybe cross-compile some other dependencies of Expat and D-Bus as well.  
I also maintain some notes with instructions of the toolchains and cross-compilation processes, which you might find useful: https://tttapa.github.io/Pages/Raspberry-Pi/C++-Development/index.html

You might want to add some extra options to the configure and cmake steps, but that's outside of the scope of this answer, see the relevant D-Bus documentation.  
Also note that installs both libraries to both the sysroot and the staging area, it'll depend on what you want to do with it. You have to install at least `libexpat` to the `${RPI_SYSROOT}` folder, because that's the folder used as the sysroot for compiling `dbus` which depends on `libexpat`. The sysroot folder for the compilation of `dbus` is selected in the CMake Toolchain file, `~/${HOST_TRIPLE}.cmake`, it's included with the Docker container. Its contents are:
```cmake
SET(CMAKE_SYSTEM_NAME Linux)
SET(CMAKE_C_COMPILER armv6-rpi-linux-gnueabihf-gcc)
SET(CMAKE_CXX_COMPILER armv6-rpi-linux-gnueabihf-g++)
SET(CMAKE_SYSTEM_PROCESSOR armv6)

set(CMAKE_SYSROOT $ENV{RPI_SYSROOT})
SET(CMAKE_FIND_ROOT_PATH ${CMAKE_SYSROOT}) 

set(CMAKE_FIND_ROOT_PATH_MODE_PROGRAM NEVER)
set(CMAKE_FIND_ROOT_PATH_MODE_LIBRARY ONLY)
set(CMAKE_FIND_ROOT_PATH_MODE_INCLUDE ONLY)
set(CMAKE_FIND_ROOT_PATH_MODE_PACKAGE ONLY)
```
You might also have to point `pkg-config` to the right sysroot folder. This is handled by the `cross-pkg-config` script:
```sh
export PKG_CONFIG_LIBDIR="${RPI_SYSROOT}/usr/local/lib:${RPI_SYSROOT}/opt/vc/lib"
export PKG_CONFIG_PATH="${RPI_SYSROOT}/usr/local/lib/pkgconfig:${RPI_SYSROOT}/usr/local/share/pkgconfig:${RPI_SYSROOT}/opt/vc/lib/pkgconfig"
export PKG_CONFIG_SYSROOT_DIR="${RPI_SYSROOT}"
```



## Rust Qt binding
* <https://youtu.be/McgwDB13igo>, github <https://github.com/KDE/rust-qt-binding-generator>



## using rust with vscode in windows
If you are using powershell in vscode, the path might not pickup rust compiler.
Read [Powershell setup](vscode#powershell-setup) for vscode for more information.

Place `.psrc.ps1` file at the root of the project folder with following, which is the default
path of rust install.
```
$env:Path += ";$profile/.cargo/bin"
```
If you installed rust to a custom path, use that path instead.

### Videos to watch:
* [IDE Setup For Rust Development](https://youtu.be/x_iZEK6Rww4)
* [Getting Started with Rust on Windows and Visual Studio Code](https://youtu.be/aYsUBddY7KY)

## debugging rust with vscode in windows
* <https://www.brycevandyk.com/debug-rust-on-windows-with-visual-studio-code-and-the-msvc-debugger/>


## Server
* <https://crates.io/crates/rust-embed> embeds static file in the server binary.
* <https://crates.io/crates/live-server> live reload enabled server. Embeds livereload websocket code
into html files on the fly when serving.
* <https://crates.io/crates/tide> a web server with support for middleware.

## creative content framework
* <https://nannou.cc/>

## Ide design 
* <https://github.com/makepad/makepad>

## rust drawing app
* <https://github.com/GraphiteEditor/Graphite>