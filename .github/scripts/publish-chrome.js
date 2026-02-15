#!/usr/bin/env node

/**
 * Chrome Web Store Upload Script
 * Uploads the extension to Chrome Web Store using OAuth 2.0
 */

import https from 'https';
import fs from 'fs';
import path from 'path';

const {
  CHROME_CLIENT_ID,
  CHROME_CLIENT_SECRET,
  CHROME_REFRESH_TOKEN,
  CHROME_EXTENSION_ID,
  EXTENSION_ZIP,
} = process.env;

// Validate required env vars
if (!CHROME_CLIENT_ID || !CHROME_CLIENT_SECRET || !CHROME_REFRESH_TOKEN || !CHROME_EXTENSION_ID || !EXTENSION_ZIP) {
  console.error('❌ Missing required Chrome Web Store credentials or configuration');
  console.error('Required: CHROME_CLIENT_ID, CHROME_CLIENT_SECRET, CHROME_REFRESH_TOKEN, CHROME_EXTENSION_ID, EXTENSION_ZIP');
  process.exit(1);
}

/**
 * Get access token using refresh token
 */
async function getAccessToken() {
  return new Promise((resolve, reject) => {
    const postData = new URLSearchParams({
      client_id: CHROME_CLIENT_ID,
      client_secret: CHROME_CLIENT_SECRET,
      refresh_token: CHROME_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }).toString();

    const options = {
      hostname: 'oauth2.googleapis.com',
      port: 443,
      path: '/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.access_token) {
            console.log('✅ Got Chrome Web Store access token');
            resolve(json.access_token);
          } else {
            reject(new Error(`Failed to get access token: ${json.error_description || data}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse token response: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

/**
 * Upload extension to Chrome Web Store
 */
async function uploadExtension(accessToken) {
  return new Promise((resolve, reject) => {
    const zipPath = path.resolve(EXTENSION_ZIP);

    if (!fs.existsSync(zipPath)) {
      reject(new Error(`Extension zip not found: ${zipPath}`));
      return;
    }

    const fileStream = fs.createReadStream(zipPath);
    const fileSize = fs.statSync(zipPath).size;

    const options = {
      hostname: 'www.googleapis.com',
      port: 443,
      path: `/upload/chromewebstore/v1.1/items/${CHROME_EXTENSION_ID}`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'x-goog-api-version': '2',
        'Content-Type': 'application/zip',
        'Content-Length': fileSize,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Extension uploaded to Chrome Web Store');
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`Upload failed with status ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);

    fileStream.on('error', reject);
    fileStream.pipe(req);
  });
}

/**
 * Publish extension on Chrome Web Store
 */
async function publishExtension(accessToken) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      target: 'default',
    });

    const options = {
      hostname: 'www.googleapis.com',
      port: 443,
      path: `/chromewebstore/v1.1/items/${CHROME_EXTENSION_ID}/publish`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'x-goog-api-version': '2',
        'Content-Type': 'application/json',
        'Content-Length': postData.length,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Extension published on Chrome Web Store');
          resolve(JSON.parse(data));
        } else if (res.statusCode === 403) {
          console.log('ℹ️  Publishing skipped (may require manual review)');
          resolve({ status: 'pending_review' });
        } else {
          reject(new Error(`Publish failed with status ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('🎨 Publishing to Chrome Web Store...');
    console.log(`📦 Extension: ${CHROME_EXTENSION_ID}`);
    console.log(`📄 File: ${EXTENSION_ZIP}`);

    const accessToken = await getAccessToken();
    await uploadExtension(accessToken);
    await publishExtension(accessToken);

    console.log('✅ Chrome Web Store publication complete');
  } catch (error) {
    console.error('❌ Chrome Web Store publication failed:', error.message);
    process.exit(1);
  }
}

main();
