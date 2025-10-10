# Quick Start Guide

Get your treasure hunt website up and running in minutes!

## 🚀 Deploy to GitHub Pages (5 minutes)

1. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click **Settings** (top menu)
   - Click **Pages** (left sidebar)
   - Under "Source", select **main** branch
   - Click **Save**
   - Wait 2-3 minutes for deployment

2. **Your website will be live at:**
   ```
   https://stagged1-cloud.github.io/THEHUNT/
   ```

## ✏️ Customize Your Hunt (10-30 minutes)

### Option 1: Edit on GitHub (Easiest)

1. Go to your repository on GitHub
2. Click on any file (e.g., `index.html`)
3. Click the pencil icon (✏️) to edit
4. Make your changes
5. Scroll down and click "Commit changes"
6. Repeat for other pages

### Option 2: Edit Locally (Advanced)

1. Clone the repository:
   ```bash
   git clone https://github.com/stagged1-cloud/THEHUNT.git
   cd THEHUNT
   ```

2. Edit the HTML files in your favorite editor

3. Commit and push:
   ```bash
   git add .
   git commit -m "Updated clues"
   git push
   ```

## 📝 What to Edit

### Starting Page (`index.html`)
Replace the placeholder clue with your first clue:

```html
<div class="clue">
    <h3>🔍 First Clue:</h3>
    <p><em>Your first clue goes here!</em></p>
</div>
```

### Hunt Pages (`page1.html` - `page12.html`)
Update each page with your clues following the same pattern.

### Completion Page (`complete.html`)
Customize the final message to your family!

## 🎮 Add Interactive Elements

Check out `example-interactive.html` for ideas on:
- Riddles with answer checking
- Math puzzles
- Hidden clues
- Auto-redirects

## 📱 Test Your Site

1. Open the site on desktop: `https://stagged1-cloud.github.io/THEHUNT/`
2. Test on mobile phone (scan QR code or send link)
3. Click through all 12 pages to verify navigation
4. Make sure all clues make sense in order

## 🎁 Share with Family

Once everything is ready:

1. **Send the starting URL** to family members:
   ```
   https://stagged1-cloud.github.io/THEHUNT/
   ```

2. **Optional: Create a QR code**
   - Visit: https://www.qr-code-generator.com/
   - Paste your URL
   - Download the QR code
   - Share it via email or messaging

3. **Set a start time** so everyone begins together!

## 🛠️ Troubleshooting

**Site not loading?**
- Wait 5 minutes after enabling GitHub Pages
- Check that Pages is enabled in Settings
- Make sure you selected the `main` branch

**Changes not showing?**
- Wait 2-3 minutes after committing
- Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache

**Navigation not working?**
- Make sure file names match exactly (case-sensitive)
- Check that all pages are committed to the repository

## 📚 Additional Resources

- **Full Documentation**: See `README.md`
- **Migration from Google Sites**: See `MIGRATION_GUIDE.md`
- **Interactive Examples**: Open `example-interactive.html`

## ⏱️ Timeline

- **5 min**: Enable GitHub Pages and verify site is live
- **10-30 min**: Add your clues and customize content
- **5 min**: Test the entire hunt flow
- **1 min**: Share with family
- **Fun time**: Watch them solve the hunt! 🎉

---

**Ready? Start with step 1 above! 🎄**
