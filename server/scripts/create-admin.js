const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const createAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@brtmultisoft.com' });
    
    if (adminExists) {
      console.log('Admin user already exists');
      mongoose.connection.close();
      return;
    }
    
    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const admin = new User({
      name: 'Admin User',
      email: 'admin@brtmultisoft.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    await admin.save();
    
    console.log('Admin user created successfully');
    console.log('Email: admin@brtmultisoft.com');
    console.log('Password: admin123');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error creating admin user:', error);
    mongoose.connection.close();
  }
};

createAdmin();
