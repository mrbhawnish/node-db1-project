const express = require('express');
const db = require("../data/dbConfig.js");
const router = express.Router();

const Accounts = {
  getAll(){
    return db('accounts')
  },
  getById(id){
    return db('accounts').where({ id })
 }, 
  create(account){
    return db('accounts').insert(account)
 },
  update(id, account){
    return db('accounts').where({ id }).update(account)
 },
  delete(id){
     return db('accounts').where({ id }).del()
  }


};

router.get('/', (req, res) => {
    Accounts.getAll()
    .then(result => {
        res.json(result)
    })
    .catch(error => {
        res.json({message: error.message})
    })
})

router.get('/:id', (req, res) => {
    Accounts.getById(req.params.id)
    .then(result => {
        res.json(result)
    })
    .catch(error => {
        res.json({message: error.message})
    })
})

router.post("/", (req, res) => {

     if(!req.body.name || !req.body.budget){
            res.status(400).json({ message: "name or accounts field are missing."})
     }
   Accounts.create(req.body)
   .then(([id]) => {
        return Accounts.getById(id)
   })
   .then((data) => {
       res.json(data)
   })
     .catch((error) => {
        res.json({ message: error.message })
     })


});

router.put('/:id', async (req, res) => {
    try{
        await Accounts.update(req.params.id, req.body)
        const updatedAcc = await Accounts.getById(req.params.id) 
        res.json(updatedAcc).first()
    }
    catch(error) {
        res.json({message: error.message})
    }
})

router.delete('/:id', async (req, res) => {
    try{

        const deletedAcc = await Accounts.delete(req.params.id)
        if(deletedAcc){
        res.json({message: "item is deleted successfully"})
        } else {
                res.status(404).json({ message: "No account with the given id"})
        }

    }
    catch(error) {
        res.json({message: error.message})
    }
})
module.exports = router;