require("express-async-errors");
// require("dotenv").config({ path: "./.env" })
const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth");
//const userRouter = require("./routes/user")
const planRouter = require("./routes/plan")
const auth = require("./middelware/auth");

const app = express();

//middleware
app.use(express.json());
app.use("/api/auth", authRouter);

app.use(auth)
// app.use("/plans", plansRouter)

// app.use("/plans", auth, plansRouter)
//app.use("/users", userRouter);

app.use("/plans", planRouter);

const errorHandler = (func) => {
    return (req, res, next) => {
        try {
            func(req, res, next)
        } catch (error) {
            next(error)
        }
    }
}

app.get("/", errorHandler((req, res) => {
    // throw new Error("un-expected-error")
    console.log(req.user);
     if (req.user.isAdmin)
         return res.json({ message: "hello-world" })
     res.status(401).json({ message: "must be admin" })
}))

//Error handling middleware
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message })
})

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("successfully connected to database");
    app.listen(3000, () => {
        console.log("listening on port 3000");
    })
}).catch(e => console.log(e.message))



























// const mongoose = require("mongoose");
// const express = require("express");
// const userRouter = require("./routes/user")
// const planRouter = require("./routes/plan")

// const app = express();

// // middleware
// app.use(express.json());

// //

// app.use((req, res, next) => {
//   // res.json({ message: "un-authorized" })
//   console.log(req.method, req.url);
//   next()
// })

// app.use("/api/auth", authRouter);

// app.use("/users", userRouter);
// app.use("/plans", planRouter)

// //connection to database
// mongoose
//   .connect("mongodb://localhost/node-quena")
//   .then(async () => {
//     console.log("successfully connected to mongodb");
//     // start backend erver
//     app.listen(3000, () => {
//       console.log("Server listeing on port 3000");
//     });
//   })
//   .catch((e) => {
//     console.log(e.message);
//   });
