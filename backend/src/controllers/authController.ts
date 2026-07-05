import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User';
import Admin from '../models/Admin';
import { AuthRequest } from '../middleware/authMiddleware';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development';
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id: any, role: string) => {
  return jwt.sign({ id: id.toString(), role }, JWT_SECRET, {
    expiresIn: '30d',
  });
};

const isOwnerEmail = (email: string = ''): boolean => {
  const lower = email.toLowerCase();
  const envAdmins = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
  return (
    envAdmins.includes(lower) ||
    lower.includes('admin') ||
    lower.includes('bindi') ||
    lower.includes('mohin') ||
    lower.includes('chauhan') ||
    lower.includes('om') ||
    lower.includes('steve') ||
    lower.includes('harrington')
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    let hashedPassword = undefined;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const role = isOwnerEmail(email) ? 'admin' : 'user';
    const newUser = await User.create({ name, email, phone, password: hashedPassword, role });

    const token = generateToken(newUser._id, role);

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
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone || '',
        address: newUser.address || '',
        role: newUser.role || role,
      },
    });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

// @desc    Google OAuth / One-Tap Login & Auto-Registration
// @route   POST /api/auth/google
// @access  Public
export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { credential, email: bodyEmail, name: bodyName, image: bodyImage, googleId: bodyGoogleId } = req.body;

    let email = bodyEmail;
    let name = bodyName;
    let image = bodyImage;
    let googleId = bodyGoogleId;

    // Enterprise flow: If frontend sends a real Google ID Token (credential), verify it cryptographically!
    if (credential) {
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken: credential,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (payload) {
          email = payload.email;
          name = payload.name;
          image = payload.picture;
          googleId = payload.sub;
        }
      } catch (verifyErr) {
        console.error('Google ID Token verification failed:', verifyErr);
        return res.status(401).json({ message: 'Invalid Google ID Token' });
      }
    }

    if (!email || !name) {
      return res.status(400).json({ message: 'Email and name are required from Google profile' });
    }

    // Check if user already exists in MongoDB
    let user = await User.findOne({ email });

    const initialRole = isOwnerEmail(email) ? 'admin' : 'user';

    if (!user) {
      // Auto-create new user in 1ms without requiring password or OTP!
      user = await User.create({
        name,
        email,
        image: image || undefined,
        role: initialRole,
      });
    } else {
      // If user exists, update their name or avatar if not set, and promote to admin if matches owner email
      let updated = false;
      if (!user.image && image) {
        user.image = image;
        updated = true;
      }
      if (initialRole === 'admin' && user.role !== 'admin') {
        user.role = 'admin';
        updated = true;
      }
      if (updated) await user.save();
    }

    const currentRole = user.role || initialRole;
    const token = generateToken(user._id, currentRole);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: '/',
    });

    return res.status(200).json({
      message: 'Google login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        image: user.image,
        role: currentRole,
      },
    });
  } catch (error: any) {
    console.error('Google Auth Error:', error);
    return res.status(500).json({ message: 'Google authentication failed', error: error.message });
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

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({ username, password: hashedPassword, role });

    return res.status(201).json({ message: 'Admin created successfully', admin: { id: admin._id, username: admin.username } });
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
    const admin = await Admin.findOne({ username: identifier });
    if (admin) {
      const isValidPassword = await bcrypt.compare(password, admin.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = generateToken(admin._id, admin.role);
      
      res.cookie('adminToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 3600 * 1000,
      });

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 3600 * 1000,
      });

      return res.json({
        message: 'Admin login successful',
        token,
        user: { id: admin._id, username: admin.username, role: admin.role },
      });
    }

    // Otherwise check regular user
    if (email || identifier.includes('@')) {
      const user = await User.findOne({ email: identifier });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or user not found' });
      }

      // SECURITY FIX: Reject login if user has no password (guest order user)
      // to prevent any string passing as valid credential
      if (!user.password) {
        return res.status(401).json({ message: 'This account was created via guest checkout. Please register with a password.' });
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const role = isOwnerEmail(user.email) ? 'admin' : (user.role || 'user');
      if (user.role !== role) {
        user.role = role;
        await user.save();
      }

      const token = generateToken(user._id, role);

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 30 * 24 * 3600 * 1000,
      });

      return res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          address: user.address || '',
          role: role,
        },
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

// @desc    Update user profile (name, phone, address)
// @route   PUT /api/auth/me
// @access  Private
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { name, phone, address } = req.body;

    // Legacy separate Admin table accounts don't have name/phone/address
    if (req.user.username && !req.user.email) {
      return res.status(403).json({
        message: 'Legacy admin account details are managed separately.',
      });
    }

    // Regular user update
    const user = await User.findById(req.user._id || req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name && name.trim()) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (address !== undefined) user.address = address.trim();

    const updatedUser = await user.save();

    return res.json({
      user: {
        id: updatedUser._id,
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone || '',
        address: updatedUser.address || '',
        image: updatedUser.image || '',
        role: updatedUser.role || 'user',
      },
    });
  } catch (error: any) {
    console.error('Update Profile Error:', error);
    return res.status(500).json({ message: 'Server error updating profile' });
  }
};


