migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4ad4z22ofoyplg9")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fhvwscq3",
    "name": "name",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4ad4z22ofoyplg9")

  // remove
  collection.schema.removeField("fhvwscq3")

  return dao.saveCollection(collection)
})
