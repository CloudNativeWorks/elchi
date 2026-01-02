

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

export const CheckDate = (targetDate: number) => {
    const currentDate = new Date();
    const target = new Date(targetDate * 1000);

    if (target < currentDate) {
        return true;
    }

    return false;
};