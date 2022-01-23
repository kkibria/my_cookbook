---
title: Ubuntu
---

# {{ page.title }}

## Debugging kernel or system program crash

* [Beginning Kernel Crash Debugging on Ubuntu 18.10](https://ruffell.nz/programming/writeups/2019/02/22/beginning-kernel-crash-debugging-on-ubuntu-18-10.html).
* [Kernel panic - not syncing: Attempted to kill init!](https://askubuntu.com/questions/92946/cannot-boot-because-kernel-panic-not-syncing-attempted-to-kill-init).
* Regarding Annoying crash report- [How To Fix System Program Problem Detected In Ubuntu](https://itsfoss.com/how-to-fix-system-program-problem-detected-ubuntu/).

## File system check

The simplest way to force ``fsck`` filesystem check on a root partition
eg. ``/dev/sda1`` is to create an empty file called forcefsck in the 
partition's root directory.

```bash
sudo touch /forcefsck
```

This empty file will temporarily override any other settings and force 
``fsck`` to check the filesystem on the next system reboot. Once the 
filesystem is checked the ``forcefsck`` file will be removed thus next time 
you reboot your filesystem will NOT be checked again. Once boot completes, 
the result of ``fsck`` will be available in ``/var/log/boot.log``. Also
the ram filesystem used during boot will log it in 
``/run/initramfs/fsck.log``. This file will be lost as soon as the system 
is shut down since the ram filesystem is volatile.

## Security
* [What Is AppArmor, and How Does It Keep Ubuntu Secure?](https://www.howtogeek.com/118222/htg-explains-what-apparmor-is-and-how-it-secures-your-ubuntu-system/)


## Setting up ubuntu server with lubuntu desktop in a VirtualBox VM

### Set up the VM with,
* 4G memeory.
* 32G vdi disk. 
* Network: NAT / Host only 
* Clipboard: bidirectional.

### Setup linux

Install ubuntu server from server.iso using a USB drive.

Now setup the desktop,

```bash
sudo apt-get update
# Install lubuntu desktop
sudo apt-get install lubuntu-desktop
# get guest addition
sudo apt-get install virtualbox-guest-x11
```

Now go to ``Start > Preferences > Monitor settings`` and select a resolution of your choice. 

### Custom Resolution

First we need to find out what display outputs are available.
```bash
$ xrandr -q
Screen 0: minimum 640 x 400, current 1600 x 1200, maximum 1600 x 1200
Virtual1 connected 1600x1200+0+0 0mm x 0mm
   1600x1200       0.0* 
   1280x1024       0.0  
   640x480         0.0  
...
```
This means ``Virtual1`` is the first output device, there might be more listed. Find which output you want the monitor to connect to.

Lets say we want a monitor resolution of 960 x 600 @ 60Hz.  
```bash
# get a Modeline 
gtf 960 600 60
```
Lets say output will look like:
```txt
# 960x600 @ 60.00 Hz (GTF) hsync: 37.32 kHz; pclk: 45.98 MHz
Modeline "960x600_60.00"  45.98  960 1000 1096 1232  600 601 604 622  -HSync +Vsync
```
The string ``960x600_60.00`` is just an identifier proposed. For the following you can substitute it to anything more meaningful.

Now we will use this Modeline content to set our configuration,
```bash
# define a mode
xrandr --newmode "960x600_60.00"  45.98  960 1000 1096 1232  600 601 604 622  -HSync +Vsync
# map this mode to a output
xrandr --addmode Virtual1 "960x600_60.00"
```

At this point you can switch to the new resolution by 
going to ``Start > Preferences > Monitor settings`` and Selecting the resolution added. 
Alternatively you can switch mode for the output from the terminal, 
```bash
xrandr --output Virtual1 --mode "960x600_60.00"
```

The whole thing can be turned into a bash script,
```bash
#!/bin/bash

# get the modeline for the following resolution
RESOLUTION="960 600 60"
# extract modeline settings
SETTINGS=$( gtf $RESOLUTION | grep Modeline | cut -d ' ' -f4-16 )
# define the mode
xrandr --newmode $SETTINGS
# get name of mode from settings
MODE=$( echo $SETTINGS | cut -d ' ' -f1 )
# get the first connected output device
DEVICE=$( xrandr -q | grep "connected" | head -1 | cut -d ' ' -f1 )
# map this mode to the device
xrandr --addmode $DEVICE $MODE
# switch to the new mode
xrandr --output $DEVICE --mode $MODE
```

### Changing the cursor size
To change the size of your mouse cursor, 
open the desktop configuration file ``~/.config/lxsession/lubuntu/desktop.conf``, 
find the key ``iGtk/CursorThemeSize`` and update the value to the desired size.


## Converting VirtualBox VDI (or VMDK) to a ISO
* Inspired by the article, [Converting a virtual disk image: VDI or VMDK to an ISO you can distribute](https://www.turnkeylinux.org/blog/convert-vm-iso).
* [TKLPatch - a simple appliance customization mechanism](https://www.turnkeylinux.org/docs/tklpatch). Source in [github](https://github.com/turnkeylinux/tklpatch).
* [All about VDIs](https://forums.virtualbox.org/viewtopic.php?t=8046)

create raw image 
```bash
VBoxManage clonemedium turnkey-core.vdi turnkey-core.raw --format RAW
```
Next, mount the raw disk as a loopback device.

```bash
mkdir turnkey-core.mount
mount -o loop turnkey-core.raw turnkey-core.mount
```


GOTCHA 1: If your VM has partitions, it's a little tricker. You'll need to setup the loop device, partition mappings and finally mount the rootfs partition. You will need kpartx to setup the mappings.

```bash
loopdev=$(losetup -s -f turnkey-core.raw)

apt-get install kpartx
kpartx -a $loopdev

# p1 refers to the first partition (rootfs)
mkdir turnkey-core.mount
mount /dev/mapper/$(basename $loopdev)p1 turnkey-core.mount
```

Extract root filesystem and tweak for ISO configuration
Now, make a copy of the root filesystem and unmount the loopback.

```bash
mkdir turnkey-core.rootfs
rsync -a -t -r -S -I turnkey-core.mount/ turnkey-core.rootfs

umount -d turnkey-core.mount

# If your VM had partitions (GOTCHA 1):
kpartx -d $loopdev
losetup -d $loopdev

```

Because the VM is an installed system as opposed to the ISO, the file system table needs to be updated.

```bash
cat>turnkey-core.rootfs/etc/fstab<<EOF
aufs / aufs rw 0 0
tmpfs /tmp tmpfs nosuid,nodev 0 0
EOF
```
GOTCHA 2: If your VM uses a kernel optimized for virtualization (like the one included in the TurnKey VM builds), you need to replace it with a generic kernel, and also remove vmware-tools if installed.
You can remove any other unneeded packages.

```bash
tklpatch-chroot turnkey-core.rootfs

# inside the chroot
apt-get update
apt-get install linux-image-generic
dpkg --purge $(dpkg-query --showformat='${Package}\n' -W 'vmware-tools*')
dpkg --purge $(dpkg-query --showformat='${Package}\n' -W '*-virtual')

exit
```
Generate the ISO
Finally, prepare the cdroot and generate the ISO.

```bash
tklpatch-prepare-cdroot turnkey-core.rootfs/
tklpatch-geniso turnkey-core.cdroot/
```
this will create my_system.iso

Thats it!

burn it to usb

* [How to create a bootable Ubuntu USB flash drive from terminal?](https://askubuntu.com/questions/372607/how-to-create-a-bootable-ubuntu-usb-flash-drive-from-terminal)

You can use dd.

un mount the usb 
```bash
 sudo umount /dev/sd<?><?>  
```
where <?><?> is a letter followed by a number, look it up by running lsblk.

It will look something like
```text
sdb      8:16   1  14.9G  0 disk 
├─sdb1   8:17   1   1.6G  0 part /media/username/usb volume name
└─sdb2   8:18   1   2.4M  0 part 
```
I would un mount sdb1.

Then, next (this is a destructive command and wipes the entire USB drive with the contents of the iso, so be careful):


```bash
 sudo dd bs=4M if=path/to/my_system.iso of=/dev/sd<?> conv=fdatasync  status=progress
```

where my_system.iso is the input file, and /dev/sd<?> is the USB device you're writing to (run lsblk to see all drives to find out what <?> is for your USB).

