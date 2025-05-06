import moment from 'moment-timezone';

export const util = {
    convertToGermanyTime,
    isValidEmail,
    isValidPassword
};

function convertToGermanyTime(utcDateString) {
    // Define the source and target timezones
    const sourceTimezone = 'Etc/UTC'; // UTC timezone
    const targetTimezone = 'Europe/Berlin'; // Germany timezone

    // Parse the input date string in UTC timezone
    const dateInUtc = moment.tz(utcDateString, sourceTimezone);

    // Convert the date to the target timezone (Germany)
    const dateInGermany = moment.tz(dateInUtc, targetTimezone);

    // Format the date as a string in Germany timezone
    return dateInGermany.format('DD.MM.YYYY HH:mm:ss');
}

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function isValidPassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
    return regex.test(password);
}