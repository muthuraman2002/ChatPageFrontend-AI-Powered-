import { useState, useContext } from 'react'
import { clearJWT } from '../utils/auth'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ThemeContext } from '../context/ThemeContext'

function Chat() {
  const { axiosInstance } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setMessages(prev => [
      ...prev,
      { text: input, sender: 'user' }
    ]);
    try {
      const res = await axiosInstance.post('/chat', { message: input });
      setMessages(prev => [
        ...prev,
        { text: res?.data?.response || '', sender: 'MODEL' }
      ]);
      setInput('');
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearJWT();
    navigate('/login');
  };

  const getClassName = (msg) => {
    return msg.sender === 'user'
      ? 'flex flex-row-reverse items-start mb-4'
      : 'flex items-start mb-4';
  };

  const getAvatar = (sender) => {
    const avatarBase = "https://ui-avatars.com/api/?background=random&color=fff&name=";
    return (
      <img
        src={`${avatarBase}${sender === 'user' ? 'You' : 'GPT'}`}
        alt={sender}
        className="w-10 h-10 rounded-full"
      />
    );
  };

  // Theme classes
  const themeClasses = theme === 'dark'
    ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100'
    : 'bg-gradient-to-br from-blue-100 to-green-100 text-gray-900';

  const headerClasses = theme === 'dark'
    ? 'bg-gray-900 text-white shadow-md'
    : 'bg-white text-blue-600 shadow-md';

  const chatBubbleUser = theme === 'dark'
    ? 'bg-blue-700 text-white ml-2'
    : 'bg-blue-500 text-white ml-2';

  const chatBubbleModel = theme === 'dark'
    ? 'bg-gray-700 text-gray-100 mr-2'
    : 'bg-gray-200 text-gray-800 mr-2';

  const inputClasses = theme === 'dark'
    ? 'bg-gray-800 border-gray-700 text-white'
    : 'bg-white border-gray-300 text-gray-900';

  const buttonClasses = theme === 'dark'
    ? 'bg-blue-700 hover:bg-blue-800'
    : 'bg-blue-500 hover:bg-blue-600';

  // Loading dots animation
  const LoadingDots = () => (
    <div className="flex items-center space-x-1 ml-2">
      <span className="animate-bounce text-2xl" style={{ animationDelay: '0ms' }}>.</span>
      <span className="animate-bounce text-2xl" style={{ animationDelay: '200ms' }}>.</span>
      <span className="animate-bounce text-2xl" style={{ animationDelay: '400ms' }}>.</span>
    </div>
  );

  return (
    <div className={`min-h-screen flex flex-col ${themeClasses}`}>
      {/* Header */}
      <header className={`flex justify-between items-center px-6 py-4 sticky top-0 z-10 ${headerClasses}`}>
        <h2 className="text-2xl font-bold">Chat</h2>
        <div className="flex gap-4 items-center">
          <button
            className="text-sm px-3 py-1 rounded border border-blue-400 font-semibold hover:bg-blue-400 hover:text-white transition"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? 'Day Mode' : 'Night Mode'}
          </button>
          <button
            className="text-red-500 font-semibold hover:underline"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Chat messages */}
      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-20">
            Start the conversation...
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={getClassName(msg)}>
            {getAvatar(msg.sender)}
            <div
              className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm ${
                msg.sender === 'user'
                  ? chatBubbleUser
                  : chatBubbleModel
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-start mb-4">
            {getAvatar('MODEL')}
            <div className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm ${chatBubbleModel} flex items-center`}>
              <LoadingDots />
            </div>
          </div>
        )}
      </main>

      {/* Message input */}
      <footer className={`flex items-center border-t p-4 sticky bottom-0 ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
        <input
          type="text"
          className={`flex-1 rounded-l-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 ${inputClasses}`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          disabled={loading}
        />
        <button
          className={`text-white px-6 py-3 rounded-r-xl font-semibold transition ${buttonClasses}`}
          onClick={handleSend}
          disabled={loading}
        >
          Send
        </button>
      </footer>
    </div>
  )}; 
  export default Chat;