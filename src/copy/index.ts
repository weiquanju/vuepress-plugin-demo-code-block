function fallbackCopyTextToClipboard(text: string) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        if (!successful) {
            return 'copy failed'
        }
    } catch (err) {
        return `copy error: ${err}`
    }

    document.body.removeChild(textArea);
}
export async function writeToClipboard(text: string) {
    if (!navigator.clipboard) {
        return fallbackCopyTextToClipboard(text);
    }
    try {
        await navigator.clipboard.writeText(text)
    } catch (err) {
        return `copy error: ${err}`
    }
}