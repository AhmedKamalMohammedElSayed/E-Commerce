# 🛒 E-Commerce RESTful API

A scalable E-Commerce backend API built with Node.js, Express, and MongoDB, providing complete product and user management with security, performance, and best practices in mind.

## 🚀 Features

Full CRUD operations for Categories, Subcategories, Brands, and Products

Advanced search, filtering, and sorting (by price, category, brand, sales, etc.)

Authentication & Authorization using JWT with role-based access (Admin, Manager, User)

Image upload & processing (single & multiple images) with validation and optimization

Centralized error handling and request validation layer

Nginx reverse proxy with load balancing and rate limiting

## 🔐 Authentication & Authorization

Secure user registration and login

JWT-based authentication

Role-based access control for protected routes

## 📌 API Endpoints
Auth
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/forgot-password
PATCH  /api/v1/auth/reset-password

Categories
GET    /api/v1/categories
POST   /api/v1/categories
GET    /api/v1/categories/:id
PATCH  /api/v1/categories/:id
DELETE /api/v1/categories/:id

Subcategories
GET    /api/v1/subcategories
POST   /api/v1/subcategories
PATCH  /api/v1/subcategories/:id
DELETE /api/v1/subcategories/:id

Brands
GET    /api/v1/brands
POST   /api/v1/brands
PATCH  /api/v1/brands/:id
DELETE /api/v1/brands/:id

Products
GET    /api/v1/products
POST   /api/v1/products
GET    /api/v1/products/:id
PATCH  /api/v1/products/:id
DELETE /api/v1/products/:id


## Query Features:

/products?keyword=phone
/products?price[lte]=5000
/products?sort=price,-sold
/products?category=electronics&brand=apple

## ⚙️ Nginx Configuration

The project includes an Nginx reverse proxy configuration to improve performance and scalability.

Nginx Features

Reverse proxy for backend services

Load balancing between multiple backend instances

IP-based rate limiting to protect APIs

Client IP forwarding for logging and security

Traffic Flow:

Client → Nginx (Port 80) → Backend Services (8000, 8001)

## 🛠️ Tech Stack

Node.js, Express.js

MongoDB & Mongoose

JWT Authentication

Nginx

RESTful APIs
