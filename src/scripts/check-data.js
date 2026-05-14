const mongoose = require('mongoose');

async function checkData() {
  const uri = "mongodb://khanmahid97_db_user:Pakistan26@ac-bqrcqif-shard-00-00.ddvqx63.mongodb.net:27017,ac-bqrcqif-shard-00-01.ddvqx63.mongodb.net:27017,ac-bqrcqif-shard-00-02.ddvqx63.mongodb.net:27017/EmployeeDB?ssl=true&replicaSet=atlas-t1jh9g-shard-0&authSource=admin&appName=todoapp";
  try {
    await mongoose.connect(uri);
    const Employee = mongoose.model('Employee', new mongoose.Schema({}, { strict: false }));
    const count = await Employee.countDocuments();
    const samples = await Employee.find().limit(2);
    console.log(`Total employees: ${count}`);
    console.log('Sample data:', JSON.stringify(samples, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkData();
