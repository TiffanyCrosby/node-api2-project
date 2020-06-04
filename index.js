const express = require('express')
const server = express();
server.use(express.json());

const posts = require('./posts/postsRouter')
server.use('/api/posts', posts)

server.get('/', (req, res) => {
    res.json({successMessage: "Yay My Server IS WORKING!!!"})
})


const port = 8000
server.listen(port, () => {console.log(`\n == API server listening on port: ${port} == \n`)})