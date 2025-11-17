
import React, { useState } from 'react';
import * as apiClient from '../services/apiClient';
import { User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onShowSignUp: () => void;
  registrationSuccessMessage?: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onShowSignUp, registrationSuccessMessage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
        const result = await apiClient.login(email, password);
        if (result.success && result.user) {
            onLogin(result.user);
        } else {
            setError(result.message);
        }
    } catch (err) {
        setError('An unexpected error occurred. Please try again.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#0C0D0F] text-white min-h-screen font-sans flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-sm text-center">
        <div className="mb-8">
            <h1 className="text-5xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8]">
                RELOOK
            </h1>
            <p className="text-gray-400 mt-2">Your smart memory inbox.</p>
        </div>
        
        {registrationSuccessMessage && (
            <div className="p-3 mb-4 bg-green-500/20 border border-green-500/30 rounded-lg text-sm text-green-300 animate-fade-in">
                {registrationSuccessMessage}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-3 bg-[#1a1b1e] border border-white/10 rounded-lg focus:ring-2 focus:ring-[#E6F0C6] focus:outline-none transition"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-3 bg-[#1a1b1e] border border-white/10 rounded-lg focus:ring-2 focus:ring-[#E6F0C6] focus:outline-none transition"
              required
              disabled={isLoading}
            />
          </div>
          
          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center space-x-2 font-bold py-3 px-4 rounded-full bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8] text-black hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <div className="mt-6">
            <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <button onClick={onShowSignUp} className="font-semibold text-[#E6F0C6] hover:underline">
                    Sign up
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
