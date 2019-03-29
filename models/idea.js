const mongoose = require('mongoose');

const schema = mongoose.Schema;

const ideaSchema = new schema({
    title:{
        type:String,
        required:true
    },
    detail:{
        type:String,
        required:true
    },
    user:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})

mongoose.model('ideas',ideaSchema);