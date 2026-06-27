MomentumX — Fitness & Gym Management Platform (Client)

Your ultimate fitness management platform. Discover classes, book sessions, and transform your journey.

🌐 Live Site: https://momentumx-client.vercel.app/

🔗 Server Repo:https://github.com/Rabiul-Sujon/momentumx-client

📧 Contact: https://www.linkedin.com/in/maven-rabiul/


📋 Table of Contents

About the Project
Features
Tech Stack
Getting Started
Environment Variables
Pages & Routes
NPM Packages

🎯 About the Project

MomentumX is a comprehensive full-stack Fitness & Gym Management Platform designed for fitness enthusiasts, trainers, and administrators. Users can discover fitness classes, book sessions, participate in community discussions, and track their fitness journey.

🎨 Design

Color Palette: #0A0F1E (Background) · #00D4FF (Primary) · #7B2FFF (Accent)
Typography: DM Sans
Theme: Dark, professional, cyber-inspired


✨ Features

👤 User

Browse and search fitness classes by name and category
Book classes through Stripe payment integration
Save favorite classes and manage them
Apply to become a trainer
Participate in community forum (like, dislike, comment, reply)
View booking history and application status


🏋️ Trainer

Create and manage fitness classes
View enrolled students per class
Post and manage community forum content
Track class performance and student enrollment


👑 Admin

Manage all users (block/unblock, promote to admin)
Approve or reject trainer applications with feedback
Manage trainer roles (promote/demote)
Approve, reject, or delete fitness classes
View all payment transactions
Moderate community forum posts

🛠️ Tech Stack

TechnologyPurposeNext.js 15React framework with App RouterTailwind CSS v4Utility-first stylingDaisyUI v5Component libraryFramer MotionAnimations and transitionsBetter AuthAuthentication (Email + Google OAuth)TanStack QueryServer state management & cachingAxiosHTTP client for API callsStripe.jsPayment processingReact Hook FormForm handlingReact Hot ToastToast notificationsRechartsAnalytics charts (Admin dashboard)DM SansGoogle Font via next/font


🚀 Getting Started

Prerequisites


Node.js 18+
npm or yarn
MomentumX Server running (see server repo)

Installation

bash# Clone the repository
git clone https://github.com/Rabiul-Sujon/momentumx-client.git

# Navigate to project directory
cd momentumx-client

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev

Open http://localhost:3000 in your browser.


🔐 Environment Variables

Create a .env.local file in the root directory:

env# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000

# Better Auth
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:5000
BETTER_AUTH_URL=http://localhost:5000
BETTER_AUTH_SECRET=your_better_auth_secret

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name


⚠️ Never commit .env.local to version control. 


📁 Pages & Routes

Public Routes

Route                 Description

/                     Home page with featured classes and forum posts
/classes              All approved classes with search & filter
/classes/[id]         Class details with booking and favorites
/forum                Community forum with pagination
/forum/[id]           Forum post details with comments
/login                Login with email or Google
/register             Register new account


Private Routes

Route                                 Description

/payment                              Stripe checkout page
/dashboard/user                       User overview and stats
/dashboard/user/booked-classes        User's booked classes
/dashboard/user/apply-trainer         Apply as trainer form
/dashboard/user/favorites             User's favorite classes
/dashboard/trainer                    Trainer overview and stats
/dashboard/trainer/add-class          Add new fitness class
/dashboard/trainer/my-classes         Manage trainer's classes
/dashboard/trainer/add-post           Add forum post
/dashboard/trainer/my-posts           Manage trainer's forum posts
/dashboard/admin                      Admin overview and stats
/dashboard/admin/manage-users         Block/unblock users, make admin
/dashboard/admin/applied-trainers     Approve/reject trainer
                                      applications 
/dashboard/admin/manage-trainers      Demote trainers
/dashboard/admin/manage-classes       Approve/reject/delete classes
/dashboard/admin/add-post             Admin add forum post
/dashboard/admin/transactions         View all payment transactions
/dashboard/admin/manage-posts         Moderate forum posts
                                      


📦 NPM Packages

json{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "tailwindcss": "^4.0.0",
    "daisyui": "^5.0.0",
    "framer-motion": "^11.0.0",
    "better-auth": "latest",
    "@tanstack/react-query": "^5.0.0",
    "axios": "^1.6.0",
    "@stripe/stripe-js": "^3.0.0",
    "@stripe/react-stripe-js": "^2.0.0",
    "react-hook-form": "^7.0.0",
    "react-hot-toast": "^2.4.0",
    "recharts": "^2.10.0",
    "@gravity-ui/icons": "latest"
  }
}

🔑 Test Credentials

Admin Email: jhon@gmail.com
Admin Password: 123456Aa

Stripe Test Card: 4242 4242 4242 4242
Expiry: 12/28 | CVC: 123


👨‍💻 Author

Rabiul Alam

GitHub: [@Rabiul-Sujon](https://github.com/Rabiul-Sujon)
LinkedIn: [maven-rabiul](https://www.linkedin.com/in/maven-rabiul/)
Portfolio: [my-portfolio](https://my-portfolio-tawny-theta-64.vercel.app/)