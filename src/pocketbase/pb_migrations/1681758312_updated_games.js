migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4t3cu0um3z57egj")

  collection.listRule = "@request.query.gameId = id || @request.auth.game.id = id || @request.query.lobbyId = lobby.lobbyId"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4t3cu0um3z57egj")

  collection.listRule = null

  return dao.saveCollection(collection)
})
