nvm use 16

git clone https://github.com/fan-droide/buywatch_POC.git

cd buywatch_POC

IMPORTANT!!
npm ci 

NOTE: do not run npm i otherwise the code will not work, might be related to @inrupt/universal-fetch and undici dependency

rename config.tamplate.js to config.js

Get a valid PAYMENT_TOKEN from https://wallet.ilpv4.dev/

npm start

Open http://localhost:3001