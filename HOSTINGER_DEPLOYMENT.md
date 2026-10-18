# Hostinger Production Deployment Guide for Titan Shilajit Store

This guide provides end-to-end instructions for deploying the **Titan Shilajit** e-commerce application to **Hostinger** while preserving **Firebase Firestore**, **Firebase Authentication**, **Razorpay Payments**, and **Delhivery One Logistics**.

---

## 1. Hosting Plan Assessment & Compatibility

### Critical Assessment: Standard PHP Hosting vs. Node.js / VPS
- **Standard Shared Web Hosting (PHP / Apache / LiteSpeed only)**:  
  ❌ **Cannot run this application.** The project requires an active, long-running Node.js process to execute the Express backend (`server.ts` / `dist/server.cjs`), handle Razorpay HMAC-SHA256 payment verification, interact with Delhivery APIs, serve server-side Gemini AI chat, and manage invoice counters.
- **Hostinger KVM VPS (Recommended — KVM 1, KVM 2, KVM 4, or KVM 8)**:  
  ✅ **Best & Most Reliable Choice.** Gives dedicated resources, Ubuntu Linux OS, full root access, PM2 process management, Nginx reverse proxy, free automated Let's Encrypt SSL, and permanent disk persistence for `/uploads`.
- **Hostinger Cloud Hosting / Node.js Web Hosting (hPanel with Node.js Manager)**:  
  ✅ **Supported.** If your Hostinger plan includes the **Node.js Application Manager** in hPanel (Cloud Startup, Cloud Professional, or Cloud Enterprise), you can run Node.js 18.x, 20.x, or 22.x with reverse-proxied ports.

---

## 2. Architecture & Runtime Overview

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 19 + Vite | Compiled to static HTML/JS/CSS in `dist/` |
| **Backend** | Node.js + Express | Bundled to `dist/server.cjs`, started via `server.js` or `npm start` |
| **Database** | Firebase Firestore | Cloud database — completely preserved, zero migration needed |
| **Authentication** | Firebase Auth | Google Sign-In & Email/Password — completely preserved |
| **Payments** | Razorpay | Server-side HMAC validation + direct fallback |
| **Shipping** | Delhivery One | Live AWB generation, pincode serviceability, and order sync |
| **File Storage** | Hybrid Local & CDN | Stored in `public/uploads/` (or configurable `UPLOADS_DIR`), with image URL support |
| **Port Binding** | Dynamic Port | Uses `process.env.PORT` automatically with fallback to `3000` |

---

## 3. Option A: Deployment on Hostinger KVM VPS (Recommended)

### Step 1: Initial VPS Setup (Ubuntu 22.04 or 24.04 LTS)
SSH into your VPS as `root`:
```bash
ssh root@your-vps-ip
```

Update packages and install Node.js 20 LTS, Git, Nginx, and PM2:
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs git nginx certbot python3-certbot-nginx

# Install PM2 process manager globally
npm install -g pm2
```

### Step 2: Clone Repository & Install Dependencies
```bash
# Create application directory
mkdir -p /var/www/titan-store
cd /var/www/titan-store

# Clone your GitHub repository
git clone https://github.com/your-username/your-repo.git .

# Install dependencies (production + build devDependencies)
npm install
```

### Step 3: Configure Production Environment Variables
Create `/var/www/titan-store/.env`:
```bash
nano .env
```
Paste your production environment variables:
```ini
NODE_ENV=production
PORT=3000

# Persistent uploads directory (outside git checkout so git pull never touches it)
UPLOADS_DIR=/var/www/titan-store-uploads

# Razorpay
RAZORPAY_KEY_ID=rzp_live_your_actual_key_id
RAZORPAY_KEY_SECRET=your_actual_razorpay_secret
VITE_RAZORPAY_KEY_ID=rzp_live_your_actual_key_id

# Delhivery One Shipping
DELHIVERY_TOKEN=your_delhivery_api_token
DELHIVERY_PICKUP_LOCATION="SHRI RAM TRADERS 1 B2B"
DELHIVERY_CLIENT_ID=ucp-service-cli
DELHIVERY_CLIENT_SECRET=your_delhivery_client_secret

# Gemini AI (Optional for wellness assistant)
GEMINI_API_KEY=your_gemini_api_key
```

### Step 4: Set Up Persistent Uploads Directory
To ensure uploaded product images survive `git pull` or codebase updates:
```bash
# Create external persistent uploads folder
mkdir -p /var/www/titan-store-uploads

