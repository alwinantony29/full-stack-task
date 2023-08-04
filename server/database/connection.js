import mongoose from "mongoose";

const connectDB = async () => {
    const uri = process.env.MONGODB_URI;
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        // useFindAndModify: false, // You can include this option if needed
        useUnifiedTopology: true,
    });

    console.log('Database connected');
};

export default connectDB
