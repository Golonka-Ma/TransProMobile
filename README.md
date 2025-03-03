# TransPro Mobile - Driver Application

## Project Description
TransPro Mobile is a React Native application developed for drivers as part of the TransPro Transport Management System. The mobile app enables real-time communication between drivers and dispatchers, provides access to route and load details, and streamlines operational updates in the field.

## Features
- **Real-Time Communication**: Chat functionality allowing drivers to coordinate with dispatchers and other users, implemented using WebSockets (SockJS & STOMP)
- **Authentication**: Secure JWT-based login system integrated with the TransPro backend
- **Load Management**: View assigned loads with pickup/delivery times and locations
- **Route Details**: Access to route information including start/end locations and distances
- **Status Updates**: Ability to update load status (pending, in progress, delivered)

## Mobile App Showcase
Below is a short demonstration of the key functionalities of the TransPro Mobile app in action.

https://github.com/user-attachments/assets/dec1fd54-8dee-494c-9102-ffca3a3fc834

## Technology Stack
- **React Native** (Expo) for cross-platform mobile development
- **Axios** for HTTP requests to the backend API
- **SockJS & STOMP** for WebSocket communication
- **AsyncStorage** for local data persistence
- **React Navigation** for screen navigation

## Installation Guide

### Prerequisites
- **Node.js** (14+ or 16+)
- **npm** or **yarn**
- **Expo CLI**
- Physical device with Expo Go app or Android/iOS emulator

### Setup
1. Clone the repository
   ```bash
   git clone https://github.com/Golonka-Ma/TransProWeb.git
   ```

2. Navigate to the mobile app directory:
   ```bash
   cd transpro-mobile
   ```

3. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

4. Configure the backend API URL:
   - Open `src/config/api.config.js`
   - Update the API_URL variable with your backend server address:
     ```javascript
     export const API_URL = 'http://192.168.1.19:8080/api';
     ```

5. Start the Expo development server:
   ```bash
   expo start
   ```

6. Scan the QR code with Expo Go app (Android) or Camera app (iOS) or run on an emulator

## Usage
1. Launch the app and log in with credentials provided by your administrator
2. The home screen will display:
   - Current assigned routes
   - Pending and active loads
   - Unread messages indicator
3. Use the chat feature to communicate with dispatchers
4. Access load details by tapping on active loads
5. Update load status as you progress through deliveries

## Development Roadmap
| Feature | Description | Status |
|---------|-------------|--------|
| GPS Integration | Real-time location tracking for better route management | Planned |
| Digital Documentation | Upload and manage delivery confirmations and other paperwork | In Progress |
| Expense Reporting | Submit fuel, toll, and other expenses directly from the app | Planned |
| Offline Mode | Enhanced functionality when working in areas with limited connectivity | Researching |

## Troubleshooting

### Connection Issues
- If unable to connect to the backend, verify the API URL configuration and ensure the backend server is running
- For WebSocket connection issues, check if your network allows WebSocket traffic

### App Performance
- Clear the app cache or reinstall if experiencing persistent UI issues
- Ensure your device meets the minimum requirements for running React Native applications

### Login Problems
- Verify your credentials with your administrator
- Check if your JWT token has expired and re-login if necessary

## Contact
For any questions or suggestions regarding the TransPro Mobile app, feel free to contact the developer:
- **Email**: marcin.golonka21@gmail.com  
- **GitHub**: [TransProWeb Repository](https://github.com/Golonka-Ma/TransProWeb)  
- **LinkedIn**: [Marcin Golonka](https://www.linkedin.com/in/marcin-golonka-4510a928b/)