# Copy initial seed product images if needed
cp -rn /var/www/titan-store/public/uploads/* /var/www/titan-store-uploads/ 2>/dev/null || true

# Set correct permissions
chown -R www-data:www-data /var/www/titan-store-uploads
chmod -R 775 /var/www/titan-store-uploads
```

### Step 5: Build the Application
```bash
cd /var/www/titan-store
npm run build
```
This builds the React frontend to `dist/` and compiles `server.ts` to `dist/server.cjs`.

### Step 6: Start with PM2
```bash
# Start the production server
pm2 start server.js --name "titan-store" --env production

# Ensure PM2 starts automatically on server boot
pm2 save
pm2 startup
# (Run the sudo env PATH=... command printed by pm2 startup)
```

Verify the app is running locally:
```bash
curl http://127.0.0.1:3000/api/health
# Expected: {"status":"ok","brand":"Titan Shilajit",...}
```

### Step 7: Configure Nginx as Reverse Proxy
Create `/etc/nginx/sites-available/titan-store`:
```bash
nano /etc/nginx/sites-available/titan-store
```
Paste the following configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Maximum upload size for product images
    client_max_body_size 50M;

    # Directly serve persistent uploads with aggressive caching
    location /uploads/ {
        alias /var/www/titan-store-uploads/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
        try_files $uri @proxy;
    }

    # Proxy all other requests to Node.js / Express
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location @proxy {
        proxy_pass http://127.0.0.1:3000;
    }
}
```

Enable the site and test Nginx:
```bash
ln -s /etc/nginx/sites-available/titan-store /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
```

### Step 8: Free SSL Certificate (HTTPS)
```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
Follow the prompts. Certbot automatically configures auto-renewing SSL certificates.

---

## 4. Option B: Deployment on Hostinger Cloud Hosting (hPanel Node.js Manager)

If your Hostinger account is a **Cloud Plan** with the **Node.js** icon in hPanel:

1. **Deploy Repository**:
   - In hPanel, go to **Advanced > GIT** or clone your repository into your domain's folder (e.g. `/home/uXXXX/domains/yourdomain.com/public_html`).
2. **Access Node.js Application Manager**:
   - In hPanel, search for **Node.js** and click **Create Application**.
   - **Node.js version**: Select `20.x` (or `18.x`).
   - **Application mode**: `Production`.
   - **Application root**: `public_html` (or the folder where the project files reside).
   - **Application startup file**: `dist/server.cjs` (or `server.js`).
3. **Set Environment Variables**:
   - In the Node.js settings panel, add:
     - `NODE_ENV` = `production`
     - `RAZORPAY_KEY_ID` = `rzp_live_...`
     - `RAZORPAY_KEY_SECRET` = `...`
     - `VITE_RAZORPAY_KEY_ID` = `rzp_live_...`
     - `DELHIVERY_TOKEN` = `...`
     - `DELHIVERY_PICKUP_LOCATION` = `SHRI RAM TRADERS 1 B2B`
4. **Build the Application via SSH**:
   - Connect via SSH to your Hostinger account:
     ```bash
     cd public_html
     npm install
     npm run build
     ```
5. **Start Application**:
   - In hPanel, click **Restart Application** or **Start**.

---

## 5. Environment Variables Reference

| Variable Name | Required | Location | Description |
|---|---|---|---|
| `PORT` | Auto | Server-side | Assigned by Hostinger or defaults to `3000` |
| `NODE_ENV` | Yes | Server-side | Set to `production` |
| `UPLOADS_DIR` | Optional | Server-side | Custom path for persistent uploads (e.g., `/var/www/titan-store-uploads`) |
| `RAZORPAY_KEY_ID` | Yes | Server-side | Razorpay Key ID for backend order creation & HMAC verification |
| `RAZORPAY_KEY_SECRET` | Yes | Server-side (Private) | Razorpay Key Secret (never exposed to client) |
| `VITE_RAZORPAY_KEY_ID` | Yes | Frontend bundle | Public client key for opening standard checkout modal |
| `DELHIVERY_TOKEN` | Yes | Server-side | Delhivery API token for shipment dispatch & AWB generation |
| `DELHIVERY_PICKUP_LOCATION` | Yes | Server-side | Registered pickup hub name (e.g. `SHRI RAM TRADERS 1 B2B`) |
| `DELHIVERY_CLIENT_ID` | Optional | Server-side | Delhivery UCP Client ID |
| `DELHIVERY_CLIENT_SECRET` | Optional | Server-side (Private) | Delhivery UCP Client Secret |
| `GEMINI_API_KEY` | Optional | Server-side | Google Gemini API key for Ayurvedic wellness chat |

> **Note on Firebase Credentials**: Firebase Firestore configuration (`firebase-applet-config.json` and client SDK) is committed safely to the codebase because Firebase client keys are designed for public client authorization protected by `firestore.rules`. Firestore admin and token settings are synchronized automatically.

---

## 6. Continuous Deployment & Future Updates

When you push updates to GitHub, deploy them to your Hostinger VPS in 3 simple commands:

```bash
cd /var/www/titan-store
git pull origin main
npm install && npm run build
pm2 reload titan-store
```

Because `UPLOADS_DIR` points to an external directory (or because `public/uploads` is preserved on disk), existing uploaded product images will **never** be deleted or broken by new deployments.

---

---

## 7. Custom Domain & Firebase Auth Whitelist Setup

To connect your custom domain (e.g. `yourdomain.com` and `www.yourdomain.com`):

### Step 1: DNS Records at Domain Registrar (GoDaddy, Namecheap, Cloudflare, etc.)
Point your domain's DNS to your Hostinger server IP:
| Type | Name / Host | Target / Value | TTL |
|---|---|---|---|
| `A` | `@` (or leave blank) | `YOUR_HOSTINGER_VPS_IP` | Automatic / 300s |
| `CNAME` | `www` | `yourdomain.com` | Automatic / 300s |

### Step 2: Authorize Custom Domain in Firebase Console (CRITICAL)
Because this app uses Firebase Authentication (and Firestore), Firebase will block authentication requests from unregistered domains:
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project: `ai-studio-titanshilajitpur-1452db60-7239-4a0f-a49f-6a6e1915aa02`.
3. In the left sidebar, navigate to **Build > Authentication > Settings**.
4. Click the **Authorized domains** tab.
5. Click **Add domain** and enter your custom domain:
   - Add `yourdomain.com`
   - Add `www.yourdomain.com`
6. Click **Save**.

### Step 3: Issue Free SSL (HTTPS)
Once your DNS records point to your Hostinger VPS, run Certbot:
```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
Certbot will automatically obtain certificates and configure Nginx to redirect all HTTP traffic to HTTPS.

---

## 8. Hidden Admin Desk Access (`/supreme-titanadmin`)

For security and brand aesthetics:
- **Public storefront buttons removed**: The Admin Desk button is completely hidden from the footer, navigation header, and checkout confirmation pages. Standard shoppers will never see any administrative link.
- **Dedicated Secret Route**: The Admin Panel is exclusively accessible by directly appending `/supreme-titanadmin` to your domain:
  ```
  https://yourdomain.com/supreme-titanadmin
  ```
- **Automatic Protection**: Legacy URLs (`/admin` and `/admin-desk`) automatically redirect back to the storefront (`/`) so unauthorized visitors cannot guess or access admin endpoints.
- **Permanent Super Admin Credentials**: The pre-authorized admin (`amanbhambhani33@gmail.com`) retains full Super Admin authority to approve new staff requests, manage the catalog, configure Delhivery shipping, and view order receipts.

---

## 9. Verification Checklist

After deploying on Hostinger, test these endpoints:

- [ ] **Health Check**:
  ```bash
  curl -i https://yourdomain.com/api/health
  # Response: HTTP 200 OK {"status":"ok","brand":"Titan Shilajit","razorpayConfigured":true}
  ```
- [ ] **Storefront Products API**:
  ```bash
  curl -i https://yourdomain.com/api/store-content/products
  # Response: HTTP 200 OK with product catalog JSON
  ```
- [ ] **Static Assets & Uploaded Images**:
  ```bash
  curl -i https://yourdomain.com/uploads/titan-honey-sticks-classic-0.jpg
  # Response: HTTP 200 OK image/jpeg
  ```
- [ ] **Delhivery Pincode Serviceability**:
  ```bash
  curl -i "https://yourdomain.com/api/delhivery/serviceability?pincode=110001"
  # Response: HTTP 200 OK with delivery estimate
  ```
- [ ] **Hidden Admin Panel Route**:
  Open `https://yourdomain.com/supreme-titanadmin` in your browser. Verify the Admin Login Gate opens.
- [ ] **Legacy Route Protection**:
  Open `https://yourdomain.com/admin` or `https://yourdomain.com/admin-desk`. Verify it immediately redirects to the storefront home page (`/`).
- [ ] **Frontend Single Page Navigation**:
  Open `https://yourdomain.com/` in your browser. Navigate to `/shop`, `/product/titan-shilajit-resin`, and `/cart`. Refresh the page on any subpath to confirm Nginx rewrites correctly to `index.html`.
- [ ] **Order Placement (COD & Online)**:
  Perform a test order with Cash on Delivery (COD) to verify Firestore order persistence and continuous invoice numbering.

---

## 10. Safe DNS Cutover from Vercel

To ensure zero downtime:
1. Complete all setup steps on Hostinger first.
2. Verify all API routes and frontend pages using your VPS IP address or Hostinger temporary preview URL.
3. Once 100% verified, update your domain's DNS `A` records (at GoDaddy, Namecheap, or Cloudflare) from Vercel's IP to your Hostinger VPS IP:
   - Type: `A`, Host: `@`, Value: `YOUR_HOSTINGER_VPS_IP`
   - Type: `CNAME`, Host: `www`, Value: `yourdomain.com`
4. Once DNS propagates (15-30 minutes), issue the SSL certificate via `certbot --nginx`.
5. Add the domain to Firebase Auth Authorized Domains.
6. Keep Vercel active as a standby until all DNS caches resolve to Hostinger.
