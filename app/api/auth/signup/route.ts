import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { hashPassword, generateToken, generateId, isValidEmail, isValidPhone } from '@/lib/utils';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, phone } = body;

    // Validation
    if (!email || !password || !name || !phone) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (!isValidPhone(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await storage.users.findOne(u => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const hashedPassword = await hashPassword(password);
    const user = await storage.users.create({
      id: generateId(),
      email,
      password: hashedPassword,
      name,
      phone,
      createdAt: new Date().toISOString(),
    });

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email });

    logger.info('signup success', { userId: user.id, email: user.email });

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
      },
    }, { status: 201 });
  } catch (error) {
    logger.error('signup error', { error: (error as Error).message, stack: (error as Error).stack });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
