const { Type  } = require("../db.js");
const axios = require('axios');

async function getTypes(){
    var dbHasTypes = await Type.count();
    if (!dbHasTypes) await loadTypes();
    var types = await Type.findAll();
    return types;
}

async function loadTypes() {
    var { data: { results: typesRaw } } = await axios.get("https://pokeapi.co/api/v2/type");
    var types = typesRaw.map((type) => extractFieldsFromTypeData(type));
    await Type.bulkCreate(types);
}

function extractFieldsFromTypeData({name, url}){
    var urlList = url.split("/");
    var id = urlList[urlList.length - 2];
    return { id, name };
}

module.exports = {
    getTypes
}