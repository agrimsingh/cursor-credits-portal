# Cursor Credits Portal

A friction-free, self-service portal for distributing Cursor credits at hackathons and meetups.

> 🚀 **This is an alternative implementation** to the existing [cursor-credits](https://github.com/cursorcommunityled/cursor-credits) service. While that project focuses on backend email distribution, this portal provides a **self-service web interface** where attendees can claim codes themselves through an intuitive UI.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Firebase project
- npm or yarn

### Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Firebase:**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Firestore Database and Authentication
   - Copy `env.example` to `.env.local` and fill in your Firebase config values

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Seed test data (optional):**
   ```bash
   # Update scripts/seed-data.js with your Firebase config first
   node scripts/seed-data.js
   ```

## 🚀 Current Features

### 👥 **Attendee Experience (Enhanced MVP)**
- **Smart Redemption Flow**: Two-step validation with attendee autocomplete
- **Event-Specific URLs**: Access via `/event/{slug}/redeem` for each hackathon
- **Instant Code Delivery**: Direct Cursor URL redemption (no copy-paste needed)
- **Mobile-First Design**: Optimized for all devices with loading states
- **Real-Time Validation**: Prevents errors with immediate feedback

### 🔧 **Admin Dashboard (Production-Ready)**
- **Project Management**: Create, switch between, and manage multiple events
- **Real-Time Analytics**: Live redemption tracking and usage statistics
- **CSV Processing**: Upload codes and attendee lists with validation
- **Data Export**: Download redemption logs and audit trails
- **Bulk Operations**: Manage hundreds of codes and attendees efficiently
- **Project Isolation**: Complete data separation between events

### 🏗️ **Multi-Event Architecture**
- **Project-Based System**: Full multi-tenant architecture
- **Dynamic Routing**: Each event gets its own redemption page
- **Legacy Compatibility**: Maintains backward compatibility
- **Scalable Design**: Handles unlimited events and attendees

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **UI/UX**: shadcn/ui components, Tailwind CSS 4, Lucide icons
- **Backend**: Firebase (Firestore, Hosting)
- **Validation**: Zod schemas with comprehensive type safety
- **Data Processing**: Advanced CSV parsing and validation
- **Architecture**: Domain-driven feature folders, REST API design
- **Styling**: Inter typography, Apple HIG-inspired design system
- **Performance**: Static-first rendering, optimized bundle size

## 📂 Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/ui/          # shadcn/ui components
├── features/               # Domain-driven feature modules
│   ├── attendees/         # Attendee management
│   ├── codes/             # Code management  
│   └── auth/              # Authentication
└── lib/                   # Shared utilities and helpers
```

## 🔥 Firebase Configuration

### Firestore Collections
- `projects` - Event/hackathon configurations
- `codes` - Available credit codes (project-scoped)
- `attendees` - Event participants (project-scoped)  
- `redemptions` - Complete audit trail (project-scoped)

All data is automatically isolated by project for multi-event support.

### Setup Requirements
1. Enable Firestore Database in your Firebase project
2. Configure environment variables (see `env.example`)
3. Set `ADMIN_PASSWORD` environment variable for admin access
4. Deploy security rules from `firestore.rules` (currently in dev mode)

**Note**: Currently uses simple password authentication (`ADMIN_PASSWORD`), not Firebase Auth.

## 🚧 Development Status

**Phase 1 MVP**: ✅ **COMPLETED + ENHANCED**  
**Phase 2 Admin Dashboard**: ✅ **COMPLETED**  
**Phase 3 Multi-Event Support**: ✅ **COMPLETED**  
**Phase 4 Ambassador Platform**: 📋 *Next (optional)*  

**🎉 Ready for Production Deployment!**

The app has significantly exceeded initial scope with:
- Advanced two-step validation system
- Complete project management architecture  
- Real-time admin dashboard with live updates
- Production-grade CSV processing and data export
- Mobile-optimized responsive design

See `README_PRD.txt` for detailed implementation status.

## 📝 Usage

### For Attendees:
1. Visit your event's redemption URL: `/event/{your-event-slug}/redeem`
2. Start typing your name (autocomplete will suggest matches)
3. Confirm your email address
4. Click to instantly claim your Cursor credits
5. Redirect directly to Cursor with credits automatically applied

### For Organizers:
1. Access admin dashboard at `/admin` (password required)
2. Create a new project for your hackathon/event
3. Upload your attendee list (CSV from Luma/Eventbrite) 
4. Upload your Cursor credit codes (CSV format)
5. Share the event redemption URL with participants
6. Monitor real-time redemptions and download audit logs

### Advanced Features:
- **Project switching**: Manage multiple events simultaneously
- **Real-time dashboard**: Watch redemptions happen live
- **Data isolation**: Each event's data is completely separate
- **Export capabilities**: Download complete audit trails

## 🤝 Contributing

We welcome contributions from the Cursor community! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Contributing Guide:
1. Fork this repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`  
3. Make your changes and test locally
4. Submit a pull request with a clear description

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ for the Cursor community
