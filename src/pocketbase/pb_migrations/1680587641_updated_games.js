migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4t3cu0um3z57egj")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "1wte5smq",
    "name": "startTime",
    "type": "date",
    "required": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4t3cu0um3z57egj")

  // remove
  collection.schema.removeField("1wte5smq")

  return dao.saveCollection(collection)
})
