# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# 🍕 FoodFusion — Multi-Vendor Food Delivery Web Application

> A full-stack multi-vendor food delivery platform built with React.js, Node.js, Express.js and MySQL — featuring AI-powered food recommendations, real-time order management, vendor analytics and secure JWT authentication.

---

## 🚀 Live Features

| Feature | Description |
|---|---|
| 🔐 Secure Auth | bcrypt password hashing + JWT token authentication |
| 🤖 AI Recommender | Mood-based food suggestions powered by Groq LLaMA 3.3 |
| 📊 Vendor Analytics | Revenue charts, top items, order status breakdown |
| 📦 Order Tracking | 4-stage order lifecycle: Placed → Preparing → On the Way → Delivered |
| 🎟️ Promo Codes | SAVE10, SAVE20, FREESHIP discount support |
| 🛡️ Protected Routes | Role-based access for customers and vendors |
| 📋 Order History | Full order history with itemized breakdowns |
| 🔍 Search & Filter | Search by name, description, vendor + category filters |

---

## 🛠️ Tech Stack

### Frontend
- **React.js** + **Vite** — Component-based UI
- **Tailwind CSS** — Responsive styling
- **React Router** — Client-side navigation + protected routes
- **Recharts** — Interactive analytics charts

### Backend
- **Node.js** + **Express.js** — REST API server
- **bcryptjs** — Password hashing
- **jsonwebtoken** — JWT authentication
- **Groq API (LLaMA 3.3)** — Free AI recommendations

### Database
- **MySQL** — Relational database with foreign key relationships

---

## 📁 Project Structure

```
FoodFusion/
├── backend_node_mysql/
│   ├── routes/
│   │   ├── auth.js        # Register, Login (bcrypt + JWT)
│   │   ├── menu.js        # Fetch all menu items with vendor names
│   │   ├── orders.js      # Place, fetch, update orders
│   │   └── vendors.js     # Vendor menu management
│   ├── db.js              # MySQL connection
│   ├── server.js          # Express server + Groq AI endpoint
│   └── .env               # Environment variables (not committed)
├── src/
│   ├── components/
│   │   ├── auth/          # Login, Register, ProtectedRoute
│   │   ├── customer/      # FoodItem, FoodList, CartItem
│   │   ├── vendor/        # MenuItemForm, MenuItemsList
│   │   └── ui/            # Navbar, Footer, Layout
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── CustomerMenuPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── PaymentPage.jsx
│   │   ├── OrderConfirmationPage.jsx
│   │   ├── OrderHistoryPage.jsx
│   │   ├── VendorDashboardPage.jsx
│   │   └── AIRecommenderPage.jsx
│   └── App.jsx
└── package.json
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MySQL 8+
- A free [Groq API key](https://console.groq.com/keys)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/FoodFusion.git
cd FoodFusion
```

### 2. Setup the database
Open MySQL Workbench and create the database:
```sql
CREATE DATABASE food_delivery;
USE food_delivery;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  address VARCHAR(255)
);

CREATE TABLE vendors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  location VARCHAR(255),
  contact VARCHAR(50)
);

CREATE TABLE menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  description TEXT,
  price DECIMAL(10,2),
  image VARCHAR(500),
  category VARCHAR(100),
  vendor_id INT,
  FOREIGN KEY (vendor_id) REFERENCES vendors(id)
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  address VARCHAR(255),
  status VARCHAR(20) DEFAULT 'placed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  item_id INT,
  quantity INT,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (item_id) REFERENCES menu_items(id)
);
```

### 3. Configure environment variables
Create `backend_node_mysql/.env`:
```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=yourpassword
DB_NAME=food_delivery
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=your_jwt_secret
```

### 4. Install dependencies

**Backend:**
```bash
cd backend_node_mysql
npm install
```

**Frontend:**
```bash
cd ..
npm install
```

### 5. Run the application

**Terminal 1 — Backend:**
```bash
cd backend_node_mysql
npm start
```

**Terminal 2 — Frontend:**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🔑 Promo Codes

| Code | Discount |
|---|---|
| `SAVE10` | 10% off subtotal |
| `SAVE20` | 20% off subtotal |
| `FREESHIP` | Free delivery |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register customer or vendor |
| POST | `/api/auth/login` | Login and receive JWT token |
| GET | `/api/menu` | Fetch all menu items with vendor names |
| GET | `/api/vendors/:id/menu-items` | Get vendor's menu items |
| POST | `/api/vendors/:id/menu-items` | Add new menu item |
| PUT | `/api/vendors/:id/menu-items/:itemId` | Update menu item |
| DELETE | `/api/vendors/:id/menu-items/:itemId` | Delete menu item |
| POST | `/api/orders` | Place a new order |
| GET | `/api/orders/user/:userId` | Customer order history |
| GET | `/api/orders/vendor/:vendorId` | Vendor incoming orders |
| PATCH | `/api/orders/:id/status` | Update order status |
| POST | `/api/ai/recommend` | Get AI food recommendations |

---

## 🗄️ Database Schema

```
users          → id, name, email, password, address
vendors        → id, name, email, location, contact
menu_items     → id, name, description, price, image, category, vendor_id (FK)
orders         → id, user_id (FK), address, status, created_at
order_items    → id, order_id (FK), item_id (FK), quantity
```

---

## 🔒 Security

- Passwords hashed with **bcrypt** (salt rounds: 10)
- **JWT tokens** stored in localStorage, verified on every protected request
- **Protected routes** redirect unauthenticated users to login
- Sensitive credentials stored in **`.env`** — never committed to GitHub

---

## 👥 User Roles

### Customer
- Register/Login → Browse Menu → Search & Filter → AI Recommendations
- Add to Cart → Apply Promo Code → Payment → Order Confirmation
- View Order History with live status tracking

### Vendor
- Register/Login → Manage Menu Items (Add/Edit/Delete)
- View Incoming Orders → Update Order Status
- View Analytics Dashboard (Revenue, Top Items, Order Status)

---

## 🤖 AI Food Recommender

Powered by **Groq API (LLaMA 3.3-70b-versatile)**. Customers describe their mood or select a preset (Spicy & Bold, Comfort Food, Budget Friendly, etc.). The backend sends the mood + live menu data to Groq, which returns personalized dish recommendations with reasons and food tips in JSON format.

---

## 📊 Vendor Analytics

Built with **Recharts**:
- 📈 Line chart — Revenue over time
- 📊 Bar chart — Top selling items by quantity  
- 🥧 Pie chart — Orders by status
- Summary cards — Delivered orders, Pending orders, Average order value

---

## 🙏 Acknowledgements

- [Groq](https://groq.com/) — Free LLaMA AI API
- [Recharts](https://recharts.org/) — React charting library
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework
- [React Icons](https://react-icons.github.io/react-icons/) — Icon library

---

## 📄 License

MIT License — feel free to use and modify for your own projects.
