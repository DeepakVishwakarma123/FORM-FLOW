import app from "./app.js"
import connectDb from "./db/db.js";

connectDb().then(
    () => {
        console.log("connection succesful");
        
        app.listen(4000,() => { 
            console.log('server is running');  
        })
    }
).catch(
    (err) => {
     console.log(err);
    }
) 