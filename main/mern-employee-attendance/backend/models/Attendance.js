const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const attendanceSchema = new Schema({

    attendance: [{email: String, marking: Boolean}],
    date: {
        type: String,
        required: true
    }
});

const attendance = mongoose.model('attendance', attendanceSchema);

module.exports = attendance;