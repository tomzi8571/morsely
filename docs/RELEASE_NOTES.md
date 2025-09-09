# Release Notes

All notable changes to this project will be documented in this file.

## [25.9.9]

- added a progress bar for exersices. Now you can also see visually, using dots in the progress bar, how many exersices 
  there are in one progression.
- refactored morsekey.svg to more accurately reflect the timing for . and -. Now the lever presses down very quickly and then
  in both cases, like in real life and stays for a certain time depending on . or -, until it releases again. 
  Additionally a time gap between symbols has been added (currently we had a time gap between letters and words)
- Added recommended timings from https://morsecode.world/international/timing/

## [25.9.x]

- introduce new version numbering year.month.day.patch
- updated UI
- added new icons for streak and highscore and moved it to the top.
  created new components for both
- redid the navigation bar
- extracted some svg into its own files and folder
- Added more exercises
- added more favicons
- moved for some React components the css into the .module.css files
- added new documentation for AI-prompts used during development
- synced manifest.json and manifest.webmanifest for the PWA by
  letting it generate by[RELEASE_NOTES.md](RELEASE_NOTES.md) the vite.config.js
- added a serviceworker to reload the app when a new version is deployed
- fixed layout issue to make it fullscreen on mobile devices
  and compute the correct height for the footer using 'keyboard-inset-height'
- added \<input> is automatically focused on desktop application, where
  a keyboard is available and on mobile devices you need to touch the
  the main component to open the keyboard.
- Prevent to open the keyboard on mobile devices when the nav or menu
  is clicked.
- added logging framework
- fixed issue when menu is closed or navbar icons are clicked, the input element
  wasn't refocused on the desktop ap any more.
- also added dynamic letter specing between the morse code letters
- added morsekey_OS.svg - just for fun :)

## [0.1.0]

### Added

- Initial app scaffold and README with project background.
- Deployment notes for Netlify.
- Basic mobile-friendly UI approach described.
