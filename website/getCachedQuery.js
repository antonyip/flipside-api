const { getQuery } = require('./getQuery')
const { storeQuery } = require('./storeQuery')

const { Client } = require('pg')
const client = new Client({
    host: '10.0.0.100',
    port: 5432,
    user: 'postgres',
    password: 'flipside-api-database-password',
  })
client.connect()

const DEBUGLOG = true;
function debugLog(myString){
    if (DEBUGLOG)
    {
        console.log(myString);
    }
}

async function isQueryTTLValid(query) {
    const pg_res = await client.query(
        'select CURRENT_TIMESTAMP - COALESCE(last_updated, to_timestamp(0)) as diff, result from stored_queries where query=$1',
        [query]
    )

    debugLog(`pg_res.rows ${JSON.stringify(pg_res.rows)}`)
    const timediff = parseInt(pg_res.rows[0].diff.hours)
    const timediff2 = parseInt(pg_res.rows[0].diff.days)
    debugLog(`timediff hours: ${timediff}`)
    debugLog(`timediff days: ${timediff2}`)
    if (timediff > 1 || timediff2 > 1) {
        return { isValid: false, returnValue: {} };
    }
    return { isValid: true, returnValue: pg_res.rows[0].result };
}

async function storeQueryResults(query, results) {

    // Send the `Query` to Flipside's query engine and await the results
    const pg_res = await client.query(
        'update stored_queries set result=$1, last_updated=CURRENT_TIMESTAMP where query=$2',
        [results, query]
        )
}

async function _getCachedQueryWeb(req, res) {
    if (!req.body) {
        res.send("Invalid Body");
        return {"error":"Invalid Input Body"};
    }

    if (!req.body.query) {
        res.send("Invalid Body");    
        return {"error":"Invalid Input Body"};
    }
    debugLog(`query: ${req.body.query}`)
    await storeQuery(req.body.query);
    // if query is still valid
    const { isValid, returnValue } = await isQueryTTLValid(req.body.query)
    if (isValid) {
        res.send(returnValue);
    }
    else { // else return previous values
        const queryResults = await getQuery(req.body.query);
        await storeQueryResults(req.body.query, queryResults);
        res.send(queryResults);
    }
}

exports.getCachedQueryWeb = _getCachedQueryWeb