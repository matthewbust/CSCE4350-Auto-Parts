# Setup Guide - Auto Parts System Frontend

This guide will walk you through setting up the React frontend and pushing it to your Git repository.

## Prerequisites

1. **Node.js and npm installed**
   - Download from: https://nodejs.org/
   - Verify installation:
     ```bash
     node --version
     npm --version
     ```

2. **Git installed**
   - Download from: https://git-scm.com/
   - Verify installation:
     ```bash
     git --version
     ```

3. **GitHub account and repository created**
   - Create a new repository on GitHub (e.g., `auto-parts-system`)

## Step-by-Step Setup

### 1. Navigate to Your Project Directory

```bash
cd /path/to/your/project
```

### 2. If You Already Have a Git Repo

If you already have a git repository with your backend code:

```bash
# Navigate to your existing repo
cd your-existing-repo

# Copy the frontend folder into your repo
# (Assuming you have the auto-parts-frontend folder ready)
cp -r /path/to/auto-parts-frontend ./frontend

# Or if you want it at the root level
cp -r /path/to/auto-parts-frontend/* ./
```

### 3. If Starting Fresh

If you're creating a new repository:

```bash
# Initialize git repository
git init

# Copy your frontend files here
# Then add remote
git remote add origin https://github.com/your-username/your-repo-name.git
```

### 4. Install Dependencies

```bash
# Navigate to frontend directory
cd auto-parts-frontend

# Install all required packages
npm install
```

This will install:
- React 18
- React Router DOM
- Axios
- React Scripts

### 5. Configure Environment Variables

```bash
# Create .env file from example
cp .env.example .env

# Edit .env file with your settings
# For Windows: notepad .env
# For Mac/Linux: nano .env
```

Update `.env` with your backend API URL:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### 6. Test the Application Locally

```bash
# Start the development server
npm start
```

The app should open at `http://localhost:3000`

**Test these features:**
- [ ] Login page loads correctly
- [ ] Registration page loads correctly
- [ ] Parts listing page displays
- [ ] Navigation works between pages

### 7. Git Commands to Push to Repository

#### First Time Setup

```bash
# Make sure you're in the right directory
cd auto-parts-frontend

# Check git status
git status

# Add all files to staging
git add .

# Commit the files
git commit -m "Initial commit: Add React frontend for auto parts system"

# Add remote repository (if not already added)
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git

# Push to GitHub
git push -u origin main
```

**Note:** If your default branch is `master` instead of `main`, use:
```bash
git push -u origin master
```

#### If You Get Authentication Errors

For HTTPS:
```bash
# GitHub now requires personal access tokens instead of passwords
# Create a token at: https://github.com/settings/tokens
# Use the token as your password when prompted
```

For SSH:
```bash
# If using SSH, make sure you've added your SSH key to GitHub
# Test connection:
ssh -T git@github.com

# Change remote to SSH:
git remote set-url origin git@github.com:YOUR-USERNAME/YOUR-REPO-NAME.git
```

### 8. Subsequent Updates

When you make changes to your code:

```bash
# Check what files changed
git status

# Add specific files
git add src/pages/NewPage.js

# Or add all changes
git add .

# Commit with a descriptive message
git commit -m "Add: Implement new feature for inventory management"

# Push to GitHub
git push
```

## Git Commit Message Conventions

Use clear, descriptive commit messages:

```bash
# Feature additions
git commit -m "Add: Shopping cart functionality"

# Bug fixes
git commit -m "Fix: Cart total calculation error"

# Updates
git commit -m "Update: Improve parts listing UI"

# Documentation
git commit -m "Docs: Update README with API endpoints"

# Refactoring
git commit -m "Refactor: Simplify authentication logic"
```

## Project Structure in Git

```
your-repo/
├── auto-parts-frontend/        # React frontend
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── README.md
│   └── .gitignore
├── backend/                    # Your Node.js/Express backend (if in same repo)
│   ├── server.js
│   ├── routes/
│   └── ...
├── database/                   # Database scripts
│   ├── schema.sql
│   └── seed-data.sql
└── README.md                   # Main project README
```

