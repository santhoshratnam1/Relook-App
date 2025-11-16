import React from 'react';
import { SparklesIcon } from '../components/IconComponents';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd handle username/password validation here.
    onLogin();
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
        
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 bg-[#1a1b1e] border border-white/10 rounded-lg focus:ring-2 focus:ring-[#E6F0C6] focus:outline-none transition"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 bg-[#1a1b1e] border border-white/10 rounded-lg focus:ring-2 focus:ring-[#E6F0C6] focus:outline-none transition"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center items-center space-x-2 font-bold py-3 px-4 rounded-full bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8] text-black hover:opacity-90 transition-opacity"
          >
            <span>Log In</span>
          </button>
        </form>

        <div className="mt-6">
            <p className="text-sm text-gray-500">
                Don't have an account? <a href="#" className="font-semibold text-[#E6F0C6] hover:underline">Sign up</a>
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;