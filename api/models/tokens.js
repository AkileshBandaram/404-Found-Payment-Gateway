const dynamoose = require("dynamoose");

const token_schema = new dynamoose.Schema({
  token_id: {
    type: String,
    required: true,
    hashKey: true,
  },
  token: {
    type: String,
    required: true,
  },
  token_card: {
    type: String,
    required: true,
  },
  token_email:{
    type:String,
    required:true
  }
});

module.exports = dynamoose.model("404_found_tokens", token_schema);