# Changelog

All notable changes to the Cursor Credits Portal will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2025-01-16

### Added
- **Complete self-service redemption portal** with two-step validation
- **Project-based architecture** supporting unlimited events/hackathons
- **Advanced admin dashboard** with real-time statistics and live updates
- **Intelligent attendee autocomplete** to prevent name/email errors
- **CSV processing system** for codes and attendees (Luma export support)
- **Project management interface** with creation, switching, and deletion
- **Data export capabilities** for audit trails and redemption logs
- **Mobile-responsive design** following Apple Human Interface Guidelines
- **Firebase integration** with Firestore for data persistence
- **Dynamic event routing** (`/event/{slug}/redeem` for each project)
- **Comprehensive error handling** and user feedback throughout
- **Production-ready API** with Zod validation and backward compatibility

### Features
- Two-step attendee validation (name selection + email confirmation)
- Real-time dashboard with live redemption tracking
- Project-scoped data isolation for multi-event management
- Advanced CSV upload with validation and preview
- Bulk operations for managing hundreds of codes and attendees
- Direct Cursor URL integration (no copy-paste needed)
- Simple password-based admin authentication
- Complete audit trail for all redemptions
- Responsive design optimized for mobile and desktop
- Dark/light mode support via Tailwind CSS

### Technical Implementation
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Backend**: Next.js API routes with Firebase Firestore
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **Validation**: Zod schemas for type safety
- **Architecture**: Domain-driven feature folders
- **Performance**: Optimized bundle with static-first rendering

### Documentation
- Complete setup and deployment guides
- Detailed API documentation
- CSV format specifications
- Contributing guidelines for community development

## [0.1.0] - Initial Development

### Added
- Basic project structure and Next.js setup
- Initial Firebase configuration
- Prototype attendee redemption flow
- Basic admin authentication
- CSV parsing foundation

---

For more details about changes, see the commit history in the repository.
