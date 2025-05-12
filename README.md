
# REAL-TIME CHAT APPLICATION

**Company Name:** CODETECH IT SOLUTIONS  
**Name:** AKSHAY H NAYAK  
**Intern ID:** CT4MWA21  
**Domain:** MERN STACK WEB DEVELOPMENT  
**Duration:** 15 Weeks  
**Mentor:** NEELA SANTHOSH  

## PROJECT DESCRIPTION  
**TITLE:** Real-Time Chat Application with Socket.IO  

A full-stack real-time chat application built with the MERN stack and Socket.IO. The application features instant messaging, online user tracking, and message persistence with MongoDB storage.

🚀 **Features**  
✅ Real-time messaging with Socket.IO  
✅ Online user presence tracking  
✅ Message history persistence with MongoDB  
✅ Responsive UI with distinct message bubbles  
✅ User join/leave notifications  
✅ Typing indicators (optional enhancement)  
✅ Private messaging capability  
✅ Message timestamps  

📂 **Project Structure**  
```
chat-app/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat.js
│   │   │   └── Chat.css
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── server/
    ├── server.js
    ├── models/
    │   ├── Message.js
    │   └── User.js
    └── package.json
```

📊 **How It Works**  
1. **User Joins** → Enters username to join chat  
2. **Real-Time Chat** → Messages appear instantly for all users  
3. **Online Users** → Sidebar shows active participants  
4. **Message History** → Previous messages load automatically  
5. **System Notifications** → Join/leave alerts for all users  

🛠 **Built With**  
- **Frontend:** React.js, Socket.IO Client  
- **Backend:** Node.js, Express.js, Socket.IO Server  
- **Database:** MongoDB (with Mongoose ODM)  
- **Styling:** CSS with responsive design  

🎯 **Future Enhancements**  
- Add user authentication (JWT)  
- Implement chat rooms/channels  
- Add file/image sharing capability  
- Include message reactions/emojis  
- Implement end-to-end encryption  
- Add voice/video chat functionality  
