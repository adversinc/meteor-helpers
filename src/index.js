import moment from '@advers/moment-SLT';
import AvatarTools from "@advers/secondlife-tools";

Template.registerHelper('formatDateTime', function(date, format) {
	let formatString = "YYYY.MM.DD";
	if(format == "date-time") {
		formatString = "YYYY.MM.DD HH:mm";
	}

	return moment(date).format(formatString);
});


Template.registerHelper('formatDateTimeSLT', function(date, format) {
	let formatString = "YYYY.MM.DD";
	if(format == "date-time") {
		formatString = "YYYY.MM.DD HH:mm";
	}

	return moment.tz(date, "America/Los_Angeles").format(formatString);
});

/**
 * Returns the value of the session var.
 *
 * @function Session
 * @param {string} v - the session variable
 * @param {string} [p] - if specified, then specific value is taken from session var
 */
Template.registerHelper('Session', function(v, p) {
	if(typeof(p) !== "string") {
		return Session.get(v);
	} else {
		let d = Session.get(v);
		if(d) { return d[p]; }
		else { return null; }
	}
});

/**
 * Page local state helper.
 *
 * Note: The template has to define the local ReactiveDict pageState variable
 * in onCreated.
 * @function pageState
 * @param {String} v - the field of the pageState
 */
Template.registerHelper('pageState', function(v) {
	return Template.instance().pageState.get(v);
});

/**
 * Concatenates arguments into a string
 * @function conCat
 */
Template.registerHelper('conCat', function(...args) {
	return args.slice(0, args.length-1).join("");
});


Template.registerHelper('slname2str', function(slname) {
	if(typeof slname == "object") { slname = slname.slname; }

	if(typeof slname != "string") { return ""; }
	return AvatarTools.slname2str(slname);
});

Template.registerHelper('uuid2str', function(uuid) {
	if(typeof uuid !== "string") {
		return "0000…00";
	}
	let result = uuid.substring(0, 4) + "…" + uuid.substring(uuid.length-2);
	return result.toUpperCase();
});

/**
 * Returns the period length from now till the specific datetime
 *
 * @function period2str
 * @param {Date} date - the date to calculate till
 */
Template.registerHelper('period2str', function(date) {
	return moment().to(moment(date), true);
});

Template.registerHelper('slname2snake', function(slname) {
	if(typeof slname == "object") { slname = slname.slname; }

	if(typeof slname != "string") { return ""; }
	return AvatarTools.slname2str(slname).toLowerCase().replace(" ", "_");
});

/**
 * Formats money number, printing it as L$XXX,XXX
 */
Number.prototype.format = function(n, x) {
	const re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
	return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};

Template.registerHelper('formatLS', function(amount) {
	if(!amount) {
		return "L$0";
	}
	const amountAbs = Math.abs(amount);
	const str = amountAbs.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '$&,');
	return (amount<0)? `-L$${str}`: `L$${str}`;
});

/**
 * Converts location to fill SLURL (https://maps.secondlife.com...)
 * @function location2slurl
 * @param {String} location - the location string (Region/X/Y/Z)
 */
Template.registerHelper('location2slurl', function(location) {
	if(!location) { return "#"; }

	location = location.replace(/ /g, "%20");
	return "https://maps.secondlife.com/secondlife/" + location;
});
