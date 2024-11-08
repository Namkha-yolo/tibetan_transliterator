async function extractAndTransliterateText() {
    // Get all Tibetan text elements from the page
    const elements = document.body.getElementsByTagName("*");
    let tibetanContent = "";

    // Collect Tibetan text from each element
    for (let element of elements) {
        for (let node of element.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                const tibetanMatches = node.nodeValue.match(/[\u0F00-\u0FFF]+/g);
                if (tibetanMatches) {
                    tibetanContent += node.nodeValue + "\n";
                }
            }
        }
    }

    if (!tibetanContent) {
        alert("No Tibetan text found on this page.");
        return;
    }

    let transliteratedText = "";

    try {
        // Send Tibetan text to the backend server
        const response = await fetch('http://localhost:5001/transliterate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: tibetanContent })
        });
        const data = await response.json();
        transliteratedText = data.transliteration;
    } catch (error) {
        console.error("Error during transliteration:", error);
        alert("Error transliterating text.");
        return;
    }

    // Open a new tab with the transliterated text
    const newTab = window.open();
    newTab.document.write(`
        <html>
          <head>
            <title>Transliterated Tibetan Text</title>
          </head>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Transliterated Tibetan Text</h2>
            <pre style="white-space: pre-wrap;">${transliteratedText}</pre>
          </body>
        </html>
    `);
    newTab.document.close();
}

// Listen for a message from popup.js to start the transliteration
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "transliterate") {
        extractAndTransliterateText();
    }
});
