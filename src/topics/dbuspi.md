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