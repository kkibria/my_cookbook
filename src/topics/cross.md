---
title: Cross Compilation
---
# {{ page.title }}

## cross compile
[Anatomy of Cross-Compilation Toolchains](https://youtu.be/Pbt330zuNPc). The [slides](https://elinux.org/images/1/15/Anatomy_of_Cross-Compilation_Toolchains.pdf).

## Using rust in Raspberry pi
* [Cross Compiling Rust for the Raspberry Pi](https://chacin.dev/blog/cross-compiling-rust-for-the-raspberry-pi/)
* [Prebuilt Windows Toolchain for Raspberry Pi](https://gnutoolchains.com/raspberry/). Question: who are these people? where are the sources fro these tools?
* [Cross compiling Rust for ARM (e.g. Raspberry Pi) using any OS!](https://medium.com/@wizofe/cross-compiling-rust-for-arm-e-g-raspberry-pi-using-any-os-11711ebfc52b)
* [“Zero setup” cross compilation and “cross testing” of Rust crates](https://github.com/rust-embedded/cross)
* [Vagrant, Virtual machine for cross development](https://www.vagrantup.com/). I really like this setup, easy to use. Plays well with virtualbox.
* <https://github.com/kunerd/clerk/wiki/How-to-use-HD44780-LCD-from-Rust#setting-up-the-cross-toolchain>
* <https://opensource.com/article/19/3/physical-computing-rust-raspberry-pi>
* <https://github.com/japaric/rust-cross>
* [RPi-GCC-cross-compiler](https://gist.github.com/sol-prog/94b2ba84559975c76111afe6a0499814)


### QEMU for library dependencies
* [Debootstrap](http://linux-sunxi.org/Debootstrap)
* [Introduction to qemu-debootstrap](http://logan.tw/posts/2017/01/21/introduction-to-qemu-debootstrap/).
* <https://headmelted.com/using-qemu-to-produce-debian-filesystems-for-multiple-architectures-280df41d28eb>.
* [Kernel Recipes 2015 - Speed up your kernel development cycle with QEMU - Stefan Hajnoczi](https://youtu.be/PBY9l97-lto).
* [Debootstrap #1 Creating a Filesystem for Debian install Linux tutorial](https://youtu.be/L_r3z3402do).
* [Creating Ubuntu and Debian container base images, the old and simple way](https://youtu.be/OLFH4Ov6bJQ).
* [Raspberry Pi Emulator for Windows 10 Full Setup Tutorial and Speed Optimization](https://youtu.be/xiQX0YXYuqU).
* [RASPBERRY PI ON QEMU](https://azeria-labs.com/emulate-raspberry-pi-with-qemu/).
* [Run Raspberry Pi Zero W image in qemu](https://stackoverflow.com/questions/60127086/run-raspberry-pi-zero-w-image-in-qemu), github [source](https://github.com/igwtech/qemu).
* [How to set up QEMU 3.0 on Ubuntu 18.04](https://www.reddit.com/r/VFIO/comments/9pi2cd/how_to_set_up_qemu_30_on_ubuntu_1804/).


## building qemu from raspberri pi zero in wsl2 ubuntu
It is best if you make a directory somewhere in windows for the sources. Using powershell to keep wsl2 VHD files small,
```bash
cd c:\Users\<user_name>\Documents
mkdir qemu-build
```
Start ubuntu wsl2 instance. Now using shell, 
```bash
cd ~/<some_dir>
mkdir qemu-build
sudo mount --bind "/mnt/c/Users/<user_name>/Documents/qemu-build" qemu-build
cd qemu-build
```
This is where we will build qemu for raspberry pi zero.

Get qemu sources and dependencies,
```bash
git clone https://github.com/igwtech/qemu
# do followings only if you need to modify submodule sources
# git submodule init
# git submodule update --recursive
```
We are using a forked qemu source above because the official qemu repo doesn't provide support for raspberry pi zero. Feel free to diff the code with tags from original source, which will provide valuable insight to adding another arm processor support.

Activate source repositories by un-commenting the ``deb-src`` lines in ``/etc/apt/sources.list``.

Get qemu dependencies,
```bash
sudo apt-get update
sudo apt-get build-dep qemu
```

Create a build directory
```bash
mkdir build
cd build
```

Configure qemu to build all qemu binaries,
```bash
../qemu/configure
```

Otherwise if you already have installed all the binaries, or only interested in ``qemu-arm`` and ``qemu-system-arm``,
this configures to build just those,
```bash
../qemu/configure --target-list=arm-softmmu,arm-linux-user
```
To find all the configuration options, run ``configure --help``.

Build and install qemu,
```bash
make
sudo make install
```

Now we can remove the mount,
```bash
cd ../..
sudo umount qemu-build
``` 

You can remove the build directory ``qemu-build\build`` if you like, or keep it for later development. 

Run qemu for raspi0,
```bash
qemu-system-arm -machine raspi0 -serial stdio  -dtb bcm2708-rpi-zero-w.dtb -kernel kernel.img -append 'printk.time=0 earlycon=pl011,0x20201000 console=ttyAMA0'
```

qemu-kvm has problems in wsl2, currently it does not work properly.

## Raspbian apt sources
``/etc/apt/sources.list``,
```
deb http://raspbian.raspberrypi.org/raspbian/ buster main contrib non-free rpi
# Uncomment line below then 'apt-get update' to enable 'apt-get source'
#deb-src http://raspbian.raspberrypi.org/raspbian/ buster main contrib non-free rpi
```

``/etc/apt/sources.list.d/raspi.list``,
```
deb http://archive.raspberrypi.org/debian/ buster main
# Uncomment line below then 'apt-get update' to enable 'apt-get source'
#deb-src http://archive.raspberrypi.org/debian/ buster main
```

## install the cross compiler
check <https://github.com/Pro/raspi-toolchain> to use their prebuilt toolchain in wsl2
```
# Download the toolchain:
wget https://github.com/Pro/raspi-toolchain/releases/latest/download/raspi-toolchain.tar.gz
# The toolchain has to be in /opt/cross-pi-gcc since it's not location independent.
sudo tar xfz raspi-toolchain.tar.gz --strip-components=1 -C /opt
```

## raspbian filesystem

``/etc/fstab``,
```
proc            /proc           proc    defaults          0       0
PARTUUID=288695f5-01  /boot           vfat    defaults          0       2
PARTUUID=288695f5-02  /               ext4    defaults,noatime  0       1
# a swapfile is not a swap partition, no line here
#   use  dphys-swapfile swap[on|off]  for that
```

``pi-sd-2/etc/ld.so.preload``,
```
/usr/lib/arm-linux-gnueabihf/libarmmem-${PLATFORM}.so
```

### Installing library dependencies in a image
If there is a dependency on additional libraries, we should install those
in the raspberry pi SD. Then we can save an image of the SD using ``Win32DiskImage``
in a ``.img`` file. Now we can mount the image and copy the
necessary libraries to the toolchain sysroot we installed earlier.

```bash
$ fdisk -lu /mnt/d/pi_images/pi-sd.img
Disk /mnt/d/pi_images/pi-sd.img: 28.97 GiB, 31086084096 bytes, 60715008 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0x288695f5

Device                      Boot  Start      End  Sectors  Size Id Type
/mnt/d/pi_images/pi-sd.img1        8192   532479   524288  256M  c W95 FAT32 (LBA)
/mnt/d/pi_images/pi-sd.img2      532480 60715007 60182528 28.7G 83 Linux
```

The ``fat32`` partition is the first one. The offset is 8192\*512=4194304 and
size is 524288\*512=268435456 in bytes.

The ``ext4`` partition is the second one. The offset is 512\*532480=272629760 and size is 512\*60182528=30813454336 in bytes.

Now you can mount them,
```bash
mkdir /home/pi/pi-sd-1
mkdir /home/pi/pi-sd-2

mount -o loop,offset=4194304,sizelimit=268435456 /mnt/d/pi-images/pi-sd.img /home/pi/pi-sd-1
mount -o loop,offset=272629760 /mnt/d/pi_images/pi-sd.img /home/pi/pi-sd-2

ls -la /home/pi/pi-sd-1
ls -la /home/pi/pi-sd-2
```
There is no need to specify size for the last partition.
At this point we can edit the image to get it ready for emulation. 

to cross compile copy all libraries
```
rsync -vR --progress -rl --delete-after --safe-links /home/pi/pi-sd-2/{lib,usr,etc/ld.so.conf.d,opt/vc/lib} $HOME/rpi/rootfs
```

(TODO)
Now you can copy appropriate libraries to 
``/opt/rpi_tools/arm-bcm2708/arm-linux-gnueabihf/arm-linux-gnueabihf/sysroot``.

## cross compile dbus
* <https://github.com/diwic/dbus-rs/blob/master/libdbus-sys/cross_compile.md>
* <https://serverfault.com/questions/892465/starting-systemd-services-sharing-a-session-d-bus-on-headless-system> headless dbus.
* <https://raspberrypi.stackexchange.com/questions/114739/how-to-install-pi-libraries-to-cross-compile-for-pi-zero-in-wsl2>.
* <https://airtower.wordpress.com/2010/07/20/using-gvariant-tuples/>
* <https://fosdem.org/2020/schedule/event/rust_dbus_library/>

## qemu rpi kernel (TODO)

* <https://github.com/dhruvvyas90/qemu-rpi-kernel> this claims some adjustment on rpi kernel for qemu need to investigate what this adjustment is and is it  relevant any more.

## disk images
* [Create blank disk image for file storage](https://askubuntu.com/questions/667291/create-blank-disk-image-for-file-storage)
* [Can I expand the size of a file based disk image?](https://superuser.com/questions/693158/can-i-expand-the-size-of-a-file-based-disk-image/693162)

## utilities
* [Raspberry-Pi Utilities](https://github.com/johnlane/rpi-utils).
A very nice place to learn how to chroot and get emulation going.


## compiling for windows in linux
* <https://swarminglogic.com/article/2014_11_crosscompile>
* <https://mxe.cc/>


some ideas.....

build LFS using the scheme in <https://github.com/LeeKyuHyuk/PiCLFS> but change the compiler using scheme in <https://github.com/Pro/raspi-toolchain> 

build missing libraries
