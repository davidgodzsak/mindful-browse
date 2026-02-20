# CI/CD Setup Guide: Publishing to Firefox & Chrome

This guide walks through setting up GitHub Actions to automatically publish your extension to both Firefox Add-ons (AMO) and Chrome Web Store when you create a GitHub release.

## Overview

**Workflow triggers on**: GitHub Release Published
**What it does**:
1. ✅ Builds the extension
2. 📦 Creates a zip file
3. 🦊 Publishes to Firefox Add-ons
4. 🎨 Uploads to Chrome Web Store

## Prerequisites

### 1. Firefox Add-ons (AMO)

#### Get API Credentials
1. Go to [https://addons.mozilla.org/en-US/developers/](https://addons.mozilla.org/en-US/developers/)
2. Sign in with your Mozilla account
3. Go to **Settings** → **API Keys**
4. Click **Issue New Credentials**
5. Copy the **API Key** and **API Secret**

### 2. Chrome Web Store
Just follow this: https://developer.chrome.com/docs/webstore/using-api#beforeyoubegin

## GitHub Setup - Add Secrets to GitHub

1. Go to your GitHub repository
2. **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add:

| Secret Name | Value | Where to Get |
|---|---|---|
| `FIREFOX_API_KEY` | Your Mozilla API Key | Firefox Add-ons Developer Hub |
| `FIREFOX_API_SECRET` | Your Mozilla API Secret | Firefox Add-ons Developer Hub |
| `CHROME_CLIENT_ID` | Your Google Client ID | Google Cloud Console |
| `CHROME_CLIENT_SECRET` | Your Google Client Secret | Google Cloud Console |
| `CHROME_REFRESH_TOKEN` | Your OAuth Refresh Token | Generated via curl command above |
| `CHROME_EXTENSION_ID` | Your Chrome Web Store Extension ID | Chrome Web Store Dashboard |

## Creating a Release

The release **version is the source of truth**. The workflow automatically updates `manifest.json` based on the release tag.

### Simple 2-Step Process:

**Step 1: Create a GitHub Release**

Using GitHub CLI:
```bash
git tag v1.5.1
git push origin v1.5.1

# Or go to GitHub UI:
# 1. Go to Releases page
# 2. Click "Create a new release"
# 3. Set tag to "v1.5.1" (use semantic versioning)
# 4. Add release notes explaining changes
# 5. Click "Publish release"
```

## How Versioning Works

### The Flow:

1. **You create a release** with tag `v1.5.1`
2. **Workflow extracts version** → `1.5.1`
3. **Workflow updates manifest.json** → `"version": "1.5.1"`
4. **Workflow commits change** with message `chore: update manifest.json to v1.5.1 [skip ci]`
5. **Build & publish** proceeds with updated manifest

### Note: Git Commit

The workflow commits the manifest update automatically using a bot account (`github-actions[bot]`). The commit includes `[skip ci]` to prevent workflow loops. This ensures the repository always stays in sync with releases.

## Manual Release (Fallback)

If the automation fails, you can still publish manually:

1. **Build locally**:
```bash
npm run build
cd dist
zip -r ../mindful-browse-1.5.1.zip .
cd ..
```

2. **Firefox**: Upload via [https://addons.mozilla.org/developers/](https://addons.mozilla.org/developers/)
3. **Chrome**: Upload via [Chrome Web Store Developer Dashboard](https://chromewebstore.google.com/)