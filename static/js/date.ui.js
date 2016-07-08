"use strict";
/*
 * date.ui.js
 */


/*global document*/


var date = (function() {
  var $, today, selected, MyDate,
    flushToday, flushYear, flushMonth, flushDay, flushBoard,
    initModule, getSelectedDate, setSelectedDate,

    dateOnClick, yearOnChange, monthOnChange, nextOnClick, previousOnClick;

  $ = {
    selectYear: document.getElementById("date-ui-year"),
    selectMonth: document.getElementById("date-ui-month"),
    spanDays: document.getElementsByClassName("date-date"),
    buttonPrevious: document.getElementById("date-previous"),
    buttonNext: document.getElementById("date-next")
  };

  MyDate = function () {
      this.year = 0;
      this.month = 0;
      this.date = 0;
      this.idx = 0;
  }

  MyDate.prototype.toString = function () {
    return this.year + '.' + this.month + '.' + this.date + '.' + this.idx;
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
    var i, len, cur, dateOf1st, idxOfLastDate;

    // cleanup old date class
    for (i = 0, len = $.spanDays.length; i < len; i++) {
      $.spanDays[i].classList.remove("previous-month");
      $.spanDays[i].classList.remove("next-month");
      $.spanDays[i].classList.remove("today");
      $.spanDays[i].classList.remove("selected");
    }

    dateOf1st = (new Date(date.year, date.month)).getDay();

    idxOfLastDate = dateOf1st + new Date((new Date(date.year, date.month+1) - 1)).getDate();

    cur = 1;
    for (i = dateOf1st, len = idxOfLastDate; i < len; i++) {
        $.spanDays[i].innerText = cur;
        if (cur === today.date && date.year === today.year && date.month === today.month) {
          $.spanDays[i].classList.add("today");
        }
        if (cur == selected.date && date.year === selected.year && date.month === selected.month) {
          $.spanDays[i].classList.add("selected");
          selected.idx = i;
        }
        if (cur === date.date) {
          date.idx = i;
        }
        cur += 1;
    }

    cur = 1;
    for (i = idxOfLastDate, len = $.spanDays.length; i < len; i++) {
        $.spanDays[i].innerText = cur;
        $.spanDays[i].classList.add('next-month');
        cur += 1;
    }

    cur = new Date((new Date(date.year, date.month) - 1)).getDate();
    for (i = dateOf1st - 1;i >= 0; i--) {
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
        selected.month = Number($.selectMonth.selectedIndex + 1);
        if (-1 === selected.month) {
          selected.month = 11;
          selected.year -= 1;
        }
      } else if (-1 !== this.className.indexOf("previous-month")) {
        selected.month = Number($.selectMonth.selectedIndex - 1);
        if (12 === selected.month) {
          selected.month = 0;
          selected.year += 1;
        }
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

  getSelectedDate = function () {
    var cur = new MyDate(), selected;
    cur.year = Number($.selectYear.selectedOptions[0].innerText);
    cur.month = Number($.selectMonth.selectedIndex);
    selected = document.getElementsByClassName("selected");
    if (0 !== selected.length) {
      cur.date = Number(selected[0].innerText);
    } else {
      cur.date = null;
    }

    return cur;
  }

  setSelectedDate = function (year, month, date) {
    var cur = new MyDate();
    cur.year = year;
    cur.month = month;
    cur.date = date;
    flushYear(cur);
    flushMonth(cur);
    flushDay(cur);
    dateOnClick(cur.idx).apply($.spanDays[cur.idx]);
  }

  previousOnClick = function () {
      var cur = getSelectedDate();
      cur.date = null;
      cur.month -= 1;
      if (-1 === cur.month) {
        cur.month = 11;
        cur.year -= 1;
      }
      flushYear(cur);
      flushMonth(cur);
      flushDay(cur);
  }

  nextOnClick = function () {
      var cur = getSelectedDate();
      cur.date = null;
      cur.month += 1;
      if (12 === cur.month) {
        cur.month = 0;
        cur.year += 1;
      }
      flushYear(cur);
      flushMonth(cur);
      flushDay(cur);
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
    $.buttonPrevious.addEventListener("click", previousOnClick);
    $.buttonNext.addEventListener("click", nextOnClick);
  }



  initModule()
  return {
    getSelectedDate: getSelectedDate,
    setSelectedDate: setSelectedDate,
    initModule: initModule
  };
}());
