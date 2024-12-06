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
    const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };

    return date.toLocaleDateString(i18n.language, options);
};

export {
    formatDateShort,
    formatDateFull
};