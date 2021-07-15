#!/bin/env node
const querystring = require("querystring");
var short = (link) => {
	if (link[link.length-1]=="/"&&link[link.length-2]!="/") link = link.substring(0, link.length-1);
	var f = link.match(/^(https?\:\/\/)?(www\.)?reddit\.com\/([ur]\/[a-zA-Z0-9_\-]{2,24})(\/((comments\/([A-Z0-9a-z]{4,8}))(\/[a-zA-Z0-9_]+(\/(([A-Z0-9a-z]{4,8})?))?)?([\#\?].*)?)?)?$/);
	if (!f) return null;
	var url = `https://reddit.com`;
	if (f[3]) {
		url += `/${f[3]}`;
		if (f[6]) {
			url += `/${f[6]}`;
			if (f[10]) {
				url += `/_/${f[10]}`;
			}
		}
	}
	if (f[11] && f[11].startsWith('?')) {
		var qs = querystring.parse(f[11].substring(1));
		delete qs.utm_source;
		delete qs.utm_medium;
		delete qs.utm_name;
		delete qs.source;
		//delete qs.context; //context will show parent comments
		if (Object.keys(qs).length > 0)
			url += `?${querystring.stringify(qs)}`;
	}
	return url;
};
if (require.main === module) {
	const argv = require("minimist")(process.argv.splice(2));
	const url = argv.url || argv.u;
	if (typeof url == 'string') {
		var e = short(url);
		if (e) console.log(e);
		process.exit(e ? 0 : 1);
	} else {
		console.error('requires argument --url -u');
		process.exit(2);
	}
} else {
	module.exports = short;
}

