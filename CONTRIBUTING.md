# Contributing to Cursor Credits Portal

Thank you for your interest in contributing to the Cursor Credits Portal! This project helps Cursor ambassadors distribute credits efficiently at hackathons and meetups.

## 🚀 Quick Start for Contributors

### Prerequisites
- Node.js 18+
- Firebase project
- Basic knowledge of Next.js and TypeScript

### Setup
1. Fork this repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/cursor-credits-portal.git`
3. Install dependencies: `npm install`
4. Copy `.env.example` to `.env.local` and configure your Firebase project
5. Run development server: `npm run dev`

## 🏗️ Project Architecture

This project follows domain-driven design with:
- **`src/app/`** - Next.js 15 App Router pages and API routes
- **`src/features/`** - Domain-specific features (attendees, codes, projects, auth)
- **`src/components/ui/`** - Reusable UI components (shadcn/ui)
- **`src/lib/`** - Shared utilities and Firebase helpers

## 📋 Contribution Guidelines

### Code Style
- Follow the existing TypeScript patterns
- Use functional React components with hooks
- Follow the naming conventions in `.cursor/rules/`
- Maintain the 500 LOC per file limit
- Add JSDoc comments for complex functions

### Pull Request Process
1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes following the code style
3. Test your changes locally
4. Update documentation if needed
5. Submit a pull request with a clear description

### Types of Contributions Welcome
- 🐛 **Bug fixes** - Fix issues with the redemption flow or admin dashboard
- ✨ **Feature enhancements** - Improve existing functionality
- 📚 **Documentation** - Improve setup guides or code documentation
- 🎨 **UI/UX improvements** - Enhance the user experience
- 🔧 **Performance optimizations** - Make the app faster
- 🧪 **Testing** - Add unit or integration tests

## 🛡️ Security Considerations

When contributing:
- Never commit sensitive data (API keys, passwords)
- Follow Firebase security best practices
- Validate all user inputs with Zod schemas
- Consider rate limiting for public endpoints

## 📞 Getting Help

- Check existing Issues for known problems
- Create a new issue for bugs or feature requests  
- Join discussions in the project repository

## 🙏 Recognition

Contributors will be acknowledged in the README and project documentation. Thank you for helping make Cursor credit distribution easier for the community!
