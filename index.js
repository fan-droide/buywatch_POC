const express = require('express')
const cookieSession = require('cookie-session')
const path = require('path')
const public = path.join(__dirname, 'dist')
const cors = require('cors')

const {
  universalAccess
} = require('@inrupt/solid-client')

const {
  getSessionFromStorage,
  getSessionIdFromStorageAll,
  Session
} = require('@inrupt/solid-client-authn-node')

const app = express()
const port = 3001

const corsOptions = {
  origin: 'http://localhost:1234',
  credentials: true,
  optionsSuccessStatus: 200
}

let listItems = []

app.use(cors(corsOptions))
app.use(express.json())

app.use(
  cookieSession({
    name: 'session',
    keys: [
      'key1',
      'key2',
    ],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
)

app.get('/login', async (req, res, next) => {

  const session = new Session()
  req.session.sessionId = session.info.sessionId
  const redirectToSolidIdentityProvider = (url) => {
    res.redirect(url)
  }
  await session.login({
    redirectUrl: `http://localhost:${port}/home`,
    // oidcIssuer: 'https://localhost:3000', // THROWS ERROR
    // oidcIssuer: req.query['issuer'] || 'http://localhost:3000',
    oidcIssuer: req.query['issuer'] || 'https://login.inrupt.com',
    clientName: 'BuyWatch',
    handleRedirect: redirectToSolidIdentityProvider,
  })
})

app.get('/home', async (req, res) => {

  const session = await getSessionFromStorage(req.session.sessionId)
  // TODO: check the session is valid
  if (session) {
    await session.handleIncomingRedirect(`http://localhost:${port}${req.url}`)
    if (session.info.isLoggedIn) {
      console.log('New Server Session:', session.info)      
      //res.redirect('/?webid='+session.info.webId)
      //return res.send(`<p>Logged in with the WebID ${session.info.webId}.</p>`)
      res.redirect('/')
    }
  }

})

app.get('/logout', async (req, res, next) => {
  const session = await getSessionFromStorage(req.session.sessionId)
  session.logout()
  res.send(`<p>Logged out.</p>`)
})

app.get('/myappid', async (req, res, next) => {
  var options = {
    root: path.join(public)
  }
  var fileName = 'myappid.jsonld'
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err)
    } else {
      console.log('Sent:', fileName)
    }
  })
})

app.use('/', express.static(public))

app.post('/api/newitem', async (req, res) => {

  if (req.session) {
    console.log('Client ', req.session)
    let newItem = req.body
    // TODO: Add TO DB
    newItem.id = listItems.length + 1
    listItems.push(newItem)
    res.send(newItem)
  }

})



app.post('/api/buy', async (req, res) => {

  const sessionIds = await getSessionIdFromStorageAll()
  if (sessionIds.length) {
    // TODO: pick up the correct session from the user who owns the resource 
    // in order to be able to grant access on behalf of it
    const session = await getSessionFromStorage(sessionIds[0])
    console.log('Server Session:', sessionIds[0])
    // Location of Resource
    let incomingData = req.body
    let resourceUrl = incomingData.resourceUrl
    console.log('Resource = ', resourceUrl)

    // WebID of Buyer
    let buyerWebId = incomingData.buyerWebId
    console.log('Buyers WebID = ', buyerWebId)

    // Give Full Access to Buyer
    await giveAccessToContent(resourceUrl, buyerWebId, session, res)

  } else {
    res.status(400).send({ error: 'Server Not Authenticated' })
  }

})

async function giveAccessToContent(resource, webId, session, response) {
  await universalAccess.setAgentAccess(
    resource,         // Resource
    webId,     // Agent
    { read: true, append: true, write: true, control: true, controlRead: true, controlWrite: true },          // Access object
    { fetch: session.fetch }                         // fetch function from authenticated session
  ).then((newAccess) => {
    logAccessInfo(webId, newAccess, resource, response)
  })
}

function logAccessInfo(agent, agentAccess, resource, response) {
  console.log(`For resource::: ${resource}`)
  if (agentAccess === null) {
    console.log(`Could not load ${agent}'s access details.`)
    response.status(400).send({ error: 'There was a problem with permissions' })
  } else {
    console.log(`${agent}'s Access:: ${JSON.stringify(agentAccess)}`)
    response.status(200).send({ sucess: 'Access Granted' })
  }
}

app.get('/api/getitems', (req, res) => {
  res.send(listItems)
})

app.listen(port, () => {
  console.log(
    `Server running on port [${port}]. ` +
    `Visit [http://localhost:${port}/login] to log in to [login.inrupt.com].`
  )
})
