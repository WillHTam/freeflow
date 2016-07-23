/**
 * Format Google Calendar JSON output into human readable list
 *
 * Copyright 2015, Milan Kacurak
 *
 */
/* globals $*/
var formatGoogleCalendar = (function () {
  'use strict'
  var config

  // Gets JSON from Google Calendar and transfroms it into html list items and appends it to past or upcoming events list
  var init = function (settings) {
    var result = []

    config = settings

    // Get JSON, parse it, transform into list items and append it to past or upcoming events list
    $.getJSON(settings.calendarUrl, function (data) {
      // Remove any cancelled events
      data.items.forEach(function removeCancelledEvents (item) {
        if (item && item.hasOwnProperty('status') && item.status !== 'cancelled') {
          result.push(item)
        }
      })

      result.sort(comp).reverse()

      var pastCounter = 0
      var upcomingCounter = 0
      var pastResult = []
      var upcomingResult = []
      var upcomingResultTemp = []
      var $upcomingElem = $(settings.upcomingSelector)
      var $pastElem = $(settings.pastSelector)
      var i

      if (settings.pastTopN === -1) {
        settings.pastTopN = result.length
      }

      if (settings.upcomingTopN === -1) {
        settings.upcomingTopN = result.length
      }

      if (settings.past === false) {
        settings.pastTopN = 0
      }

      if (settings.upcoming === false) {
        settings.upcomingTopN = 0
      }

      for (i in result) {
        if (isPast(result[i].end.dateTime || result[i].end.date)) {
          if (pastCounter < settings.pastTopN) {
            pastResult.push(result[i])
            pastCounter++
          }
        } else {
          upcomingResultTemp.push(result[i])
        }
      }

      upcomingResultTemp.reverse()

      for (i in upcomingResultTemp) {
        if (upcomingCounter < settings.upcomingTopN) {
          upcomingResult.push(upcomingResultTemp[i])
          upcomingCounter++
        }
      }

      for (i in pastResult) {
        $pastElem.append(transformationList(pastResult[i], settings.itemsTagName, settings.format))
      }

      for (i in upcomingResult) {
        $upcomingElem.append(transformationList(upcomingResult[i], settings.itemsTagName, settings.format))
      }

      if ($upcomingElem.children().length !== 0) {
        $(settings.upcomingHeading).insertBefore($upcomingElem)
      }

      if ($pastElem.children().length !== 0) {
        $(settings.pastHeading).insertBefore($pastElem)
      }
    })
  }

  // Compare dates
  var comp = function (a, b) {
    return new Date(a.start.dateTime || a.start.date).getTime() - new Date(b.start.dateTime || b.start.date).getTime()
  }

  // Overwrites defaultSettings values with overrideSettings and adds overrideSettings if non existent in defaultSettings
  var mergeOptions = function (defaultSettings, overrideSettings) {
    var newObject = {}
    var i
    for (i in defaultSettings) {
      newObject[i] = defaultSettings[i]
    }
    for (i in overrideSettings) {
      newObject[i] = overrideSettings[i]
    }
    return newObject
  }

  // Get all necessary data (dates, location, summary, description) and creates a list item
  var transformationList = function (result, tagName, format) {
    var dateStart = getDateInfo(result.start.dateTime || result.start.date)
    var dateEnd = getDateInfo(result.end.dateTime || result.end.date)
    var dateFormatted = getFormattedDate(dateStart, dateEnd)
    var output = '<' + tagName + '>'
    var summary = result.summary || ''
    var description = result.description || ''
    var location = result.location || ''
    var i

    for (i = 0; i < format.length; i++) {
      format[i] = format[i].toString()

      if (format[i] === '*summary*') {
        output = output.concat('<p class="summary">' + summary + '</p>')
      } else if (format[i] === '*date*') {
        output = output.concat('<p class="date">' + dateFormatted + '</p>')
      } else if (format[i] === '*description*') {
        output = output.concat('<p class="description">' + description + '</p>')
      } else if (format[i] === '*location*') {
        output = output.concat('<p class="location">' + location + '</p>')
      } else {
        if ((format[i + 1] === '*location*' && location !== '') ||
          (format[i + 1] === '*summary*' && summary !== '') ||
          (format[i + 1] === '*date*' && dateFormatted !== '') ||
          (format[i + 1] === '*description*' && description !== '')) {
          output = output.concat(format[i])
        }
      }
    }

    return output + '</' + tagName + '>'
  }

  // Check if date is later then now
  var isPast = function (date) {
    var compareDate = new Date(date)
    var now = new Date()

    if (now.getTime() > compareDate.getTime()) {
      return true
    }
    return false
  }

  // Get temp array with information abou day in followin format: [day number, month number, year]
  var getDateInfo = function (date) {
    date = new Date(date)
    return [date.getDate(), date.getMonth(), date.getFullYear(), date.getHours(), date.getMinutes()]
  }

  // Get month name according to index
  var getMonthName = function (month) {
    var monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ]
    return monthNames[month]
  }

  // Transformations for formatting date into human readable format
  var formatDateSameDay = function (dateStart, dateEnd) {
    var formattedTime = ''

    if (config.sameDayTimes) {
      formattedTime = ' from ' + getFormattedTime(dateStart) + ' - ' + getFormattedTime(dateEnd)
    }

    // month day, year time-time
    return getMonthName(dateStart[1]) + ' ' + dateStart[0] + ', ' + dateStart[2] + formattedTime
  }

  var formatDateDifferentDay = function (dateStart, dateEnd) {
    // month day-day, year
    return getMonthName(dateStart[1]) + ' ' + dateStart[0] + '-' + dateEnd[0] + ', ' + dateStart[2]
  }

  var formatDateDifferentMonth = function (dateStart, dateEnd) {
    // month day - month day, year
    return getMonthName(dateStart[1]) + ' ' + dateStart[0] + '-' + getMonthName(dateEnd[1]) + ' ' + dateEnd[0] + ', ' + dateStart[2]
  }

  var formatDateDifferentYear = function (dateStart, dateEnd) {
    // month day, year - month day, year
    return getMonthName(dateStart[1]) + ' ' + dateStart[0] + ', ' + dateStart[2] + '-' + getMonthName(dateEnd[1]) + ' ' + dateEnd[0] + ', ' + dateEnd[2]
  }

  // Check differences between dates and format them
  var getFormattedDate = function (dateStart, dateEnd) {
    var formattedDate = ''

    if (dateStart[0] === dateEnd[0]) {
      if (dateStart[1] === dateEnd[1]) {
        if (dateStart[2] === dateEnd[2]) {
          // month day, year
          formattedDate = formatDateSameDay(dateStart, dateEnd)
        } else {
          // month day, year - month day, year
          formattedDate = formatDateDifferentYear(dateStart, dateEnd)
        }
      } else {
        if (dateStart[2] === dateEnd[2]) {
          // month day - month day, year
          formattedDate = formatDateDifferentMonth(dateStart, dateEnd)
        } else {
          // month day, year - month day, year
          formattedDate = formatDateDifferentYear(dateStart, dateEnd)
        }
      }
    } else {
      if (dateStart[1] === dateEnd[1]) {
        if (dateStart[2] === dateEnd[2]) {
          // month day-day, year
          formattedDate = formatDateDifferentDay(dateStart, dateEnd)
        } else {
          // month day, year - month day, year
          formattedDate = formatDateDifferentYear(dateStart, dateEnd)
        }
      } else {
        if (dateStart[2] === dateEnd[2]) {
          // month day - month day, year
          formattedDate = formatDateDifferentMonth(dateStart, dateEnd)
        } else {
          // month day, year - month day, year
          formattedDate = formatDateDifferentYear(dateStart, dateEnd)
        }
      }
    }
    return formattedDate
  }

  var getFormattedTime = function (date) {
    var formattedTime = ''
    var period = 'AM'
    var hour = date[3]
    var minute = date[4]

    // Handle afternoon.
    if (hour >= 12) {
      period = 'PM'

      if (hour >= 13) {
        hour -= 12
      }
    }

    // Handle midnight.
    if (hour === 0) {
      hour = 12
    }

    // Ensure 2-digit minute value.
    minute = (minute < 10 ? '0' : '') + minute

    // Format time.
    formattedTime = hour + ':' + minute + period
    return formattedTime
  }

  return {
    init: function (settingsOverride) {
      var settings = {
        calendarUrl: 'https://www.googleapis.com/calendar/v3/calendars/84arudvc87kfnrlm7n3vbaoki4@group.calendar.google.com/events?key=AIzaSyDwr3cwM3OXuPikB1BqebAWQQyACjZsFGA',
        past: true,
        upcoming: true,
        sameDayTimes: true,
        pastTopN: -1,
        upcomingTopN: -1,
        itemsTagName: 'li',
        upcomingSelector: '#events-upcoming',
        pastSelector: '#events-past',
        upcomingHeading: '<h5>Upcoming events</h5>',
        pastHeading: '<h5>Past events</h5>',
        format: ['*date*', ': ', '*summary*', ' &mdash ', '*description*', ' in ', '*location*']
      }
      settings = mergeOptions(settings, settingsOverride)
      init(settings)
    }
  }
})()
$(function () {
  formatGoogleCalendar.init({
    calendarUrl: 'https://www.googleapis.com/calendar/v3/calendars/ugehkq8pugck4d8ton3415n5cialail2@import.calendar.google.com/events?key=AIzaSyDwr3cwM3OXuPikB1BqebAWQQyACjZsFGA',
    past: true,
    upcoming: true,
    sameDayTimes: true,
    pastTopN: -1,
    upcomingTopN: -1,
    itemsTagName: 'li',
    upcomingSelector: '#events-upcoming',
    pastSelector: '#events-past',
    upcomingHeading: '<h5>Upcoming events</h5>',
    pastHeading: '<h5>Past events</h5>',
    format: ['*date*', ': ', '*summary*', ' — ', '*description*', ' in ', '*location*']
  })
})
