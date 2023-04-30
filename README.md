# buywatch (Proof Of Concept)
SOLID + Web Monetization and Micropyaments for media consumption

## Summary:
This prototype represents an original idea about how can be combined the decentralized web and the web monetization API for micropayments with the focus on media files distribution


## Architecture 

![Architecture Diagram](https://raw.githubusercontent.com/fan-droide/buywatch_POC/main/screenshots/architecture.jpg)

## Requirements:
- Node.js (v16)


## How to run it locally:

`nvm use 16`

`git clone https://github.com/fan-droide/buywatch_POC.git`

`cd buywatch_POC`

**IMPORTANT!!**
`npm ci`

**NOTE**: do not run `npm i` otherwise the code will not work, the probelm might be related to `@inrupt/universal-fetch` and `undici` dependency

At `app/` folder, rename `config.tamplate.js` to `config.js`

Get Bearer token value from `https://wallet.ilpv4.dev/`

`npm start`

Open `http://localhost:3001`

## Demo:

Required:

- 2 accounts at https://start.inrupt.com/profile
- 2 accounts at https://wallet.ilpv4.dev

1) Login with Inrupt

2) Go to Upload Form


## More info:

- Web Monetization: http://webmonetization.org/docs/explainer
- Interledger: https://interledger.org/developer-tools/get-started/manage-accounts/