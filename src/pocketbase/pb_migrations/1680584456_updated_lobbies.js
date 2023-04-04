migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4ad4z22ofoyplg9")

  collection.listRule = "@request.data.lobbyId = lobbyId"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4ad4z22ofoyplg9")

  collection.listRule = null

  return dao.saveCollection(collection)
})
