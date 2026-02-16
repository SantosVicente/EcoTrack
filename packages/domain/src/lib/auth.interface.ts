export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  // Nota: O token JWT será enviado via Cookie HttpOnly,
}

export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}
