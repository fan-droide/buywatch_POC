# buywatch (Proof Of Concept)
SOLID + Web Monetization and Micropyaments for media distribution

## Summary:
This prototype represents an original idea about how can be combined the decentralized web and the web monetization API for micropayments with the focus on media files


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

1) Login with Inrupt Provider
![Step  - ](https://raw.githubusercontent.com/fan-droide/buywatch_POC/main/screenshots/step01_login_inrupt_seller.png)

2) Choose account for Seller
![Step  - ](https://raw.githubusercontent.com/fan-droide/buywatch_POC/main/screenshots/step02_inruptaccount_seller.png)

3) Successful login shows the Seller WebId
![Step  - ](https://raw.githubusercontent.com/fan-droide/buywatch_POC/main/screenshots/step03_homescreenloggedin.png)

4) Go to Upload tab and fill the form. Select Pod, price and name. Include the payment endpoint and attach a file.
![Step  - ](https://raw.githubusercontent.com/fan-droide/buywatch_POC/main/screenshots/step04_uploadform.png)

5) Sign in at backend level to generate a session for seller in the server so access to resources can be granted to buyers
![Step  - ](https://raw.githubusercontent.com/fan-droide/buywatch_POC/main/screenshots/step05_backendauthentication.png)

6) Check at Market tab the new item added to the backend DB (right now data stored in memory)
![Step  - ](https://raw.githubusercontent.com/fan-droide/buywatch_POC/main/screenshots/step06_validateitemmarket.png)

7) Validate content is present in Inrupt's Pod
![Step  - ](https://raw.githubusercontent.com/fan-droide/buywatch_POC/main/screenshots/step07_checkInruptPod.png)

8) In a different browser session login with buyer account at Inrupt Provider
![Step  - ](https://raw.githubusercontent.com/fan-droide/buywatch_POC/main/screenshots/step08_loginNewWindowBuyer.png)

9) NOTE: Try to fetch exiting content in Market throws 401 error when not authenticated
![Step  - ](https://raw.githubusercontent.com/fan-droide/buywatch_POC/main/screenshots/step09_tryfetchwithoutlogin.png)

10) Click on "Fetch" button. If the user is logged in the error is 403, Forbidden, as it has no permission
![Step  - ](https://raw.githubusercontent.com/fan-droide/buywatch_POC/main/screenshots/step10_403forbidden.png)

11) To start the purchase process click on "Buy". A prompt will ask for buyer username at payment provider (https://wallet.ilpv4.dev). This step is only a mockup to showcase the payment experience in a test environment
![Step  - ](https://raw.githubusercontent.com/fan-droide/buywatch_POC/main/screenshots/step11_usernamePayBuyer.png)

12) After introducing the user name, the application wil request the secret token.
![Step  - ](https://raw.githubusercontent.com/fan-droide/buywatch_POC/main/screenshots/step12_IntroducePyamentSession.png)

13) The secret token, a bearer, can be extracted from the aforementioned website (https://wallet.ilpv4.dev) checking the headers in the requests. Copy the value.
![Step  - ](https://raw.githubusercontent.com/fan-droide/buywatch_POC/main/screenshots/step13_getBearerTOken.png)

14) Paste the value of the bearer in the prompt
![Step  - ](https://raw.githubusercontent.com/fan-droide/buywatch_POC/main/screenshots/step14_introduceToken.png)

15) Dialog shows the result "Access Granted" in casew the payment was successful.
![Step  - ](https://raw.githubusercontent.com/fan-droide/buywatch_POC/main/screenshots/step15_dialogSuccessAccess.png)

16) The result of the payment is shown in the console.
![Step  - ](https://raw.githubusercontent.com/fan-droide/buywatch_POC/main/screenshots/step16_paymenSuccesstResponse.png)

17) If click on "fetch" button now the content will be accessible and retrieved.
![Step  - ](https://raw.githubusercontent.com/fan-droide/buywatch_POC/main/screenshots/step17_fetchFromBuyer.png)



## More info:

- Web Monetization: http://webmonetization.org/docs/explainer
- Interledger: https://interledger.org/developer-tools/get-started/manage-accounts/