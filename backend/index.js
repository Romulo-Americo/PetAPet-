const express = require('express')
const cors = require('cors')
const PORT = 5000
const app = express()

//config json response
app.use(express.json())

//Data Base
const conn = require('./db/conn')

//solve cors
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}))


//Public for images
app.use(express.static('public'))

//Routes
const UsersRoutes = require('./routes/UsersRoutes')
const PetsRoutes = require('./routes/PetsRoutes')

app.use('/users', UsersRoutes)
app.use('/pets', PetsRoutes)

app.listen(PORT, ()=>{
    console.log(`App listening on port http://localhost:${PORT}`)
})