const fs = require('fs');
const envData = fs.readFileSync('.env.local', 'utf8');
const mongoMatch = envData.match(/MONGODB_URI=([^\r\n]+)/);
const MONGODB_URI = mongoMatch ? mongoMatch[1] : '';
const mongoose = require('mongoose');

// Need to run this with node, so we use commonjs
async function migrate() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to DB');

  const db = mongoose.connection.db;

  // 1. Move Admins to Employees collection
  const admins = await db.collection('admins').find({}).toArray();
  for (const admin of admins) {
    const existing = await db.collection('employees').findOne({ email: admin.email });
    if (!existing) {
      await db.collection('employees').insertOne({
        firstName: 'System',
        lastName: 'Admin',
        email: admin.email,
        password: admin.password,
        role: 'admin',
        department: 'Admin',
        position: 'Administrator',
        salary: 0,
        joiningDate: admin.createdAt || new Date(),
        status: 'Active',
        permissions: ['all'],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`Migrated admin: ${admin.email}`);
    }
  }

  // 2. Standardize departments in employees
  // HR, Finance, Sales, IT, Admin
  const deptMapping = {
    'Human Resources': 'HR',
    'Human Resource': 'HR',
    'hr': 'HR',
    'Engineering': 'IT',
    'Software': 'IT',
    'Design': 'IT',
    'Marketing': 'Sales',
    'Sales': 'Sales',
    'Finance': 'Finance',
    'Customer Support': 'HR',
    'Admin': 'Admin'
  };

  const employees = await db.collection('employees').find({}).toArray();
  for (const emp of employees) {
    let newDept = deptMapping[emp.department] || emp.department;
    if (!['HR', 'Finance', 'Sales', 'IT', 'Admin'].includes(newDept)) {
      // Default fallback
      newDept = 'HR';
    }

    let newRole = emp.role;
    if (!['admin', 'manager', 'employee'].includes(newRole)) {
      newRole = 'employee';
    }

    await db.collection('employees').updateOne(
      { _id: emp._id },
      { 
        $set: { 
          department: newDept,
          role: newRole,
          permissions: emp.permissions || []
        } 
      }
    );
    console.log(`Updated employee ${emp.email}: dept -> ${newDept}, role -> ${newRole}`);
  }

  // 3. (Optional) Update departments collection
  await db.collection('departments').deleteMany({});
  const defaultDepts = [
    { name: 'HR', description: 'Human Resources', head: 'John Doe', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Finance', description: 'Finance and Payroll', head: 'Jane Smith', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Sales', description: 'Sales and Revenue', head: 'Robert Fox', createdAt: new Date(), updatedAt: new Date() },
    { name: 'IT', description: 'Engineering and Tech', head: 'Esther Howard', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Admin', description: 'Administration', head: 'System', createdAt: new Date(), updatedAt: new Date() }
  ];
  await db.collection('departments').insertMany(defaultDepts);
  console.log('Reset departments collection');

  console.log('Migration complete');
  process.exit(0);
}

migrate().catch(console.error);
