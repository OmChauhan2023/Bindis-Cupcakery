import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    
    // Check if it's admin or regular user
    if (decoded.role === 'admin') {
      const admin = await prisma.admin.findUnique({ where: { id: decoded.id } });
      if (!admin) {
        return res.status(401).json({ message: 'Not authorized, admin not found' });
      }
      req.user = { ...admin, role: 'admin' };
    } else {
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      req.user = { ...user, role: 'user' };
    }

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};
