migrate((db) => {
  const collection = new Collection({
    "id": "4ad4z22ofoyplg9",
    "created": "2023-04-04 04:26:22.481Z",
    "updated": "2023-04-04 04:26:22.481Z",
    "name": "lobby",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "sosn0va9",
        "name": "lobbyId",
        "type": "text",
        "required": false,
        "unique": true,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "xlwsahzj",
        "name": "particpants",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": 0,
          "max": null
        }
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
  const collection = dao.findCollectionByNameOrId("4ad4z22ofoyplg9");

  return dao.deleteCollection(collection);
})
