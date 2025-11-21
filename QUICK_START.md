# Quick Start Guide

Get your React frontend up and running in 5 minutes!

## Prerequisites
- Node.js installed (v14+)
- Git installed
- Backend API running on port 5000

## Quick Setup Commands

```bash
# 1. Navigate to the frontend directory
cd auto-parts-frontend

# 2. Install dependencies (this may take a few minutes)
npm install

# 3. Create environment file
cp .env.example .env

# 4. (Optional) Edit .env if your API is not on localhost:5000
# nano .env  # or use your preferred editor

# 5. Start the development server
npm start
```

The app will automatically open in your browser at `http://localhost:3000`

## Push to GitHub (First Time)

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: React frontend"

# Add your GitHub repository
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git

# Push to GitHub
git push -u origin main
```

## Making Updates Later

```bash
# After making changes
git add .
git commit -m "Description of changes"
git push
```

## Default Login Credentials (if using seed data)

**Customer Account:**
- Email: (will be provided by backend)
- Password: (will be provided by backend)

**Staff Account:**
- Email: (will be provided by backend)
- Password: (will be provided by backend)

## Common Issues

**Port 3000 already in use?**
```bash
# Use a different port
PORT=3001 npm start
```

**Can't connect to API?**
- Make sure backend server is running
- Check `.env` has correct API URL
- Default should be: `REACT_APP_API_URL=http://localhost:5000/api`

**npm install fails?**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## File Structure

```
auto-parts-frontend/
├── src/
│   ├── pages/           # All page components
│   ├── components/      # Reusable components
│   ├── services/        # API calls
│   └── App.js          # Main app component
├── public/
├── package.json
└── README.md
```

## Available Features

✅ User Authentication (Login/Register)  
✅ Browse Parts Catalog  
✅ Search and Filter Parts  
✅ Shopping Cart  
✅ Place Orders  
✅ Order History  
✅ Customer Dashboard  
✅ Staff Dashboard  
✅ Order Management (Staff)  

## Need Help?

📖 See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions  
📖 See [README.md](./README.md) for full documentation  

## Team

- Matthew Bustamente - Backend Development
- Samwel Makyao - Database Implementation
- Saurav Pandey - Frontend Development

---

**Ready to start? Run `npm install` then `npm start`!** 🚀
