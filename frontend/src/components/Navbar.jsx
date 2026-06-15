import { Link } from 'react-router-dom'
import { MessageCircle, User, LogOut } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'

const Navbar = () => {
  const { authUser, logout } = useAuthStore()

  return (
    <header className="border-b border-white/5 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
            <MessageCircle size={16} className="text-white" />
          </div>
          <span className="font-bold gradient-text text-lg">Chatify</span>
        </Link>

        {authUser && (
          <div className="flex items-center gap-2">
            <Link
              to="/profile"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors text-slate-300 hover:text-white text-sm"
            >
              <User size={15} />
              <span className="hidden sm:block">Profile</span>
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors text-slate-400 hover:text-white text-sm"
            >
              <LogOut size={15} />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar