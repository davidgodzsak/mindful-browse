# CLAUDE.md - Development Guide for Claude Bots

This file provides guidance to Claude Code when working on this Firefox extension project.

## Project Overview

**Distraction Limiter** is a Firefox extension that helps users stay focused by limiting time spent on distracting websites. Users can:
- Set daily time limits for specific sites or groups of sites
- Set open count limits (how many times a site can be visited per day)
- Receive motivational messages when limits are reached
- Quickly add limits from the toolbar popup

**Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Manifest V3

## Architecture Overview

The extension follows a **modular event-driven architecture** with three main layers:

### 1. Background Scripts (`src/background_scripts/`)
Non-persistent event handlers that manage the extension's core logic:

- **`background.js`**: Main event router listening to browser events (alarms, navigation, messages, toolbar clicks)
- **`site_storage.js`**: CRUD operations for sites and limits
- **`group_storage.js`**: CRUD operations for site groups
- **`usage_recorder.js`**: Tracks time spent and visits per site via alarms
- **`distraction_detector.js`**: Detects if current URL matches any limited sites (flexible pattern matching)
- **`site_blocker.js`**: Blocks/redirects users to timeout page when limits are reached
- **`badge_manager.js`**: Updates toolbar badge with remaining time
- **`daily_reset.js`**: Triggers daily reset of usage stats via alarms
- **`note_storage.js`**: Stores motivational messages for blocked sites
- **`usage_storage.js`**: Daily usage data persistence
- **`validation_utils.js`**: Input validation for sites, limits, notes

### 2. UI Components (`src/pages/` and `src/components/`)
React components that run in isolated contexts:

- **`pages/popup/`**: Toolbar popup component (PluginPopup.tsx) with quick limit setup
- **`pages/settings/`**: Settings page (SettingsPage.tsx) for managing sites, groups, and limits
- **`pages/timeout/`**: Timeout page (TimeoutPage.tsx) shown when users hit their limits

### 3. Shared Libraries (`src/lib/`)
- **`api.ts`**: Type-safe message passing wrapper for background script communication
- **`storage.ts`**: Type definitions and converters for storage objects

## Key Patterns

### Event-Driven Architecture
- Background script listens to: `browser.alarms.onAlarm`, `browser.webNavigation.onBeforeNavigate`, `browser.runtime.onMessage`, `browser.action.onClicked`
- All state stored in `chrome.storage.local`
- Modules are stateless (data fetched on each event)

### Real-Time Synchronization
- UI changes trigger `broadcast_update` messages from background script
- All UI components listen for broadcasts via `useBroadcastUpdates` hook
- Updates are immediate across all open tabs and pages

### Message Passing Protocol
Every message follows this structure:
```typescript
interface Message {
  type: string;
  payload?: any;
  // Background responds with: { success: boolean, data?: any, error?: { message, type, isRetryable } }
}
```

### Site Matching
Flexible URL pattern matching:
- Domain: `facebook.com` matches any path/subdomain
- Subdomain: `mail.google.com` matches exact subdomain
- Protocol: `https://twitter.com` includes protocol
- Case-insensitive matching

### Limit Types
- **Time Limits**: Minutes (1-1440), tracked via daily alarms checking chrome.storage
- **Open Count Limits**: Site visits (1-100), tracked on webNavigation.onBeforeNavigate
- **Combined**: Sites can have both; blocked when ANY limit reached

## Common Development Tasks

### Adding a New Feature
1. Define message types in background script
2. Implement handler in appropriate background module
3. Add API wrapper in `src/lib/api.ts`
4. Use API in React component with proper error handling
5. Add broadcast update if it affects other UI components
6. Test message passing and state synchronization

### Modifying Site Storage
- Always go through `site_storage.js` functions (not direct storage access)
- Changes trigger `broadcast_update` to notify UI
- Automatic cache invalidation in background script

### Updating UI in Real-Time
- Components use `useBroadcastUpdates` hook to listen for background updates
- Hook automatically re-renders when relevant updates occur
- See `PluginPopup.tsx` for example implementation

### Handling Limit Enforcement
- `site_blocker.js` checks limits on every navigation
- If limit reached, user redirected to timeout page
- Timeout page shows remaining time and motivational message
- Opening the blocked site again re-checks limits

## Code Standards

### File Organization
- Keep background scripts under 600 lines
- Group related logic together
- Use clear, descriptive function names
- Export only necessary functions

### Error Handling
- Validation happens early via `validation_utils.js`
- Background script wraps responses in `{ success, data, error }`
- API wrapper throws on errors with categorized error types
- UI components catch and display user-friendly error messages

### TypeScript
- Use strict mode (tsconfig.json)
- Define interfaces in `src/lib/storage.ts` for storage objects
- API responses include proper type definitions
- React components use proper event handler typing

### Testing
- Unit test background scripts in isolation
- Integration tests verify message passing between components
- Test storage operations with mock storage

## Storage Schema

```
chrome.storage.local keys:
- distracting_sites: Site[] (array of site objects with limits)
- site_groups: Group[] (array of group objects)
- usage_data: { [siteId]: UsageEntry } (daily tracking)
- timeout_notes: { [siteId]: string } (motivational messages)
- extension_version: string (for migrations)
```

## Building & Running

```bash
# From root directory
npm run build          # Build dist/
npm run dev           # Dev server with HMR
npm run lint          # ESLint check
npm run preview       # Preview production build

# To load in Firefox:
1. Go to about:debugging
2. Click "This Firefox"
3. Click "Load Temporary Add-on"
4. Select src/manifest.json
```

## Important Notes

- **Manifest V3 Compliance**: Use `chrome.alarms` instead of `setInterval`/`setTimeout` for background tasks
- **Non-persistent Background**: Background script only runs when events occur
- **Message Passing**: All communication goes through browser.runtime.sendMessage
- **Storage Limits**: chrome.storage.local has limits (~10MB total)
- **Security**: Always validate user input; avoid eval; sanitize URLs

## Common Gotchas

1. **State Management**: Don't try to store state in background script variables; always use chrome.storage
2. **Event Handlers**: Each event listener should be defined at top-level in background.js
3. **Alarms**: Create alarms in initialization; they persist across extension reloads
4. **Cache Invalidation**: Changes to sites/limits need to update badge, re-check blocked tabs
5. **URL Matching**: The same URL pattern may match multiple sites; extension blocks based on highest match priority

## References

- [MDN WebExtensions API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/)
- [React Component Docs](https://react.dev/)
- [shadcn/ui Components](https://ui.shadcn.com/)
