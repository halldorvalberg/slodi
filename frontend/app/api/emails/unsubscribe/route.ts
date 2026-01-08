import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Ógilt netfang." },
        { status: 400 }
      );
    }

    // TODO: Make actual API call to backend when ready
    // For now, we'll simulate the behavior
    
    // Example of how the backend call would look:
    /*
    const response = await fetch(`${API_BASE_URL}/api/v1/emails/unsubscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.detail || "Ekki tókst að afskrá netfang." },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
    */

    // Temporary simulation - remove when backend is ready
    console.log(`[Unsubscribe Request] Email: ${email}`);
    
    // Simulate a successful unsubscribe
    return NextResponse.json(
      { 
        message: "Netfang afskráð af póstlista.",
        email: email 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("[Unsubscribe Error]", error);
    return NextResponse.json(
      { error: "Villa kom upp við afskráningu. Reyndu aftur síðar." },
      { status: 500 }
    );
  }
}
