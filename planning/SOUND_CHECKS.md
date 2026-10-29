# First village soundscape

## Sound design and implementation

- Original runtime synthesis, with no sampled recordings, external music, new dependencies, provider accounts or audio downloads. Deterministic sound designs and the original chord progression live in `src/audio-design.ts`; native Web Audio playback and mixing live in `src/audio.ts`.
- Shoe impacts combine a low body, textured crunch and scuff, with four variations per ground type. Wooden building floors, earth paths and grass use distinct textures. Distance-based timing is quicker and slightly stronger when sprinting; idle, blocked movement, menus and teleports cannot emit a burst of missed steps.
- Inspecting any valid world object produces a short paper opening and warm chime. Footsteps stop when menus open while the interaction cue finishes normally.
- Stereo filtered wind and leaf rustle use slow gain modulation and a crossfaded noise loop. The original eight-chord score uses sustained open voicings and a few gentle high notes with reverb; the audio clock schedules it independently of graphics frame rate.
- Default volumes: overall 70%, effects 70%, wind/leaves 45%, music 10%. Menus duck the background to 32%. Mute/zero overall volume fade to silence and suspend the context; focus/visibility changes stop effects and suspend playback. Preferences persist separately from discoveries. Context creation is deferred to an ordinary user gesture.

## Verification

- Production packaging and all existing physics, camera, journal/gate and mouse-capture checks pass. New audio regressions cover saved/invalid/clamped preferences, rotated wooden floors, walking/running cadence across 30–144 FPS, walls/idle/pause/reset/teleports, varied finite waveforms with silent endpoints, stereo wind seams and reverb tails.
- Browser-native OfflineAudioContext renders tested the actual playback graph for footsteps, interactions, wind, music and the combined mix. All outputs were finite, non-silent and unclipped. At default settings, the combined peak was 0.237; music RMS was about 14.5 dB below the wind. A 28-second WAV preview was exported locally under `.cache/` and is not shipped with the game.
- Actual game check: initial audio state idle; entering starts the running context; a walk produced six footfalls, remaining at six while idle; reading the welcome sign produced one interaction cue without adding footfalls. No console errors.
- Browser mute suspended playback. After reload, mute remained checked and entering while muted left the audio context uncreated. Zero overall volume also suspended playback. Independent music volume was exercised and the default 10% restored afterward.
- The private offline-render check page and preview audio remain in ignored `.cache/`, outside production output. These checks establish rendered audio and runtime behavior; no human listening review is claimed.
