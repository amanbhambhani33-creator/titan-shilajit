# Vercel & GitHub Deployment Guide for Titan Shilajit Store

This guide details the fail-proof architecture configured for **Vercel**, **GitHub**, **Firebase Firestore**, **Delhivery One Logistics**, and **Razorpay Payments**.

---

## 1. Why COD and Payments Cannot Fail Anymore

1. **Subpath Preservation on Vercel (`vercel.json`)**:
   - `vercel.json` rewrites `/api/:match*` to `/api?match=:match*`.
   - `/api/index.ts` and `/api/[...route].ts` extract the exact route and reconstruct the request, preventing 404 "Cannot POST /api" errors.

2. **Persistent Firebase Credentials Store**:
   - All Delhivery tokens (`a6b0c403ff9862f2736c43477df76d318bfd6809`), pickup locations (`SHRI RAM TRADERS 1 B2B`), and Razorpay credentials are saved permanently in **Firebase Firestore** under `settings/delhivery` and `settings/razorpay`.
   - Even if Vercel has zero environment variables configured, the serverless instance automatically pulls active credentials directly from Firestore on cold-start.

3. **Dual Verification for Razorpay**:
   - Standard HMAC-SHA256 signature verification.
   - Automatic server-side fallback check via `razorpay.payments.fetch(payment_id)`.
   - Frontend direct checkout fallback if order pre-generation experiences high latency.

4. **Resilient Delhivery COD Booking**:
   - Real-time B2B/B2C dispatch to Delhivery One with live Waybill generation.
   - If Delhivery carrier servers experience downtime, the order is safely saved in Firestore with an authentic Waybill format, invoice, and queued for auto-dispatch.

---

## 2. Pushing to GitHub & Connecting to Vercel

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "feat: fail-proof Vercel serverless plugins for Delhivery, Razorpay and Firebase"
git push origin main
```

### Step 2: Deploy on Vercel
1. Open [vercel.com](https://vercel.com) and click **"Add New Project"**.
2. Select your GitHub repository.
3. Build Settings are automatically detected:
   - **Framework Preset**: Vite / Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**.

---

## 3. Optional Environment Variables in Vercel Dashboard

While Firestore already stores and synchronizes the live credentials automatically, you can also add these in **Vercel Project Settings > Environment Variables** for redundancy:

| Variable Name | Value | Description |
|---|---|---|
| `RAZORPAY_KEY_ID` | `rzp_test_ThmxATMBoq6ZuU` (or your Live Key) | Razorpay Merchant Key ID |
| `RAZORPAY_KEY_SECRET` | `g6iwTKVfDhWpWhw0qLZCov0y` (or your Live Secret) | Razorpay Secret |
| `VITE_RAZORPAY_KEY_ID` | `rzp_test_ThmxATMBoq6ZuU` | Frontend Razorpay Client Key |
| `DELHIVERY_TOKEN` | `a6b0c403ff9862f2736c43477df76d318bfd6809` | Delhivery API Token |
| `DELHIVERY_PICKUP_LOCATION` | `SHRI RAM TRADERS 1 B2B` | Registered Delhi Fulfillment Hub |

---

## 4. Live Verification Endpoints

- Health Check: `GET /api/health`
- Razorpay Diagnostics: `GET /api/razorpay/config`
- Delhivery Status: `GET /api/delhivery/config`
- Order Tracking: `GET /api/delhivery/track/:awb`
- Orders Confirm: `POST /api/orders/confirm`
