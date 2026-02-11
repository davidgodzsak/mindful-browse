# Code Cleanup & Refactoring Plan

**Purpose**: Clean the codebase for maintainability without changing functionality.
**Scope**: Zero functional changes, pure refactoring/organization.

---

## Phase 1: Inventory & Analysis (INFORMATIONAL ONLY)

### A. UI Components Audit
**Status**: Need to verify which shadcn/ui components are actually used vs unused

**Current imports across codebase**:
- ✅ USED: Button, Card, CardContent, CardHeader, CardTitle, Input, Badge, Tabs, TabsContent, TabsList, TabsTrigger, Switch, Progress, Textarea, Loader2, Plus, Search, Trash2, Edit2, Clock, MousePointerClick, ChevronDown, ChevronRight, etc.
- ❌ LIKELY UNUSED: Alert, AlertDialog, Accordion, Breadcrumb, Calendar, Carousel, Chart, Checkbox, Collapsible, Command, ContextMenu, Dialog, Drawer, DropdownMenu, Form, HoverCard, InputOTP, Label, Menubar, NavigationMenu, Pagination, Popover, RadioGroup, Resizable, ScrollArea, Select, Sheet, Sidebar, Skeleton, Slider, Sonner, ToggleGroup, Toggle, Tooltip

**Action**:
- [ ] Search codebase for actual usage of each unused component
- [ ] Keep UI components folder untouched (do NOT delete)
- [ ] Add note to CLAUDE.md: "components/ui folder contains pre-made shadcn/ui components. Never delete or modify these files. Only use them in application code."

### B. File Size & Structure Analysis
- `PluginPopup.tsx`: 989 lines → **TOO LARGE** (target: 200-300)
- `SettingsPage.tsx`: 1245 lines → **TOO LARGE** (target: 300-400)
- `TimeoutPage.tsx`: 342 lines → **ACCEPTABLE**
- `api.ts`: 402 → 282 lines ✅
- Background scripts: Mixed sizes

---

## Phase 2: Extract Constants & Helpers ✅ COMPLETE

### Task 1: Create `src/constants/urls.ts` ✅
Extract hardcoded URL patterns and page identifiers:
- Created with helper functions: `isTimeoutPage()`, `isSettingsPage()`, `isExtensionPage()`
- Eliminates string literals scattered throughout codebase

### Task 2: Create `src/lib/utils/formatting.ts` ✅
Extract repeated formatting/conversion logic:
- `secondsToMinutes()` - consolidated conversion logic
- `formatTimeLimit()` - format limit seconds to minutes
- `formatTimeUsed()` - format used time
- `formatLimitDisplay()` - format original → extended display

### Task 3: Create `src/lib/utils/notifications.ts` ✅
Extract repeated toast notification patterns:
- Created `NOTIFICATIONS` object with common patterns
- Success helpers: `siteAdded()`, `groupCreated()`, `trackingEnabled()`, etc.
- Error helpers: `loadingFailed()`, `saveFailed()`, `addFailed()`, etc.

### Task 4: Create `src/constants/suggestions.ts` ✅
Move hardcoded suggestions array from TimeoutPage to shared constant:
- Moved `ACTIVITY_SUGGESTIONS` array with type definitions
- Moved `DEFAULT_QUOTES` array
- All imports consolidated in one place

---

## Phase 3: Remove Excessive Documentation ✅ COMPLETE

### Task 1: Simplify `api.ts` doc comments ✅
- Removed JSDoc comments on every function
- Removed file header comments
- File reduced from 402 → 282 lines (-120 lines, 30% reduction)

### Task 2: Reduce background script comments ✅
- Removed verbose listener registration logs from background.js
- Simplified startup initialization logging in background.js
- Removed JSDoc comments from site_blocker.js
- Removed verbose console.log statements from checkAndBlockSite function
- site_blocker.js reduced by ~40 lines

### Task 3: General comment cleanup ✅
- Found only 2 TODO comments in HTML template (not critical)
- No FIXME, DEBUG, or HACK comments found
- Remaining console.log statements are useful debug info (kept for troubleshooting)

**Phase 2 Summary**:
- Removed 120+ lines of excessive JSDoc documentation
- Removed 40+ lines from background scripts
- api.ts: 402 → 282 lines (-30%)
- Build passes: ✅

