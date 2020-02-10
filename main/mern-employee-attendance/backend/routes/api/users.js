const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");


const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

const User = require("../../models/User");
const Attendance = require("../../models/Attendance");


router.post("/register", (req, res) => {

    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
          return res.status(400).json({ email: "Email already exists" });
        } else {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            type: req.body.type
          });
    // Hash password before saving in database
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => res.json(user))
                .catch(err => console.log(err));
            });
        });
        }
    });
});


router.post("/login", (req, res) => {

  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
  const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email }).then(user => {
      // user exists
      if (!user) {
        return res.status(404).json({ emailnotfound: "Email not found" });
      }
  // Check password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // User matched
          const payload = {
            id: user.id,
            name: user.name
          };
          jwt.sign(
            payload,
            keys.secretOrKey,
            {
              expiresIn: 31556926 // 1 year in seconds
            },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token
              });
            }
          );
        } else {
          return res
            .status(400)
            .json({ passwordincorrect: "Password incorrect" });
        }
      });
    });
  });

var curday = function (sp) {
    today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //As January is 0.
    var yyyy = today.getFullYear();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    return (mm + sp + dd + sp + yyyy);
};

router.get("/getdates", (req, res) => {
    Attendance.find({}, 'date')
              .then(dates => res.json(dates))
              .catch(err => res.status(400).json('Error: ' + err));;

});

router.route('/:id').get((req, res) => {
  Attendance.findById(req.params.id)
    .then(attendances => res.json(attendances))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/check/:id').get((req, res) => {
  console.log("Called check");
  User.findById(req.params.id, 'name email type')
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Attendance.findByIdAndDelete(req.params.id)
    .then(() => res.json('Attendance deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
  Attendance.findById(req.params.id)
    .then(attendance => {
      attendance.attendance = req.body.attendance;
      exercise.save()
        .then(() => res.json('Attendance updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/getattendance/:id').get((req, res) => {
  User.findById(req.params.id)
    .then((data) => {
      var email = data.email;
      var att = [];
      Attendance.find({ "attendance.email": email },'date attendance')
                .then(
                    d => {
                      data=[]
                      d.forEach(element => {
                        let date = element['date']
                        let atten = element['attendance']
                        let mark
                        atten.forEach(e=>{
                          if(e['email']===email){
                            if(e['marking']===true)
                              mark='true'
                            else mark='false'
                          }
                        })
                        data.push({'date':date,'marking':mark})
                      });
                      res.send(data)
                    })
                .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.post("/createattendance", (req, res) => {

  const date = curday("-");
  Attendance.findOne({ date }).then(attendance => {
    // user exists
    if (attendance) {
      flag = false;
      return res.status(400).json({ error: "Date already exists" });
    } else {

      const type = "E";
      User.find({ type }, 'email').then(data => {

      var attendance = [];

      data.forEach(ele => attendance.push({ email: ele["email"], marking: false }));

      const newAttendance = new Attendance({
        date: curday("-"),
        attendance: attendance
      });

      newAttendance.save().then(att => res.json(att)).catch(err => console.log(err));

    })

    }
  });
});

router.post("/attendancebydateid/:id", (req, res) => {
  let id = req.params.id
  console.log(id)
  Attendance.findById(id, 'attendance').then(attendance => {
    // user exists
    res.json(attendance)

  });
});

// Delete Later
router.post("/createattendancetemp", (req, res) => {

  const date = curday("-");
  Attendance.findOne({ date }).then(attendance => {
    // user exists

      const type = "E";
      User.find({ type }, 'email').then(data => {

      var attendance = [];

      data.forEach(ele => attendance.push({ email: ele["email"], marking: false }));

      const newAttendance = new Attendance({
        date: req.body.date,
        attendance: attendance
      });

      newAttendance.save().then(att => res.json(att)).catch(err => console.log(err));

    })

  });
});




  module.exports = router;
