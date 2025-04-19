import moment from 'moment-timezone';

export const util = {
    convertToGermanyTime
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