---
title: Linux from scratch (Part 2)
---

# {{ page.title }}

## Chapter 5, Build Toolchain

In chapter 5, prepare ``lib`` folders and go to ``sources`` folder, 
```bash
case $(uname -m) in
 x86_64) mkdir -v /tools/lib && ln -sv lib /tools/lib64 ;;
esac
cd $LFS/sources
```

### Build pass 1 binutils
```bash
tar -xvf binutils-2.34.tar.xz
pushd binutils-2.34

mkdir -v build
cd build

../config.guess
../configure --prefix=/tools \
 --with-sysroot=$LFS \
 --with-lib-path=/tools/lib \
 --target=$LFS_TGT \
 --disable-nls \
 --disable-werror

make
make install

# if everything went fine we can remove
popd
rm -rf binutils-2.34
```

### build pass 1 gcc
```bash
tar -xvf gcc-9.2.0.tar.xz
pushd gcc-9.2.0

tar -xf ../mpfr-4.0.2.tar.xz
mv -v mpfr-4.0.2 mpfr
tar -xf ../gmp-6.2.0.tar.xz
mv -v gmp-6.2.0 gmp
tar -xf ../mpc-1.1.0.tar.gz
mv -v mpc-1.1.0 mpc

for file in gcc/config/{linux,i386/linux{,64}}.h
do
 cp -uv $file{,.orig}
 sed -e 's@/lib\(64\)\?\(32\)\?/ld@/tools&@g' \
 -e 's@/usr@/tools@g' $file.orig > $file
 echo '
#undef STANDARD_STARTFILE_PREFIX_1
#undef STANDARD_STARTFILE_PREFIX_2
#define STANDARD_STARTFILE_PREFIX_1 "/tools/lib/"
#define STANDARD_STARTFILE_PREFIX_2 ""' >> $file
 touch $file.orig
done

case $(uname -m) in
 x86_64)
 sed -e '/m64=/s/lib64/lib/' \
 -i.orig gcc/config/i386/t-linux64
 ;;
esac

mkdir -v build
cd build

../configure \
 --target=$LFS_TGT \
 --prefix=/tools \
 --with-glibc-version=2.11 \
 --with-sysroot=$LFS \
 --with-newlib \
 --without-headers \
 --with-local-prefix=/tools \
 --with-native-system-header-dir=/tools/include \
 --disable-nls \
 --disable-shared \
 --disable-multilib \
 --disable-decimal-float \
 --disable-threads \
 --disable-libatomic \
 --disable-libgomp \
 --disable-libquadmath \
 --disable-libssp \
 --disable-libvtv \
 --disable-libstdcxx \
 --enable-languages=c,c++

# take a cup of coffee and relax
make
make install

popd
rm -rf gcc-9.2.0
```

### Install linux headers 
```bash
tar -xvf linux-5.5.3.tar.xz
pushd linux-5.5.3

make mrproper
make headers
cp -rv usr/include/* /tools/include

popd
rm -rf linux-5.5.3
```

### Build Glibc
```bash
tar -xvf glibc-2.31.tar.xz
pushd glibc-2.31

mkdir -v build
cd build

../configure \
 --prefix=/tools \
 --host=$LFS_TGT \
 --build=$(../scripts/config.guess) \
 --enable-kernel=3.2 \
 --with-headers=/tools/include

make
make install

popd
rm -rf glibc-2.31
```

Test the build,
```bash
mkdir test
pushd test
echo 'int main(){}' > dummy.c
$LFS_TGT-gcc dummy.c
readelf -l a.out | grep ': /tools'
popd
rm -rf test
```
This should produce output,
```text
[Requesting program interpreter: /tools/lib64/ld-linux-x86-64.so.2]
```
Note that for 32-bit machines, the interpreter name will be /tools/lib/ld-linux.so.2.

### Build Libstdc++
```bash
tar -xvf gcc-9.2.0.tar.xz
pushd gcc-9.2.0
mkdir -v build
cd build

../libstdc++-v3/configure \
 --host=$LFS_TGT \
 --prefix=/tools \
 --disable-multilib \
 --disable-nls \
 --disable-libstdcxx-threads \
 --disable-libstdcxx-pch \
 --with-gxx-include-dir=/tools/$LFS_TGT/include/c++/9.2.0

make
make install

popd
rm -rf gcc-9.2.0
```

### Build pass 2 binutils
```bash
tar -xvf binutils-2.34.tar.xz
pushd binutils-2.34

mkdir -v build
cd build

CC=$LFS_TGT-gcc \
AR=$LFS_TGT-ar \
RANLIB=$LFS_TGT-ranlib \
../configure \
 --prefix=/tools \
 --disable-nls \
 --disable-werror \
 --with-lib-path=/tools/lib \
 --with-sysroot

make
make install

make -C ld clean
make -C ld LIB_PATH=/usr/lib:/lib
cp -v ld/ld-new /tools/bin

popd
rm -rf binutils-2.34
```

