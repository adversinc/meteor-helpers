"use strict";

var _momentSLT = _interopRequireDefault(require("@advers/moment-SLT"));

var _secondlifeTools = _interopRequireDefault(require("@advers/secondlife-tools"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Template.registerHelper('formatDateTime', function (date, format) {
  let formatString = "YYYY.MM.DD";

  if (format == "date-time") {
    formatString = "YYYY.MM.DD HH:mm";
  }

  return (0, _momentSLT.default)(date).format(formatString);
});
Template.registerHelper('formatDateTimeSLT', function (date, format) {
  let formatString = "YYYY.MM.DD";

  if (format == "date-time") {
    formatString = "YYYY.MM.DD HH:mm";
  }

  return _momentSLT.default.tz(date, "America/Los_Angeles").format(formatString);
});
/**
 * Returns the value of the session var.
 * @param {string} v - the session variable
 * @param {string} [p] - if specified, then specific value is taken from session var
 */

Template.registerHelper('Session', function (v, p) {
  if (typeof p !== "string") {
    return Session.get(v);
  } else {
    let d = Session.get(v);

    if (d) {
      return d[p];
    } else {
      return null;
    }
  }
});
/**
 * Page local state helper. The page has to define local ReactiveDict
 * pageState variable in onCreated
 */

Template.registerHelper('pageState', function (v) {
  return Template.instance().pageState.get(v);
});
Template.registerHelper('slname2str', function (slname) {
  if (typeof slname == "object") {
    slname = slname.slname;
  }

  if (typeof slname != "string") {
    return "";
  }

  return _secondlifeTools.default.slname2str(slname);
});
Template.registerHelper('uuid2str', function (uuid) {
  if (typeof uuid !== "string") {
    return "0000…00";
  }

  let result = uuid.substring(0, 4) + "…" + uuid.substring(uuid.length - 2);
  return result.toUpperCase();
});
Template.registerHelper('period2str', function (date) {
  return (0, _momentSLT.default)().to((0, _momentSLT.default)(date), true);
});
Template.registerHelper('slname2snake', function (slname) {
  if (typeof slname == "object") {
    slname = slname.slname;
  }

  if (typeof slname != "string") {
    return "";
  }

  return _secondlifeTools.default.slname2str(slname).toLowerCase().replace(" ", "_");
});
/**
 * Formats money number, printing it as L$XXX,XXX
 */

Number.prototype.format = function (n, x) {
  const re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
  return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};

Template.registerHelper('formatLS', function (amount) {
  if (!amount) {
    return "L$0";
  }

  const amountAbs = Math.abs(amount);
  const str = amountAbs.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  return amount < 0 ? `-L$${str}` : `L$${str}`;
});
/**
 * Converts location to fill SLURL (https://maps.secondlife.com...)
 * @function
 */

Template.registerHelper('location2slurl', function (location) {
  if (!location) {
    return "#";
  }

  location = location.replace(/ /g, "%20");
  return "https://map.secondlife.com/secondlife/" + location;
});