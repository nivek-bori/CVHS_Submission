// DATABASE
export interface User {
  id: string;
  email: string;
  name: string | null;
  ratings?: Rating[];
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  id: string;
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
  ratings?: Rating[];
  createdAt: string;
  updatedAt: string;
}

export interface Rating {
  id: string;
  user: User;
  userId: string;
  location: Location;
  locationId: string;
  value: number;
  description: string | null;
  time: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

// API ENDPOINTS
export type SignInArgs = {
  email: string;
  password: string;
};

export type SignInRet = {
  status: 'success' | 'error';
  message: string;
  redirectUrl?: string;
};

export type SignUpArgs = {
  email: string;
  password: string;
  name: string;
};

export type SignUpRet = {
  status: 'success' | 'error';
  message: string;
  redirectUrl?: string;
};

export type DeleteMFAArgs = {};

export type DeleteMFARet = {
  status: string;
  message: string;
};

export type ProfileArgs = {};

export type ProfileRet = {
  user: User;
};

export type LocationGetArgs = {};

export type LocationGetRet = {
  status: string;
  message: string;
  redirectUrl?: string;
};

export type LocationCreateArgs = {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
};

export type LocationCreateRet = {
  status: string;
  message: string;
  locationId?: string;
};

export type RatingGetArgs = {};

export type RatingGetRet = {
  status: string;
  message: string;
};

export type RatingCreateArgs = {
  locationId: string;
  rating: number;
  time: Date;
};

export type RatingCreateRet = {
  status: string;
  message: string;
};

// Additional

export type Role = 'admin' | 'user' | 'guest';
