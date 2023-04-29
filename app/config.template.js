const MODE = 'DEV' // DEV, STAGE, PROD

const ENVIRONMENTS = {
    PROD : {
        PAYMENT_TOKEN: '',
        API_URL: ''
    },
    STAGE : {
        PAYMENT_TOKEN: '',
        API_URL: ''
    },
    DEV: {
        PAYMENT_TOKEN: '',
        API_URL: 'http://localhost:3001/api'
    }
}

module.exports = {
    PAYMENT_TOKEN: ENVIRONMENTS[MODE].PAYMENT_TOKEN,
    API_URL: ENVIRONMENTS[MODE].API_URL  
}