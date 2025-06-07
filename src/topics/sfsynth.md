---
title: Understanding Soundfont Synthesis
---

# {{ page.title }}

I took RustySynth as an example from github <https://github.com/sinshu/rustysynth>, which is written in `rust`.

Below is an overview of how the various pieces of RustySynth fit together—both
in terms of “who depends on whom” (module/dependency structure) and in terms of
the main runtime call‐hierarchy (what calls what at runtime).

---

## 1. High-Level Cargo/Workspace Layout

At the top level, the repository has three main sub-directories (workspace members):

* **`rustysynth/`**
  The core synthesizer library (this is where all of the SoundFont parsing, voice management, sample generation, and effects live).

* **`rustysynth_test/`**
  A small crate for running unit/integration tests against the core library.

* **`example/`**
  One or more example programs (showing how to load a SoundFont, create a `Synthesizer`, play a MIDI file, etc.).

For our purposes, everything we care about is in `rustysynth/src/`. Below is a
rough sketch of the files you’ll find there (names taken from docs.rs and a
GitHub directory listing) :

```
rustysynth/
├─ Cargo.toml
└─ src/
   ├─ error.rs
   ├─ midi_file.rs
   ├─ midi_file_sequencer.rs
   ├─ sound_font.rs
   ├─ synthesizer_settings.rs
   ├─ synthesizer.rs
   ├─ voice.rs
   ├─ oscillator.rs
   ├─ envelope.rs
   ├─ comb_filter.rs
   ├─ all_pass_filter.rs
   ├─ reverb.rs
   ├─ chorus.rs
   └─ … (possibly a few small helpers, but these are the main pieces)
```

Each of the `.rs` files corresponds to a `mod` in `lib.rs`, and together they
form the library’s public/exported API (plus internal helpers).

---

## 2. Module/Dependency Structure

Below is a simplified “dependency graph” of modules—i.e. which `mod` files refer
to which other modules. Arrows (→) mean “depends on / uses functionality from.”

```
 ┌─────────────────┐
 │   error.rs      │   ←── defines `MidiFileError`, `SoundFontError`, `SynthesizerError` 
 └─────────────────┘
          ▲
          │
 ┌─────────────────┐
 │   sound_font.rs │  ←── uses `error::SoundFontError`, plus low‐level I/O traits (`Read`, `Seek`)
 └─────────────────┘
          ▲
          │
 ┌────────────────────────────┐
 │   midi_file.rs             │  ←── uses `error::MidiFileError`
 └────────────────────────────┘
          ▲
          │
 ┌──────────────────────────────────────┐
 │   midi_file_sequencer.rs             │  ←── uses `MidiFile` (from midi_file.rs)  
 │                                      |      and `Synthesizer` (from synthesizer.rs)  
 └──────────────────────────────────────┘
          ▲
          │
 ┌──────────────────────────────┐
 │  synthesizer_settings.rs     │  ←── trivial: only holds numeric fields (sample_rate, block_size, max_polyphony)  
 └──────────────────────────────┘
          ▲
          │
 ┌──────────────────────────────┐
 │   synthesizer.rs             │  ←── uses:  
 │                              │        • `SynthesizerSettings`  
 │                              │        • `SoundFont`  
 │                              │        • `Voice` (from voice.rs)  
 │                              │        • DSP buffers (Vec<f32>)  
 │                              │        • Effects (`Reverb`, `Chorus`)  
 └──────────────────────────────┘
          ▲
          │
 ┌──────────────────────────────┐
 │   voice.rs                   │  ←── uses:  
 │                              │        • `Oscillator` (from oscillator.rs)  
 │                              │        • `Envelope` (from envelope.rs)  
 │                              │        • `CombFilter`, `AllPassFilter` (from their own modules)  
 └──────────────────────────────┘
          ▲
          │
 ┌──────────────────────────────┐
 │   oscillator.rs              │  (no dependencies except `std::f32::consts::PI`)  
 └──────────────────────────────┘

 ┌──────────────────────────────┐
 │   envelope.rs                │  (no dependencies beyond basic math)  
 └──────────────────────────────┘

 ┌──────────────────────────────┐
 │   comb_filter.rs             │  (no external dependencies—just a buffer and feedback logic)  
 └──────────────────────────────┘

 ┌──────────────────────────────┐
 │   all_pass_filter.rs         │  (stateless/all-pass filter logic only)  
 └──────────────────────────────┘

 ┌──────────────────────────────┐
 │   reverb.rs                  │  ←── uses `CombFilter` and `AllPassFilter`  
 └──────────────────────────────┘

 ┌──────────────────────────────┐
 │   chorus.rs                  │  (similar: uses one or more LFOs + delay lines; no other cross‐deps)  
 └──────────────────────────────┘
```

