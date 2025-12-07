import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');
  const languageCode = searchParams.get('languageCode') || 'en';

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    );
  }

  const apiKey = process.env.GOOGLE_FACT_CHECK_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Server configuration error: GOOGLE_FACT_CHECK_API_KEY is missing' },
      { status: 500 }
    );
  }

  try {
    const url = `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=${encodeURIComponent(query)}&languageCode=${languageCode}&key=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fact check error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fact check data' },
      { status: 500 }
    );
  }
}