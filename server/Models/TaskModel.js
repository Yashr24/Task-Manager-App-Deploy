const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    isDone: {
        type: Boolean,
        required: true
    }
});

const TaskModel = mongoose.model('taskmanagers', TaskSchema);

module.exports = TaskModel;