* **`error.rs`** defines the crate’s error types (`MidiFileError`, `SoundFontError`, `SynthesizerError`). Other modules simply import these via `pub use error::…;`.
* **`sound_font.rs`** is responsible for parsing an SF2 file (`SoundFont::new(...)`) and exposing types like `Preset`, `SampleHeader`, etc. It only depends on I/O traits (`Read`, `Seek`) and `error::SoundFontError`.
* **`midi_file.rs`** parses a standard MIDI file and exposes `MidiFile` and its associated data structures (tracks, events). It depends on `error::MidiFileError`.
* **`midi_file_sequencer.rs`** drives playback of a `MidiFile` through a `Synthesizer`. Internally, it calls methods on `Synthesizer` (e.g. `note_on`, `note_off`, `render`).
* **`synthesizer_settings.rs`** is trivial—just a small struct holding `sample_rate`, `block_size`, `maximum_polyphony`.
* **`synthesizer.rs`** is the heart of the real-time (or block‐based) engine. It:

  1. Holds an `Arc<SoundFont>` (so multiple threads can share the same SoundFont safely).
  2. Keeps a `Vec<Voice>` (one slot per possible voice).
  3. Keeps per-channel state (`channels: Vec<ChannelState>`).
  4. Manages effect units (`Reverb`, `Chorus`).
  5. Exposes methods like

     * `fn new(sound_font: &Arc<SoundFont>, settings: &SynthesizerSettings) -> Result<Self, SynthesizerError>`
     * `fn note_on(&mut self, channel: u8, key: u8, velocity: u8)`
     * `fn note_off(&mut self, channel: u8, key: u8, velocity: u8)`
     * `fn render(&mut self, left: &mut [f32], right: &mut [f32])`
* **`voice.rs`** represents a single active note (“voice”). Each voice holds:

  1. An `Oscillator` (for waveform generation).
  2. An `Envelope` (for ADSR or similar amplitude shaping).
  3. A small bank of `CombFilter`s and `AllPassFilter`s (for per-voice filtering).
  4. A reference to the `SampleHeader` (so it knows which PCM data to read).
  5. Methods like `fn new(…)` to create a voice from a given `InstrumentRegion` or `PresetRegion`, and `fn process_block(&mut self, left: &mut [f32], right: &mut [f32])` to generate its output into the provided audio block.
* **`oscillator.rs`** implements low-level math for, e.g., generating a sine wave, a square wave, or reading a PCM sample from memory. It does not depend on any other module except `std::f32::consts`.
* **`envelope.rs`** implements standard envelope generators (ADSR). No cross-deps.
* **`comb_filter.rs`** and **`all_pass_filter.rs`** implement the two basic filter types used both in each voice (for “filter per voice”) and inside the main reverb unit (for “global reverb”).
* **`reverb.rs`** builds on `CombFilter` + `AllPassFilter` to implement a stereo reverb effect.
* **`chorus.rs`** implements a stereo chorus effect (no further dependencies).
* Finally, **`lib.rs`** has lines like:

  ```rust
  mod error;
  mod sound_font;
  mod midi_file;
  mod midi_file_sequencer;
  mod synthesizer_settings;
  mod synthesizer;
  mod voice;
  mod oscillator;
  mod envelope;
  mod comb_filter;
  mod all_pass_filter;
  mod reverb;
  mod chorus;

  pub use error::{MidiFileError, SoundFontError, SynthesizerError};
  pub use sound_font::SoundFont;
  pub use midi_file::{MidiFile, MidiEvent};
  pub use midi_file_sequencer::MidiFileSequencer;
  pub use synthesizer_settings::SynthesizerSettings;
  pub use synthesizer::Synthesizer;
  ```

  so that downstream users can write:

  ```rust
  use rustysynth::SoundFont;
  use rustysynth::Synthesizer;
  use rustysynth::MidiFile;
  use rustysynth::MidiFileSequencer;
  ```

  without needing to know the internal module structure.

