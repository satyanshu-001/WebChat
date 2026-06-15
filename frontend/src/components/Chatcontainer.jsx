import { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore'
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'
import { formatMessageTime, formatDate } from '../lib/utils'

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages } = useChatStore()
  const { authUser } = useAuthStore()
  const msgEndRef = useRef(null)

  useEffect(() => {
    getMessages(selectedUser._id)
    subscribeToMessages()
    return () => unsubscribeFromMessages()
  }, [selectedUser._id])

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Group messages by date
  const groupedMessages = messages.reduce((groups, msg) => {
    const date = formatDate(msg.createdAt)
    if (!groups[date]) groups[date] = []
    groups[date].push(msg)
    return groups
  }, {})

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col">
        <ChatHeader />
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`flex items-end gap-2 ${i % 2 === 0 ? '' : 'flex-row-reverse'} animate-pulse`}>
              <div className="w-8 h-8 rounded-full bg-white/5 flex-shrink-0" />
              <div className={`max-w-xs space-y-1 ${i % 2 === 0 ? '' : 'items-end flex flex-col'}`}>
                <div className="h-10 bg-white/5 rounded-2xl w-48" />
                <div className="h-2 bg-white/5 rounded w-16" />
              </div>
            </div>
          ))}
        </div>
        <MessageInput />
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-500">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/10 to-pink-500/10 border border-white/5 flex items-center justify-center">
              <span className="text-3xl">💬</span>
            </div>
            <div className="text-center">
              <p className="font-medium text-slate-400">Start the conversation</p>
              <p className="text-sm mt-1">Say hello to {selectedUser.fullName.split(' ')[0]}!</p>
            </div>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date}>
              {/* Date divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-xs text-slate-500 bg-black/20 px-3 py-1 rounded-full border border-white/5">{date}</span>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              {msgs.map((msg, idx) => {
                const isMine = msg.senderId === authUser._id
                const isFirst = idx === 0 || msgs[idx - 1]?.senderId !== msg.senderId
                const isLast = idx === msgs.length - 1 || msgs[idx + 1]?.senderId !== msg.senderId

                return (
                  <div
                    key={msg._id}
                    className={`flex items-end gap-2 message-animate mb-0.5 ${isMine ? 'flex-row-reverse' : ''}`}
                  >
                    {/* Avatar */}
                    <div className={`flex-shrink-0 ${isLast ? 'visible' : 'invisible'}`}>
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img
                          src={isMine
                            ? (authUser.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser.fullName)}&background=8b5cf6&color=fff`)
                            : (selectedUser.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.fullName)}&background=ec4899&color=fff`)
                          }
                          alt="avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Bubble */}
                    <div className={`max-w-xs lg:max-w-md ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
                      {msg.image && (
                        <img
                          src={msg.image}
                          alt="attachment"
                          className={`max-w-xs rounded-2xl mb-1 object-cover ${
                            isMine ? 'rounded-br-sm' : 'rounded-bl-sm'
                          }`}
                        />
                      )}
                      {msg.text && (
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            isMine
                              ? `bg-gradient-to-br from-violet-500 to-violet-600 text-white ${isFirst ? 'rounded-tr-sm' : ''}`
                              : `bg-white/8 border border-white/8 text-slate-200 ${isFirst ? 'rounded-tl-sm' : ''}`
                          }`}
                          style={!isMine ? { background: 'rgba(255,255,255,0.06)' } : {}}
                        >
                          {msg.text}
                        </div>
                      )}
                      {isLast && (
                        <span className="text-xs text-slate-600 mt-1 px-1">
                          {formatMessageTime(msg.createdAt)}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ))
        )}
        <div ref={msgEndRef} />
      </div>

      <MessageInput />
    </div>
  )
}

export default ChatContainer