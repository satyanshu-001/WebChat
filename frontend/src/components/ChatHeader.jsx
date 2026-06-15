import { X, Phone, Video } from 'lucide-react'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore'

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore()
  const { onlineUsers } = useAuthStore()
  const isOnline = onlineUsers.includes(selectedUser._id)

  return (
    <div className="px-4 py-3 border-b border-white/5 bg-black/10 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-violet-500/20">
            <img
              src={selectedUser.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.fullName)}&background=8b5cf6&color=fff`}
              alt={selectedUser.fullName}
              className="w-full h-full object-cover"
            />
          </div>
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0f0f1a]" />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-white text-sm">{selectedUser.fullName}</h3>
          <p className={`text-xs ${isOnline ? 'text-green-400' : 'text-slate-500'}`}>
            {isOnline ? '● Online' : '○ Offline'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button className="w-9 h-9 rounded-xl hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors" title="Voice call (coming soon)">
          <Phone size={16} />
        </button>
        <button className="w-9 h-9 rounded-xl hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors" title="Video call (coming soon)">
          <Video size={16} />
        </button>
        <button
          onClick={() => setSelectedUser(null)}
          className="w-9 h-9 rounded-xl hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

export default ChatHeader