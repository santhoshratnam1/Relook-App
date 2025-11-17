
import React, { useState } from 'react';
import * as apiClient from '../services/apiClient';

interface SignUpPageProps {
  onSignUpSuccess: () => void;
  onShowLogin: () => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onSignUpSuccess, onShowLogin }) => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const passwordValid = password.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!passwordValid) {
        setError('Password must be at least 8 characters long.');
        return;
    }
    setIsLoading(true);
    
    try {
        const result = await apiClient.register(displayName, email, password);
        if (result.success) {
            onSignUpSuccess();
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
    <div className="bg-[#0C0D0F] text-white min-h-screen font-sans flex flex-col justify-center items-center p-6 animate-fade-in">
      <div className="w-full max-w-sm text-center">
        <div className="mb-8">
            <h1 className="text-5xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8]">
                RELOOK
            </h1>
            <p className="text-gray-400 mt-2">Create your account.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Display Name"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className="w-full p-3 bg-[#1a1b1e] border border-white/10 rounded-lg focus:ring-2 focus:ring-[#E6F0C6] focus:outline-none transition"
              required
              disabled={isLoading}
            />
          </div>
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
            <p className={`text-xs text-left mt-1 px-1 ${password.length > 0 ? (passwordValid ? 'text-green-400' : 'text-red-400') : 'text-gray-500'}`}>
                Must be at least 8 characters.
            </p>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
          
          <button
            type="submit"
            disabled={isLoading || !displayName || !email || !passwordValid}
            className="w-full flex justify-center items-center space-x-2 font-bold py-3 px-4 rounded-full bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8] text-black hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6">
            <p className="text-sm text-gray-500">
                Already have an account?{' '}
                <button onClick={onShowLogin} className="font-semibold text-[#E6F0C6] hover:underline">
                    Log in
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
