const { Flipside } = require("@flipsidecrypto/sdk");

// Initialize `Flipside` with your API key
const flipside = new Flipside(
  "6e3d7f1c-b1da-4362-a3d5-570717d239b8",
  "https://node-api.flipsidecrypto.com"
);

async function _getQuery(query) {
    // Create a query object for the `query.run` function to execute
    const fs_query = {
        sql: query,
        ttlMinutes: 15,
    };

    // Send the `Query` to Flipside's query engine and await the results
    const result = await flipside.query.run(fs_query);

    return result;
}

async function _getQueryWeb (req, res) {

    if (!req.body) {
        res.send("Invalid Body");
        return {"error":"Invalid Input Body"};
    }

    if (!req.body.query) {
        res.send("Invalid Body");    
        return {"error":"Invalid Input Body"};
    }

    const result = await _getQuery(req.body.query);

    if (result?.records) {
        res.send(JSON.stringify(result?.records));
        return result?.records;
    }
    else {
        res.send(JSON.stringify(result))
    }
    return result
}

exports.getQuery = _getQuery;
exports.getQueryWeb = _getQueryWeb;