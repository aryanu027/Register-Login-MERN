const mongoose = require("mongoose");

const playerSchema = mongoose.Schema({
  email: { type: "string", required: true },
  password: { type: "string", required: true },
  id: { type: "string" },
  name: { type: "string", required: true },
});
let playerData = mongoose.model("playerData", playerSchema);
module.exports = playerData;
