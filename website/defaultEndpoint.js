async function _defaultEndpoint (res, req) {
    req.send("Hello World!");
}

exports.defaultEndpoint = _defaultEndpoint;