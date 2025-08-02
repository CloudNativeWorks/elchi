export const getIPAddresses = (addresses: string) => {
    const entries = addresses.split(',');
    let ips: string[] = [];

    try {
        entries.forEach(entry => {
            if (entry.includes('/')) {
                const [ip, mask] = entry.split('/');
                if (!validateIP(ip) || parseInt(mask) > 32) throw new Error(`Invalid subnet: ${entry}`);
                const range = getIPRange(ip, mask);
                ips = [...ips, ...range];
            } else if (entry.includes('-')) {
                const [startIP, endIP] = entry.split('-');
                if (!validateIP(startIP) || !validateIP(endIP)) throw new Error(`Invalid range: ${entry}`);
                const range = getIPRangeFromInterval(startIP, endIP);
                ips = [...ips, ...range];
            } else {
                if (!validateIP(entry)) throw new Error(`Invalid IP: ${entry}`);
                ips.push(entry);
            }
        });

        return Array.from(new Set(ips));
    } catch (error: any) {
        return error.message;
    }
};

const validateIP = (ip: string) => {
    const octets = ip.split('.');
    return octets.length === 4 && octets.every(octet => parseInt(octet) >= 0 && parseInt(octet) <= 255);
}

const getIPRange = (ip: string, mask: string) => {
    const maskAsInt = parseInt(mask);
    const ipAsInt = ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0);
    const maskBits = 0xFFFFFFFF << (32 - maskAsInt);
    const networkAddress = ipAsInt & maskBits;
    const broadcastAddress = networkAddress | ~maskBits;

    const range: string[] = [];
    for (let i = networkAddress; i <= broadcastAddress; i++) {
        range.push(intToIP(i));
    }

    return range;
}

const getIPRangeFromInterval = (startIP: string, endIP: string) => {
    const startIPAsInt = ipToInt(startIP);
    const endIPAsInt = ipToInt(endIP);

    const range: string[] = [];
    for (let i = startIPAsInt; i <= endIPAsInt; i++) {
        range.push(intToIP(i));
    }

    return range;
}

const ipToInt = (ip: string) => {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0);
}

const intToIP = (int: number) => {
    return ((int >>> 24) & 0xFF) + '.' + ((int >>> 16) & 0xFF) + '.' + ((int >>> 8) & 0xFF) + '.' + (int & 0xFF);
}
