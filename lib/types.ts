// User who submits a case
export interface User {
  id: string;
  email: string;
  password: string; // hashed
  name: string;
  phone: string;
  createdAt: string;
}

// Case statuses
export type CaseStatus = 
  | "submitted" 
  | "under_review" 
  | "verified" 
  | "rejected" 
  | "scheduled_for_podcast" 
  | "published";

// Loss types
export type LossType = "money" | "time" | "opportunity" | "meeting" | "other";

// Main case submission
export interface Case {
  id: string;
  userId: string;
  status: CaseStatus;
  
  // Case details
  companyName: string;
  domain: string; // e.g., "E-commerce", "Banking", "Healthcare"
  incidentDate: string;
  description: string;
  lossTypes: LossType[];
  monetaryLoss?: number;
  
  // Supporting evidence
  evidenceFiles?: string[]; // file paths/URLs
  
  // Contact info
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  
  // Verification
  verifiedBy?: string; // admin ID
  verifiedAt?: string;
  rejectionReason?: string;
  
  // Podcast details
  podcastVideoUrl?: string;
  publishedAt?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// Updates/notifications for a case
export interface CaseUpdate {
  id: string;
  caseId: string;
  message: string;
  createdAt: string;
  createdBy: string; // admin ID or system
}

// Admin users (for internal verification)
export interface Admin {
  id: string;
  email: string;
  password: string; // hashed
  name: string;
  role: "admin" | "super_admin";
  createdAt: string;
}

// YouTube channel configuration
export interface YouTubeConfig {
  id: string;
  channelUrl: string;
  featuredVideoId: string; // YouTube video ID
  lastUpdated: string;
}
