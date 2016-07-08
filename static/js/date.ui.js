"use strict";
/*
 * date.ui.js
 */


/*global document*/


var date = (function() {
  var $, today, selected, MyDate,
    flushToday, flushYear, flushMonth, flushDay, flushBoard,
    initModule,
    
    dateOnClick, yearOnChange, monthOnChange;

  $ = {
    selectYear: document.getElementById("date-ui-year"),
    selectMonth: document.getElementById("date-ui-month"),
    spanDays: document.getElementsByClassName("date-date")
  };

  MyDate = function () {
    return {
      year: 0,
      month: 0,
      date: 0,
      week: 0,
      idx: null
    }
  }

  selected = new MyDate();

  today = new MyDate();

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
      if (String(date.month) === cur.value) {
        cur.selected = true;
      }
    }

  };

  flushDay = function (date) {
    var i, len, cur, dayOf1st, lastDate;

    // cleanup old date class
    for (i = 0, len = $.spanDays.length; i < len; i++) {
      $.spanDays[i].classList.remove("previous-month");
      $.spanDays[i].classList.remove("next-month");
      $.spanDays[i].classList.remove("today");
      $.spanDays[i].classList.remove("selected");
    }

    dayOf1st = (new Date(date.year, date.month)).getDay();

    lastDate = dayOf1st + 31;/*TODO*/

    cur = 1;
    for (i = dayOf1st, len = dayOf1st + 31/*TODO*/; i < len; i++) {
        $.spanDays[i].innerText = cur;
        if (cur === today.date && date.year === today.year && date.month === today.month) {
          $.spanDays[i].classList.add("today");
        }
        cur += 1;
    }

    cur = 1;
    for (i = lastDate, len = $.spanDays.length; i < len; i++) {
        $.spanDays[i].innerText = cur;
        $.spanDays[i].classList.add('next-month');
        cur += 1;
    }

    cur = new Date((new Date(date.year, date.month) - 1)).getDate();
    for (i = dayOf1st - 1;i >= 0; i--) {
        $.spanDays[i].innerText = cur;
        $.spanDays[i].classList.add('previous-month');
        cur -= 1;
    }
  };


  dateOnClick = function (idx) {
    return function () {
      if (null !== selected.idx) {
        $.spanDays[selected.idx].classList.remove("selected");
      }
      this.classList.add("selected");
      selected.idx = idx;
      selected.year = Number($.selectYear.selectedOptions[0].innerText);
      if (-1 !== this.className.indexOf("next-month")) {
        // TODO flush the date board
        selected.month = Number($.selectMonth.selectedIndex + 1);
      } else if (-1 !== this.className.indexOf("previous-month")) {
        // TODO flush the date board
        selected.month = Number($.selectMonth.selectedIndex - 1);
      } else {
        selected.month = Number($.selectMonth.selectedIndex);
      }
      selected.date = Number(this.innerText);
      selected.week = idx % 7;
    }
  }

  flushBoard = function () {
    var cur = new MyDate();
      cur.year = Number($.selectYear.selectedOptions[0].innerText);
      cur.month = Number($.selectMonth.selectedIndex);
      flushYear(cur);
      flushMonth(cur);
      flushDay(cur);
  }

  yearOnChange = function () {
    flushBoard();
  }

  monthOnChange = function () {
    flushBoard();
  }

  initModule = function () {
    var i, len;
    flushToday();
    flushYear(today);
    flushMonth(today);
    flushDay(today);

    for (i = 0, len = $.spanDays.length; i < len; i++) {
      $.spanDays[i].addEventListener("click", dateOnClick(i));
    }

    $.selectYear.addEventListener("change", yearOnChange);
    $.selectMonth.addEventListener("change", monthOnChange);
  }



  initModule()
  return {};
}());
