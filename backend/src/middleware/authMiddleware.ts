import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Admin from '../models/Admin';

export interface AuthRequest extends Request {
  user?: any;
}

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
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    
    // Check if it's admin or regular user
    if (decoded.role === 'admin') {
      const admin = await Admin.findById(decoded.id).select('-password').lean();
      if (!admin) {
        return res.status(401).json({ message: 'Not authorized, admin not found' });
      }
      req.user = { ...admin, id: admin._id, role: 'admin' };
    } else {
      const user = await User.findById(decoded.id).select('-password').lean();
      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      req.user = { ...user, id: user._id, role: 'user' };
    }

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};