---

## Phase 4: Reduce Logging & Debug Code ✅ COMPLETE

### Task 1: Consolidate logging in background scripts ✅
- [x] Removed verbose console.log statements logging objects and intermediate states
- [x] Removed 30+ verbose debug logs from site_blocker.js
- [x] Kept console.warn and console.error for actual error conditions
- [x] Cleaned up handlePotentialRedirect logging
- site_blocker.js: Reduced from ~320 to 288 lines

### Task 2: Check for debug/mock data ✅
- [x] Searched for hardcoded test data - found none
- [x] Removed unnecessary console.log statements from production code
- [x] Only kept essential error/warning logs

---

## Phase 5: Extract React Components (NOT STARTED)

### Task 1: Split `PluginPopup.tsx` (989 lines)
**Create new files:**
- `src/components/popup/NormalPageView.tsx` - Regular site tracking UI
- `src/components/popup/DisabledStateView.tsx` - Disabled site/group UI
- `src/components/popup/TimeoutPageView.tsx` - Timeout page UI with extension form
- `src/components/popup/SettingsPageView.tsx` - Settings page info
- `src/components/popup/UnlimitedSiteView.tsx` - Non-tracked site UI

**Extract utilities:**
- `src/lib/hooks/usePageInfo.ts` - Page info loading logic
- `src/lib/hooks/useExtension.ts` - Extension form state management

**Reduce main component to**: ~150-200 lines (routing logic only)

### Task 2: Split `SettingsPage.tsx` (1245 lines)
**Create new files:**
- `src/components/settings/IndividualSitesTab.tsx` - Sites list & management
- `src/components/settings/GroupsTab.tsx` - Groups management
- `src/components/settings/MessagesTab.tsx` - Messages & preferences

**Extract utilities:**
- `src/lib/hooks/useSettings.ts` - Data loading and broadcast updates
- `src/lib/hooks/useSettingsMutations.ts` - All API call handlers

**Reduce main component to**: ~200-250 lines (layout & tab routing)

---

## Phase 6: Reduce State Duplication (NOT STARTED)

### Task 1: Consolidate loading states in PluginPopup
- Merge `isLoading`, `isSaving` into single state if possible
- Or use consistent naming/pattern

### Task 2: Extract common patterns in SettingsPage
- Create reusable hook for toggle handlers (site enabled/disabled)
- Create reusable hook for dialog management
- Consolidate similar mutation handlers

### Task 3: Consolidate error handling
- Use consistent error message patterns
- Extract to utils for DRY principle

---

## Phase 7: Clean Up Imports & Unused Code ✅ COMPLETE

### Task 1: Audit all imports ✅
- [x] Removed Clock icon import from PluginPopup (unused)
- [x] Removed unused icon imports from TimeoutPage (BookOpen, Droplets, TreePine, Phone, Brain, Coffee)
- [x] Updated TimeoutPage to import from @/constants/suggestions
- [x] Eliminated duplicate suggestions and defaultQuotes arrays in TimeoutPage

**Files Updated:**
- PluginPopup.tsx: Removed unused Clock import
- TimeoutPage.tsx: Integrated with constants/suggestions, removed 50+ lines of duplicate code

### Task 2: Remove dead code ✅
- [x] Removed duplicate suggestions array (now using ACTIVITY_SUGGESTIONS)
- [x] Removed duplicate defaultQuotes array (now using DEFAULT_QUOTES)
- [x] No commented-out code found
- [x] No unreachable branches found

### Task 3: Clean background scripts (ALREADY DONE IN PHASE 4)
- [x] Removed verbose logging setup
- [x] Kept only essential error handling
- [x] Consolidated logging patterns

---

## Phase 8: CLAUDE.md Updates (NOT STARTED)

Add these sections to CLAUDE.md:

### UI Components Library
```
## UI Components Library

The `src/components/ui` folder contains pre-made shadcn/ui components.
This folder should **NEVER** be modified, deleted, or have files removed.

**Important**: When adding new features that need UI components:
1. Check if a matching shadcn/ui component exists in `src/components/ui`
2. Import and use it (don't reinvent)
3. If it doesn't exist, consider adding it via `npx shadcn-ui@latest add <component-name>`

Example: Use the `<Badge>` component from `src/components/ui/badge` instead of custom styling.
```

