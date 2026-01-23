# CAKE Weekly Metrics Dashboard

A React-based dashboard for visualizing CAKE's weekly performance metrics.

## Quick Start

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Build for production
npm run build
```

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "New Project" → Import your repo
4. Click "Deploy" (no configuration needed)
5. Done! You'll get a URL like `cake-metrics.vercel.app`

**To update:** Just push changes to GitHub, Vercel auto-deploys.

### Option 2: Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize (select "Hosting", use "dist" as public folder)
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

### Option 3: Google Cloud Storage

```bash
# Build the project
npm run build

# Create a bucket (one-time)
gsutil mb gs://cake-metrics-dashboard

# Make it publicly accessible
gsutil iam ch allUsers:objectViewer gs://cake-metrics-dashboard

# Configure as static website
gsutil web set -m index.html gs://cake-metrics-dashboard

# Upload built files
gsutil -m cp -r dist/* gs://cake-metrics-dashboard
```

## Weekly Updates

The data file `src/data.js` is updated each Friday with new metrics from BigQuery.

To update manually:
1. Edit `src/data.js` with new week's data
2. Run `npm run build`
3. Redeploy (method depends on your hosting choice)

## Project Structure

```
cake-metrics-dashboard/
├── src/
│   ├── main.jsx              # App entry point
│   ├── WeeklyMetricsDashboard.jsx  # Main dashboard component
│   ├── data.js               # Weekly metrics data (UPDATE THIS)
│   └── index.css             # Tailwind styles
├── public/
│   └── favicon.svg           # Site icon
├── index.html                # HTML template
├── package.json              # Dependencies
├── vite.config.js            # Build configuration
├── tailwind.config.js        # Tailwind CSS config
└── postcss.config.js         # PostCSS config
```

## Data Fields (src/data.js)

Each week object contains:
- `week`: Week label (e.g., "Week 4")
- `dateRange`: Date range (e.g., "Jan 23-29")
- `caSalesUnits`: California units sold
- `caSalesDollars`: California revenue
- `caPromoUnits`: California promo units
- `caUnitsManufactured`: Units manufactured
- `cogsPercent`: Cost of goods sold percentage
- `caOrdersDelivered`: Number of orders
- `azSalesUnits/azSalesDollars`: Arizona metrics
- `nvSalesUnits/nvSalesDollars`: Nevada metrics
- `caArCollected/azArCollected/nvArCollected`: AR collected
- `pulseCheck`: Team pulse rating

## Support

Dashboard is maintained by Claude AI as part of the weekly metrics workflow.
