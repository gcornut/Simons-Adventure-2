
exports.url = ["/robots.txt"];
exports.processor = function(req, res) {
	res.end("User-agent: *\n\nAllow: /");
};
