module.exports = class DateTimeUtils {
    dayjs = require('dayjs');
  
    constructor() {
      const customParseFormat = require('dayjs/plugin/customParseFormat');
      const advancedFormat = require('dayjs/plugin/advancedFormat');
      const localizedFormat = require('dayjs/plugin/localizedFormat');
      const utc = require('dayjs/plugin/utc');
      this.dayjs.extend(utc);
      this.dayjs.extend(customParseFormat);
      this.dayjs.extend(advancedFormat);
      this.dayjs.extend(localizedFormat);
    }

       /**
     * function to  get current timestamp
     * @param format (default: 'YYYY-MM-DD HH:mm:ss')
     */
       getCurrentTimestamp(format = 'YYYY-MM-DD HH:mm:ss') {
        return this.dayjs().format(format);
      }
  
      
       /**
     * get unix time stamp in milliseconds
     * @param dateTime - if not specified, then it'll be considered as current date time
     * @param format format of the datetime passed
     * if the dateTime is not specified, then it'll return the current unix timestamp
     */
    getUnixTimestamp(dateTime, format) {
        return this.dayjs(dateTime, format).unix();
      }


    /**
     * Format the given date or time, provided format to the new format
     * @param dateTime - Date or time or date time that need to converted in new format
     * @param currentFormat - original Date/Time or Date time format,
     * If you are not sure about the input format then you can add multiple possible formats in array
     * @param toFormat - New format in which date time need to be converted
     */
    format(dateTime, toFormat, currentFormat) {
      return this.dayjs(dateTime, currentFormat, true).format(toFormat);
    }
  
    /**
     * function is used to get the difference from the 2 date time.
     * @param from will be minuend for the difference, difference from which date time
     * @param to will be subhead for the difference, subtracted from Param from
     * @param unit By default unit will be milliseconds, we can provide the units in which we need result in.
     * reference for the unit - https://day.js.org/docs/en/display/difference
     */
    getDiff(from, to, unit, float = false) {
      const fromDayjs = this.dayjs(from);
      const toDayjs = this.dayjs(to);
  
      return toDayjs.diff(fromDayjs, unit, float);
    }
  

  
    /**
     * function to  get current utc date time or convert given date time to the utc
     * @param dateTime - if not specified, then it'll be considered as current date time
     * @param format
     */
    convertToUtc(dateTime, format = 'YYYY-MM-DD HH:mm:ss') {
        console.log(this.dayjs(dateTime).utc().format(format))
        return this.dayjs(dateTime).utc().format(format);
      }
      
  
}