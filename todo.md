# TODO

## Bugs

### Timeout page
-[ ] Randomize with default suggestions not working
-[ ] Randomize button makes the 
-[ ] Hard to click the dots to select a new message
-[ ] Both the Big message and the carousel of messages does not really make sense

### Settings page
-[ ] Editing individual site does not work
-

### Popup
- [ ] Quick presets should have 2 lines, one for adding time limit, one for adding opens limit
- [ ] It should only have one "add limit" button, not separately for time and open limit
- [ ] It should have a working "add to group". The "add to group" button should be below "add limit" button divided by a ----- OR ------

## Improvements

### General
-[ ] Popup on the timeout page and settings should show something different, not the regular "not tracked"
-[ ] Be able to extend current limit for a day, but needs an explanation of at least 35 characters this is somewhere not obvious on the timout page and the popup.
-[ ] Clean clutter: Simplify code, create a "mental map" and check what can be reused across pages, Delete dead code, delete unnecessary logging and error handling, delete mock data, delete unnecessary components
-[ ] Make sofisticated tests
-[ ] Refactor to actually use locales, remove eery hardcoded string in favor of this. 

### Settings page
-[ ] be able to turn limits on or off by having a "switch" button next to each page in the limits tab (even on pages individually that are in a group) (reuse the one in the settings -> messages tab -> display options)