# DBUS in pi








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

## Python example for dbus

* [wpas-dbus-new.py](https://android.googlesource.com/platform/external/wpa_supplicant_8/+/master/wpa_supplicant/examples/wpas-dbus-new.py)



## Setting up dbus for interacting with WPA_SUPPLICANT
I was trying to write some code that is to use dbus api to access wpa_supplicant. My understanding from reading various posts that wpa_supplicant must be started with `-u` flag to fully expose it's apis to dbus. So I edited, `/lib/dhcpcd/dhcpcd-hooks/10-wpa_supplicant` to by adding the `-u` flag to the invocation of the `wpa_supplicant` daemon in the `wpa_supplicant_start()`.

At this point I couldn't use wpa_cli to connect to `wlan0` anymore. I checked the processes with `ps` and got,
```
pi@raspi:~ $ ps -aux | grep wpa_sup
root       306  0.0  1.0  10724  4732 ?        Ss   21:21   0:00 /sbin/wpa_supplicant -u -s -O /run/wpa_supplicant
```

So, I edited `/lib/dhcpcd/dhcpcd-hooks/10-wpa_supplicant` again to remove `-u` flag, rebooted etc. and again checked the processes. This time I got,
```
pi@raspi:~ $ ps -aux | grep wpa_sup
root       260  0.3  1.0  10724  4640 ?        Ss   21:25   0:00 /sbin/wpa_supplicant -u -s -O /run/wpa_supplicant
root       350  0.1  0.9  10988  4052 ?        Ss   21:25   0:00 wpa_supplicant -B -c/etc/wpa_supplicant/wpa_supplicant.conf -iwlan0 -Dnl80211,wext
```

and now I can use wpa_cli to connect to `wlan0`.

This is confusing to me. I am not sure why.

After some digging, it appears that `wpa_supplicant.service` should be disabled as it was preventing `wpa_cli` from connecting to `wlan0`.

After doing,
```bash
sudo systemctl disable wpa_supplicant
sudo reboot
```
I was able to connect.

I am still not sure why.

<https://raspberrypi.stackexchange.com/questions/132998/confusing-wpa-supplicant-processes-while-trying-to-use-dbus-api>



this has an explanation. <https://github.com/mark2b/wpa-connect>



## cross compile dbus
* <https://github.com/diwic/dbus-rs/blob/master/libdbus-sys/cross_compile.md>
* <https://serverfault.com/questions/892465/starting-systemd-services-sharing-a-session-d-bus-on-headless-system> headless dbus.
* <https://raspberrypi.stackexchange.com/questions/114739/how-to-install-pi-libraries-to-cross-compile-for-pi-zero-in-wsl2>.
* <https://airtower.wordpress.com/2010/07/20/using-gvariant-tuples/>
* <https://fosdem.org/2020/schedule/event/rust_dbus_library/>

