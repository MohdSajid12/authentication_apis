import mongoose from "mongoose";

const dbConnect = () =>{
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log(`Database connected successfully`);
    }).catch((err)=>{
        console.log(`Something went wrong` ,err.message);
        process.exit(1);
    })
}

export default dbConnect;