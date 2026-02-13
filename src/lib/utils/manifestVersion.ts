export const getVersionFromManifest = async (): Promise<string> => {
  try {
    const response = await fetch('/manifest.json');
    const manifest = await response.json();
    return manifest.version || '';
  } catch (error) {
    console.error("Failed to load version from manifest:", error);
    return '';
  }
};
