const dynamoose = require("dynamoose");

const card_schema = new dynamoose.Schema({
  card_id: {
    type: String,
    required: true,
    hashKey: true,
  },
  card_number: {
    type: String,
    required: true,
  },
  card_exp: {
    type: String,
    required: true,
  },
  card_cvv: {
    type: String,
    required: true,
  },
  card_balance:{
    type:Number,
    required:true,
    default:100
  }
});

module.exports = dynamoose.model("404_found_cards", card_schema);
