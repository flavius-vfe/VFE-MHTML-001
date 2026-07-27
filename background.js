"use strict";

const MAX_TITLE_LENGTH = 110;
const RESTRICTED_URL_PATTERN = /^(about|chrome|chrome-extension|chrome-search|devtools|edge|view-source):/i;
const WINDOWS_RESERVED_NAME_PATTERN = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;

function safeFilenamePart(value) {
  const normalized = String(value || "page")
    .normalize("NFKC")
    .replace(/[\u0000-\u001f\u007f<>:"/\\|?*]+/g, "-")
    .replace(/\s+/g, " ")
    .replace(/[. ]+$/g, "")
    .trim()
    .slice(0, MAX_TITLE_LENGTH);

  if (!normalized) {
    return "page";
  }

  return WINDOWS_RESERVED_NAME_PATTERN.test(normalized)
    ? `page-${normalized}`
    : normalized;
}

function timestampForFilename(date = new Date()) {
  return date.toISOString().replace(/:/g, "-").replace(/\.\d{3}Z$/, "Z");
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("The page snapshot could not be prepared for download."));
      }
    });

    reader.addEventListener("error", () => {
      reject(reader.error || new Error("The page snapshot could not be read."));
    });

    reader.readAsDataURL(blob);
  });
}

async function saveTabAsMhtml(tabId) {
  const tab = await chrome.tabs.get(tabId);

  if (!tab) {
    throw new Error("The selected tab is no longer available.");
  }

  if (tab.url && RESTRICTED_URL_PATTERN.test(tab.url)) {
    throw new Error("Chrome does not allow extensions to capture this protected browser page.");
  }

  const mhtmlBlob = await chrome.pageCapture.saveAsMHTML({ tabId });

  if (!(mhtmlBlob instanceof Blob) || mhtmlBlob.size === 0) {
    throw new Error("Chrome returned an empty page snapshot.");
  }

  const dataUrl = await blobToDataUrl(mhtmlBlob);
  const title = safeFilenamePart(tab.title);
  const filename = `${title} - ${timestampForFilename()}.mhtml`;
  const downloadId = await chrome.downloads.download({
    url: dataUrl,
    filename,
    saveAs: true,
    conflictAction: "uniquify"
  });

  if (!Number.isInteger(downloadId)) {
    throw new Error("Chrome did not start the download.");
  }

  return filename;
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "SAVE_MHTML") {
    return false;
  }

  if (!Number.isInteger(message.tabId)) {
    sendResponse({ ok: false, error: "The tab identifier is invalid." });
    return false;
  }

  saveTabAsMhtml(message.tabId)
    .then((filename) => sendResponse({ ok: true, filename }))
    .catch((error) => {
      const messageText = error instanceof Error ? error.message : String(error);
      sendResponse({ ok: false, error: messageText });
    });

  return true;
});
