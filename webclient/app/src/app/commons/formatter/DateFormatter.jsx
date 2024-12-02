const formatDateFull = (isoString, i18n) => {
    const date = new Date(isoString);

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };

    return date.toLocaleDateString(i18n.language, options);
};

const formatDateShort = (isoString, i18n) => {
    const date = new Date(isoString);

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();

    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    if (i18n.language == "en-US") {
        return `${month}.${day}.${year} ${hours}:${minutes}:${seconds}`;
    }
    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
};

export {
    formatDateShort,
    formatDateFull
};