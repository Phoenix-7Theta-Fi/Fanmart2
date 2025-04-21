import { useState, useEffect } from 'react';
import { createClient, type User } from '@/lib/supabase';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'; // Import types

interface AuthProps {
  children: React.ReactNode
}

export function AuthComponent({ children }: AuthProps) {
  const supabase = createClient() // Create client instance
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Basic validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }
    
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })
        if (error) throw error
        setSuccess('Successfully logged in!')
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        })

        console.log('Signup response:', {
          data,
          error,
          user: data?.user,
          session: data?.session
        })

        if (error) throw error

        if (data.user?.identities?.length === 0) {
          setError('This email is already registered. Please try logging in instead.')
          setIsLogin(true)
          return
        }

        setSuccess('Almost there! Please check your email to confirm your account.')
        setIsLogin(true)
      }
    } catch (err: any) {
      console.error('Auth error:', err)
      if (err.message?.includes('weak')) {
        setError('Password is too weak. Please use at least 6 characters with a mix of letters and numbers.')
      } else if (err.message?.includes('email')) {
        setError('Please enter a valid email address.')
      } else if (err.status === 422) {
        setError('Email already registered or invalid signup details. Please try logging in.')
      } else if (err.status === 500) {
        setError('Server error. Please try again in a few minutes.')
      } else {
        setError(err.message || 'Unable to sign up. Please try again.')
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (user) {
    return <>{children}</>
  }

  // Apply UI improvements: gradient background, shadows, black text where requested, refined inputs/buttons
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg border-4 border-black p-8 space-y-6 comic-shadow-hard">
        {/* Title: Black text, bold */}
        <h2 className="comic-title text-4xl font-extrabold text-center mb-8 text-black">
          {isLogin ? '🦸‍♂️ Hero Login' : '✨ New Hero Signup'}
        </h2>

        {/* Alert styling */}
        {success && (
          <div className="bg-green-100 border-2 border-green-600 text-green-800 px-4 py-3 rounded-md relative font-semibold comic-shadow-soft" role="alert">
            <span className="block sm:inline">{success}</span>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border-2 border-red-600 text-red-800 px-4 py-3 rounded-md relative font-semibold comic-shadow-soft" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Form styling: spacing, inputs, button */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-lg font-bold mb-2 text-gray-700">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 focus:border-yellow-400 comic-shadow-soft text-lg text-gray-900"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-lg font-bold mb-2 text-gray-700">
              Password
              {/* Hint text: Black */}
              <span className="block text-sm text-black font-normal mt-1">
                (Min. 6 characters, letters & numbers)
              </span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 focus:border-yellow-400 comic-shadow-soft text-lg text-gray-900"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-br from-cyan-400 to-blue-500 text-white text-xl font-bold py-3 px-4 rounded-md border-2 border-black hover:from-cyan-500 hover:to-blue-600 active:from-cyan-600 active:to-blue-700 transform transition hover:-translate-y-1 active:translate-y-0 comic-shadow-hard focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
          >
            {isLogin ? '🚀 Blast Off!' : '✨ Join the Adventure!'}
          </button>
        </form>

        {/* Toggle button: Black text */}
        <div className="text-center pt-4">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null); // Clear error when switching forms
              setSuccess(null); // Clear success when switching forms
            }}
            className="text-black hover:text-gray-700 font-bold text-lg underline decoration-dotted hover:decoration-solid transition duration-150"
          >
            {isLogin ? 'New here? Create an account!' : 'Got an account? Log in!'}
          </button>
        </div>
      </div>
    </div>
  )
}
