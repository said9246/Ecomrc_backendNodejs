const app =require("./App")

const dotenv=require("dotenv")
const connectDatabase=require("./config/database")

//config
dotenv.config({path:"backend/config/confiq.env"})
//connection of database
connectDatabase()


        const server = app.listen(process.env.PORT, ()=>{
        console.log(`server is running on ${process.env.PORT}`)
})


// Handling Uncaught Exception use for error-------------not work
process.on("uncaughtException", (err) => {
        console.log(`Error: ${err.message}`);
        console.log(`Shutting down the server due to Uncaught Exception`);
        server.close(()=>{

                process.exit(1);
        })
      });//--------3
