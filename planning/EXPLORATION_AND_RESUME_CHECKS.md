# Exploration-only journal and mouse capture resume

- Removed direct browsing from the welcome menu, pause menu, all village notices and game footer. Removed the reveal-all state and journal rendering branch, not just the shortcut labels.
- Journal entries remain locked until discovered. Existing saved discoveries and the six-entry gate condition are unchanged. Back to portfolio remains available from pause.
- Resume now waits for browser-confirmed mouse capture. A denied Escape request leaves movement paused with Click to continue, rather than returning to free-cursor play. A click retries capture. Any capture refusal also offers an explicit right-drag alternative, including browser restrictions whose error is not classified as unsupported.
- The capture session supports promise-based and event-only browser APIs, handles both rejection and synchronous errors, avoids double resume, and invalidates late requests after returning to menus.
- Browser checks at a fresh localhost origin: zero clickable entries and seven locked placeholders; no direct-browse labels on welcome, pause, welcome notice or square notice. Visited both notices through actual movement. Movement stays stationary during pending capture. Escape and click resume cycles work with explicit right-drag mode.
- In-app browser returns WrongDocumentError for pointer lock. Full native capture and physical camera reacquisition cannot be verified there; automated capture-session regressions cover success, denial, retry, duplicate events and cancelled requests. No browser security rule is bypassed.
- Production packaging, physics, camera, journal/gate and mouse-capture regression tests pass.
