export function socialShareUrls(url, title = '', text = '') {
  const encUrl = encodeURIComponent(url);
  const encText = encodeURIComponent(text || title || '');
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encUrl}&text=${encText}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encText}%20${encUrl}`,
    telegram: `https://t.me/share/url?url=${encUrl}&text=${encText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}`
  };
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    return false;
  }
}

export async function shareDirect({ title, text, url }) {
  if (navigator.share) {
    try {
      console.log('[Share] Calling navigator.share()');
      await navigator.share({ title, text, url });
      console.log('[Share] navigator.share() succeeded');
      return true;
    } catch (e) {
      console.log('[Share] navigator.share() error:', e.message);
      return false;
    }
  }
  console.log('[Share] navigator.share not available');
  return false;
}

export function openShareWindow(shareUrl) {
  console.log('[Share] Opening fallback share window:', shareUrl);
  const w = 600; const h = 480;
  const left = (window.innerWidth / 2) - (w / 2);
  const top = (window.innerHeight / 2) - (h / 2);
  const result = window.open(shareUrl, '_blank', `toolbar=0,status=0,width=${w},height=${h},left=${left},top=${top}`);
  if (!result) {
    console.warn('[Share] Pop-up may have been blocked');
  }
  return result;
}

export async function shareFallback({ title, text, url }) {
  const { facebook, twitter, whatsapp, telegram } = socialShareUrls(url, title, text);
  // default to Twitter if direct share fails; could show a custom UI
  openShareWindow(twitter);
}

export async function shareContent({ title, text, url }) {
  console.log('[Share] Attempting to share:', { title, text, url });
  const used = await shareDirect({ title, text, url });
  if (!used) {
    console.log('[Share] Native share unavailable or failed, using fallback');
    const { twitter } = socialShareUrls(url, title, text);
    console.log('[Share] Twitter URL:', twitter);
    await shareFallback({ title, text, url });
  } else {
    console.log('[Share] Used native Web Share API');
  }
}
