const dynamoose = require("dynamoose")
const Card = require("../models/cards")
const { v1: uuidv1 } = require("uuid");
const { exec } = require('child_process');
const Token = require("../models/tokens");
const axios = require('axios');
const CryptoJS = require("crypto-js");
exports.sayhello = (req,res,next)=>{
    res.status(200).json({status:1, message:"Hello User"});
}

exports.addcard = (req,res,next)=>{
    const card = new Card({
        card_id: uuidv1(),
        card_number:req.body.card_number,
        card_exp:req.body.card_exp,
        card_cvv:req.body.card_cvv,
        card_balance:req.body.card_balance || 100
    })
    card.save().then(()=>{
        res.status(200).json({status:1,message:"Card Added Successfully"})
    }).catch((err)=>{
        res.status(500).json({status:0,message:err})
    });
}

exports.makepayment = (req,res,next)=>{
    
    bodyData = req.bodyData;
    if(bodyData.withtoken){
        if(bodyData.charge_amount > 0){
            Token.scan("token").eq(bodyData.token).exec().then((tokens)=>{
                
                if(tokens.count>0){
                    
                    const token = tokens[0];
                    if(token.token_email==req.email){
                        Card.query("card_id").eq(token.token_card).exec().then((cards)=>{
                            if(cards.count>0){
                                if(bodyData.charge_amount <= cards[0].card_balance){
                                    Card.update({card_id:cards[0].card_id, card_balance: cards[0].card_balance - bodyData.charge_amount}).then(()=>{
                                        res.status(200).json({status:0,message:"Transaction Successfull"});
                                    }).catch((err)=>{
                                        res.status(500).json({status:0,message:"Transaction Failed"})
                                    })
                                }else{
                                    res.status(200).json({status:0,message:"Insufficient Funds"})
                                }
                            }else{
                                res.status(500).json({status:0,message:"Transaction Failed"})
                            }
                        }).catch((err)=>{
                            res.status(500).json({status:0,message:"Transaction Failed"})
                        })
                    }else{
                        res.status(500).json({status:0,message:"Transaction Failed"})
                    }
                }else{
                    res.status(200).json({status:0,message:"Transaction Failed"})
                }
            }).catch((err)=>{
                res.status(500).json({status:0,message:"Transaction Failed"})
            })
        }else{
            res.status(200).json({status:0,message:"Invalid Amount"})
        }
        
    }else{
    if(bodyData.charge_amount>0){   
    Card.scan("card_number").eq(bodyData.card_number).and().parenthesis(new dynamoose.Condition().where("card_exp").eq(bodyData.card_exp)).and().parenthesis(new dynamoose.Condition().where("card_cvv").eq(bodyData.card_cvv)).exec().then((cards)=>{
        if(cards.count>0){
            if(bodyData.charge_amount <= cards[0].card_balance){
                if(bodyData.save_card){
                    const tokend = new Token({token_id:uuidv1(), token:req.token, token_card:cards[0].card_id, token_email:bodyData.email});
                tokend.save().then(()=>{
                    Card.update({card_id:cards[0].card_id, card_balance: cards[0].card_balance - bodyData.charge_amount}).then(()=>{
                        const token_data = {
                            token:req.token,
                            card:"**** **** **** "+bodyData.card_number.slice(-4),
                            exp:bodyData.card_exp,
                            name:bodyData.card_name
                        }

                        const postData = {
                            api_key:"API_e453222f-9e44-48c6-b22b-fe5394995bd6",
                            user_email:bodyData.email,
                            "user_token":JSON.stringify(token_data),
                        }
                        axios.post('http://localhost:3001/webhook/savetoken', postData).then((response)=>{
                            if(response.data.status==1){
                                res.status(200).json({status:1, message:"Transaction Successfull"})
                            }else{
                            res.status(200).json({status:1, message:"Transaction Successfull but Unable to Save Card"})
                            }
                        }).catch((err)=>{
                            res.status(200).json({status:1, err:err})
                        })
                    }).catch((err)=>{
                        res.status(500).json({status:0,message:"Transaction Failed"});
                    })
                }).catch((err)=>{
                    res.status(500).json({status:0,message:"Transaction Failed"})
                })
                }else{
                    Card.update({card_id:cards[0].card_id, card_balance: cards[0].card_balance - bodyData.charge_amount}).then(()=>{
                        res.status(200).json({status:0,message:"Transaction Successfull"})
                    }).catch((err)=>{
                        res.status(500).json({status:0,message:"Transaction Failed"})
                    })
                }
            }else{
                res.status(200).json({status:0,message:"Insufficient Funds"})
            }
        }else{
            res.status(200).json({status:0,message:"Invalid Card Details"});
        }
    }).catch((err)=>{
        res.status(500).json({status:0,message:"Something Went Wrong"});
    })
}else{
    res.status(200).json({status:0,message:"Invalid Transaction Amount"})
}
}
}
exports.tokenize = (req,res,next)=>{
    
    const bytes = CryptoJS.AES.decrypt(req.body.data, 'A7mBSxZrjCYZObWd1ziU5wYqm5KyFUqK');
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    const ebytes = CryptoJS.AES.decrypt(req.headers.authorization, 'A7mBSxZrjCYZObWd1ziU5wYqm5KyFUqK');
    let decryptedEmail = ebytes.toString(CryptoJS.enc.Utf8);
    decryptedEmail = decryptedEmail.substring(1, decryptedEmail.length - 1);
    bodyData = JSON.parse(decryptedData);
    req.bodyData = bodyData;
    req.email = decryptedEmail;
    if(bodyData.email === decryptedEmail){
        if(bodyData.withtoken){
            next();
        }else{
    if(bodyData.save_card==1){
        const cardNumber = bodyData.card_number ;
        const exp = bodyData.card_exp;
        const cvv = bodyData.cvv;
        const email = bodyData.email;
        const command = `node interact.js ${cardNumber} ${exp} ${cvv} ${email}`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
              res.status(500).json({ error: 'Internal server error' });
            } else {
              let token = stdout.trim().split('\n').pop();
               token = token.substring(2);
              req.token = "tok_"+token;
          next();
            }
          });
          
    }else{
        next();
    }
}
}else{
    res.status(500).json({status:0,message:"Transaction Failedd"})
}

}
