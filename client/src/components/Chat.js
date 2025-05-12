import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './Chat.css';

const socket = io('http://localhost:5000');

const Chat = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [joined, setJoined] = useState(false);
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);

  useEffect(() => {
    const handleMessage = (msg) => {
      setMessages(prev => [...prev, msg]);
    };

    const handleUsers = (updatedUsers) => {
      setUsers(updatedUsers);
    };

    socket.on('message', handleMessage);
    socket.on('users', handleUsers);

    return () => {
      socket.off('message', handleMessage);
      socket.off('users', handleUsers);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const joinChat = (e) => {
    e.preventDefault();
    const trimmedUsername = username.trim();
    if (trimmedUsername) {
      socket.emit('join', trimmedUsername);
      setJoined(true);
      setTimeout(() => messageInputRef.current?.focus(), 100);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (trimmedMessage) {
      socket.emit('sendMessage', trimmedMessage);
      setMessage('');
    }
  };

  if (!joined) {
    return (
      <div className="join-container">
        <h2>Join Chat</h2>
        <form onSubmit={joinChat}>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />
          <button type="submit" disabled={!username.trim()}>
            Join
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="sidebar">
        <h3>Online Users ({users.length})</h3>
        <ul>
          {users.map((user, index) => (
            <li key={index}>
              <span className={user.online ? 'online' : 'offline'}></span>
              {user.username}
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-area">
        <div className="messages">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`message ${msg.username === username ? 'own-message' : ''}`}
            >
              {msg.username !== 'System' && <strong>{msg.username}: </strong>}
              <span>{msg.text}</span>
              <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={sendMessage} className="message-form">
          <input
            ref={messageInputRef}
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" disabled={!message.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;