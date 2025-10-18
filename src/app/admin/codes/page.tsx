"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Code {
  id: string;
  url: string;
  isUsed: boolean;
  redeemedBy?: string;
  redeemedAt?: string;
}

/**
 * Admin page for managing Cursor credit codes
 */
export default function AdminCodes() {
  const [codes, setCodes] = useState<Code[]>([]);
  const [filteredCodes, setFilteredCodes] = useState<Code[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "used" | "unused">("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCodes();
  }, []);

  // Filter codes based on status and search term
  useEffect(() => {
    let filtered = codes;

    // Apply status filter
    if (filter === "used") {
      filtered = filtered.filter((code) => code.isUsed);
    } else if (filter === "unused") {
      filtered = filtered.filter((code) => !code.isUsed);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (code) =>
          code.url.toLowerCase().includes(term) ||
          code.redeemedBy?.toLowerCase().includes(term) ||
          code.id.toLowerCase().includes(term)
      );
    }

    setFilteredCodes(filtered);
  }, [codes, filter, searchTerm]);

  const fetchCodes = async () => {
    try {
      // Get selected project from localStorage
      const selectedProjectData = localStorage.getItem(
        "admin_selected_project"
      );
      if (!selectedProjectData) {
        setError("No project selected");
        setIsLoading(false);
        return;
      }

      const selectedProject = JSON.parse(selectedProjectData);
      const response = await fetch(
        `/api/admin/codes?projectId=${selectedProject.id}`
      );
      if (!response.ok) throw new Error("Failed to fetch codes");

      const data = await response.json();
      setCodes(data.codes);
      setError("");
    } catch (err) {
      setError("Failed to load codes");
      console.error("Codes fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const exportCodes = () => {
    const csvData = [
      ["Code URL", "Status", "Redeemed By", "Redeemed At"],
      ...filteredCodes.map((code) => [
        code.url,
        code.isUsed ? "Used" : "Available",
        code.redeemedBy || "",
        code.redeemedAt ? new Date(code.redeemedAt).toLocaleString() : "",
      ]),
    ];

    const csvContent = csvData
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `codes-${filter}-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={fetchCodes} />;
  }

  const usedCount = codes.filter((c) => c.isUsed).length;
  const unusedCount = codes.length - usedCount;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Code Management</h1>
        <Button onClick={exportCodes}>
          Export{" "}
          {filter === "all"
            ? "All"
            : filter.charAt(0).toUpperCase() + filter.slice(1)}{" "}
          Codes
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="text-3xl font-semibold text-green-400">
              {unusedCount}
            </div>
            <p className="text-sm text-muted-foreground">Available Codes</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="text-3xl font-semibold text-blue-400">
              {usedCount}
            </div>
            <p className="text-sm text-muted-foreground">Redeemed Codes</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="text-3xl font-semibold">{codes.length}</div>
            <p className="text-sm text-muted-foreground">Total Codes</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All ({codes.length})
            </Button>
            <Button
              variant={filter === "unused" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("unused")}
            >
              Available ({unusedCount})
            </Button>
            <Button
              variant={filter === "used" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("used")}
            >
              Redeemed ({usedCount})
            </Button>
          </div>

          <Input
            placeholder="Search codes, redeemed by, or code ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </CardContent>
      </Card>

      {/* Codes Table */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Codes ({filteredCodes.length})</CardTitle>
          <CardDescription className="text-muted-foreground">
            {filter === "all" && "All codes in the system"}
            {filter === "used" && "Codes that have been redeemed"}
            {filter === "unused" && "Codes available for redemption"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCodes.length > 0 ? (
            <div className="space-y-2">
              {filteredCodes.map((code) => (
                <div
                  key={code.id}
                  className={`p-3 rounded-lg border ${
                    code.isUsed
                      ? "bg-secondary border-border"
                      : "bg-green-500/10 border-green-500/20"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <a
                          href={code.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 font-mono text-sm underline underline-offset-2"
                        >
                          {code.url}
                        </a>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            code.isUsed
                              ? "bg-secondary text-muted-foreground border border-border"
                              : "bg-green-500/10 text-green-400 border border-green-500/20"
                          }`}
                        >
                          {code.isUsed ? "Used" : "Available"}
                        </span>
                      </div>

                      {code.isUsed && code.redeemedBy && (
                        <div className="mt-1 text-sm text-muted-foreground">
                          Redeemed by:{" "}
                          <span className="font-medium text-foreground">
                            {code.redeemedBy}
                          </span>
                          {code.redeemedAt && (
                            <span className="ml-2">
                              on {new Date(code.redeemedAt).toLocaleString()}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? "No codes match your search." : "No codes found."}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Code Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse border-border bg-card">
            <CardContent className="pt-6">
              <div className="h-8 bg-secondary rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-secondary rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ErrorState({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Code Management</h1>
      <Card className="border-border bg-card">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-destructive">{error}</p>
            <Button onClick={onRetry} className="mt-4">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
