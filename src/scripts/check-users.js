const mongoose = require('mongoose');

async function checkUsers() {
  const uri = "mongodb://khanmahid97_db_user:Pakistan26@ac-bqrcqif-shard-00-00.ddvqx63.mongodb.net:27017,ac-bqrcqif-shard-00-01.ddvqx63.mongodb.net:27017,ac-bqrcqif-shard-00-02.ddvqx63.mongodb.net:27017/EmployeeDB?ssl=true&replicaSet=atlas-t1jh9g-shard-0&authSource=admin&appName=todoapp";
  try {
    await mongoose.connect(uri);
    const Employee = mongoose.model('Employee', new mongoose.Schema({}, { strict: false }));
    const admins = await Employee.find({ role: 'admin' });
    const managers = await Employee.find({ role: 'manager' });
    console.log(`Admins: ${admins.length}`);
    console.log(`Managers: ${managers.length}`);
    console.log('Managers details:', JSON.stringify(managers, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkUsers();
