/**
 * Landing page for Cursor Credits Distribution
 *
 * Dynamically displays active events and allows attendees to claim credits.
 * Fetches project data from Firestore to show current events.
 */

import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

interface Project {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  eventDate: string | null;
  location: string | null;
}

async function getActiveProjects(): Promise<Project[]> {
  try {
    // Fetch directly from Firestore on server-side for better performance
    const projectsRef = collection(db, "projects");
    const activeQuery = query(projectsRef, where("status", "==", "active"));
    const snapshot = await getDocs(activeQuery);

    const projects: Project[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      
      // Convert Firestore Timestamp to ISO string
      let eventDateStr: string | null = null;
      if (data.eventDate) {
        try {
          // Handle both Timestamp objects and string dates
          if (data.eventDate.toDate) {
            eventDateStr = data.eventDate.toDate().toISOString();
          } else if (typeof data.eventDate === 'string') {
            eventDateStr = data.eventDate;
          }
        } catch (e) {
          console.error('Error converting eventDate:', e);
        }
      }
      
      return {
        id: doc.id,
        name: data.name || "",
        description: data.description || null,
        slug: data.slug || "",
        eventDate: eventDateStr,
        location: data.location || null,
      };
    });

    // Sort by event date (most recent first)
    return projects.sort((a, b) => {
      if (!a.eventDate) return 1;
      if (!b.eventDate) return -1;
      return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime();
    });
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
}

// Revalidate every 60 seconds to keep data fresh
export const revalidate = 60;

function formatEventDate(dateString: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function Home() {
  const projects = await getActiveProjects();
  const primaryProject = projects[0]; // Show the most recent active project

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-24">
        <main className="max-w-2xl mx-auto">
          {/* Hero Section */}
          <div className="mb-16 text-center">
            <h1 className="text-5xl font-semibold tracking-tight mb-6">
              Claim Your Cursor Credits
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Thank you for attending our event! Enter your details below to
              claim your complimentary Cursor credits.
            </p>
          </div>

          {/* Event Info Card */}
          {primaryProject ? (
            <div className="bg-card border border-border rounded-xl p-8 mb-12 hover:border-muted-foreground/20 transition-colors">
              <h2 className="text-2xl font-medium mb-3">
                {primaryProject.name}
              </h2>
              <p className="text-muted-foreground mb-6">
                {primaryProject.location && `${primaryProject.location} • `}
                {formatEventDate(primaryProject.eventDate)}
              </p>

              {primaryProject.description && (
                <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                  {primaryProject.description}
                </p>
              )}

              {/* CTA Button */}
              <a
                href={`/event/${primaryProject.slug}/redeem`}
                className="flex items-center justify-center w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-6 rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
              >
                Start Code Redemption
              </a>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-8 mb-12">
              <p className="text-muted-foreground text-center">
                No active events at the moment. Check back soon!
              </p>
            </div>
          )}

          {/* Info Section */}
          <div className="text-sm text-muted-foreground text-center space-y-2">
            <p>
              Each attendee can claim one code. You&apos;ll need your name and
              email address.
            </p>
            <p>Having trouble? Contact the event organizers for assistance.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
