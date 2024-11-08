document.getElementById("transliterateBtn").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "transliterate" });
});
