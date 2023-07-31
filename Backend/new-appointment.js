import { MongoClient } from "mongodb";

async function newappointment(req, res) {
  if (req.method === "POST") {
    const data = req.body;

    const client = await MongoClient.connect(
      "mongodb+srv://vishweshshah:Thisismypassword1303!@cluster0.lx1ltgv.mongodb.net/?retryWrites=true&w=majority"
    );
    const db = client.db();

    const AppointmentsCollection = db.collection("Appointments");

    const result = await AppointmentsCollection.insertOne(data);

    console.log(result);

    client.close();

    res.status(201).json({ message: "AppointmentsCollection inserted!" });
  }
}

export default newappointment;
