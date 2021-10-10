process.env["NODE_ENV"] = "development";
process.env["DEV_INIT_TEMPLATE"] = "1";

const
	assert = require('assert');

// Libs to test
const Template = require("../lib/index");

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
describe('formatDateTimeSLT', function() {
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
	it('should return zero difference with now', function() {
		const now = new Date();
		const diff = Template.period2str(now);

		console.log(diff);

		// Check if components of the date are correct
		assert.equal(diff, "a few seconds");
	});
});
