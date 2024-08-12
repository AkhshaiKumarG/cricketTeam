let express = require('express')
let path = require('path')
let app = express()
let {open} = require('sqlite')
let sqlite3 = require('sqlite3')
app.use(express.json())

let dbPath = path.join(__dirname, 'cricketTeam.db')
let db = null
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    // app.listen(3000, () => {
    //   console.log('Server is Running...')
    // })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}
initializeDBAndServer()

let convertDBOjecttoResponseObject = dbObject => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  }
}

// Lisiting all Players API
app.get('/players/', async (request, response) => {
  let listingQuery = `
    SELECT *
    FROM cricket_team;
    `
  let listingPlayers = await db.all(listingQuery)
  response.send(
    listingPlayers.map(eachPlayer => {
      convertDBOjecttoResponseObject(eachPlayer)
    }),
  )
  // response.send(listingPlayers)
})

// Adding Player API
app.post('/players/', async (request, response) => {
  let playerDetails = request.body
  let {player_name, jersey_number, role} = playerDetails
  let addingPlayerQuery = `
    INSERT INTO cricket_team (player_name, jersey_number, role)
    VALUES (
      'Vishal', 
    17, 
    'Bowler')
    `
  let dbResponse = await db.run(addingPlayerQuery)
  let playerId = dbResponse.lastId
  console.log(dbResponse.lastId)
  // response.send({playerId: playerId})
  response.send('Player Added to Team')
})

// Getting Player using Id API
app.get('/players/:playerId/', async (request, response) => {
  let {playerId} = request.params
  // let getPlayer = request.body
  // let {player_name, jersey_number, role} = getPlayer
  let gettingPlayerQuery = `
  SELECT *
  FROM cricket_team
  WHERE player_id = ${playerId}`
  let resp = await db.get(gettingPlayerQuery)
  response.send(resp)
})

// Updating Player Details API
app.put('/players/:playerId/', async (request, response) => {
  let {playerId} = request.params
  let pId = request.body
  let {playerName, jerseyNumber, role} = pId
  let updatingQuery = `
  UPDATE cricket_team
  SET
  player_name = "Maneesh",
  jersey_number = 54,
  role = "All-rounder"
  WHERE player_id = ${playerId}
  `
  let res = await db.run(updatingQuery)
  response.send('Player Details Updated')
})

// Deleting Player API
app.delete('/players/:playerId/', async (request, response) => {
  let {playerId} = request.params
  let deleteQuery = `
  DELETE FROM cricket_team
  WHERE player_id = ${playerId}`
  let respon = await db.run(deleteQuery)
  response.send('Player Removed')
  // response.send(respon)
})
module.exports = app
