import mongoose from "mongoose";

const db =
  "mongodb://admin:admin@ac-2ku6cyy-shard-00-00.qynns02.mongodb.net:27017,ac-2ku6cyy-shard-00-01.qynns02.mongodb.net:27017,ac-2ku6cyy-shard-00-02.qynns02.mongodb.net:27017/DevConnector?ssl=true&replicaSet=atlas-h9u3c9-shard-0&authSource=admin&retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
