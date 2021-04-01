"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./config/app");
const environment_1 = require("./environment");
const PORT = environment_1.default.getPort();
app_1.default.listen(PORT, () => {
    console.log('Express server listening on port ' + PORT);
});
// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://user:user@cluster0.9hbnr.mongodb.net/test?retryWrites=true&w=majority"
// MongoClient.connect(
//     uri, 
//     {
//     useUnifiedTopology: true,
//     useNewUrlParser: true,
//     },
//     (err, client) => {
//     if (err) return console.log(err)
//     db = client.db('test')
//     app.listen(3000, function(){
//         console.log('Server is running on port 3000...')
//     });
// })
