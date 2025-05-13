import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtVerify, JWTPayload } from 'jose';

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

const SUPABASE_JWT_ISSUER = getRequiredEnv('SUPABASE_JWT_ISSUER');
const SUPABASE_JWT_SECRET = getRequiredEnv('SUPABASE_JWT_SECRET');

@Injectable()
export class SupabaseAuthService {
  async verifyToken(token: string): Promise<JWTPayload> {
    try {
      const encoder = new TextEncoder();
      const secretKey = encoder.encode(SUPABASE_JWT_SECRET);

      const { payload } = await jwtVerify(token, secretKey, {
        issuer: SUPABASE_JWT_ISSUER,
      });
      
      return payload;
    } catch (err) {
      console.error("[Auth] Token verification failed:", err);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}