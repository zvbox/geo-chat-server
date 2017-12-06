var SERVER_NAME = 'user-api'
var PORT = process.env.PORT;
var HOST = '127.0.0.1';


var restify = require('restify')

  // Get a persistence engine for the users
  , usersSave = require('save')('users')
  , patientsSave = require('save')('patients')

  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('Resources:')
  console.log(' /users')
  console.log(' /users/:id')  
})

server
  // Allow the use of POST
  .use(restify.fullResponse())

  // Maps req.body to req.params so there is no switching between them
  .use(restify.bodyParser())

// Get all users in the system
server.get('/users', function (req, res, next) {

  // Find every entity within the given collection
  usersSave.find({}, function (error, users) {

    // Return all of the users in the system
    res.send(users)
  })
})

// Get all users in the system
server.get('/patients', function (req, res, next) {

  // Find every entity within the given collection
  patientsSave.find({}, function (error, patients) {

    // Return all of the users in the system
    res.send(patients)
  })
})

// Get a single user by their user id
server.get('/users/:id', function (req, res, next) {

  // Find a single user by their id within save
  usersSave.findOne({ _id: req.params.id }, function (error, user) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    if (user) {
      // Send the user if no issues
      res.send(user)
    } else {
      // Send 404 header if the user doesn't exist
      res.send(404)
    }
  })
})

// Create a new user
server.post('/users', function (req, res, next) {

  // Make sure name is defined
  if (req.params.name === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('name must be supplied'))
  }
  if (req.params.age === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('age must be supplied'))
  }
  var newUser = {
		name: req.params.name, 
		age: req.params.age
	}

  // Create the user using the persistence engine
  usersSave.create( newUser, function (error, user) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send the user if no issues
    res.send(201, user)
  })
})


server.post('/patients', function (req, res, next) {

  var newPatient = {
		name: req.params.name, 
		age: req.params.age
	}
  patientsSave.create( newPatient, function (error, patient) {
	res.send(201, patient)
  })
})


// Update a user by their id
server.put('/users/:id', function (req, res, next) {

  // Make sure name is defined
  if (req.params.name === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('name must be supplied'))
  }
  if (req.params.age === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('age must be supplied'))
  }
  
  var newUser = {
		_id: req.params.id,
		name: req.params.name, 
		age: req.params.age
	}
  
  // Update the user with the persistence engine
  usersSave.update(newUser, function (error, user) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send(200)
  })
})

// Delete user with the given id
server.del('/users/:id', function (req, res, next) {

  // Delete the user with the persistence engine
  usersSave.delete(req.params.id, function (error, user) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send()
  })
})


