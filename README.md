# 🍔 Hungry House

A modern, full-featured food delivery platform built with React, TypeScript, and Supabase. Hungry House provides a seamless experience for customers to browse restaurants, order food, track deliveries, and manage their profiles.

## 🌟 Features

### Customer Features
- **Browse & Order**: Explore restaurants, view menus, and place orders with ease
- **Real-time Order Tracking**: Track your order status from preparation to delivery
- **User Authentication**: Secure login and registration with profile management
- **Shopping Cart**: Add items, customize quantities, and manage your cart
- **Offers & Promotions**: Access exclusive deals and discounts
- **Order History**: View past orders and reorder favorites
- **Gallery**: Browse food images and restaurant showcases
- **Contact Support**: Get help when you need it

### Admin Features
- **Order Management**: Monitor and manage all incoming orders
- **Agent Management**: Assign and track delivery agents
- **Offers Management**: Create and manage promotional campaigns
- **Analytics & Insights**: View business metrics and performance data
- **Real-time Dashboard**: Track orders, revenue, and operations

### Agent Features
- **Delivery Dashboard**: View assigned deliveries
- **Order Updates**: Update delivery status in real-time
- **Route Optimization**: Manage delivery routes efficiently

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **React Router** - Client-side routing
- **TanStack Query** - Server state management

### UI Components & Styling
- **shadcn/ui** - High-quality React components
- **Radix UI** - Accessible component primitives
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Recharts** - Data visualization
- **Embla Carousel** - Smooth carousels

### Backend & Database
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication
  - Row Level Security

### Form & Validation
- **React Hook Form** - Performant form handling
- **Zod** - Schema validation
- **@hookform/resolvers** - Form validation integration

### Additional Libraries
- **date-fns** - Date manipulation
- **Sonner** - Toast notifications
- **next-themes** - Dark mode support

## 📦 Installation

### Prerequisites
- **Node.js** (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm)
- **npm** or **bun** package manager
- **Supabase Account** - [Sign up](https://supabase.com)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd Hungry-house
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Configure Environment Variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the migrations in the `supabase/` directory
   - Configure authentication providers
   - Set up Row Level Security policies

5. **Start the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
Hungry-house/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── BottomNav.tsx   # Mobile navigation
│   │   ├── TopNav.tsx      # Header navigation
│   │   └── ...
│   ├── pages/              # Route pages
│   │   ├── Home.tsx        # Landing page
│   │   ├── Menu.tsx        # Restaurant menu
│   │   ├── Cart.tsx        # Shopping cart
│   │   ├── Admin.tsx       # Admin dashboard
│   │   ├── Agent.tsx       # Agent dashboard
│   │   └── ...
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx # Authentication state
│   ├── hooks/              # Custom React hooks
│   ├── integrations/       # Third-party integrations
│   │   └── supabase/       # Supabase client & types
│   ├── lib/                # Utility functions
│   └── utils/              # Helper utilities
├── supabase/               # Supabase migrations & config
├── public/                 # Static assets
└── ...config files

```

## 🔐 Authentication

The application supports multiple user roles:
- **Customer** - Browse and order food
- **Admin** - Manage platform operations
- **Agent** - Handle deliveries

Authentication is handled through Supabase Auth with secure session management.

## 🎨 UI/UX Features

- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Dark Mode Support** - Toggle between light and dark themes
- **Smooth Animations** - Enhanced user experience with Tailwind animations
- **Accessible** - Built with accessibility in mind using Radix UI
- **Toast Notifications** - Real-time feedback for user actions
- **Loading States** - Skeleton loaders and progress indicators

## 🔧 Configuration

### Tailwind Configuration
Customize theme, colors, and plugins in `tailwind.config.ts`

### TypeScript Configuration
- `tsconfig.json` - Base TypeScript config
- `tsconfig.app.json` - App-specific config
- `tsconfig.node.json` - Node-specific config

### Vite Configuration
Build settings and plugins in `vite.config.ts`

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🐛 Bug Reports & Feature Requests

Please use the issue tracker to report bugs or request features.

## 📞 Support

For support, please contact the development team or use the in-app contact form.

---

**Built with ❤️ using React, TypeScript, and Supabase**
