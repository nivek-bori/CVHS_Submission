// DATABASE

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          tokens: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          tokens?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          tokens?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export interface User {
  id: string;
  email: string;
  tokens: number;
  created_at: string;
  updated_at: string;
}

// TODO: add in
export interface Location {
  id: string;
  ll_position: { lat: number; lng: number }; // data: ll_position: { lat: -33.8568, lng: 151.2153 },
  name: string;
  description: string;
}

export interface Rating {
  id: string;
  name: string;
  description: string
  time: string;
  rating: number;
}

// Additional

export interface SearchParams {
  searchParams: { [key: string]: string | string[] | undefined };
}

export type Role = 'admin' | 'user' | 'guest';
