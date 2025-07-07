import { Copy2SVG, PasteSVG } from "@/assets/svg/icons";

export const cpItems = [
    { key: '1', label: <div style={{ display: 'flex', flexGrow: 'inherit', alignItems: 'center', marginLeft: -6 }}><Copy2SVG />Copy</div > },
    { key: '2', label: <div style={{ display: 'flex', flexGrow: 'inherit', alignItems: 'center', marginLeft: -6 }}><PasteSVG />Paste</div > },
];

async function readFromClipboard(Paste: any, keys: string, ctype: string, onCPSuccess: any, onCPError: any) {
    try {
        const text = await navigator.clipboard.readText();
        try {
            if (text.startsWith(`${ctype}:`)) {
                const data = JSON.parse(text.replace(`${ctype}:`, ''));
                Paste(keys, data);
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

async function writeToClipboard(data: any, ctype: string, onCPSuccess: any, onCPError: any) {
    const withCTypeData = `${ctype}:${JSON.stringify(data)}`;
    navigator.clipboard.writeText(withCTypeData)
        .then(() => {
            onCPSuccess('Resource copied to clipboard!')
        })
        .catch(err => {
            onCPError(`Copy to clipboard error: ${err}`);
        });
}

export const CopyPaste = (data: any, index: string, keys: string, Paste: any, ctype: string, onCPSuccess: any, onCPError: any) => {
    switch (index) {
        case "1":
        case "5": // "1" ve "5" durumları aynı işlem için kullanılıyor
            writeToClipboard(data, ctype, onCPSuccess, onCPError);
            break;
        case "2":
            readFromClipboard(Paste, keys, ctype, onCPSuccess, onCPError);
            break;
        default:
            console.error("Geçersiz index değeri");
            break;
    }
};


