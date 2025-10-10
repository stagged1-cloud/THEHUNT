# How to Update The Hunt Main Page

## 📍 File Locations

The main starting page consists of two files:

1. **`index.html`** - The main HTML structure of the page
   - Location: `/index.html` (root of the repository)
   - Contains: Page content, text, structure, and interactive elements

2. **`style.css`** - The styling and design of the page
   - Location: `/style.css` (root of the repository)
   - Contains: Colors, fonts, layout, animations, and responsive design

## 🎨 How to Update Content

### Updating Text and Headings

To update the page title or tagline, edit `index.html`:

```html
<!-- Change the main title -->
<h1>🎯 THE HUNT</h1>

<!-- Change the tagline -->
<p class="tagline">Find clues, play games, get to the next mission</p>
```

### Updating Welcome Message

Edit the welcome section in `index.html`:

```html
<section class="welcome-section">
    <h2>Welcome, Hunter!</h2>
    <p>Your welcome message here...</p>
</section>
```

### Updating Game Features

Modify the info cards in `index.html`:

```html
<div class="info-card">
    <h3>🔍 Find Clues</h3>
    <p>Your description here...</p>
</div>
```

### Changing the Start Button

Update the button action by modifying the script at the bottom of `index.html`:

```html
<script>
    document.getElementById('startButton').addEventListener('click', function() {
        alert('Your message here');
    });
</script>
```

To link to an actual game page instead of showing an alert:
```html
<script>
    document.getElementById('startButton').addEventListener('click', function() {
        window.location.href = 'game.html';
    });
</script>
```

### Updating Status Messages

Edit the status section in `index.html`:

```html
<p class="status-text">🚀 Your status message here</p>
```

## 🎨 How to Customize Styling

### Changing Colors

Edit `style.css` to change the color scheme:

```css
/* Main gradient background */
body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Main title color */
header h1 {
    color: #667eea;
}

/* Button gradient */
.start-button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

Popular color combinations:
- Ocean: `#667eea` → `#764ba2` (current)
- Sunset: `#ff6b6b` → `#feca57`
- Forest: `#11998e` → `#38ef7d`
- Cosmic: `#4e54c8` → `#8f94fb`

### Changing Fonts

Update the font family in `style.css`:

```css
body {
    font-family: 'Your Font', 'Fallback Font', sans-serif;
}
```

### Adjusting Layout

Modify spacing, sizing, and layout properties in `style.css`.

## 🌐 Making the Page Public (GitHub Pages)

### Step 1: Enable GitHub Pages

1. Go to your repository: https://github.com/stagged1-cloud/THEHUNT
2. Click on **Settings** (top right)
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**

### Step 2: Access Your Public Page

After enabling GitHub Pages, your page will be available at:
```
https://stagged1-cloud.github.io/THEHUNT/
```

It may take a few minutes for the page to go live.

### Step 3: Custom Domain (Optional)

If you want a custom domain:
1. In GitHub Pages settings, enter your custom domain
2. Configure DNS records with your domain provider
3. Follow GitHub's instructions for custom domains

## 📝 Quick Edit Guide

### For Quick Text Changes:

1. Go to https://github.com/stagged1-cloud/THEHUNT
2. Click on `index.html`
3. Click the pencil icon (✏️) to edit
4. Make your changes
5. Scroll down and click "Commit changes"
6. Your changes will be live in a few minutes

### For Styling Changes:

1. Go to https://github.com/stagged1-cloud/THEHUNT
2. Click on `style.css`
3. Click the pencil icon (✏️) to edit
4. Make your changes
5. Scroll down and click "Commit changes"
6. Your changes will be live in a few minutes

## 🚀 Adding New Features

### Adding a New Section

1. Open `index.html`
2. Add your new section inside `<main>`:

```html
<section class="your-section-name">
    <h2>Your Section Title</h2>
    <p>Your content here...</p>
</section>
```

3. Add styling in `style.css`:

```css
.your-section-name {
    text-align: center;
    margin: 20px 0;
    padding: 20px;
}
```

### Adding Images

1. Upload images to the repository
2. Reference them in `index.html`:

```html
<img src="your-image.jpg" alt="Description">
```

### Adding Links

```html
<a href="https://example.com">Link Text</a>
```

Or to other pages in your hunt:
```html
<a href="mission1.html">Start Mission 1</a>
```

## 🔧 Testing Changes Locally

To test changes on your computer before publishing:

1. Clone the repository:
   ```bash
   git clone https://github.com/stagged1-cloud/THEHUNT.git
   cd THEHUNT
   ```

2. Open `index.html` in your web browser:
   - Windows: Double-click `index.html`
   - Mac: Right-click → Open With → Browser
   - Linux: `xdg-open index.html`

3. Make changes to files
4. Refresh browser to see updates
5. When satisfied, commit and push:
   ```bash
   git add .
   git commit -m "Update main page"
   git push
   ```

## 📚 Additional Resources

- [HTML Tutorial](https://www.w3schools.com/html/)
- [CSS Tutorial](https://www.w3schools.com/css/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)

## 💡 Tips

- Always test changes locally before publishing
- Keep backups of your original files
- Use meaningful commit messages
- Check the page on mobile devices too
- Consider accessibility (colors, font sizes, etc.)

## 🆘 Troubleshooting

**Page not updating?**
- Clear your browser cache (Ctrl+F5)
- Wait a few minutes for GitHub Pages to rebuild
- Check GitHub Actions for build errors

**Styling looks broken?**
- Ensure `style.css` is in the same directory as `index.html`
- Check for syntax errors in CSS
- Verify the `<link>` tag in `index.html` is correct

**Need help?**
- Check GitHub Issues for similar problems
- Create a new issue in the repository
- Review commit history to see what changed
