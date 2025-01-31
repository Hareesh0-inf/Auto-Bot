# **Auto-Bot** - Your media companion

## **Overview**
This project enables users to engage with an AI-powered system that can:

1. Provides whatever information users needed.
2. Provides information about uploaded images.
3. Create advertisements inspired by the images.

Users log in with their name and API key, which are cached temporarily during the session using Memcached.

---

## **Technologies Used**

- **Frontend**: Next.js (React)
- **Backend**: FastAPI
- **API**: Gemini API
- **AI Model - Text**: Gemini Pro
- **AI Model - Text**: Gemini flash
- **Cache**: Memcached
- **Image Processing**: PIL and Base64 encoding

---




## **Key Functionalities**

### **1. User Login**
- The login page prompts users to input their name and API key.
- API keys are cached using Memcached for session-based access.

#### **Frontend Implementation**
- A user-friendly login page collects and submits user details to the backend.
- Successful login stores the API key in Memcached for session usage.

#### **Backend Implementation**
- Handles validation of user credentials.
- Caches API keys temporarily with expiration policies.

---
### **2. Text Generation**
- Users can chat with the Auto-Bot , ask questions, suggestions or just have a fun conversation.

#### **Frontend Implementation**
- A responsive page allows users to send messages and to the backend.
- Allows users to see their chats and appropriate responses.

#### **Backend Implementation**
- Converts the message into a json format.
- Sends the message and receives the response from the Gemini-pro model using API.
-LangGraph is employed for chat-bot tasks.

### **3. Image Upload and Processing**
- Users can upload images to generate captions and create advertisements.

#### **Frontend Implementation**
- A form allows users to upload images and sends them asynchronously to the backend.

#### **Backend Implementation**
- Converts images to the required format using PIL.
- Encodes image data in Base64 and sends it to the Gemini API for processing.

---

### **4. Advertisement Generation**
- Creates custom advertisement text based on the uploaded image.
- Leverages AI to align ad content with the image context.

---

## **Project Architecture**

### **1. Frontend**
- **Framework**: Next.js
- **Key Pages**:
  - Login Page: Collects user credentials.
  - Chatbot Page: Interface for chatting with the AI.
  - Image Upload Page: Facilitates interactions with the AI system.
- **API Communication**: Uses Axios for seamless backend integration.




### **2. Backend**
- **Framework**: FastAPI
- **Endpoints**:
  - `/login`: Validates and stores user credentials.
  - `/chat`: Handles texts.
  - `/upload`: Handles image processing.
  - `/caption`: Generates captions for images.
  - `/advertisement`: Creates advertisements based on images.
- **Caching**: Utilizes Memcached for temporary storage.

### **3. AI Integration**
- **Model**: Gemini API via LangGraph
- **Tasks**:
  - ChatBot
  - Caption generation
  - Advertisement creation

### **4. Cache Management**
- Memcached ensures fast and temporary storage of API keys.
- Cached data is cleared automatically when the server stops.

---







## **How to Run the Project**

### **Setup**
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install       # Frontend dependencies
   pip install -r requirements.txt  # Backend dependencies
   ```
3. Start Memcached:
   ```bash
   memcached -d
   ```
4. Run the backend:
   ```bash
   python backend\app\__init__.py
   ```
5. Run the frontend:
   ```bash
   npm run dev
   ```

### **Access the Application**
- Open your browser and visit `http://localhost:3000`.

---



## **Endpoints**

### **1. `/login` (POST)**
**Request**:
```json
{
  "name": "John Doe",
  "api_key": "your_api_key_here"
}
```
**Response**:
```json
{
  "message": "Login successful"
}
```
### **2. `/chat` (POST)**
**Request**:
- Form data containing the meassages.

**Response**:
```json
{
  "role": "Assistant/human",
  "content":"message"
}



### **2. `/caption` (POST)**
**Request**:
```json
{
  "image": "<base64_encoded_image_data>"
}
```
**Response**:
```json
{
  "caption": "Generated caption for the image"
}
```

### **5. `/advertisement` (POST)**
**Request**:
```json
{
  "image": "<base64_encoded_image_data>"
}
```
**Response**:
```json
{
  "advertisement": "Get the best vacations with views like this. Book now!"
}
```

---

## **Future Enhancements**
1. **User Authentication**:
   - Implement token-based authentication for increased security.
2. **Advanced AI Capabilities**:
   - Integrate multimodal models for improved understanding of image context.
   - Integrate multiple tools for models to increase flexibility.
3. **Scalability**:
   - Migrate to cloud-based caching solutions for large-scale applications.

---

## **Conclusion**
This project integrates modern web technologies with advanced AI to deliver an intuitive system for image captioning, question answering, and advertisement creation, showcasing the seamless synergy between cutting-edge tools and user-centric design.

