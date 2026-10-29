# Village soundscape

## Current sound design

- Footsteps use the three recordings supplied in the local `Audio design/` folder. Eight path impacts come from minimilka's book foley, seven wood impacts from Fewes, and one dry grass impact from Ali_6868. Each was cut at its own attack, filtered gently, level-matched and given short edge fades. Three mono PCM WAV banks total 157,232 bytes. Exact source hashes, edit ranges and resulting hashes are shipped in `public/audio/footsteps/receipt.json`. Credits and license links are shipped alongside them and linked from Sound settings.
- The previous synthesized footsteps and distance timer have been removed. Heel contacts in the actual traveler GLB drive each impact through the animation action's current local time. Walk contacts are at stride fractions 0 and .5; run contacts are at .45 and .95. This follows the existing animation playback rates (3.2 and 3.4) without changing travel speed or animation. Very small pitch/level variation avoids identical repetition; running is slightly stronger. Actual travel still gates sound at walls, while paused, and during teleports. Loading never queues delayed impacts.
- Recordings preload independently of the audio context. Decoding begins with the existing user gesture. Each bank can fail independently without disabling the game, wind, music or interactions. A missing floor-specific bank can use the path bank. No new tools or dependencies are installed.
- Inspecting a valid world object still produces the existing paper opening and warm chime. Stereo wind/leaves and the original eight-chord score are unchanged.
- Defaults remain: overall 70%, effects 70%, wind/leaves 45%, music 10%. Menus duck the background to 32%. Muting, zero overall volume and hidden/unfocused pages fade/suspend playback. Preferences remain under `sleeping-village.sound.v1`.

## Regression checks

- Audio tests read and animate the transform hierarchy and real tracks from `Traveler_animated.glb`. They verify that each configured contact is a descending, forward, near-ground foot, that every sound falls within one rendered frame of contact at 30-144 FPS, that animation speed changes affect cadence, and that blocked movement, menus, reset and teleports stay quiet.
- The 16 individual recorded impacts are checked for valid mono 22050 Hz PCM16 encoding, short one-shot duration, quiet endpoints, consistent finite levels, total size budget and exact provenance hashes. Existing preference, interaction, wind, reverb and score checks remain.
- Production path validation includes all three audio banks and the credit document under `/village/`, alongside the existing model, font, bundle and screenshot checks.

The original soundscape was verified with browser-native offline renders and real game playback. Follow-up recorded-footstep browser checks are recorded after validation below. Automated checks establish timing and valid rendered audio; the user's listening feedback remains the final sound-design check.

## Recorded-footstep browser verification

- The native Web Audio decoder loaded all three banks. Before entry the context remained idle; after normal entry it ran with all three banks ready. A real 1.5-second keyboard walk moved 4.4 metres and emitted ten footfalls; the counter remained at ten while idle and on opening settings. No browser errors were reported.
- Browser-native offline rendering of the actual playback graph exercised every recorded variation with walking/running animation cadence. Footsteps were finite, non-silent and unclipped: peak 0.19019, RMS 0.01203. The combined mix peaked at 0.20793. Interaction, wind and music measurements matched the preceding version (respective RMS 0.00393, 0.01136 and 0.00213).
- A fresh 28-second recorded-footstep soundscape preview is saved under ignored `.cache/recorded-footsteps-preview.wav`. The first section is path walking, then wood running, then grass walking and the existing interaction cue over the unchanged background. It is a rendering preview, not a recording of a play session.
- The Sound settings credit link resolves under `/village/audio/footsteps/CREDITS.txt` and the four volume controls retain their previous defaults.
