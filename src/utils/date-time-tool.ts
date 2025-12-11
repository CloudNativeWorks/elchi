

export const DateTimeTool = (dateTime: string | number) => {
    const gunSaat = new Date(dateTime);
    const options = {
        year: 'numeric' as const,
        month: '2-digit' as const,
        day: '2-digit' as const,
        hour: '2-digit' as const,
        minute: '2-digit' as const,
        hour24: true as const,
    };

    const formattedDateTime = gunSaat.toLocaleString('en-EN', options);

    return formattedDateTime;
};

export const FormatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
};


export const CheckDate = (targetDate: number) => {
    const currentDate = new Date();
    const target = new Date(targetDate * 1000);

    if (target < currentDate) {
        return true;
    }

    return false;
};