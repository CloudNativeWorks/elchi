import { Copy2SVG, PasteSVG } from "@/assets/svg/icons";
import { copyToClipboard, readFromClipboard } from "./clipboard";

export const cpItems = [
    { key: '1', label: <div style={{ display: 'flex', flexGrow: 'inherit', alignItems: 'center', marginLeft: -6 }}><Copy2SVG />Copy</div > },
    { key: '2', label: <div style={{ display: 'flex', flexGrow: 'inherit', alignItems: 'center', marginLeft: -6 }}><PasteSVG />Paste</div > },
];

async function readFromClipboardCType(Paste: any, keys: string, ctype: string, onCPSuccess: any, onCPError: any) {
    try {
        // readFromClipboard utility handles error notifications for us
        const text = await readFromClipboard();
        
        if (!text) {
            // Utility already showed error notification, just return silently
            return {};
        }
        
        try {
            if (text.startsWith(`${ctype}:`)) {
                const data = JSON.parse(text.replace(`${ctype}:`, ''));
                // If keys is empty, use ctype as the key (backward compatibility)
                const finalKeys = keys || ctype;
                Paste(finalKeys, data);
                onCPSuccess('Pasted successfully!')
            } else {
                onCPError('Failed to paste resource does not match!');
            }
        } catch (err) {
            onCPError(`Text not in JSON format: ${err}`);
        }
    } catch (err) {
        onCPError(`Reading error from the clipboard: ${err}`);
    }
    return {}
}

async function writeToClipboardCType(data: any, ctype: string, onCPSuccess: any, onCPError: any) {
    const withCTypeData = `${ctype}:${JSON.stringify(data)}`;
    
    // Use utility without showing messages (to avoid double notifications)
    const success = await copyToClipboard(
        withCTypeData,
        undefined, // No success message from utility
        undefined  // No error message from utility
    );
    
    if (success) {
        onCPSuccess('Resource copied to clipboard!');
    } else {
        onCPError('Copy to clipboard error. Please copy manually.');
    }
}

export const CopyPaste = (data: any, index: string, keys: string, Paste: any, ctype: string, onCPSuccess: any, onCPError: any) => {
    switch (index) {
        case "1":
        case "5":
            writeToClipboardCType(data, ctype, onCPSuccess, onCPError);
            break;
        case "2":
            readFromClipboardCType(Paste, keys, ctype, onCPSuccess, onCPError);
            break;
        default:
            console.error("wrong index");
            break;
    }
};