---

## 3. Runtime Call-Hierarchy (What Happens When You Synthesize)

Below is the typical sequence of calls, from loading a SoundFont to generating
audio. You can think of this as a “dynamic call graph” that shows how, at
runtime, each component invokes the next.

```
(1) User code: 
      let mut sf2_file = File::open("SomeSoundFont.sf2")?;
      let sound_font = Arc::new(SoundFont::new(&mut sf2_file)?);
      let settings = SynthesizerSettings::new(44100);
      let mut synth = Synthesizer::new(&sound_font, &settings)?;

  └──▶ SoundFont::new(...) parses the SF2 file, building:
         • a list of Presets
         • for each Preset, a Vec<PresetRegion>
         • each PresetRegion refers to one or more InstrumentRegion
         • each InstrumentRegion points to SampleHeader and bank parameters
         • (Internally, sound_font.rs may also build a “preset_lookup” table, etc.)

(2) User code (optional): 
      // If you want to play a standalone MIDI file:
      let mut midi_file = File::open("SomeSong.mid")?;
      let midi = Arc::new(MidiFile::new(&mut midi_file)?);
      let mut sequencer = MidiFileSequencer::new(synth);

  └──▶ MidiFile::new(...) parses all tracks, tempo maps, events (note on/off, CC, etc.)

  └──▶ MidiFileSequencer::new(...) stores the `Synthesizer` inside itself (by move or by value).

(3) User code: 
      // In a real‐time context, you might spawn an audio thread that repeatedly does:
      //    loop {
      //      sequencer.render(&mut left_buf, &mut right_buf);
      //      send to audio output device
      //    }
      // In an offline context:
      sequencer.play(&midi, /* loop = false */);
      let total_samples = (settings.sample_rate as f64 * midi.get_length()) as usize;
      let mut left  = vec![0.0_f32; total_samples];
      let mut right = vec![0.0_f32; total_samples];
      sequencer.render(&mut left[..], &mut right[..]);

  └──▶ MidiFileSequencer::play(...)  // sets an internal “start_time = 0” or similar

  └──▶ MidiFileSequencer::render(left, right):
        ├── updates internal “current_timestamp” based on block size or realtime clock  
        ├── calls `Synthesizer::note_on/off(...)` for any MIDI events whose timestamps fall in this block  
        └── calls `Synthesizer::render(left, right)`

(4) Synthesizer::note_on(channel, key, velocity):
        ├── Look up which **PresetRegion** should respond (based on channel’s current bank/program).  
        ├── For that PresetRegion, find the matching **InstrumentRegion**(s) for that key & velocity.  
        ├── For each matching InstrumentRegion:
        │     ├── Find a free voice slot (`self.voices[i]` where `i < maximum_polyphony` and voice isn’t already in use).  
        │     ├── Call `Voice::new( instrument_region, sample_rate )` to create a brand-new `Voice` struct.  
        │     ├── Initialize that voice’s fields (oscillator frequencies, envelope ADSR parameters, filter coefficients, etc.).  
        │     └── Store the new `Voice` (or a handle to it) in `self.voices[i]`.  
        └── Return, now that voice is “active.”

(5) Synthesizer::note_off(channel, key, velocity):
        ├── Search through `self.voices` for any voice whose channel/key match this note.  
        ├── For each such voice, call `voice.note_off()` (which typically sets the envelope into its “release” stage).  
        └── Return (voice remains “active” until its envelope fully dies out, at which point Synthesizer may garbage-collect it next block).

(6) Synthesizer::render(left: &mut [f32], right: &mut [f32]):
        ├── Zero out `left[]` and `right[]` for this block.  
        ├── For each active `voice` in `self.voices`:
        │     └── Call `voice.process_block(&mut voice_buf_l, &mut voice_buf_r)`.  
        │           • Inside `Voice::process_block(...)`:  
        │             ├── For each sample index `n` in the block:  
        │             │     ├── `osc_sample = self.oscillator.next_sample()`  
        │             │     ├── `amp_envelope = self.envelope.next_amplitude()`  
        │             │     └── `mixed = osc_sample * amp_envelope`  
        │             │           (optionally: apply per-voice LFO mod, filters, etc.)  
        │             │  
        │             ├── Once the raw waveform is generated, run it through per-voice filters:  
        │             │     • e.g. `comb_out = comb_filter.process(mixed)`  
        │             │     • e.g. `all_pass_out = all_pass_filter.process(comb_out)`  
        │             │     • …repeat for each filter in `self.comb_filters` and `self.all_pass_filters`.  
        │             └── Write the final result into `voice_buf_l[n]` and/or `voice_buf_r[n]`.  
        ├── Accumulate each voice’s output into the master block:  
        │     • `left[n]  += voice_buf_l[n]`  
        │     • `right[n] += voice_buf_r[n]`  
        ├── Once all voices have contributed, apply **global effects** in this order (by default):  
        │     1. `self.reverb.process(&mut left, &mut right)`  
        │     2. `self.chorus.process(&mut left, &mut right)`  
        ├── Multiply each sample in `left[]` and `right[]` by `self.master_volume`.  
        └── Return from `render(…)`—the caller (sequencer or user code) now has a filled audio buffer.

```

