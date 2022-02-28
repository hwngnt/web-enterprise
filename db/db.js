const mongoose = require('mongoose');

try 
{
    const client = mongoose.connect('mongodb+srv://group1:group1@web-enterprise.bn7jz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        // useFindAndModify: true
    })
    console.log("connected")
} catch (e) {
    console.log(e)
}


module.exports = mongoose