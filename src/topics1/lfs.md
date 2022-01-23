---
title: Linux from scratch (Part 1)
---

# {{ page.title }}

## Projects using LFS
* [Linux From scratch build scripts](https://github.com/jfdelnero/LinuxFromScratch)
* [Use dpkg (.deb) package management on LFS 6.3](http://www.linuxfromscratch.org/hints/downloads/files/dpkg.txt)
* [Fakeroot approach for package installation](http://www.linuxfromscratch.org/hints/downloads/files/fakeroot.txt)
* [LFS cross compile for arm](https://clfs.org/view/clfs-embedded/arm/)
* [Making your own Linux distribution for the Raspberry Pi](https://pixelspark.nl/2019/making-your-own-linux-distribution-for-the-raspberry-pi-for-fun-and-profit-part-1)
* [The Linux Documentation Project](http://www.tldp.org/)
* [https://www.tldp.org/HOWTO/Program-Library-HOWTO/index.html](https://www.tldp.org/HOWTO/Program-Library-HOWTO/index.html)
* [Cross Linux From Scratch (CLFS) on the Raspberry Pi](https://github.com/LeeKyuHyuk/PiCLFS)
* [someones journal of building LFS](https://github.com/hisham-maged10/Building-Linux-From-Scratch)
* [Building GCC as a cross compiler for Raspberry Pi](https://solarianprogrammer.com/2018/05/06/building-gcc-cross-compiler-raspberry-pi/)
* [Docker configuration for building Linux From Scratch system](https://github.com/reinterpretcat/lfs)


## LFS with wsl2
Get the [LFS book](http://www.linuxfromscratch.org/lfs/download.html). This book provides step by step guide to build an LFS system. Following will provide steps for chapter 1 & 2.

## Chapter 1 and 2, Setup and Disc image
We will be needing few packages that we will install if they are not installed,
```bash
sudo apt-get install subversion xsltproc
```

run setup.sh which will create ``sourceMe.sh`` in the current folder. It will also download the book source to create other scripts and files.
```bash
sh /mnt/c/Users/<user>/Documents/linux/LFS/lfs-scripts/setup.sh
```

Now source ``sourceMe.sh`` to mount the scripts
```bash
$ source sourceMe.sh
Mounting /mnt/c/Users/<user>/Documents/linux/LFS/lfs-scripts on lfs-scripts
umount: lfs-scripts: not mounted.
sh: mount-lfs.sh: No such file or directory
```

Check the requirements for LFS,
```bash
sh lfs-scripts/version-check.sh
```

Change shell to bash from dash if necessary,
```bash
sh lfs-scripts/ch2bash.sh
```

Let us create an empty disk image with two partitions,
```bash
sh lfs-scripts/mkdiscimg.sh
```
This will create ``lfs.img`` with two partitions and a script ``mount-lfs.sh`` to mount the image. Check the image, 
```bash
$ fdisk -lu lfs.img
Disk lfs.img: 10.26 GiB, 11010048000 bytes, 21504000 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0x0e0d22a7

Device     Boot  Start      End  Sectors  Size Id Type
lfs.img1          8192   532479   524288  256M  c W95 FAT32 (LBA)
lfs.img2        532480 21503999 20971520   10G 83 Linux
```

Now source ``sourceMe.sh`` the second time to mount the image.

From now on, you can source ``sourceMe.sh`` before you start working to have everything setup after you boot between steps if necessary.

We are ready to go with chapter 3. 

## Chapter 3, Get sources 

When we ran ``setup.sh``, it downloaded the book and created,
* ``packages.sh``
* ``patches.sh``
* ``wget-list``
* ``md5sums``
Feel free to examine them.

Lets proceed to download the sources,
```bash
sudo mkdir -v $LFS/sources
sudo chmod -v a+wt $LFS/sources
wget --input-file=wget-list --continue --directory-prefix=$LFS/sources
cp md5sums $LFS/sources
pushd $LFS/sources
md5sum -c md5sums
popd
``` 
Note that if a download fails you have to find an alternate source by googling and then adjust ``wget-list``.
At the time of this writing mpfr url had to be changed to ``https://ftp.gnu.org/gnu/mpfr/mpfr-4.0.2.tar.xz``.
> Writing a makefile using ``packages.sh`` and ``patches.sh`` could be an alternative.

We are ready to go with chapter 4.

## Chapter 4, Setup user to build toolchain

create user ``lfs`` and set permissions,
```bash
sudo mkdir -v $LFS/tools
sudo ln -sv $LFS/tools /
sudo groupadd lfs
sudo useradd -s /bin/bash -g lfs -m -k /dev/null lfs
sudo passwd lfs
sudo chown -v lfs $LFS/tools
sudo chown -v lfs $LFS/sources
```

Login as ``lfs``,
```bash
su - lfs
```

Setup ``lfs``'s environment,
```bash
cat > ~/.bash_profile << "EOF"
exec env -i HOME=$HOME TERM=$TERM PS1='\u:\w\$ ' /bin/bash
EOF

cat > ~/.bashrc << "EOF"
set +h
umask 022
LFS=/mnt/lfs
LC_ALL=POSIX
LFS_TGT=$(uname -m)-lfs-linux-gnu
PATH=/tools/bin:/bin:/usr/bin
export LFS LC_ALL LFS_TGT PATH
EOF

source ~/.bash_profile
```

This concludes chapter 4. Go to [Part 2](lfs2) for next chapters.
