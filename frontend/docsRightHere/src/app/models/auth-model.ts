export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse{
  accesToken: string;
  expiresIn: number;
}
