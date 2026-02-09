/**
 * @file site_storage.js
 * @description Manages CRUD operations for distracting sites in browser.storage.local.
 * Updated to support both time limits and open count limits.
 */

/**
 * Retrieves the list of distracting sites from storage.
 *
 * @async
 * @function getDistractingSites
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of distracting site objects.
 *                                    Returns an empty array if no sites are found or an error occurs.
 */
export async function getDistractingSites() {
  try {
    const result = await browser.storage.local.get('distractingSites');
    return result.distractingSites || [];
  } catch (error) {
    console.error('Error getting distracting sites:', error);
    return [];
  }
}

/**
 * Adds a new distracting site to the storage.
 * Validates the site object and generates a unique ID.
 *
 * @async
 * @function addDistractingSite
 * @param {Object} siteObject - The site object to add.
 * @param {string} siteObject.urlPattern - The URL pattern for the site.
 * @param {number} siteObject.dailyLimitSeconds - The daily time limit in seconds.
 * @param {number} [siteObject.dailyOpenLimit] - The daily open count limit (optional).
 * @param {boolean} [siteObject.isEnabled=true] - Whether the site rule is enabled.
 * @param {string} [siteObject.groupId] - The ID of the group this site belongs to (optional).
 * @returns {Promise<Object|null>} A promise that resolves to the added site object (including its new ID)
 *                                 or null if validation fails or a storage error occurs.
 */
export async function addDistractingSite(siteObject) {
  // Validate required field: urlPattern
  if (
    !siteObject ||
    typeof siteObject.urlPattern !== 'string' ||
    siteObject.urlPattern.trim() === ''
  ) {
    console.error(
      "Invalid siteObject provided to addDistractingSite. 'urlPattern' (non-empty string) is required.",
      siteObject
    );
    return null;
  }

  // Validate dailyLimitSeconds if provided (optional, but must be positive if present)
  if (
    Object.prototype.hasOwnProperty.call(siteObject, 'dailyLimitSeconds') &&
    (typeof siteObject.dailyLimitSeconds !== 'number' ||
      siteObject.dailyLimitSeconds <= 0)
  ) {
    console.error(
      'Invalid dailyLimitSeconds provided to addDistractingSite. Must be a positive number if specified.',
      siteObject.dailyLimitSeconds
    );
    return null;
  }

  // Validate dailyOpenLimit if provided (optional, but must be positive if present)
  if (
    Object.prototype.hasOwnProperty.call(siteObject, 'dailyOpenLimit') &&
    (typeof siteObject.dailyOpenLimit !== 'number' ||
      siteObject.dailyOpenLimit <= 0)
  ) {
    console.error(
      'Invalid dailyOpenLimit provided to addDistractingSite. Must be a positive number if specified.',
      siteObject.dailyOpenLimit
    );
    return null;
  }


  // Validate groupId if provided
  if (
    Object.prototype.hasOwnProperty.call(siteObject, 'groupId') &&
    (typeof siteObject.groupId !== 'string' || siteObject.groupId.trim() === '')
  ) {
    console.error(
      'Invalid groupId provided to addDistractingSite. Must be a non-empty string if specified.',
      siteObject.groupId
    );
    return null;
  }

  const newSite = {
    id: crypto.randomUUID(),
    urlPattern: siteObject.urlPattern.trim(),
    dailyLimitSeconds: siteObject.dailyLimitSeconds,
    isEnabled:
      typeof siteObject.isEnabled === 'boolean' ? siteObject.isEnabled : true,
  };

  // Add dailyOpenLimit if provided
  if (Object.prototype.hasOwnProperty.call(siteObject, 'dailyOpenLimit')) {
    newSite.dailyOpenLimit = siteObject.dailyOpenLimit;
  }

  // Add groupId if provided
  if (Object.prototype.hasOwnProperty.call(siteObject, 'groupId')) {
    newSite.groupId = siteObject.groupId;
  }

  try {
    const sites = await getDistractingSites();
    sites.push(newSite);
    await browser.storage.local.set({ distractingSites: sites });
    return newSite;
  } catch (error) {
    console.error('Error adding distracting site:', error);
    return null;
  }
}

