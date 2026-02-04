
import React from 'react';

export type UserRole = 'provider' | 'receiver' | 'volunteer' | 'super_admin' | 'admin_manager' | null;

export type DeliveryMethod = 'pickup' | 'delivery' | 'both';

export interface PointRule {
  action: string;
  points: number;
  description?: string;
  icon?: string;
}

export interface SocialTier {
  id: string;
  name: string;
  minPoints: number;
  benefits: string[];
  color: string;
  icon?: string;
}

export interface SocialSystemConfig {
  tiers: SocialTier[];
  rules: PointRule[];
}

export interface SocialImpactData {
  totalPoints: number;
  co2Saved: number; // kg
  waterSaved: number; // liter
  landSaved: number; // m2
  wasteReduction: number; // kg equivalent
  level: string; // Pemula, Aktif, Expert, etc
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  quantity: string; // Misal: "10 Pcs"
  initialQuantity: number; // Jumlah awal angka
  currentQuantity: number; // Jumlah sekarang angka
  minQuantity?: number; // Minimal ambil
  maxQuantity?: number; // Maksimal ambil
  expiryTime: string;
  createdAt: string; // Waktu pembuatan
  distributionStart?: string;
  distributionEnd?: string;
  imageUrl: string;
  providerName: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  status: 'available' | 'claimed' | 'delivered' | 'blocked' | 'under_review';
  deliveryMethod: DeliveryMethod;
  aiVerification?: {
    isEdible: boolean;
    reason: string;
    halalScore: number;
    ingredients?: string[];
    madeTime?: string;
    storageLocation?: string;
  };
  socialImpact?: SocialImpactData;
}

export interface ClaimHistoryItem {
  id: string;
  foodName: string;
  providerName: string;
  date: string;
  status: 'active' | 'completed' | 'cancelled'; 
  rating?: number; 
  review?: string;
  reviewMedia?: string[]; // Added: Foto ulasan
  isReported?: boolean;
  reportReason?: string; // Added
  reportDescription?: string; // Added
  reportEvidence?: string; // Added: Foto bukti laporan
  imageUrl: string;
  uniqueCode?: string;
  claimedQuantity?: string;
  deliveryMethod?: DeliveryMethod;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  distributionHours?: {
    start: string;
    end: string;
  };
  description?: string;
  courierName?: string;
  courierStatus?: 'assigning' | 'picking_up' | 'delivering' | 'completed';
}

export interface ProviderOrder {
  id: string;
  foodName: string;
  description: string;
  quantity: string;
  imageUrl: string;
  status: 'claimed' | 'pickup' | 'delivery' | 'completed' | 'cancelled';
  deliveryMethod: DeliveryMethod;
  receiver: {
    name: string;
    avatar: string; 
    phone: string;
  };
  courier?: {
    name: string;
    avatar: string;
    phone: string;
  };
  timestamps: {
    claimedAt: string;
    pickedUpAt?: string; 
    completedAt?: string; 
  };
  rating?: {
    stars: number;
    comment: string;
    mediaUrls?: string[];
  };
  report?: {
    issue: string;
    description: string;
    isUrgent: boolean;
  };
}

export interface SavedItem {
  id: string;
  name: string;
  provider: string;
  image: string;
  status: 'available' | 'claimed';
}

export interface Address {
  id: string;
  label: string;
  fullAddress: string;
  receiverName: string;
  phone: string;
  isPrimary: boolean;
}

export interface FAQItem {
  id?: string; 
  question: string;
  answer: string;
  category?: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'report' | 'appeal';
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  priority?: 'high' | 'medium' | 'low';
  targetRole?: string; 
}

export interface Report {
  id: string;
  orderId?: string; 
  foodName?: string; 
  title: string;
  description: string;
  date: string;
  status: 'new' | 'handled' | 'investigating' | 'resolved' | 'dismissed';
  reporter: string;
  isUrgent?: boolean; 
  target?: string;
  type?: 'quality' | 'behavior';
  category?: string; 
  evidenceUrl?: string; 
  priority?: 'high' | 'medium' | 'low';
}

export interface Review {
  id: string;
  orderId?: string; 
  foodName?: string; 
  user: string;
  rating: number;
  comment: string;
  date: string;
  mediaUrls?: string[]; 
}

export interface Quote {
  text: string;
  author: string;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  leftAddon?: React.ReactNode;
  rightElement?: React.ReactNode;
  containerClassName?: string;
  labelClassName?: string;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
}

export interface UserData {
  id: string;
  name: string;
  role: string;
  email: string;
  status: 'active' | 'suspended' | 'pending';
  points: number;
  joinDate: string;
  phone?: string; 
  address?: string; 
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin_manager';
  permissions: string[];
  status: 'active' | 'suspended';
  lastLogin: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface DistributionTask {
    id: string;
    volunteer: string;
    from: string;
    to: string;
    status: 'picking_up' | 'delivering' | 'completed' | 'cancelled' | 'pending';
    startTime: string;
    priority?: 'normal' | 'urgent';
    distance: string;
}

export interface Banner {
    id: string;
    title: string;
    status: 'active' | 'inactive';
    impressions: number;
    imageUrl: string;
    description?: string;
}

export interface BroadcastMessage {
  id: string;
  title: string;
  content: string;
  target: string;
  status: 'sent' | 'draft';
  sentAt: string;
  readCount: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string; 
  image?: string; 
  description: string;
  role: UserRole | 'all'; 
  minPoints: number; 
  awardedTo?: number;
}

export interface VolunteerTask {
  id: string | number; 
  from: string;
  to: string;
  distance: number;
  distanceStr: string;
  items: string;
  status: 'available' | 'active' | 'history';
  stage: 'pickup' | 'dropoff';
  imageUrl?: string;
  description?: string;
  ingredients?: string[];
  foodCondition?: number; 
  donorLocation?: { lat: number; lng: number; address: string };
  receiverLocation?: { lat: number; lng: number; address: string };
  donorOpenHours?: string;
  receiverDistanceStr?: string; 
  quantity?: string;
  donorPhone?: string;
  receiverPhone?: string;
  points?: number;
  claimId?: string; 
}

export interface RankLevel {
  id: number;
  name: string;
  minPoints: number;
  description: string;
  icon?: string;
}

export interface DailyQuest {
  id: number;
  title: string;
  target: number;
  current: number;
  reward: number;
  completed: boolean;
}

export interface LeaderboardItem {
  id: number; 
  name: string; 
  points: number; 
  rank: number; 
  avatar: string;
}
