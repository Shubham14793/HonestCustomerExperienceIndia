import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { toStringArray, verifyToken } from '@/lib/utils';

function normalizeCase(caseData: any) {
  return {
    ...caseData,
    lossTypes: toStringArray(caseData?.lossTypes),
    evidenceFiles: caseData?.evidenceFiles ? toStringArray(caseData.evidenceFiles) : undefined,
    monetaryLoss:
      caseData?.monetaryLoss === null || caseData?.monetaryLoss === undefined
        ? undefined
        : typeof caseData.monetaryLoss === 'number'
          ? caseData.monetaryLoss
          : Number(caseData.monetaryLoss),
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Get case
    const caseData = await storage.cases.findOne(c => c.id === id);
    if (!caseData) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }

    // Verify user owns this case
    if (caseData.userId !== decoded.userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Get updates for this case
    const updates = await storage.updates.findMany(u => u.caseId === id);

    return NextResponse.json({
      case: normalizeCase(caseData),
      updates: updates.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    });
  } catch (error) {
    console.error('Get case error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
