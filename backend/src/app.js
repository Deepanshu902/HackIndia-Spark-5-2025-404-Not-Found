import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
})) 
app.use(express.json({limit:"16kb"}))

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"))

app.use(cookieParser())


import authRoutes from "./routes/auth.routes.js"
import proposalRoutes  from "./routes/proposal.routes.js"
import voteRoutes  from "./routes/vote.routes.js"

app.use("/api/auth", authRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/votes", voteRoutes);


export {app}  