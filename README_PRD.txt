Cursor Credits Distribution App – Product Requirements & Implementation Roadmap

Problem
Our hackathons and meet-ups give participants complimentary Cursor credits, yet the current hand-out process is manual, error-prone, and leaves no record of who redeemed which code. Unclaimed credits often disappear into spreadsheets, while organizers scramble to match names, emails, and leftover codes.

Who We Serve
We are building for Cursor ambassadors and event organizers who host hackathons or meet-ups, and for the participants who attend them. Organizers need a frictionless way to distribute codes and track usage; attendees need a quick, self-service path to claim their credits without searching inboxes or waiting in lines.

================================================================================
IMPLEMENTATION PHASES
================================================================================

## Phase 1: MVP (Week 1-2) 🚧
Focus: Core redemption flow for a single event

### P1.1 - Foundation Setup
- [x] Initialize Next.js 15 App Router project with TypeScript
- [x] Configure Firebase project (Auth, Firestore, Hosting) - config ready
- [x] Setup shadcn/ui components and Tailwind CSS
- [x] Configure environment variables and Firebase SDK - template created
- [x] Basic folder structure per architecture rules

### P1.2 - Data Models & Firebase Setup
- [x] Design Firestore schema for codes, attendees, redemptions
- [x] Create Firebase security rules (basic version)
- [x] Manual data seeding scripts for test data
- [x] Basic type definitions with Zod schemas

### P1.3 - Attendee Redemption Flow
- [x] Landing page with event branding
- [x] Name selection interface (no autocomplete)
- [x] Email confirmation step
- [x] Code reveal page with clickable cursor.com links (improved UX)
- [x] Basic error handling (already redeemed, not found)

### P1.4 - Data Persistence
- [x] Store redemption records in Firestore - logic implemented
- [x] Prevent double redemption - transaction-based prevention
- [x] Basic audit trail (timestamp, name, email)

### P1.5 - MVP Polish
- [x] Mobile-responsive design
- [x] Loading states and error messages
- [ ] Deploy to Firebase Hosting - deferred until admin dashboard complete
- [x] Test with sample CSV data - CSV parsing for real data formats

**MVP Success Criteria:** ✅ COMPLETED
- ✅ Attendees can claim codes via name + email
- ✅ Each code is distributed only once (transaction-based)
- ✅ All redemptions are logged with audit trail
- ✅ Works on mobile devices
- ✅ BONUS: Clickable cursor.com links (no copy-paste needed)
- ✅ BONUS: Real CSV format support (120 codes, 194 attendees)

================================================================================

## Phase 2: Admin Dashboard (Week 3-4) 📊
Focus: Event organizer tools

### P2.1 - Simple Admin Access
- [x] Environment-based admin password (ADMIN_PASSWORD)
- [x] Basic password prompt for /admin routes
- [x] Session storage for admin access (client-side)
- [x] Admin navigation layout

### P2.2 - Project/Event Management (PRIORITY UPDATED)
- [ ] Project selection screen on admin login (create new / open existing)
- [ ] Project creation with name, description, date
- [ ] Project switching and management interface
- [ ] Project-scoped data isolation (codes, attendees, redemptions)
- [x] CSV upload for codes (drag-n-drop) - needs project scoping
- [x] CSV upload for attendee lists - needs project scoping
- [x] Data validation and error reporting

### P2.3 - Real-time Dashboard
- [x] Live redemption counter
- [x] Recent redemptions feed
- [x] Code usage statistics
- [x] Export redemption logs

### P2.4 - Code Pool Management
- [x] View all codes (used/unused) - needs project scoping
- [ ] Carry forward unused codes between projects
- [x] Bulk operations UI - needs project scoping
- [ ] Project data cleanup/deletion functionality

================================================================================

## Phase 3: Multi-Event Support (Week 5) 🎯
Focus: Scale to multiple events

### P3.1 - Event Routing (MOVED TO PHASE 2)
- [ ] Dynamic routes per project/event → MOVED TO P2.2
- [ ] Event-specific branding/config
- [ ] Event switching for admins → MOVED TO P2.2

### P3.2 - Advanced Features
- [ ] QR code generation for events
- [ ] Email notifications (optional)
- [ ] Bulk invite sending
- [ ] Event templates