### Component Organization
```
## Component Organization Guidelines

- **Max file size**: 250 lines for components (hard limit)
- **Responsibilities**: Each component should do one thing well
- **State**: Keep state as high as possible, pass down as props
- **Hooks**: Extract complex logic into custom hooks (useX patterns)
- **Naming**: Use descriptive names that indicate the component's purpose
```

---

## Implementation Order

### ✅ COMPLETED:
1. **Phase 2**: Extract constants & helpers ✅
2. **Phase 3**: Remove doc comments ✅
3. **Phase 4**: Reduce logging & debug code ✅
4. **Phase 7**: Clean up imports & dead code ✅

### NEXT (Recommended order):
5. **Phase 5**: Split large components (biggest impact)
6. **Phase 6**: Reduce state duplication (within components)
7. **Phase 1**: UI audit (informational)
8. **Phase 8**: Update documentation

---

## Summary of Progress

**Lines Removed/Refactored:**
- Phase 2: 4 new helper files created (consolidating repeated patterns)
- Phase 3: api.ts 402 → 282 lines (-120 lines, 30%)
- Phase 4: site_blocker.js ~320 → 288 lines (-32 lines)
- Phase 7: TimeoutPage ~340 → 280 lines (-60 lines from duplicate code removal)
- Total documentation & dead code removed: 200+ lines

**Code Quality Improvements:**
- Unused imports removed (Clock from PluginPopup, icon imports from TimeoutPage)
- Duplicate code eliminated (suggestions and defaultQuotes now using constants)
- Dead icon imports removed (BookOpen, Droplets, TreePine, Phone, Brain, Coffee)
- Constants properly imported and reused across components

**Build Status**: ✅ All passes (1.84s)

---

## Testing Strategy

- No functional changes = existing tests should pass
- Manual testing after each phase:
  1. Build with `npm run build` (should succeed)
  2. Check for TypeScript errors: `npx tsc --noEmit`
  3. Check for linting errors: `npm run lint`
  4. Manual smoke tests:
     - Navigate popup on normal page
     - Navigate popup on timeout page
     - Open settings page
     - Check all tabs work
     - Add/edit/delete sites
     - Create/edit/delete groups

---

## Size Targets

| File | Current | Target | Reasoning |
|------|---------|--------|-----------|
| PluginPopup.tsx | 989 | 150-200 | Main routing only, split views |
| SettingsPage.tsx | 1245 | 200-250 | Layout & routing, split tabs |
| TimeoutPage.tsx | 342 | ~300 | Extract constants, keep logic |
| api.ts | 402 | ~350 | Remove doc comments, keep structure |
| New component files | - | 150-250 | Split from large components |

---

## Files to Create

```
src/
├── constants/
│   ├── urls.ts (new)
│   ├── suggestions.ts (new)
│   └── messages.ts (new if needed)
├── lib/
│   └── utils/
│       ├── formatting.ts (new)
│       ├── notifications.ts (new)
│       └── validation.ts (potentially refactor)
├── hooks/ (create if needed)
│   ├── usePageInfo.ts (new)
│   ├── useExtension.ts (new)
│   ├── useSettings.ts (new)
│   └── useSettingsMutations.ts (new)
└── components/
    ├── popup/
    │   ├── NormalPageView.tsx (new)
    │   ├── DisabledStateView.tsx (new)
    │   ├── TimeoutPageView.tsx (new)
    │   ├── SettingsPageView.tsx (new)
    │   └── UnlimitedSiteView.tsx (new)
    └── settings/
        ├── IndividualSitesTab.tsx (new)
        ├── GroupsTab.tsx (new)
        └── MessagesTab.tsx (new)
```

---

## Risk Assessment

**Low Risk Changes**:
- Extracting constants
- Removing comments
- Removing logs
- Cleaning up imports
- Extracting utilities

**Medium Risk Changes**:
- Splitting large components (must test thoroughly)
- Extracting hooks
- State management changes (within components)

**Testing Coverage**:
- TypeScript compilation must pass
- Linting must pass
- Manual UI testing for all affected pages
- Build must succeed with no errors
