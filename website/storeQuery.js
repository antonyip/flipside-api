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
 

//await client.end()

async function _storeQuery (query) {
    const pg_res = await client.query('select count(1) from stored_queries where query=$1', [query])
    if (pg_res.rows[0].count === '0')
    {
        const pg_res2 = await client.query('INSERT INTO stored_queries(query) VALUES($1)', [query])
        debugLog(`inserted rows ${pg_res2.rowCount}`)
    }
    else
    {
        debugLog(`pg_res.rows[0].count ${pg_res.rows[0].count}`)
    }

    const pg_final = await client.query('select ID from stored_queries where query=$1', [query])
    debugLog(`pg_final.rows[0].id ${JSON.stringify(pg_final.rows[0].id)}`)
    const idParse = parseInt(pg_final.rows[0].id)
    if (idParse > 0) {
        return {isOK: true, ID: pg_final.rows[0].id}
    }
    return {isOK: false, ID: '-1'}
}

async function _storeQueryWeb (req, res) {

    if (!req.body) {
        res.send("Invalid Body");
        return {"error":"Invalid Input Body"};
    }

    if (!req.body.query) {
        res.send("Invalid Body");    
        return {"error":"Invalid Input Body"};
    }

    const {isOK, ID} = await _storeQuery(req.body.query);
    if (isOK) {
        res.send({"ID": ID})
    }
    else {
        res.send({"error": "_storeQuery failed"});
    }

}

exports.storeQueryWeb = _storeQueryWeb;
exports.storeQuery = _storeQuery;