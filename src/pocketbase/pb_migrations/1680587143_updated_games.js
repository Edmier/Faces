migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4t3cu0um3z57egj")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bgqycjg6",
    "name": "status",
    "type": "select",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "new",
        "started",
        "finished"
      ]
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xjshnr63",
    "name": "coins",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": 0,
      "max": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "iydwrwmv",
    "name": "choices",
    "type": "json",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4t3cu0um3z57egj")

  // remove
  collection.schema.removeField("bgqycjg6")

  // remove
  collection.schema.removeField("xjshnr63")

  // remove
  collection.schema.removeField("iydwrwmv")

  return dao.saveCollection(collection)
})
