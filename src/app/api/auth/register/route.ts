import { NextRequest, NextResponse } from 'next/server';

// Mock user database
let users = [
  {
    id: 'user_001',
    name: 'Nguyễn Văn A',
    email: 'user@example.com',
    password: 'password123',
  }
];

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email đã được sử dụng' },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = {
      id: `user_${Date.now()}`,
      name,
      email,
      password, // In production, hash this password
    };

    users.push(newUser);

    return NextResponse.json({
      message: 'Đăng ký thành công',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      }
    });

  } catch (error) {
    return NextResponse.json(
      { message: 'Lỗi server' },
      { status: 500 }
    );
  }
}
