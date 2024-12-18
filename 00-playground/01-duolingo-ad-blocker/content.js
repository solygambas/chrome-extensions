// Basic attribute and image selectors
const BASIC_SELECTORS = [
  '[data-test="plus-offer-logo"]',
  '[data-test="purchase-step"]',
  'img[src*="super/2e50c3e8358914df5285dc8cf45d0b4c.svg"]',
  'img[src*="super/fb7130289a205fadd2e196b9cc866555.svg"]',
].join(",");

// Function to remove the first type of ads (right sidebar)
function removeFirstTypeAds() {
  // First pass: Remove elements matching basic selectors
  document.querySelectorAll(BASIC_SELECTORS).forEach((el) => {
    const adContainer = el.closest('div[class*="_"]');
    if (adContainer) adContainer.remove();
    else el.remove();
  });

  // Second pass: Check button text content
  document.querySelectorAll("button").forEach((button) => {
    const span = button.querySelector("span");
    if (
      span?.textContent.includes("Try Super") ||
      span?.textContent.includes("Try 2 weeks free")
    ) {
      button.closest('div[class*="_"]')?.remove();
    }
  });

  // Third pass: Check div content
  document.querySelectorAll("div").forEach((div) => {
    const hasLogo = div.querySelector('[data-test="plus-offer-logo"]');
    const hasSuper = div.querySelector('img[src*="super"]');
    const hasButton = div.querySelector('button span[class*="_"]');
    if ((hasLogo || hasSuper) && hasButton) {
      div.closest('div[class*="_"]')?.remove();
    }
  });

  // Fourth pass: XPath for text content
  const xpathResult = document.evaluate(
    '//h1[contains(text(),"Super")] | //button[contains(text(),"Try")]',
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null
  );

  for (let i = 0; i < xpathResult.snapshotLength; i++) {
    const el = xpathResult.snapshotItem(i);
    el?.closest('div[class*="_"]')?.remove();
  }
}

// Function to remove the second type of ads
function removeSecondTypeAds() {
  const secondTypeAds = document.querySelectorAll("video[autoplay]");
  secondTypeAds.forEach((video) => {
    // Optionally check for specific keywords in the src
    if (video.src.includes("promo")) {
      video.remove();
    }
  });
}

// Observe and handle dynamically loaded content
function observeDOMChanges() {
  const observer = new MutationObserver(() => {
    removeFirstTypeAds();
    removeSecondTypeAds();
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Initial cleanup and start observing
removeFirstTypeAds();
removeSecondTypeAds();
observeDOMChanges();
