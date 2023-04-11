migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4t3cu0um3z57egj")

  collection.listRule = ""
  collection.viewRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4t3cu0um3z57egj")

  collection.listRule = null
  collection.viewRule = null

  return dao.saveCollection(collection)
})