### P3.3 - Security Hardening
- [ ] Rate limiting
- [ ] Comprehensive Firestore rules
- [ ] Input sanitization
- [ ] CAPTCHA for suspicious activity
- [ ] Consider upgrading admin auth (if multi-event complexity demands it)

================================================================================

## Phase 4: Ambassador Platform (Week 6) 🌍
Focus: Multi-tenant capabilities

### P4.1 - Multi-Ambassador Support
- [ ] Organization/chapter management
- [ ] Implement proper auth system (Firebase Auth + role claims)
- [ ] Role-based permissions (ambassador/admin/super-admin)
- [ ] Cross-chapter analytics

### P4.2 - Self-Service Tools
- [ ] Ambassador onboarding flow
- [ ] Documentation site
- [ ] Fork & deploy guide
- [ ] Configuration wizard

### P4.3 - Analytics & Insights
- [ ] Usage analytics dashboard
- [ ] Event performance metrics
- [ ] Code utilization reports
- [ ] Data export tools

================================================================================

## Phase 5: Polish & Scale (Week 7-8) ✨
Focus: Production readiness

### P5.1 - Performance
- [ ] Implement caching strategies
- [ ] Optimize bundle size
- [ ] Image optimization
- [ ] Database indexes

### P5.2 - Testing & Quality
- [ ] Unit test coverage (>80%)
- [ ] E2E test suite
- [ ] Load testing
- [ ] Security audit

### P5.3 - Documentation
- [ ] API documentation
- [ ] Deployment guides
- [ ] Troubleshooting guides
- [ ] Video tutorials

### P5.4 - Advanced Features
- [ ] Webhooks for integrations
- [ ] API for external systems
- [ ] Advanced analytics
- [ ] A/B testing framework

================================================================================

## Technical Debt & Maintenance 🔧
Ongoing tasks throughout development:

- [ ] Regular dependency updates
- [ ] Security patches
- [ ] Performance monitoring
- [ ] User feedback incorporation
- [ ] Documentation updates

================================================================================

## Progress Tracking
Last Updated: August 21, 2025
Current Phase: Phase 2 Admin Dashboard → Project-Based Architecture Implementation
Blockers: Need to implement project selection before continuing with existing admin features

Notes:
- Phase 1 MVP: ✅ COMPLETED (core redemption flow working)
- Phase 2 Admin Dashboard: 🚧 75% COMPLETE (major functionality working)
- CSV upload/download working for both codes and attendees
- Real-time dashboard with live stats and filtering
- **Auth Simplification Decision**: Removed complex Firebase Auth for Phase 2
  - Attendees already "auth" via name selection + email verification
  - Admin access simplified to environment password for faster iteration
  - Complex auth/roles deferred to Phase 4 (multi-tenant needs)
- **NEW: Project-Based Architecture Decision**: 
  - Admin sees project selection screen on login (create new / open existing)
  - All data (codes, attendees, redemptions) scoped to specific projects
  - Natural data isolation solves cleanup and multi-hackathon organization
  - Moves multi-event support from Phase 3 to Phase 2 priority
- Firebase deployment ready (admin dashboard functional)

## Recent Accomplishments (Phase 2)
- Full admin dashboard with navigation and layout
- CSV upload system for codes and attendees with validation
- Real-time code management with usage tracking
- Export functionality for redemption data
- Dashboard statistics and filtering
- API endpoints fully functional with proper error handling
- Fixed parsing logic and Firestore integration issues
- Resolved CSV upload import errors (parseCsvFromString → parseCodesCSV/parseAttendeesCSV)
- Fixed codes fetch API with proper null safety and collection initialization
- Improved error handling and debugging across admin routes

## Next Steps (Project-Based Architecture)
1. **Immediate Priority**: Project selection screen on admin login
   - Create/Open existing project interface
   - Project creation form (name, description, date)
   - Project management (edit, delete, archive)

2. **Data Migration**: Update all existing functionality to be project-scoped
   - Add projectId to all Firestore collections (codes, attendees, redemptions)
   - Update all API endpoints to filter by projectId
   - Update admin dashboard to show project-specific data

3. **User Experience**: Update redemption flow
   - Project selection or slug-based routing for attendees
   - Update hardcoded 'sample-event-1' eventId throughout codebase

4. **Natural Benefits**: This architecture provides
   - Built-in data cleanup (delete entire projects)
   - Clear organization for different hackathons
   - Scalable foundation for Phase 3+ features
