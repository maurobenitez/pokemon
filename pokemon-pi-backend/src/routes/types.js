const { Router } = require('express');
const router = Router();
const { getTypes } = require("../controllers/typesController")

router.get("/", async (req, res)=>{
    try{
        var types = await getTypes();
        res.send(types);
    }catch(error){
        res.status(404).send(error.message);
    }
});

module.exports = router;