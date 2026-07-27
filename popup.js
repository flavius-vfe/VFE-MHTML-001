"use strict";

const saveButton = document.getElementById("save");
const statusElement = document.getElementById("status");

function setStatus(message, state) {
  statusElement.textContent = message;
  statusElement.dataset.state = state;
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  if (!tab || !Number.isInteger(tab.id)) {
    throw new Error("No active browser tab was found.");
  }

  return tab;
}

saveButton.addEventListener("click", async () => {
  saveButton.disabled = true;
  setStatus("Capturing the current page. Please keep this popup open...", "working");

  try {
    const tab = await getActiveTab();
    const response = await chrome.runtime.sendMessage({
      type: "SAVE_MHTML",
      tabId: tab.id
    });

    if (!response?.ok) {
      throw new Error(response?.error || "Chrome could not save this page.");
    }

    setStatus(`Save dialog opened for “${response.filename}”.`, "success");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    setStatus(`Could not save the page: ${message}`, "error");
  } finally {
    saveButton.disabled = false;
  }
});
