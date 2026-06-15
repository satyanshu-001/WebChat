import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Camera, User, Mail, ArrowLeft, Calendar, CheckCircle2, Loader2 } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore()
  const [selectedImg, setSelectedImg] = useState(null)

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async () => {
      setSelectedImg(reader.result)
      await updateProfile({ profilePic: reader.result })
    }
  }

  return (
    <div className="min-h-screen animated-bg">
      {/* background orbs */}
      <div className="fixed top-0 right-0 w-96 h-96 rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-96 h-96 rounded-full bg-pink-500/5 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="border-b border-white/5 bg-black/20 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
            <ArrowLeft size={18} className="text-slate-300" />
          </Link>
          <div>
            <h1 className="font-bold text-white text-lg">Profile</h1>
            <p className="text-xs text-slate-500">Manage your account</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 relative z-10">
        {/* Avatar card */}
        <div className="surface p-8 flex flex-col items-center gap-4">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-violet-500/30 glow-purple">
              <img
                src={selectedImg || authUser?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser?.fullName || 'U')}&background=8b5cf6&color=fff`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <label
              htmlFor="avatar-upload"
              className={`absolute inset-0 rounded-full flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer ${isUpdatingProfile ? 'opacity-100 animate-pulse' : ''}`}
            >
              {isUpdatingProfile
                ? <Loader2 size={24} className="text-white animate-spin" />
                : <Camera size={24} className="text-white" />}
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
              />
            </label>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">{authUser?.fullName}</h2>
            <p className="text-slate-400 text-sm mt-1">{authUser?.email}</p>
          </div>

          <p className="text-xs text-slate-500">
            {isUpdatingProfile ? 'Uploading photo...' : 'Hover over photo to change'}
          </p>
        </div>

        {/* Info card */}
        <div className="surface p-6 space-y-4">
          <h3 className="font-semibold text-white text-sm uppercase tracking-widest text-slate-400">Account Details</h3>

          {[
            { icon: User, label: 'Full Name', value: authUser?.fullName },
            { icon: Mail, label: 'Email', value: authUser?.email },
            {
              icon: Calendar,
              label: 'Member Since',
              value: new Date(authUser?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-violet-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
                <p className="text-white font-medium truncate">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Status card */}
        <div className="surface p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={20} className="text-green-400" />
              <div>
                <p className="text-white font-medium">Account Active</p>
                <p className="text-xs text-slate-500">Your account is in good standing</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage