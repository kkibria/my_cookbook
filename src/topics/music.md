---
title: Music
---

# {{ page.title }}


## Drum patterns
* <https://cecm.indiana.edu/361/drumpatterns.html>


## rust midi library
* <https://docs.rs/midly/latest/midly/>
* <https://tauri.studio>
* <https://crates.io/crates/serde_json>

We can load midi file in a rust based tauri app. Use svelte for for the app logic.
We can try functions in rust to do even midi processing at native speed.
or we can use wasm library using rust <https://developer.mozilla.org/en-US/docs/WebAssembly/Rust_to_wasm>. Although I cant really see much of a benefit with wasm over native rust function in tauri for all practical uses. We can use plain javascript for all the processing if we really need
in browser processing.

The plan is to convert the midi structure to json and send to browser and then convert back to midi
before saving.

## rust based DAW
This is an interesting possibility, may be a tauri based user interface and backend in rust.
We can probably utilize a pure rust cross platform audio library,
* <https://github.com/RustAudio/cpal>
* <https://github.com/MeadowlarkDAW/Meadowlark>
* <https://youtu.be/Z4P5f6ZJ_nE>
* <https://youtu.be/Yom9E-67bdI>
* <https://github.com/SolarLiner/nih-reverb>
* <https://github.com/vizia/vizia> for gui
* <https://github.com/Auritia/Auritia>
* <https://npm.io/package/svelte-tauri-filedrop> This will allow file drop in on DAW
* <https://github.com/emilyskidsister/oxygen> audio recording and playback using cpal

## audio and vst3 with rust
* <https://github.com/RustAudio/vst3-sys>
* <https://github.com/t-sin/rust-vst3-example>

## open source plugins
* <https://github.com/TheWaveWarden/odin2>
* <https://github.com/surge-synthesizer/surge>
* <https://github.com/zynaddsubfx/zynaddsubfx>
* <https://github.com/surge-synthesizer/stochas>
* <https://github.com/trummerschlunk/master_me> for mastering

## karaoke
* <https://github.com/gyunaev/spivak>
* <https://github.com/magic-akari/lrc-maker> it also is a player react app.
* <https://github.com/outloudvi/lrcedit.js> a simple example using 
web audio api for lrc edit 


## rust soundfont and synthesis
* <https://github.com/sinshu/rustysynth>
* <https://github.com/PolyMeilex/OxiSynth> fluidsynth in rust
* <https://github.com/ameobea/web-synth> fm synthesis
* <https://www.youtube.com/watch?v=v0Qp7eWVyes> wavetable synthesis
* <https://rustrepo.com/repo/geom3trik-tuix_audio_synth>
* <https://github.com/geom3trik/vizia-audio-synth>


## rust libraries
* <https://github.com/RazrFalcon/resvg> svg rendering
* <https://github.com/servo/servo> browser


## yamaha style file

* [Style file specification (archived)](../files/StyleFileDescription_v21.pdf)
* <https://github.com/bures/sff2-tools>
* <https://wierzba.homepage.t-online.de/StyleFileDescription_v21.pdf>
* <https://www.jjazzlab.com/en/>
* <https://psrtutorial.com/index.html>
* <https://youtu.be/be_0JnhI-Wc>
* <https://youtu.be/gEGd__2ZQc0>

## python libraries
* style (sff2) files api <https://github.com/bures/sff2-tools>
* <https://github.com/bspaans/python-mingus>
* SCAMP <https://pypi.org/project/scamp/>. doc <http://scamp.marcevanstein.com/>

## AI datasets
* <https://github.com/bytedance/GiantMIDI-Piano>

## tool for representing music for AI
* <https://github.com/CPJKU/partitura>