/**
 * Updates an existing distracting site in storage by its ID.
 * Validates the updates before applying them.
 *
 * @async
 * @function updateDistractingSite
 * @param {string} siteId - The ID of the site to update.
 * @param {Object} updates - An object containing the properties to update.
 * @param {string} [updates.urlPattern] - The new URL pattern.
 * @param {number} [updates.dailyLimitSeconds] - The new daily time limit in seconds.
 * @param {number} [updates.dailyOpenLimit] - The new daily open count limit.
 * @param {boolean} [updates.isEnabled] - The new enabled state.
 * @param {string} [updates.groupId] - The new group ID (or null to remove from group).
 * @returns {Promise<Object|null>} A promise that resolves to the updated site object
 *                                 or null if the site is not found, validation fails, or a storage error occurs.
 */
export async function updateDistractingSite(siteId, updates) {
  if (!siteId || typeof siteId !== 'string') {
    console.error('Invalid siteId provided to updateDistractingSite.');
    return null;
  }
  if (
    !updates ||
    typeof updates !== 'object' ||
    Object.keys(updates).length === 0
  ) {
    console.error(
      'Invalid updates object provided to updateDistractingSite.',
      updates
    );
    return null;
  }

  // Validate updates
  if (
    Object.prototype.hasOwnProperty.call(updates, 'urlPattern') &&
    (typeof updates.urlPattern !== 'string' || updates.urlPattern.trim() === '')
  ) {
    console.error(
      'Invalid urlPattern in updates for updateDistractingSite.',
      updates.urlPattern
    );
    return null;
  }
  if (
    Object.prototype.hasOwnProperty.call(updates, 'dailyLimitSeconds') &&
    (typeof updates.dailyLimitSeconds !== 'number' ||
      updates.dailyLimitSeconds <= 0)
  ) {
    console.error(
      'Invalid dailyLimitSeconds in updates for updateDistractingSite.',
      updates.dailyLimitSeconds
    );
    return null;
  }
  if (
    Object.prototype.hasOwnProperty.call(updates, 'dailyOpenLimit') &&
    updates.dailyOpenLimit !== null &&
    (typeof updates.dailyOpenLimit !== 'number' || updates.dailyOpenLimit <= 0)
  ) {
    console.error(
      'Invalid dailyOpenLimit in updates for updateDistractingSite.',
      updates.dailyOpenLimit
    );
    return null;
  }
  if (
    Object.prototype.hasOwnProperty.call(updates, 'isEnabled') &&
    typeof updates.isEnabled !== 'boolean'
  ) {
    console.error(
      'Invalid isEnabled in updates for updateDistractingSite.',
      updates.isEnabled
    );
    return null;
  }
  if (
    Object.prototype.hasOwnProperty.call(updates, 'groupId') &&
    updates.groupId !== null &&
    (typeof updates.groupId !== 'string' || updates.groupId.trim() === '')
  ) {
    console.error(
      'Invalid groupId in updates for updateDistractingSite.',
      updates.groupId
    );
    return null;
  }

  try {
    const sites = await getDistractingSites();
    const siteIndex = sites.findIndex((site) => site.id === siteId);

    if (siteIndex === -1) {
      console.warn(`Site with ID "${siteId}" not found for update.`);
      return null;
    }

    // Create the updated site object by merging current site with validated updates
    const updatedSite = { ...sites[siteIndex], ...updates };

    // Remove dailyOpenLimit if it's null (explicit removal)
    if (updates.dailyOpenLimit === null) {
      delete updatedSite.dailyOpenLimit;
    }

    sites[siteIndex] = updatedSite;
    await browser.storage.local.set({ distractingSites: sites });
    return updatedSite;
  } catch (error) {
    console.error(
      `Error updating distracting site with ID "${siteId}":`,
      error
    );
    return null;
  }
}

/**
 * Deletes a distracting site from storage by its ID.
 *
 * @async
 * @function deleteDistractingSite
 * @param {string} siteId - The ID of the site to delete.
 * @returns {Promise<boolean>} A promise that resolves to true if deletion was successful,
 *                             false if the site was not found, siteId was invalid or a storage error occurred.
 */
export async function deleteDistractingSite(siteId) {
  if (!siteId || typeof siteId !== 'string') {
    console.error('Invalid siteId provided to deleteDistractingSite.');
    return false;
  }
  try {
    let sites = await getDistractingSites();
    const initialLength = sites.length;
    sites = sites.filter((site) => site.id !== siteId);

    if (sites.length === initialLength) {
      console.warn(`Site with ID "${siteId}" not found for deletion.`);
      return false; // Site not found
    }

    await browser.storage.local.set({ distractingSites: sites });
    return true;
  } catch (error) {
    console.error(
      `Error deleting distracting site with ID "${siteId}":`,
      error
    );
    return false;
  }
}
