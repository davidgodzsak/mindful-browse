# TODO

## Bugs

### Timeout page
-[ ] Randomize with default suggestions not working
-[ ] Randomize button makes the dots that show different quotes disappear. Also Randomize button should be a bit bigger and be below the dots, not inline.
-[ ] Hard to click the dots to select a new message
-[ ] Both the Big message and the carousel of messages does not really make sense

### Settings page
-[x] Editing individual site does not work, when clicking on the edit icon nothing happens it should show the same dialog as the create, but prefilled
-[ ] Limit tab -> Add site button should be inside individual sites title line, not next to the searchbar
-[ ] Limit tab -> searchbar not working it should filter both individual sites and groups (expand the group if it contains a match)
-[~] Groups tab -> Edit group when removing open or time limit and then clicking update group button, it does not store the changes (it should be required to add either time or open limit, but not required both at once)
-[x] Limits tab -> when adding a new item to a group then it adds an empty item to the individual sites as well, when refreshing the page then htey disappear
-[ ] Limit tab -> Add new site dialog -> Let's remove the quick presets, not needed 

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
-[ ] Do we need all 3 TS config files, postcss.config.js, eslint.config.js, components.json, bun.lockb?
-[ ] Be able to limit just a subdomain or a subpage (e.g. shorts.youtube.com or reddit.com/r/hungary)

### Settings page
-[ ] be able to turn limits on or off by having a "switch" button next to each page in the limits tab (even on pages individually that are in a group) (reuse the one in the settings -> messages tab -> display options)

### Statistic pages
-[ ] Track how much time we spend on each site and how many times we open each site
-[ ] Track which page we try to open even after the limit is hit
-[ ] Make visualisations of tracked data
-[ ] Display changes or trends over days/weeks/months
-[ ] Suggest distracting pages to add limits to (but remember it's ok to spend time on pages that are not distracting: e.g. jira, github, etc.), if the user cancels a suggestion then let's remember and not try to suggest it again