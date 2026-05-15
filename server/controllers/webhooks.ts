import { verifyWebhook } from "@clerk/express/webhooks";
import User from "../models/Users.js";
import type { Controller } from "../types/express.js";

export const clerkWebhook: Controller = async (req, res) => {
  try {
    const evt = await verifyWebhook(req);

    if (evt.type === "user.created" || evt.type === "user.updated") {
      const adminEmail = process.env.ADMIN_EMAIL;

      const email = evt.data?.email_addresses[0]?.email_address;

      const userData = {
        clerkId: evt.data.id,
        email,
        name: evt.data?.first_name + " " + evt.data?.last_name,
        image: evt.data?.image_url,
        role: email === adminEmail ? "admin" : "user",
      };

      await User.findOneAndUpdate({ clerkId: evt.data.id }, userData, {
        upsert: true,
        new: true,
      });
    }

    return res.json({ success: true, message: "WebHook Recived" });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return res.status(400).send("Error verifying webhook");
  }
};
