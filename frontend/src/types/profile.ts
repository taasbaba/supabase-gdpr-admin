export type Role = "manager" | "leader" | "member";

export interface UserProfile {
  id: string;
  full_name: string | null;
  role: Role;
  team_id: number | null;
  created_at: string | null;
  updated_at: string | null;
}
