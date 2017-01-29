var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://bezheng:aqwzsx123@ds161518.mlab.com:61518/mood', ['channels']);
var db2 = mongojs('mongodb://bezheng:aqwzsx123@ds161518.mlab.com:61518/mood', ['votes']);

// This page manages api/channels and api/votes

// Get all channels
router.get('/channels', function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    db.channels.find(function (err, channels) {
        if (err) {
            res.send(err);
        }
        res.json(channels);
    });
});

// Get one channel
router.get('/channel/:id', function (req, res, next) {
    db.channels.findOne({ _id: mongojs.ObjectId(req.params.id) }, function (err, channel) {
        if (err) {
            res.send(err);
        }
        res.json(channel);
    });
});

// Save new channel
router.post('/channel', function (req, res, next) {
    var channel = req.body;
    if (!channel.title) {
        res.status(400);
        res.json({
            "error": "bad data"
        });
    } else {
        db.channels.save(channel, function (err, channel) {
            if (err) {
                res.send(err);
            }
            res.json(channel._id);
        });
    }
});

// Add a user to channel
router.put('/channel/', function (req, res, next) {
    if (!req.body) {
        res.status(400);
        res.json({
            "error": "bad data"
        });
    }
    var u = req.body;
    db.channels.update(
        { _id: mongojs.ObjectId(u.channelId) },
        { $addToSet: { users: u.userId } },
        {},
        function (err, obj) {
            if (err) {
                res.send(err);
            }
            res.json(obj);
        }
    );
});

// Get all votes
router.get('/votes', function (req, res, next) {
    db2.votes.find(function (err, votes) {
        if (err) {
            res.send(err);
        }
        res.json(votes);
    });
});

// Get one vote
router.get('/vote/:id', function (req, res, next) {
    db2.votes.findOne({ _id: mongojs.ObjectId(req.params.id) }, function (err, votes) {
        if (err) {
            res.send(err);
        }
        res.json(votes);
    });
});

// Save new vote
router.post('/vote', function (req, res, next) {
    if (!req.body) {
        res.status(400);
        res.json({
            "error": "bad data"
        });
    }
    var vote = req.body;
    db2.votes.save(vote, function (err, obj) {
        if (err) {
            res.send(err);
        }
        res.json(obj);
    });

});



//get all votes of a specified channel

router.get('/votes/:idchannel', function(req, res, next){
    db2.votes.find({ channelId : req.params.idchannel }, function(err, votes){
        if (err) {
            res.send(err);
        }
        else {
            res.json(votes);
        }
    });
});


module.exports = router;