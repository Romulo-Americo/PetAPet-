const mongoose= require('../db/conn')
const { Schema } = mongoose

const User = mongoose.model(
    'User',
    new Schema(
        {
            name:{
                type: String,
                required: true

            },
            email:{
                type: String,
                required: true
            },
            password:{
                type: String,
                required: true
            },
            image:{
                //a imagem não é cadastrada e sim o caminho
                type: String,
            },
            phone:{
                type: String,
                required: true
            }
        },
    { timestamp: true } 
    ),
)

module.exports = User