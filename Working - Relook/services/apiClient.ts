
// This file simulates API calls to a backend for authentication.
// In a real application, this would use fetch() to communicate with a server.

// Super simple user storage for demonstration.
// In a real app, NEVER store passwords in plaintext.
const USERS_KEY = 'relook-users';

const getUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveUsers = (users: any[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const register = async (displayName: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
  // Simulate network delay
  await new Promise(res => setTimeout(res, 500));
  
  const users = getUsers();
  const existingUser = users.find((user: any) => user.email.toLowerCase() === email.toLowerCase());

  if (existingUser) {
    return { success: false, message: 'An account with this email already exists.' };
  }

  // Very basic password validation check. A real backend would have more complex rules.
  if (password.length < 8) {
    return { success: false, message: 'Password must be at least 8 characters long.' };
  }

  const newUser = {
    id: `user-${Date.now()}`,
    display_name: displayName,
    email,
    password, // Again, NEVER store plaintext passwords
    avatar_url: `https://picsum.photos/seed/${displayName.replace(/\s/g, '')}/100/100`, // Give a unique avatar
  };

  users.push(newUser);
  saveUsers(users);

  return { success: true, message: 'Registration successful!' };
};

export const login = async (email: string, password: string): Promise<{ success: boolean; message: string; user?: any }> => {
  // Simulate network delay
  await new Promise(res => setTimeout(res, 500));
  
  const users = getUsers();
  const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

  if (!user || user.password !== password) {
    return { success: false, message: 'Invalid email or password.' };
  }

  // Don't send the password back
  const { password: _, ...userToReturn } = user;

  return { success: true, message: 'Login successful!', user: userToReturn };
};