### Build pass 2 gcc
```bash
tar -xvf gcc-9.2.0.tar.xz
pushd gcc-9.2.0

tar -xf ../mpfr-4.0.2.tar.xz
mv -v mpfr-4.0.2 mpfr
tar -xf ../gmp-6.2.0.tar.xz
mv -v gmp-6.2.0 gmp
tar -xf ../mpc-1.1.0.tar.gz
mv -v mpc-1.1.0 mpc

cat gcc/limitx.h gcc/glimits.h gcc/limity.h > \
 `dirname $($LFS_TGT-gcc -print-libgcc-file-name)`/include-fixed/limits.h

for file in gcc/config/{linux,i386/linux{,64}}.h
do
 cp -uv $file{,.orig}
 sed -e 's@/lib\(64\)\?\(32\)\?/ld@/tools&@g' \
 -e 's@/usr@/tools@g' $file.orig > $file
 echo '
#undef STANDARD_STARTFILE_PREFIX_1
#undef STANDARD_STARTFILE_PREFIX_2
#define STANDARD_STARTFILE_PREFIX_1 "/tools/lib/"
#define STANDARD_STARTFILE_PREFIX_2 ""' >> $file
 touch $file.orig
done

case $(uname -m) in
 x86_64)
 sed -e '/m64=/s/lib64/lib/' \
 -i.orig gcc/config/i386/t-linux64
 ;;
esac

sed -e '1161 s|^|//|' \
 -i libsanitizer/sanitizer_common/sanitizer_platform_limits_posix.cc

# take a cup of coffee and relax
make
make install

ln -sv gcc /tools/bin/cc

popd
rm -rf gcc-9.2.0
```

Test the build,
```bash
mkdir test
pushd test
echo 'int main(){}' > dummy.c
cc dummy.c
readelf -l a.out | grep ': /tools'
popd
rm -rf test
```
This should produce output,
```text
[Requesting program interpreter: /tools/lib64/ld-linux-x86-64.so.2]
```
Note that for 32-bit machines, the interpreter name will be /tools/lib/ld-linux.so.2.

### Build Tcl
```bash
tar -xvf tcl8.6.10-src.tar.gz
pushd tcl8.6.10

cd unix
./configure --prefix=/tools

make
TZ=UTC make test
make install

chmod -v u+w /tools/lib/libtcl8.6.so
make install-private-headers
ln -sv tclsh8.6 /tools/bin/tclsh

popd
rm -rf tcl8.6.10
```

### Build expect
```bash
tar -xvf expect5.45.4.tar.gz
pushd expect5.45.4

cp -v configure{,.orig}
sed 's:/usr/local/bin:/bin:' configure.orig > configure

make
make test
make SCRIPTS="" install

popd
rm -rf expect5.45.4
```

### build DejaGNU
```bash
tar -xvf dejagnu-1.6.2.tar.gz
pushd dejagnu-1.6.2

./configure --prefix=/tools
make install
make check

popd
rm -rf dejagnu-1.6.2
```

### build M4
```bash
tar -xvf m4-1.4.18.tar.xz
pushd m4-1.4.18

sed -i 's/IO_ftrylockfile/IO_EOF_SEEN/' lib/*.c
echo "#define _IO_IN_BACKUP 0x100" >> lib/stdio-impl.h

./configure --prefix=/tools
make
make check
make install

popd
rm -rf m4-1.4.18
```

### build Ncurses
```bash
tar -xvf ncurses-6.2.tar.gz
pushd ncurses-6.2

sed -i s/mawk// configure
./configure --prefix=/tools \
 --with-shared \
 --without-debug \
 --without-ada \
 --enable-widec \
 --enable-overwrite

make
make install
ln -s libncursesw.so /tools/lib/libncurses.so

popd
rm -rf ncurses-6.2
```

### build bash
```bash
tar -xvf bash-5.0.tar.gz
pushd bash-5.0

./configure --prefix=/tools --without-bash-malloc

make
make tests
make install
ln -sv bash /tools/bin/sh

popd
rm -rf bash-5.0
```

### build bison
```bash
tar -xvf bison-3.5.2.tar.xz
pushd bison-3.5.2

./configure --prefix=/tools

make
make check
make install

popd
rm -rf bison-3.5.2
```

