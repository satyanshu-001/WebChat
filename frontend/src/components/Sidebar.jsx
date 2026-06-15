import { useEffect, useState } from 'react'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore'
import { Search, Users, MessageCircle, LogOut, User } from 'lucide-react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore()
  const { authUser, logout, onlineUsers } = useAuthStore()
  const [search, setSearch] = useState('')
  const [onlineOnly, setOnlineOnly] = useState(false)

  useEffect(() => { getUsers() }, [getUsers])

  const filtered = users
    .filter(u => onlineOnly ? onlineUsers.includes(u._id) : true)
    .filter(u => u.fullName.toLowerCase().includes(search.toLowerCase()))

  return (
    <aside className="w-72 lg:w-80 flex flex-col border-r border-white/5 bg-black/20 backdrop-blur-sm flex-shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
              <MessageCircle size={16} className="text-white" />
            </div>
            <span className="font-bold gradient-text text-lg">Chatify</span>
          </div>
          <div className="flex items-center gap-1">
            <Link to="/profile" className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              <User size={15} />
            </Link>
            <button onClick={logout} className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              <LogOut size={15} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search people..."
            className="input-chatify pl-8 text-sm py-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Online filter */}
        <button
          onClick={() => setOnlineOnly(!onlineOnly)}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${
            onlineOnly
              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
              : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-transparent'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${onlineOnly ? 'bg-green-400' : 'bg-slate-600'}`} />
          Online only
          <span className="ml-auto text-xs opacity-60">{onlineUsers.length - 1} online</span>
        </button>
      </div>

      {/* User list */}
      <div className="flex-1 overflow-y-auto py-2">
        {isUsersLoading ? (
          <div className="space-y-2 p-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl animate-pulse">
                <div className="w-11 h-11 rounded-full bg-white/5 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-white/5 rounded w-2/3" />
                  <div className="h-2 bg-white/5 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2 text-slate-500">
            <Users size={28} className="opacity-40" />
            <p className="text-sm">{onlineOnly ? 'No one online right now' : 'No users found'}</p>
          </div>
        ) : (
          filtered.map((user) => {
            const isOnline = onlineUsers.includes(user._id)
            const isSelected = selectedUser?._id === user._id
            return (
              <button
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`w-full flex items-center gap-3 px-3 py-3 mx-1 rounded-xl transition-all text-left group ${
                  isSelected
                    ? 'bg-gradient-to-r from-violet-500/20 to-pink-500/10 border border-violet-500/20'
                    : 'hover:bg-white/5 border border-transparent'
                }`}
                style={{ width: 'calc(100% - 8px)' }}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-11 h-11 rounded-full overflow-hidden">
                    <img
                      src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=8b5cf6&color=fff`}
                      alt={user.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0f0f1a] online-badge" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`font-medium text-sm truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                    {user.fullName}
                  </p>
                  <p className={`text-xs truncate ${isOnline ? 'text-green-400' : 'text-slate-500'}`}>
                    {isOnline ? '● Online' : '○ Offline'}
                  </p>
                </div>
              </button>
            )
          })
        )}
      </div>

      {/* Current user footer */}
      <div className="p-3 border-t border-white/5">
        <div className="flex items-center gap-3 px-2">
          <div className="relative">
            <div className="w-9 h-9 rounded-full overflow-hidden">
              <img
                src={authUser?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser?.fullName || 'U')}&background=8b5cf6&color=fff`}
                alt="You"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#0f0f1a]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white truncate">{authUser?.fullName}</p>
            <p className="text-xs text-green-400">● You</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar