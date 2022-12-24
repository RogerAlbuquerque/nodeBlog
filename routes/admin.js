const express= require('express');
const router = express.Router();

router.get('/', (req,res)=>{
  res.send("Main page for ADM")
});

router.get('/posts', (req,res)=>{
  res.send("posts page")
});

router.get('/categories', (req,res)=>{
  res.send("categories page")
});


module.exports = router;