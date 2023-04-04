migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4t3cu0um3z57egj")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "pikoqhdy",
    "name": "userId",
    "type": "text",
    "required": true,
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
  const collection = dao.findCollectionByNameOrId("4t3cu0um3z57egj")

  // remove
  collection.schema.removeField("pikoqhdy")

  return dao.saveCollection(collection)
})
