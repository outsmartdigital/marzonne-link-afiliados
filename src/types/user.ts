export type UserType = 'athlete' | 'scout';

export interface AthleteProfile {
  user_id: string;
  user_type: 'athlete';
  user_plan: 'boleiro' | 'profissional' | 'free';
  athlete_name: string;
  athlete_date_birth: string;
  athlete_position: string;
  phone: string;
  athlete_height?: number;
  athlete_weight?: number;
  father_height?: number;
  mother_height?: number;
  guardian_name?: string;
  guardian_phone?: string;
  guardian_date_birth?: string;
  guardian_relation?: string;
  guardian_photo_url?: string;
  athlete_facebook?: string;
  athlete_instagram?: string;
  athlete_tiktok?: string;
  clubs?: { name: string }[];
  photo_url?: string;
  referred_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ScoutProfile {
  user_id: string;
  user_type: 'scout' | 'manager';
  user_plan: 'business' | 'free';
  scout_name: string;
  scout_date_birth: string;
  scout_phone: string;
  scout_role: string;
  photo_url?: string;
  referred_by?: string;
  coupon?: string;
  created_at: string;
  updated_at: string;
}

export type UserProfile = AthleteProfile | ScoutProfile;

export interface AthleteFormData {
  name: string;
  email: string;
  password: string;
  phone: string;
  dateOfBirth: string;
  position: string;
  height?: number;
  weight?: number;
}

export interface ScoutFormData {
  name: string;
  email: string;
  password: string;
  phone: string;
  dateOfBirth: string;
  role: string;
  organization?: string;
}
