migrate((db) => {
  const collection = new Collection({
    "id": "4t3cu0um3z57egj",
    "created": "2023-04-04 04:29:45.741Z",
    "updated": "2023-04-04 04:29:45.741Z",
    "name": "games",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "lptyu1kr",
        "name": "lobby",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "4ad4z22ofoyplg9",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "efeccm4m",
        "name": "username",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "7pw4ysyw",
        "name": "data",
        "type": "json",
        "required": false,
        "unique": false,
        "options": {}
      }
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("4t3cu0um3z57egj");

  return dao.deleteCollection(collection);
})
