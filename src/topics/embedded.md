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


## Working with dbus

### How do I get properties using dbus

I have listed the properties that I am interested in using ``timedatectl`` which uses ``systemd`` dbus,
```
$ timedatectl
               Local time: Tue 2020-07-28 19:37:00 PDT
           Universal time: Wed 2020-07-29 02:37:00 UTC
                 RTC time: n/a
                Time zone: America/Los_Angeles (PDT, -0700)
System clock synchronized: yes
              NTP service: active
          RTC in local TZ: no
```

Next, I checked ``timedatectl.c`` in ``systemd`` [source code](https://github.com/systemd/systemd) to get bus endpoint and method using which I went ahead and introspected,
  
```
$ dbus-send --system --dest=org.freedesktop.timedate1 --type=method_call --print-reply /org/freedesktop/timedate1 org.freedesktop.DBus.Introspectable.Introspect

method return time=1595997538.869702 sender=:1.30 -> destination=:1.29 serial=3 reply_serial=2
   string "<!DOCTYPE node PUBLIC "-//freedesktop//DTD D-BUS Object Introspection 1.0//EN"
"http://www.freedesktop.org/standards/dbus/1.0/introspect.dtd">
<node>
 ...
 <interface name="org.freedesktop.DBus.Properties">
  ...
  <method name="GetAll">
   <arg name="interface" direction="in" type="s"/>
   <arg name="properties" direction="out" type="a{sv}"/>
  </method>
  ... 
 </interface>
 <interface name="org.freedesktop.timedate1">
  <property name="Timezone" type="s" access="read">
  </property>
  <property name="LocalRTC" type="b" access="read">
  </property>
  ...
 </interface>
</node>
"
```
Next I tried to use the method ``GetAll``,
```
$ dbus-send --system --dest=org.freedesktop.timedate1 --type=method_call --print-reply /org/freedesktop/timedate1 org.freedesktop.DBus.Properties.GetAll string:org.freedesktop.timedate1

method return time=1595997688.111555 sender=:1.33 -> destination=:1.32 serial=4 reply_serial=2
   array [
      dict entry(
         string "Timezone"
         variant             string "America/Los_Angeles"
      )
      dict entry(
         string "LocalRTC"
         variant             boolean false
      )
      dict entry(
         string "CanNTP"
         variant             boolean true
      )
      dict entry(
         string "NTP"
         variant             boolean true
      )
      dict entry(
         string "NTPSynchronized"
         variant             boolean true
      )
      dict entry(
         string "TimeUSec"
         variant             uint64 1595997688110070
      )
      dict entry(
         string "RTCTimeUSec"
         variant             uint64 0
      )
   ]
```
and we get our desired result same as ``timedatectl``.