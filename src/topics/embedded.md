---
title: Building Embedded System
---

# {{ page.title }}

There are two build systems that can be used to build images embedded systems using linux.
* [Yocto](https://www.yoctoproject.org/).
* [Buildroot](https://buildroot.org/).

Tool to help the build
* [Using Devtool to Streamline Your Yocto Project Workflow - Tim Orling, Intel](https://youtu.be/CiD7rB35CRE)

## Raspberry pi
The official raspbian o/s is built with Buildroot, but there is also Yocto based builds available,
* [Building 32-bit Raspberry Pi Systems with Yocto](https://jumpnowtek.com/rpi/Raspberry-Pi-Systems-with-Yocto.html).
* [Building 64-bit Systems for Raspberry Pi 4 with Yocto](https://jumpnowtek.com/rpi/Raspberry-Pi-4-64bit-Systems-with-Yocto.html)
* [Building embedded GNU/Linux distribution for Raspberry Pi using the Yocto Project](https://youtu.be/zVLKPtGCtN4).

If you want to switch init system, you can check existing init system by using ``sudo stat /sbin/init``.

## Cross compile raspbian
* [Making a Raspbian Cross Compilation SDK](https://medium.com/@zw3rk/making-a-raspbian-cross-compilation-sdk-830fe56d75ba)
* [Kernel building](https://www.raspberrypi.org/documentation/linux/kernel/building.md).
* [Devicetree on the Raspberry Pi](https://mjoldfield.com/atelier/2017/03/rpi-devicetree.html).

## Yocto with wsl2
* [WSL2 file permission issues cause Buildroot and Yocto build failures](https://github.com/microsoft/WSL/issues/5108).
* [WSL2 ram usage problem workaround](https://github.com/microsoft/WSL/issues/4166#issuecomment-602191299).
* [WSL2 ram usage](https://github.com/microsoft/WSL/issues/4166#issuecomment-609497693).
* [WSL2 ram usage](https://github.com/microsoft/WSL/issues/4166#issuecomment-604707989).
* [WSL2 global options](https://docs.microsoft.com/en-us/windows/wsl/wsl-config#configure-global-options-with-wslconfig).
* [Yocto mega manual](https://www.yoctoproject.org/docs/3.1.1/mega-manual/mega-manual.html)

## wsl2 for cross compile
the default mounts for wsl2 ubuntu ext4 is ``C:\Users\<username>\AppData\Local\Packages\Canonical*\LocalState\ext4.vhdx``.
Often time we require multiple instances to work on separate ext4 mount on a different drive for disk space or other reasons. 

First check the distro name.
```
C:\> wsl -l -v
  NAME            STATE           VERSION
* Ubuntu-20.04    Running         2
```
The distro name is ``Ubuntu-20.04``.

Now we need to set the default user via editing ``/etc/wsl.conf``.
```
[user]
default=<username> 
```

Now we will create another image which is a copy of the ``Ubuntu-20.04``. 

```
PS C:\> wsl --shutdown
PS C:\> wsl -l -v
  NAME            STATE           VERSION
* Ubuntu-20.04    Stopped         2
PS C:\> cd d:\
PS D:\> mkdir my_wsl
PS D:\> cd my_wsl
PS D:\my_wsl> wsl --export Ubuntu-20.04 my_distro.tar
PS D:\my_wsl> wsl --import my_distro my_distro my_distro.tar
PS D:\my_wsl> wsl -l -v
  NAME            STATE           VERSION
* Ubuntu-20.04    Stopped         2
  my_distro       Stopped         2
```

Now we have distro on D drive.

> We can create a VHDX file using windows 10 Computer Management tool. The we can detach it. We have to figure out a way to initialize the file as ext4 and mount
> to a wsl2 linux distro.

## Manually download wsl2 distro
Use [download](https://docs.microsoft.com/en-us/windows/wsl/install-manual) page to get distro. It downloads a .appx file which can be opened by 7zip and extract
``install.tar.gz``.
now we can use wsl command to install it,
```
wsl --import my_distro my_distro install.tar.gz
```

## yocto devtool
* [Yocto Project® devtool Overviewand Hands-On](https://youtu.be/YE2YjP6Fwlo), [slides](https://wiki.yoctoproject.org/wiki/images/f/f3/DD9_Devtool_NA20.pdf).
* [Using Devtool to Streamline Your Yocto Project Workflow - Tim Orling, Intel](https://youtu.be/CiD7rB35CRE).
* [Yocto Project Extensible SDK: Simplifying the Workflow for Application Developers](https://youtu.be/d3xanDJuXRA).
* [Working with the Linux Kernel in the Yocto Project](https://youtu.be/tZACGS5nQxw).

## yocto tutorials
* [Live Coding with Yocto Project](https://www.youtube.com/playlist?list=PLD4M5FoHz-TxMfBFrDKfIS_GLY25Qsfyj).


