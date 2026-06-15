import { useChatStore } from '../store/useChatStore'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/Chatcontainer'
import NoChatSelected from '../components/Nochatselected'

const HomePage = () => {
  const { selectedUser } = useChatStore()

  return (
    <div className="h-screen animated-bg flex overflow-hidden">
      <div className="flex w-full h-full">
        <Sidebar />
        <main className="flex-1 flex overflow-hidden">
          {selectedUser ? <ChatContainer /> : <NoChatSelected />}
        </main>
      </div>
    </div>
  )
}

export default HomePage