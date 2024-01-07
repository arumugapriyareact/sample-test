const express = require("express");
const serverless = require("serverless-http")
const cors = require("cors");
const dotenv = require("dotenv");
const paymentRoutes = require("../payment");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const router = express.Router();

const app = express();

dotenv.config();

app.use(express.json());
app.use(cors());


router.get("/",async(req,res)=>{
    try{
        res.send('App is running..');
    }catch(error){
        console.log(error)
    }
    
})
router.post("/orders",async(req,res)=>{
    console.log(req)
    try{
      
        const instance= new Razorpay({
            key_id: "rzp_test_GX4az0Kga9TjoI",
            key_secret: "XwXATpfF8xcny6gYqCZWS4dR"
        })

        const options = {
            amount: req.body.amount * 100,
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex")
        }
        
        instance.orders.create(options, (error, order)=>{
            if(error){
                console.log(error);
                return res.status(500).json({message: "Something Went Wrong!"});
            }
            res.status(200).json({data:order});
        })

    }catch(error){
        console.log(error)
        res.status(500).json({message: "Internal Server Error"})
    }
})
router.get("/verify_get",async(req,res)=>{
    try{
        console.log("")
    }catch(error){
        console.log(error)
        res.status(500).json({message: "Internal Server Error!"})
    }
})
router.post("/verify",async(req,res)=>{
    try{
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body
        const sign = `${razorpay_order_id}|${razorpay_payment_id}`
        const expectedSign = crypto
            .createHmac("sha256", "XwXATpfF8xcny6gYqCZWS4dR")
            .update(sign.toString())
            .digest("hex");
            if(razorpay_signature === expectedSign){
                return res.status(200).json({message: "Payment Verified Successfully"})
            }else{
                return res.status(400).json({message: "Invalid signature"})
            }
    }catch(error){
        console.log(error)
        res.status(500).json({message: "Internal Server Error!"})
    }
})

app.use('/.netlify/functions/index', router);
const port = process.env.PORT || 8000;
app.listen(port,()=>{console.log(`Listening to port ${port}`)});
module.exports.handler=serverless(app)

