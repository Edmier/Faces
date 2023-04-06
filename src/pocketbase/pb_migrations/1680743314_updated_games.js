migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4t3cu0um3z57egj")

  collection.createRule = "@request.auth.id != '' || @request.data.lobby.lobbyId = 'guest'"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4t3cu0um3z57egj")

  collection.createRule = null

  return dao.saveCollection(collection)
})
