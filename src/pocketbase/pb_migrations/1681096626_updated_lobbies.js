migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4ad4z22ofoyplg9")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qbphzfrp",
    "name": "data",
    "type": "json",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4ad4z22ofoyplg9")

  // remove
  collection.schema.removeField("qbphzfrp")

  return dao.saveCollection(collection)
})
