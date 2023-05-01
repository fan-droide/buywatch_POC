const MODE = 'DEV' // DEV, STAGE, PROD

const ENVIRONMENTS = {
    PROD : {        
        API_URL: ''
    },
    STAGE : {     
        API_URL: ''
    },
    DEV: {        
        API_URL: 'http://localhost:3001/api'
    }
}

module.exports = {    
    API_URL: ENVIRONMENTS[MODE].API_URL  
}