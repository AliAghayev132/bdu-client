import { NextResponse } from 'next/server';

/**
 * Contact Form API Route
 * Rektora müraciət və ümumi əlaqə formları üçün
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { firstName, lastName, faculty, email, phone, subject, message, type, locale } = body;
    
    // Validation
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Required fields missing' },
        { status: 400 }
      );
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // TODO: Implement actual email sending or database storage
    // Example: Send email via nodemailer, SendGrid, or save to database
    
    console.log('Contact form submission:', {
      firstName,
      lastName,
      faculty,
      email,
      phone,
      subject,
      message,
      type,
      locale,
      timestamp: new Date().toISOString()
    });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Success response
    return NextResponse.json(
      { 
        success: true,
        message: locale === 'az' 
          ? 'Müraciətiniz uğurla göndərildi' 
          : 'Your message has been sent successfully'
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle other methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
