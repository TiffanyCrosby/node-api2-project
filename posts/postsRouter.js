const express = require('express')
const router = express.Router()
router.use(express.json())

const db = require('../data/db')

router.post('/', (req, res) => {
    const body = req.body;
    db.find(body)
    .then(post => {
        if(!body.title || !body.contents){
            res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
        } else {
            db.insert(body)
            res.status(200).json({successMessage: "Created Post", body})
        }
    })
    .catch(error => {
        console.log('Post Error:', error);
        res.status(500).json({ error: "There was an error while saving the post to the database" })
    })
})

router.post("/:id/comments", (req, res) => {
    const id = req.params.id;
    const body = req.body
    const newComment = {text:body.text, post_id: id}

    db.findById(id)
    .then(post => {
        if(post.length === 0){
            res.status(404).json({ errorMessage: "The post with the specified ID does not exist." })
        } else if (!body.text){
            res.status(400).json({ errorMessage: "Please provide text for the comment." })
        } else {
            db.insertComment(newComment) . then(({id : cId}) => {
                db.findCommentById(cId)
                .then(comment => {
                    res.status(201).json(comment)
                })
            }) 
        }
    })
    .catch(error => {
        console.log('error:', error);
        res.status(500).json({ errorMessage: "There was an error while saving the comment to the database" })
    })
})



router.get('/', (req, res) => {
    db.find()
    .then(post => {res.status(200).json(post)})
    .catch(error => {
        console.log('error', error);
        res.status(500).json({ error: "The posts information could not be retrieved." })})
})

router.get('/:id', (req, res) => {
    const id = req.params.id;
    const body = req.body

    db.findById(id)
    .then(post => {
        if(post.length === 0){
            res.status(404).json({ errorMessage: "The post with the specified ID does not exist." })
        } else{
            res.status(201).json(post)
        }
    })
    .catch(error => {
        console.log('error:', error);
        res.status(500).json({ errorMessage: "There was an error while saving the comment to the database" })
    })
})


router.get('/:id/comments', (req, res) => {
    const id = req.params.id;
    const body = req.body

    db.findCommentById(id)
    .then(post => {
        if(post.id !== id){
            res.status(404).json({ errorMessage: "The post with the specified ID does not exist." })
        } else {
            res.status(200).json(post)
        }
    })
    .catch((error) => {
                console.log(error);
                res.status(500).json({ errorMessage: "The comments information could not be retrieved." })
    })
})



router.delete('/:id', (req, res) => {
    const id = req.params.id;

    db.remove(id)
    .then(post => {
      if (post > 0) {
        res.status(200).json({successMessage: `${post} has been deleted!`});
      } else if(post === 0){
          res.status(404).json({ errorMessage: "The post with the specified ID does not exist." })
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ errorMessage: "The post could not be removed" });
    });
  });


  router.put("/:id", (req, res) => {
    const id = req.params.id;
    const body = req.body;

    db.findById(id)
    .then(post => {
        if(!body.title || !body.contents){
            res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
        } else if(post.length !== 0){
            db.update(id, body)
            res.status(200).json({successMessage: "Created Post", id, body})
        } else if (post.id !== id) {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ errorMessage: "The post information could not be modified." })
        })
  });

module.exports = router;


