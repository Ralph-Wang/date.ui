"use strict";
/*
 * date.ui.js
 */


/*global document*/


var date = (function() {
  var $, today, selected,
    flushToday, flushYear, flushMonth, flushDay;

  $ = {
    selectYear: document.getElementById("date-ui-year"),
    selectMonth: document.getElementById("date-ui-month"),
    spanDays: document.getElementsByClassName("date-date")
  };

  today = {
    year: 0,
    month: 0,
    date: 0,
    week: 0
  };

  flushToday = function() {
    var now = new Date();
    today.year = now.getFullYear();
    today.month = now.getMonth();
    today.date = now.getDate()
    today.week = now.getDay()
  };

  flushYear = function(date) {
    var cur;
    for (var i = 0, len = $.selectYear.options.length; i < len; i++) {
      cur = $.selectYear.options[i];
      cur.innerText = date.year + Number(cur.value);
      if ("0" === cur.value) {
        cur.selected = true;
      }
    }
  };

  flushMonth = function (date) {
    var cur;
    for (var i = 0, len = $.selectMonth.options.length; i < len; i++) {
      cur = $.selectMonth.options[i];
      if (String(today.month) === cur.value) {
        cur.selected = true;
      }
    }

  };

  flushDay = function (date) {
    var i, len, cur, dayOf1st, lastDate;

    // cleanup old date class
    for (i = 0, len = $.spanDays.length; i < len; i++) {
      $.spanDays[i].classList.remove("not-this-month");
      $.spanDays[i].classList.remove("today");
      $.spanDays[i].classList.remove("selected");
    }

    dayOf1st = (new Date(date.year, date.month)).getDay();

    lastDate = dayOf1st + 31;/*TODO*/

    cur = 1;
    for (i = dayOf1st, len = dayOf1st + 31/*TODO*/; i < len; i++) {
        $.spanDays[i].innerText = cur;
        if (cur === today.date) {
          $.spanDays[i].classList.add("today");
        }
        cur += 1;
    }

    cur = 1;
    for (i = lastDate, len = $.spanDays.length; i < len; i++) {
        $.spanDays[i].innerText = cur;
        $.spanDays[i].classList.add('not-this-month');
        cur += 1;
    }

    cur = new Date((new Date(date.year, date.month) - 1)).getDate();
    for (i = dayOf1st - 1;i >= 0; i--) {
        $.spanDays[i].innerText = cur;
        $.spanDays[i].classList.add('not-this-month');
        cur -= 1;
    }
  };


  flushToday();
  flushYear(today);
  flushMonth(today);
  flushDay(today);
  return {};
}());
