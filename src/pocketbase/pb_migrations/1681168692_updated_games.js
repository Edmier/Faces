migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4t3cu0um3z57egj")

  collection.listRule = "@request.query.gameId = id"
  collection.viewRule = "@request.query.gameId = id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4t3cu0um3z57egj")

  collection.listRule = null
  collection.viewRule = null

  return dao.saveCollection(collection)
})
