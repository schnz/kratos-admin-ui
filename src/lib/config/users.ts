// Define user roles
export enum UserRole {
  ADMIN = 'admin',
  VIEWER = 'viewer',
}

export interface UserCredentials {
  username: string;
  password: string;
  role: UserRole;
  displayName: string;
  email: string;
}

export const USERS: UserCredentials[] = [
  {
    username: "admin",
    password: "admin123",
    role: UserRole.ADMIN,
    displayName: "Administrator",
    email: "admin@example.com"
  },
  {
    username: "viewer",
    password: "viewer123",
    role: UserRole.VIEWER,
    displayName: "Viewer User",
    email: "viewer@example.com"
  }
];

/**
 * Find a user by username and password
 * @param username The username to search for
 * @param password The password to verify
 * @returns The user credentials if found, undefined otherwise
 */
export const findUserByCredentials = (
  username: string,
  password: string
): UserCredentials | undefined => {
  return USERS.find(
    (user) => user.username === username && user.password === password
  );
};
