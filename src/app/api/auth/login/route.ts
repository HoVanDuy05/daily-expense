import { NextRequest, NextResponse } from 'next/server';

// Mock user database
const users = [
  {
    id: 'user_001',
    name: 'Nguyễn Văn A',
    email: 'vanduyho717@gmail.com',
    password: 'hovanduy2@5', // In production, this should be hashed
  }
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Find user by email
    const user = users.find(u => u.email === email);

    if (!user || user.password !== password) {
      return NextResponse.json(
        { message: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      );
    }

    // Generate token (in production, use JWT)
    const token = `token_${user.id}_${Date.now()}`;

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: 'Đăng nhập thành công',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    return NextResponse.json(
      { message: 'Lỗi server' },
      { status: 500 }
    );
  }
}
