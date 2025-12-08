import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function GET(request: NextRequest) {
  try {
    // Get YouTube configuration
    const configs = await storage.config.readAll();
    const config = configs.length > 0 ? configs[0] : null;

    if (!config) {
      // Return default configuration
      return NextResponse.json({
        channelUrl: 'https://www.youtube.com/@HonestCustomerExperienceIndia',
        featuredVideoId: '', // Empty until configured by admin
        lastUpdated: new Date().toISOString(),
      });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error('Get config error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
