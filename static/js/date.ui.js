"use strict";
/*
 * date.ui.js
 */


/*global document*/


var date = (function() {
  var $, html, today, selected, MyDate,
    flushToday, flushYear, flushMonth, flushDay, flushBoard,
    initModule, initDocument, getSelectedDate, setSelectedDate,

    dateOnClick, yearOnChange, monthOnChange, nextOnClick, previousOnClick;

  html = '<div class="date">' +
    '<div class="date-header">' +
        '<div class="date-selector">' +
          '<button id="date-previous"><-</button>' +
          '<select id="date-ui-month">' +
            '<option value="0">Jan.</option>' +
            '<option value="1">Feb.</option>' +
            '<option value="2">Mar.</option>' +
            '<option value="3">Apr.</option>' +
            '<option value="4">May.</option>' +
            '<option value="5">June.</option>' +
            '<option value="6">July.</option>' +
            '<option value="7">Aug.</option>' +
            '<option value="8">Sept.</option>' +
            '<option value="9">Oct.</option>' +
            '<option value="10">Nov.</option>' +
            '<option value="11">Dec.</option>' +
          '</select>' +
          '<select id="date-ui-year">' +
            '<option value="-5">0</option>' +
            '<option value="-4">0</option>' +
            '<option value="-3">0</option>' +
            '<option value="-2">0</option>' +
            '<option value="-1">0</option>' +
            '<option value="0">0</option>' +
            '<option value="1">0</option>' +
            '<option value="2">0</option>' +
            '<option value="3">0</option>' +
            '<option value="4">0</option>' +
            '<option value="5">0</option>' +
          '</select>' +
          '<button id="date-next">-></button>' +
        '</div>' +
    '</div>' +
    '<div class="date-body">' +
      '<span class="date-week">Sun.</span>' +
      '<span class="date-week">Mon.</span>' +
      '<span class="date-week">Tue.</span>' +
      '<span class="date-week">Wed.</span>' +
      '<span class="date-week">Thu.</span>' +
      '<span class="date-week">Fri.</span>' +
      '<span class="date-week">Sta.</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
      '<span class="date-date">1</span>' +
    '</div>' +
  '</div>';
  $ = {
    selectYear: null,
    selectMonth: null,
    spanDays: null,
    buttonPrevious: null,
    buttonNext: null
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

  MyDate.prototype.getPrevoiusMonth = function () {
    var previous = new MyDate();
    previous.date = null;
    if (0 === this.month) {
      previous.month = 11;
      previous.year = this.year - 1;
    } else {
      previous.month = this.month - 1;
      previous.year = this.year;
    }
    return previous;
  }

  MyDate.prototype.getNextMonth = function () {
    var next = new MyDate();
    next.date = null;
    if (11 === this.month) {
      next.month = 0;
      next.year = this.year + 1;
    } else {
      next.month = this.month + 1;
      next.year = this.year;
    }
    return next;
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
    var i, len, cur, dateOf1st, idxOfLastDate, previous, next;

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
    next = date.getNextMonth();
    for (i = idxOfLastDate, len = $.spanDays.length; i < len; i++) {
        $.spanDays[i].innerText = cur;
        $.spanDays[i].classList.add('next-month');
        if (cur === selected.date &&
          next.year === selected.year && next.month === selected.month
          ) {
          $.spanDays[i].classList.add("selected");
          selected.idx = i;
        }
        cur += 1;
    }

    cur = new Date((new Date(date.year, date.month) - 1)).getDate();
    previous = date.getPrevoiusMonth();
    for (i = dateOf1st - 1;i >= 0; i--) {
        $.spanDays[i].innerText = cur;
        $.spanDays[i].classList.add('previous-month');
        if (cur == selected.date &&
          previous.year === selected.year && previous.month === selected.month
          ) {
          $.spanDays[i].classList.add("selected");
          selected.idx = i;
        }
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
      var cur = getSelectedDate().getPrevoiusMonth();
      flushYear(cur);
      flushMonth(cur);
      flushDay(cur);
  }

  nextOnClick = function () {
      var cur = getSelectedDate().getNextMonth();
      flushYear(cur);
      flushMonth(cur);
      flushDay(cur);
  }

  initDocument = function () {
      $.selectYear = document.getElementById("date-ui-year");
      $.selectMonth = document.getElementById("date-ui-month");
      $.spanDays = document.getElementsByClassName("date-date");
      $.buttonPrevious = document.getElementById("date-previous");
      $.buttonNext = document.getElementById("date-next");
  };


  initModule = function () {
    var i, len, dom;
    dom = document.getElementById('date.ui');
    dom.innerHTML = html;
    initDocument();
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
