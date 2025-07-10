// app/api/create-checkout-session/route.ts

import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-04-10",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { courseId, courseTitle, price, userEmail } = body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: userEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: courseTitle,
            },
            unit_amount: price * 100, // cents
          },
          quantity: 1,
        },
      ],
      metadata: { courseId },
      success_url: `${req.headers.get("origin")}/payment/success`,
      cancel_url: `${req.headers.get("origin")}/courses/${courseId}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return new NextResponse("Failed to create Stripe session", { status: 500 });
  }
}

export function GET() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}
