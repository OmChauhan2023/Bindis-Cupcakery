import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';

const generateToken = (id: number, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'All fields (name, email, phone) are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    let hashedPassword = undefined;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const newUser = await prisma.user.create({
      data: { name, email, phone, password: hashedPassword }
    });

    const token = generateToken(newUser.id, 'user');

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: '/',
    });

    return res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: 'user',
      },
    });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

// @desc    Register admin (helper or first admin)
// @route   POST /api/auth/register-admin
// @access  Public
export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const { username, password, role = 'admin' } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingAdmin = await prisma.admin.findUnique({ where: { username } });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: { username, password: hashedPassword, role }
    });

    return res.status(201).json({ message: 'Admin created successfully', admin: { id: admin.id, username: admin.username } });
  } catch (error: any) {
    console.error('Error creating admin:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// @desc    Login user or admin
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const identifier = username || email;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Username/Email and password are required' });
    }

    // Check if it's an admin logging in
    const admin = await prisma.admin.findUnique({ where: { username: identifier } });
    if (admin) {
      const isValidPassword = await bcrypt.compare(password, admin.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = generateToken(admin.id, admin.role);
      
      res.cookie('adminToken', token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 3600 * 1000,
      });

      res.cookie('token', token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 3600 * 1000,
      });

      return res.json({
        message: 'Admin login successful',
        token,
        user: { id: admin.id, username: admin.username, role: admin.role },
      });
    }

    // Otherwise check regular user
    if (email || identifier.includes('@')) {
      const user = await prisma.user.findUnique({ where: { email: identifier } });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or user not found' });
      }

      if (user.password) {
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
      }

      const token = generateToken(user.id, 'user');

      res.cookie('token', token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 30 * 24 * 3600 * 1000,
      });

      return res.json({
        message: 'Login successful',
        token,
        user: { id: user.id, name: user.name, email: user.email, role: 'user' },
      });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (error: any) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// @desc    Logout user/admin
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (req: Request, res: Response) => {
  res.clearCookie('token');
  res.clearCookie('adminToken');
  return res.json({ message: 'Logged out successfully' });
};

// @desc    Get current user/admin profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  return res.json({ user: req.user });
};
