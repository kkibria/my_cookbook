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