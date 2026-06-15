import { useState } from 'react'
import { Link } from 'react-router-dom'
import { User, Mail, Lock, Eye, EyeOff, Loader2, MessageCircle } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import toast from 'react-hot-toast'

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' })
  const { signup, isSigningUp } = useAuthStore()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    signup(formData)
  }

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center p-6">
      {/* background orbs */}
      <div className="fixed top-0 left-0 w-96 h-96 rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 rounded-full bg-pink-500/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Logo */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center glow-purple">
              <MessageCircle className="text-white" size={32} />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">Join Chatify</h1>
            <p className="text-slate-400 mt-1">Start chatting in seconds</p>
          </div>
        </div>

        <div className="surface p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  className="input-chatify pl-9"
                  placeholder="Alex Johnson"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  className="input-chatify pl-9"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-chatify pl-9 pr-10"
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* password strength bar */}
              {formData.password && (
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        formData.password.length >= i * 2
                          ? i <= 1 ? 'bg-red-500' : i <= 2 ? 'bg-orange-400' : i <= 3 ? 'bg-yellow-400' : 'bg-green-400'
                          : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            <button type="submit" className="btn-chatify mt-2" disabled={isSigningUp}>
              {isSigningUp
                ? <span className="flex items-center justify-center gap-2"><Loader2 size={18} className="animate-spin" /> Creating account...</span>
                : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupPage