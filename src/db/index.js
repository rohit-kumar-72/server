import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGOURL)

        console.log(`\n MONGODB CONNECTED !! DB HOST: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log(error)
        console.log("MONGODB CONNECTION ERROR!!!");
        process.exit(1);
    }
}

export default connectDB;