export class AuthService {
  private static readonly ADMIN_USERNAME = 'admin';
  // hashed password for 'admin' using SHA-256
  private static readonly ADMIN_PASSWORD_HASH = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918';
  private static readonly SESSION_KEY = 'curriculum_session_token';
  
  // generate a random session token
  private static generateSessionToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  
  // hash password using Web Crypto API (SHA-256)
  private static async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // validate and authenticate user
  public static async authenticate(username: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      // input validation
      if (!username || !password) {
        return { success: false, error: 'Username and password are required' };
      }
      
      // sanitize inputs
      const cleanUsername = username.trim().toLowerCase();
      const cleanPassword = password.trim();
      
      // check username
      if (cleanUsername !== this.ADMIN_USERNAME) {
        return { success: false, error: 'Invalid credentials' };
      }
      
      // hash the provided password
      const passwordHash = await this.hashPassword(cleanPassword);
      
      // compare with stored hash
      if (passwordHash !== this.ADMIN_PASSWORD_HASH) {
        return { success: false, error: 'Invalid credentials' };
      }
      
      // generate session token
      const token = this.generateSessionToken();
      sessionStorage.setItem(this.SESSION_KEY, token);
      
      return { success: true, token };
    } catch (error) {
      console.error('Authentication error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }
  
  // check if user is authenticated
  public static isAuthenticated(): boolean {
    return !!sessionStorage.getItem(this.SESSION_KEY);
  }
  
  // logout
  public static logout(): void {
    sessionStorage.removeItem(this.SESSION_KEY);
  }
  
  // get session token
  public static getSessionToken(): string | null {
    return sessionStorage.getItem(this.SESSION_KEY);
  }
}