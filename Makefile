posts:
	# json-server external_apis/posts.json -p 3001 --middlewares ./external_apis/random-delay.js
	json-server external_apis/posts.json -p 3001 --delay 500

users:
	# json-server external_apis/user.json -p 3002 --middlewares ./external_apis/random-delay.js
	json-server external_apis/user.json -p 3002 --delay 500

comments:
	# json-server external_apis/comments.json -p 3003 --delay 500
	json-server external_apis/comments.json -p 3003 --delay 500

run:
	NODE_PATH=./src npx ts-node-dev --trace-warnings --inspect --respawn --transpile-only --ignore-watch node_modules src/app.ts