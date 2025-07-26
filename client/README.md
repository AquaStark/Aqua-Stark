# 🌊 Aqua Stark - Frontend 🖥️  

This is the **frontend** of **Aqua Stark**, a Web3 aquarium game built with **React, Vite, and TailwindCSS**. It provides an interactive interface for managing and customizing virtual aquariums.  

## 🚀 Features  
✔️ **Dynamic aquarium customization** with fish, decorations, and expansions.  
✔️ **Seamless Web3 integration** with StarkNet wallets.  
✔️ **Optimized UI** with TailwindCSS and responsive design.  
✔️ **Fast and modular architecture** using Vite.  

## 🛠️ Tech Stack  
- **Framework**: React + Vite  
- **Styling**: TailwindCSS  
- **State Management**: Context API  
- **Package Manager**: pnpm  
- **Alias Support**: Uses `@/` instead of relative paths  

## 📂 Project Structure  
```sh
/client
│── /public
│── /src
│   ├── /components
│   ├── /pages
│   ├── /hooks
│   ├── /utils
│── .gitignore
│── package.json
│── pnpm-lock.yaml
│── vite.config.ts
│── tailwind.config.js
│── tsconfig.json
│── README.md
```
## 📦 Installation & Running  

### 1️⃣ Navigate to the Client Directory  
Before installing dependencies, make sure you are in the correct directory:  
```sh
cd client
```

### 1️⃣ Install Dependencies  
Make sure you have **pnpm** installed. If not, install it globally:  
```sh
npm install -g pnpm  
```
Now, install the project dependencies:  

```sh
pnpm install  
```

### 2️⃣ Start the Development Server  
Run the following command to start the frontend in development mode:  

```sh
pnpm dev  
```

The application will be available at http://localhost:5173/ (default Vite port).  

## 🔄 Code Guidelines  
- **Component & file naming**: Use **kebab-case** for consistency.  
- **Import paths**: Always use `@/` instead of relative paths.  

✅ Example:  
```ts
import FishCard from '@/components/fish-card';  
```
❌ Avoid:  
```ts
import FishCard from '../../components/FishCard';  
```

🎮 **Get ready to build and expand your aquarium in Aqua Stark!** 🐠🚀  
