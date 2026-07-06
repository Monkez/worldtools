let puterLoadPromise = null;

export function isFileProtocol() {
    return window.location.protocol === 'file:';
}

export async function ensurePuterLoaded() {
    if (window.puter) return window.puter;

    if (isFileProtocol()) {
        throw new Error('Puter AI is not available in the desktop file:// build. Use Gemini, Custom, Magnific, or Pollinations in the desktop app.');
    }

    if (!puterLoadPromise) {
        puterLoadPromise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://js.puter.com/v2/';
            script.async = true;
            script.onload = () => {
                if (window.puter) resolve(window.puter);
                else reject(new Error('Puter.js SDK loaded but did not initialize.'));
            };
            script.onerror = () => reject(new Error('Failed to load Puter.js SDK.'));
            document.head.appendChild(script);
        });
    }

    return puterLoadPromise;
}
