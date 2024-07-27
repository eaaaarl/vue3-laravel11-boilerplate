export const formatDate = (dateString: string, format: Intl.DateTimeFormatOptions = {}): string => {
    const date = new Date(dateString);
    const defaultFormat: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    const options = { ...defaultFormat, ...format };

    return new Intl.DateTimeFormat('en-US', options).format(date);
};

export const formatDateShort = (dateString: string): string => {
    return formatDate(dateString, { year: 'numeric', month: 'short', day: 'numeric' });
};

export const formatDateTime = (dateString: string): string => {
    return formatDate(dateString, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};