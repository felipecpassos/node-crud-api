import app from "./config/app";
import env from "./environment"

const PORT = env.getPort();
app.listen(PORT, () => {
   console.log('Express server listening on port ' + PORT);
})

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

