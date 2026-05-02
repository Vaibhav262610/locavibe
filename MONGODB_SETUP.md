# MongoDB Setup Guide for LocaVibe

## 🚨 Current Issues Fixed

### 1. **Deprecated Options Removed**

- ✅ Removed `useNewUrlParser` (deprecated in MongoDB Driver 4.0+)
- ✅ Removed `useUnifiedTopology` (deprecated in MongoDB Driver 4.0+)
- ✅ Added modern connection options for better performance

### 2. **Connection String Issue**

The error `querySrv ENOTFOUND _mongodb._tcp.cluster.mongodb.net` indicates your
MongoDB connection string is incorrect or incomplete.

---

## 🔧 **Quick Fix Steps**

### Step 1: Get Your MongoDB Atlas Connection String

1. **Go to MongoDB Atlas** (https://cloud.mongodb.com/)
2. **Sign in** to your account
3. **Click "Connect"** on your cluster
4. **Choose "Connect your application"**
5. **Copy the connection string** (it should look like this):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/locavibe?retryWrites=true&w=majority
   ```

### Step 2: Update Your .env File

Replace the `MONGODB_URI` in your `.env` file with your actual connection
string:

```env
# Replace this with your actual MongoDB connection string
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.xxxxx.mongodb.net/locavibe?retryWrites=true&w=majority
```

**Important:**

- Replace `your-username` with your MongoDB username
- Replace `your-password` with your MongoDB password
- Replace `your-cluster.xxxxx` with your actual cluster name
- The `xxxxx` part will be specific to your cluster

---

## 🆘 **Troubleshooting Common Issues**

### Issue 1: DNS Resolution Failed (ENOTFOUND)

**Symptoms:** `querySrv ENOTFOUND _mongodb._tcp.cluster.mongodb.net`

**Solutions:**

1. **Check your internet connection**
2. **Verify the cluster URL** in MongoDB Atlas
3. **Whitelist your IP address** in MongoDB Atlas:
   - Go to Network Access in MongoDB Atlas
   - Add your current IP address (or use 0.0.0.0/0 for development)

### Issue 2: Authentication Failed

**Symptoms:** `Authentication failed`

**Solutions:**

1. **Check username/password** are correct
2. **Ensure the database user exists** in MongoDB Atlas
3. **Verify user permissions** (readWrite access to the database)

### Issue 3: Network Timeout

**Symptoms:** Connection timeout errors

**Solutions:**

1. **Check firewall settings**
2. **Verify MongoDB Atlas network access**
3. **Try a different network** (mobile hotspot for testing)

---

## 🚀 **Quick Setup for Development**

### Option 1: MongoDB Atlas (Recommended)

1. **Create a free MongoDB Atlas account**
2. **Create a new cluster** (free tier is fine for development)
3. **Create a database user**:
   - Username: `locavibe-user`
   - Password: Generate a secure password
4. **Whitelist your IP** or use `0.0.0.0/0` for development
5. **Get connection string** and update `.env`

### Option 2: Local MongoDB (Alternative)

If you prefer local development:

```bash
# Install MongoDB locally
# Windows: Download from mongodb.com
# Mac: brew install mongodb-community
# Linux: Follow MongoDB installation guide

# Start MongoDB
mongod

# Update .env to use local connection
MONGODB_URI=mongodb://localhost:27017/locavibe
```

---

## 🔍 **Testing Your Connection**

Create a simple test script to verify your connection:

```javascript
// test-db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function testConnection() {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("✅ MongoDB connection successful!");

		// Test creating a simple document
		const TestSchema = new mongoose.Schema({ name: String });
		const Test = mongoose.model("Test", TestSchema);

		const doc = new Test({ name: "Connection Test" });
		await doc.save();
		console.log("✅ Database write test successful!");

		await Test.deleteOne({ name: "Connection Test" });
		console.log("✅ Database delete test successful!");

		process.exit(0);
	} catch (error) {
		console.error("❌ Connection failed:", error.message);
		process.exit(1);
	}
}

testConnection();
```

Run with: `node test-db.js`

---

## 📝 **Example Working Configuration**

Here's what your `.env` should look like with a real MongoDB Atlas connection:

```env
# Example (replace with your actual values)
MONGODB_URI=mongodb+srv://locavibe-user:MySecurePassword123@cluster0.ab1cd.mongodb.net/locavibe?retryWrites=true&w=majority
DOMAIN_URI=http://localhost:3000
TOKEN_SECRET=super_secure_random_string_here_change_this
JWT_SECRET=another_super_secure_random_string_here
NODE_ENV=development
```

---

## 🔐 **Security Best Practices**

1. **Never commit `.env` to git** (it's already in `.gitignore`)
2. **Use strong passwords** for database users
3. **Restrict IP access** in production
4. **Rotate secrets regularly**
5. **Use different databases** for development/production

---

## 🆘 **Still Having Issues?**

If you're still experiencing problems:

1. **Check the MongoDB Atlas status page**
2. **Try connecting from MongoDB Compass** (GUI tool)
3. **Contact MongoDB Atlas support** if using their service
4. **Check your network/firewall settings**

---

## 🚀 **Next Steps After Connection Works**

Once your MongoDB connection is working:

1. **Test the login functionality** with the admin credentials
2. **Create some sample restaurants** and reviews
3. **Test the real-time features** we implemented
4. **Explore the analytics dashboard**
5. **Try the voice search** and 3D visualizations

The advanced features we implemented will work seamlessly once the database
connection is established!
