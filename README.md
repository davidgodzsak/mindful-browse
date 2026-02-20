#  Mindful Browse

A modern Firebrowserfox extension that helps you stay focused by limiting time spent on distracting websites.

## Features

- ⏱️ **Time Limits**: Set daily time limits (in minutes) for any website
- 🔢 **Open Count Limits**: Limit how many times you can visit a site per day
- 👥 **Site Groups**: Organize related sites and apply limits to groups
- 🎨 **Clean UI**: Beautiful, modern interface with soft design language
- 📱 **Real-time Updates**: See remaining time instantly in the toolbar
- 💬 **Motivational Messages**: Customize messages shown when limits are reached
- 🔄 **Auto Reset**: Daily limits reset automatically at midnight

## Quick Start

### Prerequisites
- Firefox 112+
- Node.js 18+ and npm/yarn

### Installation for Development

```bash
# Install dependencies
npm install

# Build the extension
npm run build

# Or run in development mode with hot reload
npm run dev
```

### Load in Firefox

1. Navigate to `about:debugging`
2. Click **"This Firefox"**
3. Click **"Load Temporary Add-on"**
4. Select `src/manifest.json`

The extension icon should appear in your toolbar!

## Usage

### Quick Limit (Toolbar Popup)
1. Click the extension icon while on any website
2. Select a time limit preset (15 min, 30 min, 60 min)
3. The limit is added immediately

### Full Settings Page
1. Click "Open Settings" in the popup
2. Add sites with custom time or open count limits
3. Create groups to limit multiple sites together
4. Add motivational messages for when limits are reached

### When a Limit is Reached
- The site is blocked and redirected to a timeout page
- Shows remaining time and your custom motivational message
- Opens automatically each day after reset

## Project Structure

```
src/
├── background_scripts/     # Core extension logic
│   ├── background.js      # Event router
│   ├── site_blocker.js    # Blocking logic
│   ├── usage_recorder.js  # Time tracking
│   ├── distraction_detector.js
│   └── ...other modules
├── pages/
│   ├── popup/             # Toolbar popup
│   ├── settings/          # Settings page
│   └── timeout/           # Limit reached page
├── components/            # React UI components
├── lib/
│   ├── api.ts            # Background script API
│   └── storage.ts        # Data types
└── manifest.json         # Extension configuration
```

## Development

### Available Scripts

```bash
npm run dev          # Start dev server with HMR
npm run build        # Production build
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Architecture

- **Event-Driven**: Background script listens to browser events (navigation, alarms, messages)
- **Stateless Modules**: All state stored in `chrome.storage.local`
- **Real-Time Sync**: UI components receive live updates via message broadcasts
- **Manifest V3**: Modern extension API with non-persistent background scripts

For detailed architecture information, see [CLAUDE.md](./CLAUDE.md).

## Technologies

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Extension**: Manifest V3 (Browser WebExtensions API)
- **State**: Chrome Storage API
- **Build**: Vite with TypeScript support

## License

See LICENSE file for details.

## Support

For issues or feature requests, please open an issue on GitHub.