## Working with Team Members

### Clone the Repository (for team members)

```bash
# Clone the repo
git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git

# Navigate to project
cd YOUR-REPO-NAME/auto-parts-frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with local settings

# Start development server
npm start
```

### Branching Strategy

```bash
# Create a new branch for your feature
git checkout -b feature/add-payment-methods

# Make your changes and commit
git add .
git commit -m "Add: Payment method management"

# Push your branch
git push origin feature/add-payment-methods

# Create a pull request on GitHub
# After review and approval, merge to main
```

### Staying Updated

```bash
# Update your local main branch
git checkout main
git pull origin main

# Update your feature branch with latest main
git checkout feature/your-feature
git merge main

# Or use rebase for cleaner history
git rebase main
```

## Common Git Issues and Solutions

### 1. Merge Conflicts

```bash
# If you encounter conflicts during merge
git status  # Shows conflicted files

# Edit the conflicted files to resolve
# Remove conflict markers (<<<<, ====, >>>>)

# After resolving
git add .
git commit -m "Resolve merge conflicts"
```

### 2. Undo Last Commit (Before Push)

```bash
# Keep changes but undo commit
git reset --soft HEAD~1

# Discard changes and undo commit
git reset --hard HEAD~1
```

### 3. Discard Local Changes

```bash
# Discard changes to specific file
git checkout -- filename.js

# Discard all local changes
git reset --hard HEAD
```

### 4. View Commit History

```bash
# Simple view
git log --oneline

# Detailed view
git log

# Graphical view
git log --graph --oneline --all
```

## Deployment Options

### GitHub Pages (Static Hosting)

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"predeploy": "npm run build",
"deploy": "gh-pages -d build"

# Add homepage to package.json:
"homepage": "https://YOUR-USERNAME.github.io/YOUR-REPO-NAME"

# Deploy
npm run deploy
```

### Vercel (Recommended for React)

1. Push your code to GitHub
2. Go to https://vercel.com
3. Import your GitHub repository
4. Vercel will auto-detect React and deploy
5. Add environment variables in Vercel dashboard

### Netlify

1. Push code to GitHub
2. Go to https://netlify.com
3. Connect your GitHub repository
4. Set build command: `npm run build`
5. Set publish directory: `build`
6. Add environment variables

## Environment-Specific Configurations

### Development

```bash
# .env.development
REACT_APP_API_URL=http://localhost:5000/api
```

### Production

```bash
# .env.production
REACT_APP_API_URL=https://your-production-api.com/api
```

## Troubleshooting

### npm install fails

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Git push rejected

```bash
# Pull latest changes first
git pull origin main

# Then push again
git push origin main
```

### Port 3000 already in use

```bash
# Kill the process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm start
```

## Best Practices

1. **Commit Often**: Make small, focused commits
2. **Write Clear Messages**: Describe what and why, not how
3. **Test Before Commit**: Ensure code works before committing
4. **Pull Before Push**: Always pull latest changes before pushing
5. **Use Branches**: Create feature branches for new work
6. **Review Code**: Use pull requests for code review
7. **Keep .env Private**: Never commit .env files
8. **Document Changes**: Update README when adding features

## Next Steps

After setting up the frontend:

1. ✅ Test all pages locally
2. ✅ Ensure backend API is running
3. ✅ Test API integration
4. ✅ Push to GitHub
5. ✅ Set up CI/CD (optional)
6. ✅ Deploy to hosting platform
7. ✅ Share with team members

## Support

If you encounter issues:

1. Check the console for errors (`F12` in browser)
2. Review API responses in Network tab
3. Check backend server logs
4. Verify environment variables
5. Consult team members

## Additional Resources

- React Documentation: https://react.dev
- React Router: https://reactrouter.com
- Axios Documentation: https://axios-http.com
- Git Documentation: https://git-scm.com/doc
- GitHub Guides: https://guides.github.com

---

**Created for CSCE 4350.001 - Fall 2025**
**Team: Matthew Bustamente, Samwel Makyao, Saurav Pandey**
