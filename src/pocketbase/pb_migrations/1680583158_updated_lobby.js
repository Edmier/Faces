migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4ad4z22ofoyplg9")

  collection.name = "lobbies"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4ad4z22ofoyplg9")

  collection.name = "lobby"

  return dao.saveCollection(collection)
})
