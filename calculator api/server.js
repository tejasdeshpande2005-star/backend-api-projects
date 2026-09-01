const express = require("express");
const app = express();
app.use(express.json());
function calculate(req,res){
    if(!req.body.operation){
        return res.status(400).json({
            message: "Operation Missing"
        });
    }
    if(req.body.a === undefined || req.body.b === undefined){
        return res.status(400).json({
            message: "Input fields are missing"
        });
    }
    const op = req.body.operation;
    const a = Number(req.body.a);
    const b = Number(req.body.b);
    if(!Number.isFinite(a) || !Number.isFinite(b)){
        return res.status(400).json({
            message: "a and b must be valid numbers"
        });
    }
    let result;
    if(op === "+"){
        result = a + b;
    }
    else if(op === "-"){
        result = a-b;
    }
    else if(op === "*"){
        result = a*b;
    }
    else if(op === "/"){
        if(b === 0){
            return res.status(400).json({
                message: "Cannot divide by 0"
            });
        }
        result = a/b;
    }
    else{
        return res.status(400).json({
            message: "Invalid operation"
        });
    }
    res.json({
        result: result
    });
    
}
app.post("/api/calculate",calculate);
app.listen(3000,()=>{
    console.log("SERVER Listening on PORT 3000");
});