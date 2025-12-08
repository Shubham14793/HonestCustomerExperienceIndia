import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { verifyToken, generateId } from '@/lib/utils';
import { CaseStatus, LossType } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      companyName,
      domain,
      incidentDate,
      description,
      lossTypes,
      monetaryLoss,
      contactName,
      contactEmail,
      contactPhone,
    } = body;

    // Validation
    if (!companyName || !domain || !incidentDate || !description || !lossTypes || !contactName || !contactEmail || !contactPhone) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    if (!Array.isArray(lossTypes) || lossTypes.length === 0) {
      return NextResponse.json(
        { error: 'At least one loss type must be selected' },
        { status: 400 }
      );
    }

    // Create case
    const caseData = await storage.cases.create({
      id: generateId(),
      userId: decoded.userId,
      status: 'submitted' as CaseStatus,
      companyName,
      domain,
      incidentDate,
      description,
      lossTypes: lossTypes as LossType[],
      monetaryLoss: monetaryLoss ? parseFloat(monetaryLoss) : undefined,
      contactName,
      contactEmail,
      contactPhone,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Create initial update
    await storage.updates.create({
      id: generateId(),
      caseId: caseData.id,
      message: 'Your case has been submitted successfully and is under review.',
      createdAt: new Date().toISOString(),
      createdBy: 'system',
    });

    return NextResponse.json({
      success: true,
      case: caseData,
    }, { status: 201 });
  } catch (error) {
    console.error('Case submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get user's cases
    const cases = await storage.cases.findMany(c => c.userId === decoded.userId);

    return NextResponse.json({
      cases: cases.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    });
  } catch (error) {
    console.error('Get cases error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
