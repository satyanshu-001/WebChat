import { useState, useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import { Image, Send, X, Smile } from 'lucide-react'
import toast from 'react-hot-toast'

const MessageInput = () => {
  const [text, setText] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const fileRef = useRef(null)
  const { sendMessage } = useChatStore()

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file?.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImagePreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!text.trim() && !imagePreview) return
    await sendMessage({ text: text.trim(), image: imagePreview })
    setText('')
    setImagePreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend(e)
    }
  }

  return (
    <div className="p-3 border-t border-white/5 flex-shrink-0">
      {/* Image preview */}
      {imagePreview && (
        <div className="mb-3 relative inline-block">
          <img src={imagePreview} alt="preview" className="h-20 w-20 object-cover rounded-xl border border-white/10" />
          <button
            onClick={removeImage}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center shadow-lg"
          >
            <X size={12} className="text-white" />
          </button>
        </div>
      )}

      <form onSubmit={handleSend} className="flex items-end gap-2">
        {/* Image attach */}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className={`w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center transition-all ${
            imagePreview
              ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
              : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-transparent'
          }`}
        >
          <Image size={18} />
        </button>
        <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleImage} />

        {/* Text input */}
        <div className="flex-1 relative">
          <textarea
            rows={1}
            className="input-chatify resize-none py-2.5 pr-10 min-h-[40px] max-h-32"
            placeholder="Type a message... (Enter to send)"
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'
            }}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Send */}
        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className={`w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center transition-all ${
            text.trim() || imagePreview
              ? 'bg-gradient-to-br from-violet-500 to-pink-500 text-white glow-purple hover:opacity-90'
              : 'bg-white/5 text-slate-600 cursor-not-allowed'
          }`}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  )
}

export default MessageInput