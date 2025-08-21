# Cursor Credits Distribution App

A friction-free, self-service portal for distributing Cursor credits at hackathons and meetups.

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

## 📱 Current Features (Phase 1 MVP)

- **Landing Page**: Event information and redemption entry point
- **Redemption Flow**: Name and email collection with validation
- **Code Assignment**: Automatic assignment of available codes
- **Success Page**: Code display with copy-to-clipboard functionality
- **Responsive Design**: Works seamlessly on mobile and desktop

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **UI**: shadcn/ui components, Tailwind CSS, Lucide icons
- **Backend**: Firebase (Auth, Firestore, Hosting)
- **Validation**: Zod schemas with React Hook Form
- **Styling**: Inter font, mobile-first responsive design

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

The app requires these Firestore collections:
- `events` - Event information
- `codes` - Available credit codes
- `attendees` - Event participants
- `redemptions` - Audit trail of code claims

Security rules are included in `firestore.rules`.

## 🚧 Development Status

**Phase 1 MVP**: ✅ Core redemption flow completed  
**Phase 2**: 🔄 Admin dashboard (next)  
**Phase 3**: 📋 Multi-event support  
**Phase 4**: 🌍 Ambassador platform  

See `README_PRD.txt` for detailed roadmap.

## 📝 Usage

1. Visit the landing page
2. Click "Start Code Redemption"
3. Enter your name and email
4. Receive your unique Cursor credit code
5. Copy the code and redeem it in Cursor

---

Built with ❤️ for the Cursor community
