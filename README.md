# Auto-Bot

### **Project Overview**
Auto-Bot is a comprehensive web application that seamlessly integrates a sophisticated Next.js frontend with a robust FastAPI backend. Designed to provide a rich set of features, the application includes chatbot capabilities, automated image captioning, and intelligent advertisement generation. MongoDB serves as the foundation for state management and persistent data storage, ensuring scalability and reliability.

---

### **Key Features**
1. **Chatbot Functionality**: Supports multi-user interactions with dynamic, AI-generated responses tailored to individual users.
2. **Image Captioning**: Allows users to upload images, with the application leveraging advanced AI to generate detailed and contextually relevant captions.
3. **Advertisement Generation**: Empowers users to create personalized advertisement texts based on specific inputs, making it ideal for marketing and branding purposes.

---

### **Summary of What We've Done**

1. **Multi-User State Management with MongoDB**  
   - Transitioned from temporary storage solutions to MongoDB, enabling scalable, persistent, and user-specific state management. This enhancement ensures data consistency and supports simultaneous multi-user interactions.

2. **FastAPI Endpoints Fixes & Enhancements**  
   - Upgraded API endpoints to efficiently handle user-specific data requests, reduce latency, and support advanced features such as AI-driven image processing and dynamic response generation.

3. **Image Captioning & Advertisement Generation**  
   - Integrated AI models to significantly improve the quality of image captions and advertisement text suggestions. This advancement provides users with accurate, engaging, and creative outputs.

4. **Frontend Fixes & Integration**  
   - Implemented a seamless integration of backend APIs into the Next.js frontend. Enhanced the user interface to be clean, responsive, and intuitive, offering a polished user experience.

5. **MongoDB & FastAPI Compatibility Fixes**  
   - Addressed compatibility issues between MongoDB and FastAPI, ensuring smooth communication with proper data formatting, validation, and error handling.

---

### **Next Steps / Remaining Tasks**

🔹 Ensure that all stored messages are properly formatted and structured before saving in MongoDB to maintain consistency.  
🔹 Optimize MongoDB queries for faster data retrieval and improved application performance, especially under high user loads.  
🔹 Add comprehensive user authentication and session management features to enhance security and provide a personalized experience.  
🔹 Implement real-time updates using technologies like WebSockets to deliver a more interactive and engaging chatbot experience.  

---

### **Tech Stack**
- **Frontend**: Next.js, TypeScript, Tailwind CSS  
- **Backend**: FastAPI, Python  
- **Database**: MongoDB (Atlas)  

---

### **Setup Instructions**

#### **Backend**
1. Navigate to the `backend` folder.  
2. Set up a virtual environment:  
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   .\venv\Scripts\activate  # Windows
   ```
3. Install dependencies:  
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server:  
   ```bash
   python app.py
   ```

#### **Frontend**
1. Navigate to the `next` folder.  
2. Install dependencies:  
   ```bash
   npm install
   ```
3. Start the development server:  
   ```bash
   npm run dev
   ```

---

### **Contribution Guidelines**
1. Clone the repository.  
2. Create a new branch for your feature or bug fix:  
   ```bash
   git checkout -b feature-name
   ```
3. Push your changes to the branch and open a pull request. Provide a clear description of the changes you've made.

---

### **Contact**
For questions, feedback, or support, feel free to reach out via [GitHub Issues](#). We welcome contributions and collaboration from the community to continuously improve Auto-Bot.

