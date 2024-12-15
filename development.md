https://clerk.com/blog/webhooks-getting-started

npm install --save-dev localtunnel

"scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "tunnel": "npx localtunnel --port 3000"
  }

How to Use It:

    Start your development server using npm run dev (or yarn dev if using Yarn).

npm run dev

This will start your Next.js app locally on http://localhost:3000.

Expose your local server with LocalTunnel in a separate terminal window.

    npm run tunnel

    This will create a public URL, such as https://xyz123.loca.lt, which will forward requests to http://localhost:3000.

Optional: Customize the Subdomain

If you'd like a custom subdomain for the tunnel, you can modify the tunnel script like this:

"tunnel": "npx localtunnel --port 3000 --subdomain mycustomsubdomain"


//add image from public folder localtunnel.png