import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

// --------------------------------------------------------------------------
// POST /api/waitlist – Insert a new waitlist signup into Supabase
// --------------------------------------------------------------------------

interface WaitlistPayload {
  email: string;
  company_name?: string;
  use_case?: string;
  _gotcha?: string; // honeypot field
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as WaitlistPayload;

    // Honeypot check – bots will fill this hidden field
    if (body._gotcha) {
      // Return 200 silently so bots think it succeeded
      return NextResponse.json({ success: true });
    }

    // ---- Validation ----
    const email = body.email?.trim().toLowerCase();
    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, error: "A valid email address is required." },
        { status: 400 },
      );
    }

    const company_name = body.company_name?.trim() || null;
    const use_case = body.use_case?.trim() || null;

    // ---- Insert into Supabase ----
    const supabase = getServiceSupabase();

    const { error } = await supabase
      .from("waitlist")
      .insert({ email, company_name, use_case });

    if (error) {
      // Unique constraint violation → duplicate email
      if (error.code === "23505") {
        return NextResponse.json(
          {
            success: false,
            error: "This email is already on the waitlist.",
            code: "DUPLICATE_EMAIL",
          },
          { status: 409 },
        );
      }

      console.error("[api/waitlist] Supabase insert error:", error);
      return NextResponse.json(
        { success: false, error: "Unable to join the waitlist right now." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("[api/waitlist] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 },
    );
  }
}