## 4. Summary of “Who Calls Whom”

Below is a compact list of “call edges” at runtime, annotated with which module implements which function:

1. **User → `SoundFont::new(&mut R: Read + Seek) : Result<SoundFont, SoundFontError>`**  
   (in `sound_font.rs`)

2. **User → `MidiFile::new(&mut R: Read + Seek) : Result<MidiFile, MidiFileError>`**  
   (in `midi_file.rs`)

3. **User → `Synthesizer::new(&Arc<SoundFont>, &SynthesizerSettings) : Result<Synthesizer, SynthesizerError>`**  
   (in `synthesizer.rs`)  
   • inside this constructor, it calls:  
     – `preset_lookup = SoundFont::build_preset_lookup()` (in `sound_font.rs`)  
     – allocates `Vec<Voice>` slots (initially all “inactive”)  
     – constructs `Vec<ChannelState>` for 16 MIDI channels  
     – creates `Reverb::new(sample_rate)` (in `reverb.rs`) and `Chorus::new(sample_rate)` (in `chorus.rs`)  
     – stores `block_left = Vec::with_capacity(block_size)`, `block_right = Vec::with_capacity(block_size)`, etc.

4. **User → `MidiFileSequencer::new(synth: Synthesizer) : MidiFileSequencer`**  
   (in `midi_file_sequencer.rs`)  
   • stores `synth` internally, sets internal “cursor = 0,” no audio generated yet.

5. **User → `MidiFileSequencer::play(&MidiFile, loop_flag: bool)`**  
   (in `midi_file_sequencer.rs`)  
   • resets time to zero, sets up internal event iterator from the `MidiFile`.

6. **Caller (sequencer or user) → `MidiFileSequencer::render(left, right)`**  
   (in `midi_file_sequencer.rs`)  
   • computes which MIDI events fall into this block’s timestamp range, and for each event:  
     – If `NoteOn`, calls `synth.note_on(channel, key, velocity)`.  
     – If `NoteOff`, calls `synth.note_off(channel, key, velocity)`.  
   • after processing all events, calls `synth.render(left, right)`.

7. **Sequencer → `Synthesizer::note_on(channel, key, velocity)`**  
   (in `synthesizer.rs`)  
   • looks up the appropriate `PresetRegion` via a hash map built at construction.  
   • calls `Voice::new( preset_region, sample_rate )`  
   • stores that `Voice` in the first free slot of `self.voices`.

8. **Sequencer → `Synthesizer::note_off(channel, key, velocity)`**  
   (in `synthesizer.rs`)  
   • finds matching voice(s), calls `voice.note_off()`. (Voice will enter its release phase.)

