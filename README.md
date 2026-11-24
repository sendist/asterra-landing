# Asterra landing page

A Next.js landing page for Asterra: Collect the Stars.

Run the local preview with `npm install` and `npm run dev`. Open [localhost:3000](http://localhost:3000).

## Launch waitlist

The development form accepts test signups and optional feedback. It stores signups in the operating system’s temporary `asterra-waitlist-preview` directory and saves feedback in its `feedback` subdirectory. It deduplicates signups by email and feedback by email and message. Production shows the App Store review status and an Instagram link until an email provider is selected.

### Enable MailerLite

1. Create an **Asterra Launch** subscriber group and an **Asterra Feedback** custom field of type **Text**.
2. In **Integrations → MailerLite API → Use**, find the group ID and generate an API token. Find the field key in the [Fields API](https://developers.mailerlite.com/api/fields). For a new **Asterra Feedback** field the key is normally `asterra_feedback`.
3. Add these server-side values to `.env.local` for local testing or to your host’s environment before building and deploying.

   ```dotenv
   MAILERLITE_API_TOKEN=
   MAILERLITE_GROUP_ID=
   MAILERLITE_FEEDBACK_FIELD=asterra_feedback
   ```

4. Restart the dev server after setting local values. Submit a test signup with feedback and check the subscriber in MailerLite. The form saves the latest non-empty feedback from each email address. If **Double opt-in for API and integrations** is enabled, confirm the test signup via email.
5. When Asterra is available, send a regular campaign from the MailerLite dashboard to **Asterra Launch** with the App Store link.