### build Bzip2
```bash
tar -xvf bzip2-1.0.8.tar.gz
pushd bzip2-1.0.8

make -f Makefile-libbz2_so
make clean
make
make PREFIX=/tools install
cp -v bzip2-shared /tools/bin/bzip2
cp -av libbz2.so* /tools/lib
ln -sv libbz2.so.1.0 /tools/lib/libbz2.so

popd
rm -rf bzip2-1.0.8
```

### build Coreutils
```bash
tar -xvf coreutils-8.31.tar.xz
pushd coreutils-8.31

./configure --prefix=/tools --enable-install-program=hostname

make
make RUN_EXPENSIVE_TESTS=yes check
make install

popd
rm -rf coreutils-8.31
```

### build Diffutils
```bash
tar -xvf diffutils-3.7.tar.xz
pushd diffutils-3.7

./configure --prefix=/tools

make
make check
make install

popd
rm -rf diffutils-3.7
```

### build File
```bash
tar -xvf file-5.38.tar.gz
pushd file-5.38

./configure --prefix=/tools

make
make check
make install

popd
rm -rf file-5.38
```

### build Findutils
```bash
tar -xvf findutils-4.7.0.tar.xz
pushd findutils-4.7.0

./configure --prefix=/tools

make
make check
make install

popd
rm -rf findutils-4.7.0
```

### build gawk
```bash
tar -xvf gawk-5.0.1.tar.xz
pushd gawk-5.0.1

./configure --prefix=/tools

make
make check
make install

popd
rm -rf gawk-5.0.1
```

### build gettext
```bash
tar -xvf gettext-0.20.1.tar.xz
pushd gettext-0.20.1

./configure --disable-shared

make
cp -v gettext-tools/src/{msgfmt,msgmerge,xgettext} /tools/bin

popd
rm -rf gettext-0.20.1
```

### build grep
```bash
tar -xvf grep-3.4.tar.xz
pushd grep-3.4

./configure --prefix=/tools

make
make check
make install

popd
rm -rf grep-3.4
```

### build gzip
```bash
tar -xvf gzip-1.10.tar.xz
pushd gzip-1.10

./configure --prefix=/tools

make
make check
make install

popd
rm -rf gzip-1.10
```

### build make
```bash
tar -xvf make-4.3.tar.gz
pushd make-4.3

./configure --prefix=/tools --without-guile

make
make check
make install

popd
rm -rf make-4.3
```

### build patch
```bash
tar -xvf patch-2.7.6.tar.xz
pushd patch-2.7.6

./configure --prefix=/tools

make
make check
make install

popd
rm -rf patch-2.7.6
```

### build perl
```bash
tar -xvf perl-5.30.1.tar.xz
pushd perl-5.30.1

sh Configure -des -Dprefix=/tools -Dlibs=-lm -Uloclibpth -Ulocincpth

make
cp -v perl cpan/podlators/scripts/pod2man /tools/bin
mkdir -pv /tools/lib/perl5/5.30.1
cp -Rv lib/* /tools/lib/perl5/5.30.1

popd
rm -rf perl-5.30.1
```

### build python
```bash
tar -xvf Python-3.8.1.tar.xz
pushd Python-3.8.1

sed -i '/def add_multiarch_paths/a \        return' setup.py
./configure --prefix=/tools --without-ensurepip

make
make install

popd
rm -rf Python-3.8.1
```

### build sed
```bash
tar -xvf sed-4.8.tar.xz
pushd sed-4.8

./configure --prefix=/tools

make
make check
make install

popd
rm -rf sed-4.8
```

### build tar
```bash
tar -xvf tar-1.32.tar.xz
pushd tar-1.32

./configure --prefix=/tools

make
make check
make install

popd
rm -rf tar-1.32
```

### build Texinfo
```bash
tar -xvf texinfo-6.7.tar.xz
pushd texinfo-6.7

./configure --prefix=/tools

make
make check
make install

popd
rm -rf texinfo-6.7
```

### build Xz
```bash
tar -xvf xz-5.2.4.tar.xz
pushd xz-5.2.4

./configure --prefix=/tools

make
make check
make install

popd
rm -rf xz-5.2.4
```

### Wrap up

Free 3gb space,
```bash
strip --strip-debug /tools/lib/*
/usr/bin/strip --strip-unneeded /tools/{,s}bin/*

rm -rf /tools/{,share}/{info,man,doc}

find /tools/{lib,libexec} -name \*.la -delete

# go back to original login
exit
```

Back up the toolchain,
```bash
sh bkuptc.sh
```
It will create ``tools.tar.gz`` in the ``backup`` folder in ``/mnt/c/Users/<user>/Documents/linux/LFS``.

Change ownership to root,
```bash
sudo chown -R root:root $LFS/tools
```

This concludes chapter 5. Go to [Part 3](lfs3) for next chapters.
