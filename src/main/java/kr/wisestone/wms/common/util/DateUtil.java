package kr.wisestone.wms.common.util;

import org.apache.commons.lang.time.DateUtils;
import org.elasticsearch.common.joda.time.DateTime;
import org.elasticsearch.common.joda.time.Days;
import org.elasticsearch.common.joda.time.Hours;
import org.elasticsearch.common.joda.time.Seconds;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

public class DateUtil {
    public static Date convertStrToDate(String source) {
        return convertStrToDate(source, "yyyy-MM-dd HH:mm:ss");
    }

    public static Date convertStrToDate(String source, String pattern) {
        return convertStrToDate(source, pattern, Locale.KOREA);
    }

    public static Date convertStrToDate(String source, String pattern, Locale locale) {
        Date date = null;
        SimpleDateFormat sdf = new SimpleDateFormat(pattern, locale);
        try {
            date = sdf.parse(source);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        return date;
    }

    public static String convertDateToYYYYMMDD(Date source) {
        return convertDateToStr(source, "yyyy-MM-dd");
    }

    public static String convertDateToHHMMSS(Date source) {
        return convertDateToStr(source, "HH:mm:ss");
    }

    public static String convertDateToStr(Date source) {
        return convertDateToStr(source, "yyyy-MM-dd HH:mm:ss");
    }

    public static String getTodayWithYYYYMMDD() {

        return DateUtil.convertDateToYYYYMMDD(new Date());
    }

    public static String convertDateToStr(Date source, String pattern) {
        return convertDateToStr(source, pattern, Locale.KOREA);
    }

    public static String convertDateToStr(Date source, String pattern, Locale locale) {
        String date = null;
        SimpleDateFormat sdf = new SimpleDateFormat(pattern, locale);
        date = sdf.format(source);

        return date;
    }

    public static Date addDays(Date date, int amount) {
        return DateUtils.addDays(date, amount);
    }

    public static Date addHours(Date date, int amount) {
        return DateUtils.addHours(date, amount);
    }

    public static Date addMinutes(Date date, int amount) {
        return DateUtils.addMinutes(date, amount);
    }

    public static Integer getDateDiff(Date fromDate, Date toDate) {

        return Days.daysBetween(new DateTime(fromDate), new DateTime(toDate)).getDays();
    }

    public static Integer getHourDiff(Date fromDate, Date toDate) {

        return Hours.hoursBetween(new DateTime(fromDate), new DateTime(toDate)).getHours();
    }

    public static Integer getSecondsDiff(Date fromDate, Date toDate) {

        return Seconds.secondsBetween(new DateTime(fromDate), new DateTime(toDate)).getSeconds();
    }

    public static Date getWeekStartDate() {

        Calendar cal = Calendar.getInstance();
        Calendar first = (Calendar) cal.clone();
        first.add(Calendar.DAY_OF_WEEK,
            first.getFirstDayOfWeek() - first.get(Calendar.DAY_OF_WEEK));

        return first.getTime();
    }

    public static Date getWeekEndDate() {

        Calendar cal = Calendar.getInstance();
        cal.setTime(DateUtil.getWeekStartDate());

        Calendar last = (Calendar) cal.clone();
        last.add(Calendar.DAY_OF_YEAR, 6);

        return last.getTime();
    }

    public static Date getMonthStartDate() {

        Calendar first = Calendar.getInstance();
        first.set(Calendar.DAY_OF_MONTH, 1);

        first.set(Calendar.HOUR_OF_DAY, 0);
        first.set(Calendar.MINUTE, 0);
        first.set(Calendar.SECOND, 0);

        return first.getTime();
    }

    public static Date getMonthEndDate() {
        Calendar last = Calendar.getInstance();
        last.set(Calendar.DAY_OF_MONTH, last.getActualMaximum(Calendar.DAY_OF_MONTH));

        last.set(Calendar.HOUR_OF_DAY, 23);
        last.set(Calendar.MINUTE, 59);
        last.set(Calendar.SECOND, 59);

        return last.getTime();
    }

    public static ZonedDateTime convertToZonedDateTime(Date date) {

        return ZonedDateTime.ofInstant(date.toInstant(), ZoneId.systemDefault());
    }
}
