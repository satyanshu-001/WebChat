import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Loader2, MessageCircle, Zap, Shield } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const { login, isLoggingIn } = useAuthStore()

  const handleSubmit = (e) => {
    e.preventDefault()
    login(formData)
  }

  return (
    <div className="min-h-screen animated-bg flex">
      {/* Left panel - decorative */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* floating orbs */}
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-pink-500/10 blur-3xl" />

        <div className="relative z-10 text-center space-y-8 max-w-lg">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center glow-purple">
              <MessageCircle className="text-white" size={40} />
            </div>
          </div>

          <div>
            <h1 className="text-5xl font-bold gradient-text mb-4">Chatify</h1>
            <p className="text-slate-400 text-xl leading-relaxed">
              Real-time conversations, instantly delivered.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-col gap-3">
            {[
              { icon: Zap, text: 'Instant message delivery via Socket.IO' },
              { icon: Shield, text: 'Secure JWT authentication' },
              { icon: MessageCircle, text: 'Share images in conversations' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/30 to-pink-500/30 flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-violet-400" />
                </div>
                <span className="text-slate-300 text-sm">{text}</span>
              </div>
            ))}
          </div>

          {/* Animated message preview */}
          <div className="surface p-4 space-y-3 text-left">
            <div className="flex items-end gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex-shrink-0" />
              <div className="bg-violet-500/20 rounded-2xl rounded-bl-sm px-4 py-2 max-w-xs">
                <p className="text-sm text-slate-200">Hey! Just joined Chatify 👋</p>
                <p className="text-xs text-slate-500 mt-1">9:41 AM</p>
              </div>
            </div>
            <div className="flex items-end gap-2 flex-row-reverse">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex-shrink-0" />
              <div className="bg-pink-500/20 rounded-2xl rounded-br-sm px-4 py-2 max-w-xs">
                <p className="text-sm text-slate-200">This is so fast! ⚡</p>
                <p className="text-xs text-slate-500 mt-1">9:41 AM</p>
              </div>
            </div>
            <div className="flex items-center gap-2 pl-10">
              <div className="bg-white/5 rounded-2xl px-4 py-2">
                <div className="flex gap-1">
                  <div className="typing-dot w-2 h-2 rounded-full bg-violet-400" />
                  <div className="typing-dot w-2 h-2 rounded-full bg-violet-400" />
                  <div className="typing-dot w-2 h-2 rounded-full bg-violet-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center glow-purple">
                <MessageCircle className="text-white" size={32} />
              </div>
            </div>
            <h1 className="text-3xl font-bold gradient-text">Chatify</h1>
          </div>

          <div className="surface p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Welcome back</h2>
              <p className="text-slate-400 mt-1">Sign in to continue chatting</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="••••••••"
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
              </div>

              <button type="submit" className="btn-chatify mt-2" disabled={isLoggingIn}>
                {isLoggingIn
                  ? <span className="flex items-center justify-center gap-2"><Loader2 size={18} className="animate-spin" /> Signing in...</span>
                  : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-slate-400 text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage