migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4ad4z22ofoyplg9")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "1ygxna4w",
    "name": "games",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "4t3cu0um3z57egj",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4ad4z22ofoyplg9")

  // remove
  collection.schema.removeField("1ygxna4w")

  return dao.saveCollection(collection)
})
