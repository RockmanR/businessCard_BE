
/////////////     Express JS    /////////////
/////////////                   /////////////

// expressJS config
const express = require('express')
const app = express()
const port = 3000;
const bodyParser = require('body-parser')
app.use(bodyParser.json())      //to enable reading and sending a json file

/////////////       MongoDB     /////////////
/////////////                   /////////////

// mongoose setup and connection
var mongoPassword = 'user_2';
const mongoose = require('mongoose')
mongoose.connect(`mongodb+srv://user_2:${mongoPassword}@cluster0-1btaq.mongodb.net/node2?retryWrites=true`,{ useNewUrlParser: true }) // to connect to my mongoDB could account

// testing connection to mongo cloud
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('we are connected to Mongo!')
});

// Defining mongoose schema & collection
var userSchema = new mongoose.Schema({
    profilePic: String,                                     // next time, group all the fields into one main field 
    email: {type: String, unique: true, required: true},
    password: {type: Number, required: true, min: 4},
    publicName: String,
    occupation: String,
    interests: [String],
    website: String,
    facebook: String,
    linkedIn: String,
    address1: String,
    address2: String,
    pobox: String,
    contact1: String,
    contact2: String,
    accessWrites: ''
  });

var UserColl = mongoose.model('UserColl', userSchema);  // creating a colletion (like a table)


/////////////        Body       /////////////
/////////////                   /////////////

app.get('/all',(req,res)=>{                 // a request to get all user/account records
    UserColl.find({})                       // 'find' function from MongoDB
    .then(results => { res.send(results)})  // an array will be sent back to the Front-end Server
})

app.post('/login',(req,res)=>{
    console.log('login request: ', req.body)
    UserColl.find({email: req.body.email,password: req.body.password})  // to check the login credentials using mongoDB find option. (its not for production use!)
    .then(results => {                                  // the results will be user details
        console.log('login response: ', results[0])     // the result will be an array. having a [0] to extract the first (and only) user object from it
        res.send(results[0])                            // sending the user details back to the Front-end server
    })
    .catch(err => console.log(err))                     // to handle error
})

app.post('/register', (req,res)=>{
  var userDoc = new UserColl({          // creating a mongoDB document object with all the required fields
      profilePic: '',
      email: req.body.email,
      password: req.body.password,
      publicName: '',
      occupation: '',
      interests: [''],
      address1: '',
      address2: '',
      pobox: '',
      contact1: '',
      contact2: ''
    });

    userDoc.save((err, result) => {     // save method will send the records to the mongoDB cloud server
        if (err) {
            res.send(err);
        } else {
            res.send(result)            // send the result (object) back to Front-end server
            console.log('Register feedback: ', result)
        }
    })

})

app.post('/update', (req,res)=>{
    console.log('update request: ', req.body);
    UserColl.updateOne({email: req.body.email},{ $set: {
        profilePic: req.body.profilePic,
        password: req.body.password,
        publicName: req.body.publicName,
        occupation: req.body.occupation,
        interests: [req.body.interests],
        website: req.body.website,
        linkedIn: req.body.linkedIn,
        facebook: req.body.facebook,    
        address1: req.body.address1,
        address2: req.body.address2,
        pobox: req.body.pobox,
        contact1: req.body.contact1,
        contact2: req.body.contact2
    }})
    .then(results => {
        console.log('No. of updated docs: ', results.nModified)     // 'nModified' is an object field that comes from mongoDB's feedback after update operation
        if(results.nModified === 1){
            UserColl.find({email: req.body.email})  // if the user was updated, then we need to get the full user details again to reflect the updates at the Front-end
            .then(results => { 
                res.send(results[0])
            })
            .catch(err => console.log(err))
        } else {
            res.send("No updated record")
        }
    })
    .catch(err => console.log(err))
})

app.post('/delete', (req,res)=> {
    console.log('delete request: ', req.body);
    UserColl.deleteOne({email: req.body.email})
    .then(result => {
        console.log(result);
        res.send(result);
    })
    .catch(err => console.log(err))
})
  
  


app.listen(port, ()=>{console.log(`listening to port ${port}`)})
