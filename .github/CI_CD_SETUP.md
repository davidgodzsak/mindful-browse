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

#### Already Set Up
✅ Your extension is already registered with Firefox ID: `distraction-limiter@davidgodzsak.dev`
✅ manifest.json has the correct browser_specific_settings

### 2. Chrome Web Store

#### Get API Credentials (OAuth 2.0)

**Step 1: Create a Google Cloud Project**
1. Go to [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Enable the **Chrome Web Store API**

**Step 2: Create OAuth 2.0 Credentials**
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Choose **Desktop application** as application type
4. Copy the **Client ID** and **Client Secret**

**Step 3: Get Refresh Token**
1. Use this script to get the refresh token (run locally):
```bash
# Replace CLIENT_ID and CLIENT_SECRET with your values
CLIENT_ID="your-client-id.apps.googleusercontent.com"
CLIENT_SECRET="your-client-secret"

# Visit this URL in your browser and authorize
echo "Visit this URL and authorize:"
echo "https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&response_type=code&scope=https://www.googleapis.com/auth/chromewebstore&access_type=offline&redirect_uri=urn:ietf:wg:oauth:2.0:oob"

# Paste the authorization code here, then run:
AUTH_CODE="paste-your-code-here"

# Get the refresh token
curl -X POST https://oauth2.googleapis.com/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=${CLIENT_ID}" \
  -d "client_secret=${CLIENT_SECRET}" \
  -d "code=${AUTH_CODE}" \
  -d "grant_type=authorization_code" \
  -d "redirect_uri=urn:ietf:wg:oauth:2.0:oob"
```

2. In the response JSON, copy the `refresh_token`

**Step 4: Publish Extension to Chrome Web Store (Once)**
1. Go to [https://chromewebstore.google.com/](https://chromewebstore.google.com/)
2. Sign in and click **Developer Dashboard**
3. Click **New Item**
4. Upload `dist.zip` (build locally: `npm run build && cd dist && zip -r ../dist.zip . && cd ..`)
5. Fill in store listing details
6. Submit for review
7. Once published, copy the **Extension ID** from the store URL: `https://chromewebstore.google.com/detail/[EXTENSION_ID]`

## GitHub Setup

### Add Secrets to GitHub

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

### Verify Workflow Files

Check that these files exist:
- ✅ `.github/workflows/publish.yml` - Main workflow
- ✅ `.github/scripts/publish-chrome.js` - Chrome upload script

## Creating a Release

When you're ready to publish:

1. **Update version in manifest.json**:
```json
{
  "version": "1.5.1"  // Increment this
}
```

2. **Commit and push**:
```bash
git add src/manifest.json
git commit -m "Bump version to 1.5.1"
git push origin main
```

3. **Create a GitHub Release**:
```bash
# Using git CLI:
git tag v1.5.1
git push origin v1.5.1

# Or via GitHub UI:
# 1. Go to Releases page
# 2. Click "Create a new release"
# 3. Set tag to "v1.5.1"
# 4. Add release notes
# 5. Click "Publish release"
```

4. **Watch the workflow**:
   - Go to **Actions** tab
   - Watch the `Publish Release` workflow run
   - Check logs for any issues

## What Happens in the Workflow

### Firefox Add-ons

- ✅ Signs your extension with Firefox certificates
- ✅ Produces a signed `.xpi` file (added to release)
- ✅ Automatically available in Firefox after approval

**Note**: Firefox reviews extensions, so there may be a delay before it appears in the store.

### Chrome Web Store

- ✅ Uploads the zip to your extension ID
- ✅ Can optionally publish immediately (if configured)
- ℹ️ Chrome reviews extensions, so there may be a delay

**Note**: Currently configured to require manual publish. You can adjust the workflow to auto-publish if desired.

## Troubleshooting

### Firefox API Errors

**Error**: "Invalid authentication credentials"
- Check that `FIREFOX_API_KEY` and `FIREFOX_API_SECRET` are correct
- They should be from [https://addons.mozilla.org/developers/](https://addons.mozilla.org/developers/), not your Mozilla account password

**Error**: "Extension not found"
- Ensure your extension ID is registered: `distraction-limiter@davidgodzsak.dev`
- This is configured in `src/manifest.json` → `browser_specific_settings.gecko.id`

### Chrome API Errors

**Error**: "OAuth token invalid"
- Verify all three Chrome secrets are set correctly
- Make sure you used the refresh token, not the access token
- Regenerate credentials if needed

**Error**: "Extension ID not found"
- Ensure extension is published to Chrome Web Store first
- Double-check the `CHROME_EXTENSION_ID` matches your store listing

### Build Failures

**Error**: "Build failed"
- Check that `npm run build` works locally: `npm run build`
- Check that `npm run lint` passes: `npm run lint`

**Error**: "Zip file not found"
- This is unlikely, but ensure the build completes successfully

## Workflow File Customization

### Change Trigger

Edit `.github/workflows/publish.yml` to trigger on different events:

```yaml
# Trigger on any push to main
on:
  push:
    branches: [main]

# Trigger on schedule (e.g., weekly)
on:
  schedule:
    - cron: '0 0 * * 0'  # Every Sunday at midnight

# Trigger manually
on:
  workflow_dispatch:
```

### Auto-Publish to Chrome

Edit `.github/scripts/publish-chrome.js` to auto-publish without manual approval:

```javascript
// Change this line:
await publishExtension(accessToken);

// Publishing is already called, so it should auto-publish
// If you want to skip publishing (just upload), comment it out:
// await publishExtension(accessToken);
```

### Skip a Store

If you only want to publish to Firefox:

```yaml
- name: Publish to Chrome Web Store
  if: false  # Disable this step
  run: node .github/scripts/publish-chrome.js
```

## Version Management

The workflow automatically extracts the version from `src/manifest.json`, so:

1. Always update `manifest.json` before creating a release
2. Use semantic versioning: `1.0.0`, `1.0.1`, `1.1.0`, etc.
3. Git tag should match: `v1.0.0` (with `v` prefix)

## Manual Release (Fallback)

If the automation fails, you can still publish manually:

1. **Build locally**:
```bash
npm run build
cd dist
zip -r ../focus-flow-1.5.1.zip .
cd ..
```

2. **Firefox**: Upload via [https://addons.mozilla.org/developers/](https://addons.mozilla.org/developers/)

3. **Chrome**: Upload via [Chrome Web Store Developer Dashboard](https://chromewebstore.google.com/)

## Next Steps

1. ✅ Add all required GitHub secrets
2. ✅ Create your first release to test the workflow
3. ✅ Monitor the Actions tab for any issues
4. 🎉 Subsequent releases will be automated!

## Support

For issues with the CI/CD setup:
- Check workflow logs in the Actions tab
- Verify all secrets are set correctly
- Test the build locally: `npm run build`
- Review the workflow file: `.github/workflows/publish.yml`

For API-specific issues:
- Firefox: [https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- Chrome: [https://developer.chrome.com/docs/webstore/](https://developer.chrome.com/docs/webstore/)
