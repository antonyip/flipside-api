curl -X POST localhost:4000/getCachedQuery -H 'Content-Type: application/json' --data '{"query": "select 3"}'
curl -X POST localhost:4000/getCachedQuery -H 'Content-Type: application/json' --data '{"query": "select 2"}'
curl -X POST localhost:4000/getCachedQuery -H 'Content-Type: application/json' --data '{"query": "select 1", "force": "true"}'