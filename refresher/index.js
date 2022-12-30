const process = require("process");
const axios = require("axios");

const { Client } = require("pg");
const client = new Client({
  host: "10.0.0.100",
  port: 5432,
  user: "postgres",
  database: "postgres",
  password: "flipside-api-database-password",
});
client.connect();

var toTerminate = false;

function main() {
  if (toTerminate === true) {
    process.exit();
  }

  client
    .query(
      `with tmp as (
		select 
		EXTRACT(EPOCH FROM now()) as currentTime,
		EXTRACT(EPOCH FROM COALESCE(last_updated, to_timestamp(0))) as stored_time,
		*
		from stored_queries
		)
		select currentTime - stored_time, * from tmp
		where currentTime - stored_time > COALESCE(ttl_seconds, 45*60)`
    )
    .then((res) => {
      if (res.rows) {
        const array = res.rows;
        for (let index = 0; index < array.length; index++) {
          const element = array[index];
		  console.log("sending query...")
          axios.post("http://10.0.0.110:3000/getCachedQuery", {
            query: element.query,
            force: "true",
          });
        }
      }
    })
    .catch((e) => console.error(e.stack));
}

process.on("SIGINT", () => {
  console.log("Received SIGINT. Press Control-D to exit.");
  toTerminate = true;
});

process.on("SIGTERM", () => {
  console.log("Received SIGTERM. Press Control-D to exit.");
  toTerminate = true;
});

setInterval(main, 5*60000);