9. **Sequencer or user → `Synthesizer::render(left, right)`**  
   (in `synthesizer.rs`)  
   • zeroes out both `left` and `right` buffers.  
   • loops over every active `Voice` in `self.voices` and calls `voice.process_block(voice_buf_l, voice_buf_r)`.  
   • inside each `voice.process_block(...)` (in `voice.rs`):  
     – calls `Oscillator::next_sample()` repeatedly (in `oscillator.rs`).  
     – calls `Envelope::next_amplitude()` for amplitude shaping (in `envelope.rs`).  
     – sends the raw sample through each `CombFilter::process(sample)` (in `comb_filter.rs`).  
     – then through each `AllPassFilter::process(sample)` (in `all_pass_filter.rs`).  
     – writes the final per-voice sample into `voice_buf_l[n]` and `voice_buf_r[n]`.  
   • the synth accumulates each `voice_buf_l`/`voice_buf_r` into the master `left`/`right` block.  
   • after all voices are done, calls:  
     – `Reverb::process(left, right)` (in `reverb.rs`), which internally runs a bank of `CombFilter`s and `AllPassFilter`s to produce a stereo reverb tail.  
     – `Chorus::process(left, right)` (in `chorus.rs`), which applies a short, modulated delay to thicken the sound.  
     – scales `left[]` and `right[]` by `self.master_volume`.  
   • returns.

---

## 5. “Who Depends on Whom” Recap

Below is a summary list of the modules (in descending dependency order), reiterating what we already sketched above:

1. **`error.rs`**  
   - Defines `MidiFileError`, `SoundFontError`, `SynthesizerError`.  
   - No dependencies on other crate modules (beyond core/std).  

2. **`sound_font.rs`**  
   - Depends on `error::SoundFontError` and `std::io::{Read, Seek}`.  
   - Exposes types like `SoundFont`, `Preset`, `InstrumentRegion`, `SampleHeader`.  

3. **`midi_file.rs`**  
   - Depends on `error::MidiFileError` and core I/O traits.  
   - Exposes `MidiFile`, `MidiEvent`, etc.

4. **`midi_file_sequencer.rs`**  
   - Depends on `midi_file::MidiFile` + `MidiEvent`.  
   - Depends on `synthesizer::Synthesizer` (calls its `note_on`, `note_off`, `render`).  

5. **`synthesizer_settings.rs`**  
   - No cross‐deps (just holds basic numeric fields).  

6. **`synthesizer.rs`**  
   - Depends on:  
     - `sound_font::SoundFont`  
     - `synthesizer_settings::SynthesizerSettings`  
     - `voice::Voice`  
     - `reverb::Reverb`  
     - `chorus::Chorus`  
     - Basic containers (`Vec`, `Arc`, etc.)  

7. **`voice.rs`**  
   - Depends on:  
     - `oscillator::Oscillator`  
     - `envelope::Envelope`  
     - `comb_filter::CombFilter`  
     - `all_pass_filter::AllPassFilter`  
   - Also references some of the data structures from `sound_font` (e.g. the `SampleHeader` inside an `InstrumentRegion`).  

8. **`oscillator.rs`**, **`envelope.rs`**, **`comb_filter.rs`**, **`all_pass_filter.rs`**  
   - These are leaf modules. They do not depend on any other RustySynth module. They implement low-level DSP building blocks (waveform generation, ADSR envelopes, comb/all-pass filters).

9. **`reverb.rs`**  
   - Depends on `comb_filter::CombFilter` and `all_pass_filter::AllPassFilter`.  
   - Implements a stereo reverb by chaining eight comb filters + four all-pass filters per channel.

10. **`chorus.rs`**  
    - Typically implements a simple stereo chorus (delay lines + LFO).  
    - No further cross-deps (just basic numeric math).

---

## 6. Putting It All Together

