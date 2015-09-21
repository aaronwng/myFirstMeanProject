var User = require('../models/user');
var Story = require('../models/story');
var config = require('../../config');

var secretKey = config.secretKey;

var jsonwebtoken = require('jsonwebtoken');

function createToken(user) {
    var token = jsonwebtoken.sign({
        id: user._id,
        name: user.name,
        username: user.username
    }, secretKey, {
        expirtesInminute: 1440
    });
    return token;
}
module.exports = function(app, express, io) {
    var api = express.Router();

    api.get('/all_stories', function(req, res) {
        var query = Story.find({});
        query.sort({
            '_id': -1
        }).limit(5);
        query.exec(function(err, stories) {
            if (err) {
                res.send(err);
                return;
            }
            console.log(stories.toString());

            res.json(stories);
        });
    });

    api.post('/signup', function(req, res) {
        var user = new User({
            name: req.body.name,
            username: req.body.username,
            password: req.body.password
        });

        var token = createToken(user);

        user.save(function(err) {
            if (err) {
                res.send(err);
                return;
            }
            res.json({
                success: true,
                message: 'User has been created!',
                token: token
            });
        });
    });

    api.get('/users', function(req, res) {
        User.find({}, function(err, users) {
            if (err) {
                res.send(err);
                return;
            }
            res.json(users);
        })
    })

    api.post('/login', function(req, res) {
        User.findOne({
            username: req.body.username
        }).select('name username password').exec(function(err, user) {
            if (err) {
                throw err
            }
            if (!user) {
                res.send({
                    message: 'User doesnt exist'
                });
            } else if (user) {
                var validPassword = user.comparePassword(req.body.password);
                if (!validPassword) {
                    res.send({
                        message: "Invalid Password"
                    });
                } else {
                    // token
                    var token = createToken(user);
                    res.json({
                        success: true,
                        message: "Successfuly login!",
                        token: token
                    });
                }
            };
        });
    });

    api.use(function(req, res, next) {
        console.log('Somebody just came to our app!');
        var token = req.body.token || req.param('token') || req.headers['x-access-token'];
        // if token exist
        if (token) {

            jsonwebtoken.verify(token, secretKey, function(err, decoded) {

                if (err) {
                    res.status(403).send({
                        success: false,
                        message: 'failed to authenticate user'
                    });
                } else {
                    //
                    req.decoded = decoded;

                    next();
                }
            })
        } else {
            res.status(403).send({
                success: false,
                message: 'No Token Provided'
            });
        }
    });
    // Destination B // Provide a legitimate token
    api.route('/')
        .post(function(req, res) {
            var name = "";
            User.find({
                _id: req.decoded.id
            }, function(err, users){

                var story = new Story({
                    creator: req.decoded.id,
                    creatorName: users[0]._doc.name,
                    content: req.body.content,
                    created: Date.now()
                });
                story.save(function(err, newStory) {
                    if (err) {
                        res.send(err);
                        return
                    }
                    io.emit('story', newStory);
                    res.json({
                        message: 'New Story Created'
                    });

                });
            });

        })

    .get(function(req, res) {
        // creator:req.decoded.id
        var query = Story.find({});
        query.sort({
            '_id': -1
        }).limit(5);
        query.exec(function(err, stories) {
            if (err) {
                res.send(err);
                return;
            }
            res.json(stories);
        });
    });

    api.get('/me', function(req, res) {
        res.json(req.decoded);
    })

    return api;
}