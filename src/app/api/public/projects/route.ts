import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

/**
 * GET /api/public/projects
 *
 * Public endpoint to fetch active projects for landing page
 */
export async function GET() {
  try {
    const projectsRef = collection(db, "projects");
    const projectsSnapshot = await getDocs(
      query(projectsRef, where("status", "==", "active"))
    );

    const projects = projectsSnapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          description: data.description || null,
          slug: data.slug,
          eventDate: data.eventDate?.toDate?.()?.toISOString() || null,
          location: data.location || null,
        };
      })
      // Sort by event date in-memory (desc = most recent first)
      .sort((a, b) => {
        if (!a.eventDate) return 1;
        if (!b.eventDate) return -1;
        return (
          new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
        );
      });

    return NextResponse.json({
      success: true,
      data: { projects },
    });
  } catch (error) {
    console.error("Public projects fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
