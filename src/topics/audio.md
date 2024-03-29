---
title: Audio Processing
---

# {{ page.title }}


## DSP
* [The Scientist and Engineer's Guide to Digital Signal Processing](http://www.dspguide.com/)
* [Faust (Functional Audio Stream) programming language](https://faust.grame.fr/)


## vst3 with MINGW
* <https://forum.juce.com/t/is-vst3-sdk-compatible-with-mingw/12385>
* <http://kxstudio.sourceforge.net/Paste/repo/GMOVw>
* <https://github.com/steinbergmedia/vst3sdk/issues/8>
* <http://www.martin-finke.de/blog/tags/making_audio_plugins.html>
* [Generating a VST Plugin via Faust](https://ccrma.stanford.edu/~jos/fp/Generating_VST_Plugin_Faust.html).
* [MAX](https://cycling74.com/).
* <https://juce.com/>

## VST framework
* <https://github.com/DISTRHO/DPF>

## open source synths
* <https://github.com/TheWaveWarden/odin2>
* <https://github.com/zynaddsubfx/zynaddsubfx>

## reason livestreams
* <https://www.reasonstudios.com/blog/reason-livestream>

## physical synthesis libraries/ papers
* <https://github.com/thestk/stk> Perry R. Cook and Gary P. Scavone.
* <https://ccrma.stanford.edu/~jos/jnmr/jnmr.pdf>
* <https://ccrma.stanford.edu/~jos/wgj/wgj.pdf>
* <https://www.osar.fr/notes/waveguides/>
* <https://ccrma.stanford.edu/~jos/wg.html>
* <https://ccrma.stanford.edu/~jos/pasp/pasp.html>
* <https://github.com/mi-creative/mi-gen>
* <https://github.com/mi-creative/miPhysics_Processing>
* [Martin Shuppius - Physical modelling of guitar strings (ADC'17)](https://youtu.be/sxt5rxF_PdI)
* [Some pdf papers](https://drive.google.com/drive/folders/1URgFdMjBttXfwUdbf_C2p-XacsSe6hEQ?usp=sharing)


## audio/midi interface libraries

* <https://wiki.linuxaudio.org/wiki/programming_libraries>
* <http://www.portaudio.com/>. Audacity uses this.
* <https://github.com/AuLib/AuLib>

## DAW golang in audio
* <https://github.com/dskinner/snd>

## headless DAW
* <https://github.com/hq9000/py_headless_daw>

## HLS audio streaming

```
ffmpeg -i song1.mp3 -map 0 -map 0 -c:a aac -b:a:0 320k -b:a:1 128k -var_stream_map "a:0,name:320k a:1,name:128k" -master_pl_name song1_manifest.m3u8 -f hls -hls_flags single_file -hls_playlist_type vod -hls_segment_filename "song1_%v/classroom.ts" song1_%v/index.m3u8
```

# speaker frequency response
* <https://blog.audiokinetic.com/en/loudness-and-frequency-response-on-popular-smart-phones/>