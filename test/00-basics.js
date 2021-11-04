process.env["NODE_ENV"] = "development";
process.env["DEV_INIT_TEMPLATE"] = "1";

const
	assert = require('assert');

// Libs to test
const Template = require("../lib/index");
const daySLT = require("@advers/moment-SLT").default;
const dayjs = require("dayjs");

function str2date(str) {
	const m = str.match(/^(\d+)\.(\d+)\.(\d+) (\d+):(\d+):(\d+)$/);
	return {
		year: m[1],
		month: m[2],
		date: m[3],
		hour: m[4],
		minute: m[5],
		second: m[6],
	};
}

// Tests
describe('formatDateTime', function() {
	it('should work for date-time', function() {
		const now = new Date();
		const actual = Template.formatDateTime(now, "date-time");
		assert.equal(actual, dayjs(now).format("YYYY.MM.DD HH:mm"));
	});

	it('should work for date', function() {
		const now = new Date();
		const actual = Template.formatDateTime(now, "date");
		assert.equal(actual, dayjs(now).format("YYYY.MM.DD"));
	});

	it('should work for custom format', function() {
		const format = "YYYY/MM/DD HH.mm";
		const now = new Date();
		const actual = Template.formatDateTime(now, format);
		assert.equal(actual, dayjs(now).format(format));
	});
});


describe('formatDateTimeSLT', function() {
	it('should work for date-time', function() {
		const now = new Date();
		const actual = Template.formatDateTimeSLT(now, "date-time");
		assert.equal(actual, dayjs(now).tz("America/Los_Angeles").format("YYYY.MM.DD HH:mm"));
	});

	it('should work for date', function() {
		const now = new Date();
		const actual = Template.formatDateTimeSLT(now, "date");
		assert.equal(actual, dayjs(now).tz("America/Los_Angeles").format("YYYY.MM.DD"));
	});

	it('should work for custom format', function() {
		const format = "YYYY/MM/DD HH/mm";
		const now = new Date();
		const actual = Template.formatDateTimeSLT(now, format);
		assert.equal(actual, dayjs(now).tz("America/Los_Angeles").format(format));
	});

	it('should return correct time in SL', function() {
		const now = new Date();
		const sltString = Template.formatDateTimeSLT(now, "YYYY.MM.DD HH:mm:ss");
		const slt = str2date(sltString);
		console.log("SLT:", sltString, JSON.stringify(slt));

		let diff = slt.hour - now.getUTCHours();
		let shouldBeDate = now.getUTCDate();

		if(diff > 12) {
			shouldBeDate--;
			diff -= 24;
		}

		// Check if components of the date are correct
		assert.equal(diff, -7);
		assert.equal(slt.minute, now.getUTCMinutes());
		assert.equal(slt.second, now.getUTCSeconds());
		assert.equal(slt.date, shouldBeDate);
	});

});

describe('period2str', function() {
	it('should return zero difference with Los_Angeles', function() {
		const nowLA = daySLT(new Date(), "America/Los_Angeles");
		const diff = Template.period2str(nowLA);

		// Check if components of the date are correct
		assert.equal(diff, "a few seconds");
	});

	it('should return zero difference with timezoned now', function() {
		const now = new Date();
		const diff = Template.period2str(now);

		console.log(diff);

		// Check if components of the date are correct
		assert.equal(diff, "a few seconds");
	});

	it('should return actual difference with date with no timezone', function() {

		const nowDate = new Date();
		const now = daySLT(nowDate).format("YYYY-MM-DD HH:mm:ss");

		console.log(`now str: ${now} => `, daySLT(now).toISOString());
		const diff = Template.period2str(now);

		console.log(now, diff);

		// Check if components of the date are correct
		// WARNING: Moscow<->Los Angeles time, fix for non-fixed tz!
		assert.equal(diff, "10 hours");
	});
});
