export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateUserDto = Pick<User, 'email' | 'firstName' | 'lastName'> & {
  password: string;
};

export type UserProfile = Omit<User, 'createdAt' | 'updatedAt'>;
