# Formspree enquiry form

The “Work with us” form sends its fields directly from the browser to Formspree and keeps visitors on the site. Configure the Formspree form endpoint as the Vite environment variable `VITE_FORMSPREE_ENDPOINT` (for example, `https://formspree.io/f/your-form-id`).

For local development, create a `.env.local` file in the project root:

```dotenv
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/your-form-id
```

Replace the example with the endpoint shown in the Formspree dashboard, then restart the Vite dev server. For Vercel, add `VITE_FORMSPREE_ENDPOINT` under Project Settings ? Environment Variables for each environment you deploy, then redeploy. Vite exposes `VITE_` variables in the client bundle, so this value must be the public form endpoint only; never put a private API key or other secret there.

If the variable is missing, the form shows a clear configuration message and the chapter email address as a fallback. Formspree must also have the form created and submissions enabled for the endpoint.
