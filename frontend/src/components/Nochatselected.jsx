import { useAuthStore } from '../store/useAuthStore'

const NoChatSelected = () => {
  const { authUser, onlineUsers } = useAuthStore()

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-pink-500/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center space-y-6 max-w-sm">
        {/* Animated chat bubbles illustration */}
        <div className="flex justify-center">
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/20 to-pink-500/20 animate-pulse" />
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-violet-500/30 to-pink-500/30 flex items-center justify-center">
              <span className="text-4xl">💬</span>
            </div>
            {/* floating dots */}
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center text-xs text-white font-bold animate-bounce">
              {Math.max(0, onlineUsers.length - 1)}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">
            Hey, {authUser?.fullName?.split(' ')[0]}! 👋
          </h2>
          <p className="text-slate-400 leading-relaxed">
            Pick someone from the sidebar to start a real-time conversation.
          </p>
        </div>

        {/* Stats row */}
        <div className="flex justify-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold gradient-text">{Math.max(0, onlineUsers.length - 1)}</div>
            <div className="text-xs text-slate-500 mt-0.5">online now</div>
          </div>
          <div className="w-px bg-white/10" />
          <div className="text-center">
            <div className="text-2xl font-bold gradient-text">⚡</div>
            <div className="text-xs text-slate-500 mt-0.5">real-time</div>
          </div>
          <div className="w-px bg-white/10" />
          <div className="text-center">
            <div className="text-2xl font-bold gradient-text">🔒</div>
            <div className="text-xs text-slate-500 mt-0.5">secure</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoChatSelected