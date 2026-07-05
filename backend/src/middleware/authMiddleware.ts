import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Admin from '../models/Admin';

export interface AuthRequest extends Request {
  user?: any;
}

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

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && (req.cookies.token || req.cookies.adminToken)) {
    token = req.cookies.token || req.cookies.adminToken;
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_for_development');
    
    // Check User table first (supports both 'user' and promoted 'admin' roles)
    const user = await User.findById(decoded.id).select('-password').lean();
    if (user) {
      const role = isOwnerEmail(user.email) ? 'admin' : (user.role || 'user');
      if (user.role !== role) {
        await User.findByIdAndUpdate(user._id, { role });
      }
      req.user = { ...user, id: user._id, role };
      return next();
    }

    // Fallback: Check separate Admin table for legacy/dedicated admin accounts
    const admin = await Admin.findById(decoded.id).select('-password').lean();
    if (admin) {
      req.user = { ...admin, id: admin._id, role: 'admin' };
      return next();
    }

    return res.status(401).json({ message: 'Not authorized, account not found' });
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};