1. **Build-time/compile-time structure**  
   - At compile time, Cargo’s feature resolver v2 (see `resolver = "2"` in `Cargo.toml`) wires up all these modules into one library.  
   - The `lib.rs` (in `rustysynth/src/lib.rs`) has lines like:
     ```rust
     mod error;
     mod sound_font;
     mod midi_file;
     mod midi_file_sequencer;
     mod synthesizer_settings;
     mod synthesizer;
     mod voice;
     mod oscillator;
     mod envelope;
     mod comb_filter;
     mod all_pass_filter;
     mod reverb;
     mod chorus;

     pub use error::{MidiFileError, SoundFontError, SynthesizerError};
     pub use sound_font::SoundFont;
     pub use midi_file::{MidiFile, MidiEvent};
     pub use midi_file_sequencer::MidiFileSequencer;
     pub use synthesizer_settings::SynthesizerSettings;
     pub use synthesizer::Synthesizer;
     ```
   - This exports exactly the high-level types a user needs:  
     • `SoundFont` (plus associated errors)  
     • `MidiFile` (plus associated errors)  
     • `SynthesizerSettings`  
     • `Synthesizer` (and its methods: `note_on`, `note_off`, `render`)  
     • `MidiFileSequencer` (and its methods: `play`, `render`)

2. **Run-time call graph**  
   - The user first loads a SoundFont (calling into `sound_font::SoundFont::new(...)`).  
   - Then they construct a `Synthesizer`, which in turn calls into `reverb::Reverb::new`, `chorus::Chorus::new`, and sets up the voice‐pool (`Vec<Voice>`) inside `voice.rs`.  
   - Each time `note_on` is invoked, `synthesizer::Synthesizer` instantiates a `Voice` by calling `voice::Voice::new(...)`. That in turn calls constructors in `oscillator`, `envelope`, `comb_filter`, and `all_pass_filter`.  
   - On every audio block, `Synthesizer::render` loops over voices and calls `Voice::process_block`, which in turn calls:  
     - `Oscillator::next_sample` (in `oscillator.rs`)  
     - `Envelope::next_amplitude` (in `envelope.rs`)  
     - `CombFilter::process` (in `comb_filter.rs`)  
     - `AllPassFilter::process` (in `all_pass_filter.rs`)  
   - The block of per-voice samples is summed into a master buffer, then handed to `Reverb::process` (in `reverb.rs`) and `Chorus::process` (in `chorus.rs`), and finally scaled by `master_volume`.

3. **Sequencer integration**  
   - If the user wants to play a MIDI file, they first call `MidiFile::new(...)` (in `midi_file.rs`) to parse tracks/events.  
   - They then create a `MidiFileSequencer` (in `midi_file_sequencer.rs`), passing in the `Synthesizer`.  
   - Each time they call `sequencer.render(...)`, the sequencer:  
     1. Advances its internal time cursor by `block_size` samples.  
     2. Emits any scheduled `NoteOn`/`NoteOff` events via `Synthesizer::note_on/ note_off`.  
     3. Calls `Synthesizer::render(...)` to fill the next block of audio.

---

### In a Nutshell

- **“Structure dependency”** (compile-time):  
```
error.rs
↑
sound_font.rs       midi_file.rs
↑                    ↑
synthesizer_settings.rs
↑
synthesizer.rs ←─ voice.rs ←─ (oscillator.rs, envelope.rs, comb_filter.rs, all_pass_filter.rs)
↑                                     ↑
midi_file_sequencer.rs                └─ reverb.rs (also depends on comb & all_pass)
└─ chorus.rs
```
- **“Call hierarchy”** (run-time):  
1. User → `SoundFont::new` (parses SF2)  
2. User → `Synthesizer::new` (builds voice pool, effect units)  
3. (Optional) User → `MidiFile::new` (parses MIDI file)  
4. (Optional) User → `MidiFileSequencer::new(synth)`  
5. Each audio block →  
   - Sequencer → `note_on`/`note_off` on `Synthesizer` for timed events  
   - Sequencer (or user-thread) → `Synthesizer::render(left, right)`  
     • `Synthesizer::render` → calls each `Voice::process_block`  
     • `Voice::process_block` → `Oscillator::next_sample` → `Envelope::next_amplitude` → `CombFilter::process` → `AllPassFilter::process`  
     • After all voices are summed, `Synthesizer::render` → `Reverb::process` → `Chorus::process` → scale by master volume.

This should give you a clear picture of (a) how the modules depend on one another in the source tree, and (b) how, at run time, each call eventually fans out into the low-level DSP building blocks. We will explore any particular module more deeply—e.g. the exact algorithm inside `CombFilter::process` or how `PresetRegion` data flows into `Voice::new` next as needed.

