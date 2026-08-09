const ELFIGHT_SDK_URL = 'https://elfsightcdn.com/platform.js';
const SCRIPT_ID = 'elfsight-platform-sdk';

let loadPromise: Promise<void> | null = null;

export function loadElfsightPlatform(): Promise<void> {
  if (loadPromise) return loadPromise;

  const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  if (existing) {
    if (existing.dataset.loaded === 'true') return Promise.resolve();
    loadPromise = new Promise<void>((resolve) => {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => resolve(), { once: true });
    });
    return loadPromise;
  }

  loadPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = ELFIGHT_SDK_URL;
    script.async = true;
    script.dataset.loaded = 'false';
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      resolve();
    }, { once: true });
    script.addEventListener('error', () => {
      loadPromise = null;
      script.remove();
      reject(new Error('Failed to load Elfsight platform script'));
    }, { once: true });
    document.body.appendChild(script);
  });

  return loadPromise;
}
