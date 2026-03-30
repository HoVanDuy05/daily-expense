import ChatContent from './ChatContent';
import { FRIEND_IDS } from './static-params';

// Required for static export with dynamic routes
export function generateStaticParams() {
  return FRIEND_IDS.map((id) => ({
    friendId: id,
  }));
}

export default function ChatPage() {
  return <ChatContent />;
}
