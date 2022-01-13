const express = require("express");
const { Plan } = require("../model/plan");
const jwt = require("jsonwebtoken");
const { Error } = require("mongoose");

const router = express.Router()

router.get("/", async (req, res) => {
    const plans = await Plan.find().populate("users", "name email -_id");
    res.json(plans)
    //throw new Error ;
})

router.get("/:id", async (req, res) => {
    const plan = await Plan.findById(req.params.id);
    res.json(plan)
})

router.put('/subs/:id' , async (req,res)=>{
    const plan =await Plan.findById(req.params.id);
        console.log(plan.users);
    if(plan.users.includes(req.body.users))return res.status(401).send("the subscribe before");
    
    const newusers=req.body.users ;
    
    plan.users.push(req.body.users)
        
    await plan.save()
    const plans=await Plan.find().populate("users", "name email -_id");
    res.json(plans);
})


router.put('/unsubs/:id' , async (req,res)=>{
    const plan =await Plan.findById(req.params.id);
    console.log(plan.users);
    console.log(req.body.users);
    if(plan.users.includes(req.body.users))return res.status(401).send("you are not in supscription");
     plan.users.splice(plan.users.findIndex(to=>to.valueOf() === req.body.users),1)
    
  //await Plan.findByIdAndDelete(plan.users);

    //await plan.save()
    const plans=await Plan.find().populate("users", "name email -_id");
    res.json(plans);
})






const auth = (req, res, next) => {
    const token = req.header("x-auth-token");
    try {
        const result = jwt.verify(token,process.env.SECERT_key);
        //req.user = result
        if(result.isAdmin)
            next();
        else throw new Error
    } catch (error) {
        res.status(401).json({ message: "un-authorized" })
    }
}

router.post("/",auth ,async (req, res) => {
    const newPlan = new Plan(req.body)
    const result = await newPlan.save()
    res.json(result)
});

router.put("/:id",auth,async (req, res) => {
    const plan = await Plan.findById(req.params.id);
    plan.name = req.body.name
    plan.price = req.body.price
    await plan.save();
    res.json(plan)
})

router.delete("/:id",auth,async (req, res) => {
    const result = await Plan.findByIdAndDelete(req.params.id);
    res.json(result)
})

module.exports = router

