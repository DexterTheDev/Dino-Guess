const { Schema, model } = require("mongoose");

module.exports = model("users", new Schema({
    id: { type: String, default: "" },
    points: { type: Number, default: 0 }
}));