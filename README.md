
# README for Helper - Disaster Management Application

## 🌟 Why Open Source?

Open-sourcing Helper allows for:
- **Rapid Development**: Community contributions accelerate feature development and bug fixes
- **Collaborative Innovation**: Developers worldwide can improve and adapt the solution
- **Transparency**: Builds trust in emergency management systems
- **Global Impact**: Enables localization and customization for different regions' needs

## 🚀 Build

Helper is built with the MERN stack (MongoDB, Express, React, Node.js) with 90% TypeScript implementation for type safety and better developer experience.

**Key Technologies**:
- Frontend: React with TypeScript
- Backend: Node.js/Express with TypeScript
- Database: MongoDB
- Additional Libraries: Redux, Axios, WeatherAPI, etc.

## ❓ Why Helper?

Natural disasters affect millions annually. Helper provides:
- Real-time emergency alerts and weather updates
- Resource location during crises
- AI-powered disaster guidance
- Volunteer coordination platform
- Essential disaster kit marketplace

## 📊 Impact

Helper aims to:
- Reduce response time during emergencies
- Improve community preparedness
- Save lives through timely information
- Connect affected people with resources
- Empower volunteers to make a difference

## ✅ Proof
![Dashboard Screenshot](https://github.com/user-attachments/assets/61f415f7-c4d5-45ab-b1b1-69659edb98d8)

*Active alerts and emergency resources at a glance*

![AI Assistant](screenshots/ai-assistant.png)
*AI-powered disaster guidance in action*

![Resource Management](screenshots/resources.png)
*Comprehensive emergency resource directory*

## 💻 How to Install Locally

### Prerequisites
- Node.js (v16+)
- MongoDB (v4.4+)
- Yarn or npm

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/helper.git
   cd helper
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   yarn/npm install

   # Install client dependencies
   cd ../client
   yarn/npm install
   ```

3. **Set up environment variables**
   Create `.env` files in both `server` and `client` directories with required configurations:
   ```
   # server/.env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   WEATHER_API_KEY=your_weatherapi_key

   # client/.env
   REACT_APP_API_URL=http://localhost:5000
   ```

4. **Run the application**
   ```bash
   # From project root directory

   # Start server
   cd server
   yarn/npm start

   # In another terminal, start client
   cd ../client
   yarn/npm start
   ```

5. **Access the application**
   Open `http://localhost:3000` in your browser

## 🤝 Contributing

We welcome contributions!

## 📄 License

Helper is [MIT licensed](LICENSE).

---

**Emergency preparedness made accessible** - Helper is your companion for disaster management and community resilience.
