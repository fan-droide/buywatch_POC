# buywatch (Proof Of Concept)
SOLID + Web Monetization and Micropyaments for media distribution.


https://github.com/fan-droide/buywatch_POC/assets/119511528/ad2e9f95-359b-4471-904f-b91b70565330



## Summary:
This prototype represents an original idea about how can be combined the decentralized web and the web monetization API for micropayments with the focus on media files.


## Architecture 

![Architecture Diagram](https://raw.githubusercontent.com/fan-droide/buywatch_POC/main/screenshots/architecture_diagram.jpg)

## Requirements:
- Node.js (v16)
- Recommended: https://github.com/nvm-sh/nvm#intro

## How to run it locally:

- Optional: `nvm use 16` (see Requirements)

- `git clone https://github.com/fan-droide/buywatch_POC.git`

- `cd buywatch_POC`

**IMPORTANT!!**

- `npm ci`

**NOTE**: do not run `npm i`, otherwise the code will not work, the probelm might be related to `@inrupt/universal-fetch` and `undici` dependency

- At `app/` folder, rename `config.tamplate.js` to `config.js`

- Get Bearer token value from `https://wallet.ilpv4.dev/` (See Step 13 below)

- `npm start`

- Open `http://localhost:3001`

## Demo:

Required:

- 2 accounts at https://start.inrupt.com/profile
- 2 accounts at https://wallet.ilpv4.dev

**1) Login using Inrupt Provider.**

![Step 1 - ](https://raw.githubusercontent.com/fan-droide/buywatch_POC/main/screenshots/step01_login_inrupt_seller.png)


**2) Choose an account for publishing content as a Seller.**

![Step 2 - ](https://raw.githubusercontent.com/fan-droide/buywatch_POC/main/screenshots/step02_inruptaccount_seller.png)


**3) Successful login shows the Seller WebId at home page.**

![Step 3 - ](https://raw.githubusercontent.com/fan-droide/buywatch_POC/main/screenshots/step03_homescreenloggedin.png)


**4) Go to the Upload tab and fill the form. Select Pod, price and name. Include the payment endpoint and then attach a file. Click on "Send New Data to Pod".**

![Step 4 - ](https://raw.githubusercontent.com/fan-droide/buywatch_POC/main/screenshots/step04_uploadform.png)


**5) Sign in at backend level to generate a session in the server for the seller, so the server can access resources and also give permission to buyers.**

![Step 5 - ](https://raw.githubusercontent.com/fan-droide/buywatch_POC/main/screenshots/step05_backendauthentication.png)


**6) Check at the Market tab that the new item is added to the backend DB (NOTE: right now data is stored in memory only).**

![Step 6 - ](https://raw.githubusercontent.com/fan-droide/buywatch_POC/main/screenshots/step06_validateitemmarket.png)


**7) Go to Inrupt's Pod and verify that the content is successfully uploaded.**

![Step 7 - ](https://raw.githubusercontent.com/fan-droide/buywatch_POC/main/screenshots/step07_checkInruptPod.png)


**8) In a different browser session, login with a buyer account using Inrupt Provider.**

![Step 8 - ](https://raw.githubusercontent.com/fan-droide/buywatch_POC/main/screenshots/step08_loginNewWindowBuyer.png)


**9) NOTE: Try to fetch existing content in Market throws 401 error (unathorized) when user is not authenticated.**

![Step 9 - ](https://raw.githubusercontent.com/fan-droide/buywatch_POC/main/screenshots/step09_tryfetchwithoutlogin.png)


**10) Click on the "Fetch" button. If the user is logged in the error is 403, Forbidden, as it has no permission.**

![Step 10 - ](https://raw.githubusercontent.com/fan-droide/buywatch_POC/main/screenshots/step10_403forbidden.png)


**11) To start the purchase process click on "Buy". A prompt will ask for the buyer's user name in the payment provider. IN this example you can get it from https://wallet.ilpv4.dev. This step is only a mockup to showcase the payment experience in a test environment.**

![Step 11 - ](https://raw.githubusercontent.com/fan-droide/buywatch_POC/main/screenshots/step11_usernamePayBuyer.png)


**12) After introducing the user name, the application will request the secret token.**

![Step 12 - ](https://raw.githubusercontent.com/fan-droide/buywatch_POC/main/screenshots/step12_IntroducePyamentSession.png)


**13) The secret token, a bearer, can be extracted from the aforementioned website (https://wallet.ilpv4.dev) by inspecting the headers in the network requests. Copy the value as the image shows. This is a temporary solution and not recommended.**

![Step 13 - ](https://raw.githubusercontent.com/fan-droide/buywatch_POC/main/screenshots/step13_getBearerTOken.png)


**14) Paste the value of the bearer in the prompt.**

![Step 14 - ](https://raw.githubusercontent.com/fan-droide/buywatch_POC/main/screenshots/step14_introduceToken.png)


**15) Dialog shows the result "Access Granted" in case the payment is successful.**

![Step 15 - ](https://raw.githubusercontent.com/fan-droide/buywatch_POC/main/screenshots/step15_dialogSuccessAccess.png)


**16) The result of the payment transaction is shown in the console.**

![Step 16 - ](https://raw.githubusercontent.com/fan-droide/buywatch_POC/main/screenshots/step16_paymenSuccesstResponse.png)


**17) If you click on the "Fetch" button now, the content will be accessible and retrieved.**

![Step 17 - ](https://raw.githubusercontent.com/fan-droide/buywatch_POC/main/screenshots/step17_fetchFromBuyer.png)



## More info:

- Web Monetization: http://webmonetization.org/docs/explainer
- Interledger: https://interledger.org/developer-tools/get-started/manage-accounts/
