# buywatch (Proof Of Concept)
SOLID + Web Monetization and Micropyaments for media consumption

## Summary:
This prototype represents an original idea about how can be combined the decentralized web and the web monetization API for micropayments with the focus on media files distribution

## Requirements:
- Node.js (v16)


## How to run it locally:

`nvm use 16`

`git clone https://github.com/fan-droide/buywatch_POC.git`

`cd buywatch_POC`

**IMPORTANT!!**
`npm ci`

**NOTE**: do not run `npm i` otherwise the code will not work, the probelm might be related to `@inrupt/universal-fetch` and `undici` dependency

Rename `config.tamplate.js` to `config.js`

Get Bearer token value from `https://wallet.ilpv4.dev/`

`npm start`

Open `http://localhost:3001`

## Demo:


## More info: