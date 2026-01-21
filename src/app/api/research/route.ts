import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ResearchRequest, ResearchResponse } from '@/lib/types';
import { createClient } from '@/lib/supabase/server';

// Increase the max duration for this route (allows up to 5 minutes for research)
// Note: Vercel Hobby plan has 60s limit, Pro plan has 300s limit
export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    // Validate authentication
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('ai-auth');

    if (!authCookie || authCookie.value !== 'authenticated') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body: ResearchRequest = await request.json();

    // Validate required fields
    if (!body.email || !body.pdfBase64 || !body.pdfFilename) {
      return NextResponse.json(
        { error: 'Missing required fields: email, pdfBase64, pdfFilename' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Get webhook URL from environment
    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error('N8N_WEBHOOK_URL environment variable not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Create AbortController for timeout (5 minutes)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000);

    try {
      // Forward request to n8n webhook
      const n8nResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: body.email,
          pdfBase64: body.pdfBase64,
          pdfFilename: body.pdfFilename,
          businessContext: body.businessContext || '',
          researchPriority: body.researchPriority || 'All Areas (Recommended)',
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!n8nResponse.ok) {
        const errorText = await n8nResponse.text();
        console.error('n8n webhook error:', n8nResponse.status, errorText);
        return NextResponse.json(
          { error: `Research request failed (${n8nResponse.status}). Please try again.` },
          { status: 502 }
        );
      }

      // Check for empty response
      const responseText = await n8nResponse.text();
      if (!responseText || responseText.trim() === '') {
        console.error('n8n webhook returned empty response');
        return NextResponse.json(
          { error: 'The research workflow returned no data. Please check the n8n workflow configuration.' },
          { status: 502 }
        );
      }

      // Parse JSON response
      let data: ResearchResponse;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('n8n webhook returned invalid JSON:', responseText.substring(0, 500));
        return NextResponse.json(
          { error: 'The research workflow returned invalid data. Please check the n8n workflow configuration.' },
          { status: 502 }
        );
      }

      // Save report to Supabase
      try {
        const supabase = await createClient();
        const normalizedEmail = body.email.toLowerCase().trim();

        // Get or create user
        let userId: string;
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', normalizedEmail)
          .single();

        if (existingUser) {
          userId = existingUser.id;
        } else {
          const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({ email: normalizedEmail })
            .select('id')
            .single();

          if (createError || !newUser) {
            console.error('Error creating user for auto-save:', createError);
            // Don't fail the request, just skip auto-save
            return NextResponse.json(data);
          }
          userId = newUser.id;
        }

        // Create the report
        const reportName = `Research - ${new Date().toLocaleDateString()}`;
        const { data: savedReport, error: reportError } = await supabase
          .from('reports')
          .insert({
            user_id: userId,
            name: reportName,
            request_email: normalizedEmail,
            request_pdf_filename: body.pdfFilename || '',
            request_business_context: body.businessContext || '',
            request_research_priority: body.researchPriority || 'All Areas (Recommended)',
            response_data: data,
            google_doc_url: data.googleDocUrl || null,
          })
          .select('id')
          .single();

        if (reportError) {
          console.error('Error auto-saving report:', reportError);
          // Don't fail the request, just skip auto-save
        } else if (savedReport) {
          // Store email in cookie for future requests
          const cookieStore = await cookies();
          cookieStore.set('user-email', normalizedEmail, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 365, // 1 year
          });

          // Include the saved report ID in the response
          return NextResponse.json({ ...data, savedReportId: savedReport.id });
        }
      } catch (saveError) {
        console.error('Error during auto-save:', saveError);
        // Don't fail the request, just skip auto-save
      }

      return NextResponse.json(data);
    } catch (fetchError) {
      clearTimeout(timeoutId);

      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error('n8n webhook timeout after 5 minutes');
        return NextResponse.json(
          { error: 'Research is taking longer than expected. Please try again.' },
          { status: 504 }
        );
      }
      throw fetchError;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    console.error('Research API error:', errorMessage);
    console.error('Stack:', errorStack);
    return NextResponse.json(
      { error: `An unexpected error occurred: ${errorMessage}` },
      { status: 500 }
    );
  }
}
