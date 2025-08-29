// import Stripe from "stripe";
// import { headers } from "next/headers";
// import { stripe } from "@/lib/stripe";
// import { NextResponse } from "next/server";
// import { userSubscription } from "@/db/schema";
// import db from "@/db/drizzle";
// import { eq } from "drizzle-orm";


// export async function POST(req: Request) {
//     const body = await req.text();
//     const signature = headers();// TODO: CHECK THIS here await is added as headers alone was causing an error

//     let event: Stripe.Event;

//     try{
//         event = stripe.webhooks.constructEvent(
//             body,
//             signature,
//             process.env.STRIPE_WEBHOOKS_SECRET!, // NOTE: In production this is gained from the console
//         );
//     } catch(error: any) {
//         return new NextResponse(`Webhook error: ${error.message}`,{
//              status: 400,
//         });
//     }

//     const session = event.data.object as Stripe.Checkout.Session;
//     if (event.type === "checkout.session.completed") {
//         const subscription = await stripe.subscriptions.retrieve(
//             session.subscription as string
//         );

//         if(!session?.metadata?.userId){
//             return new NextResponse("User ID is required", {status: 400});
//         }

//         await db.insert(userSubscription).values({
//             userId: session.metadata.userId,
//             stripeSubscriptionId: subscription.id,
//             stripeCustomerId: subscription.customer as string,
//             stripePriceId : subscription.items.data[0].price.id,
//             stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000,
//             ),
//         });
//     }

//     if (event.type === "invoice.payment_succeeded"){
//          const subscription = await stripe.subscriptions.retrieve(
//             session.subscription as string
//         );

//         await db.update(userSubscription).set({
//             stripePriceId: subscription.items.data[0].price.id,
//             stripeCurrentPeriodEnd: new Date(
//                 subscription.current_period_end * 1000,// NOTE: used npm i stripe@17 to solve the problem here
//             ),
//         }).where(eq(userSubscription.stripeSubscriptionId, subscription.id))
//     }
    
//     return new NextResponse(null,{status:200});
// };

// app/api/webhooks/stripe/route.ts
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import db from "@/db/drizzle";
import { userSubscription } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature"); 
  if (!sig) return new Response("Missing stripe-signature", { status: 400 });

  const rawBody = await req.text();
  const secret =
    process.env.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOKS_SECRET;
  if (!secret) return new Response("Missing STRIPE_WEBHOOK_SECRET", { status: 500 });

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, sig, secret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Invalid signature";
    return new Response(`Webhook error: ${msg}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        if (!userId) return new Response("User ID is required", { status: 400 });

        const subId = session.subscription as string | null;
        if (!subId) return new Response("Missing subscription id", { status: 400 });

        const sub = await stripe.subscriptions.retrieve(subId);

        await db.insert(userSubscription).values({
          userId,
          stripeSubscriptionId: sub.id,
          stripeCustomerId: sub.customer as string,
          stripePriceId: sub.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(sub.current_period_end * 1000),
        });
        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = invoice.subscription as string | null;
        if (!subId) break;

        const sub = await stripe.subscriptions.retrieve(subId);

        await db
          .update(userSubscription)
          .set({
            stripePriceId: sub.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(sub.current_period_end * 1000),
          })
          .where(eq(userSubscription.stripeSubscriptionId, sub.id));
        break;
      }
      default:
        break;
    }
    return new Response(null, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unhandled webhook handler error";
    return new Response(`Webhook handler error: ${msg}`, { status: 500 });
  }
}

