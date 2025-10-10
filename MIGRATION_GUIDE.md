# Migration Guide: From Google Sites to GitHub Pages

This guide will help you transfer your existing treasure hunt content from Google Sites to your new GitHub Pages website.

## Step 1: Prepare Your Google Sites Content

1. Open each of your 12 Google Sites pages
2. Copy the content from each page (text, clues, images, etc.)
3. Note which page is which (page 1, page 2, etc.)

## Step 2: Add Content to Your GitHub Pages

### For Each Page:

1. **Open the corresponding HTML file** in GitHub:
   - Google Sites Page 1 → `index.html` (the starting page)
   - Google Sites Page 2 → `page1.html`
   - Google Sites Page 3 → `page2.html`
   - And so on...

2. **Find the clue section** in the HTML file:
   ```html
   <div class="clue">
       <h3>🔍 Next Clue:</h3>
       <p><em>Replace this with your clue...</em></p>
   </div>
   ```

3. **Replace the placeholder text** with your actual clue from Google Sites

4. **Add any additional content** above or below the clue section as needed

### Adding Images

If your Google Sites pages have images:

1. Upload images to the repository (create an `images/` folder)
2. Add them to your HTML:
   ```html
   <img src="images/your-image.jpg" alt="Description" style="max-width: 100%; height: auto; border-radius: 10px; margin: 20px 0;">
   ```

### Adding Videos or Audio

For embedded content:

```html
<div style="margin: 20px 0;">
    <video controls style="max-width: 100%; border-radius: 10px;">
        <source src="your-video.mp4" type="video/mp4">
    </video>
</div>
```

## Step 3: Customizing Navigation

### Auto-Redirect Pages

If you want a page to automatically move to the next page after being read:

```html
<script>
// Auto-redirect after 5 seconds
setTimeout(function() {
    window.location.href = 'page2.html';
}, 5000);
</script>
```

Add this script just before the closing `</body>` tag.

### Hidden Clues

To hide a clue until clicked:

```html
<button onclick="document.getElementById('hiddenClue').style.display='block'">
    Reveal Clue
</button>
<div id="hiddenClue" style="display: none;">
    <p>Your secret clue here!</p>
</div>
```

## Step 4: Test Your Changes

1. After editing files on GitHub, commit your changes
2. Wait a few minutes for GitHub Pages to update
3. Visit your site: `https://stagged1-cloud.github.io/THEHUNT/`
4. Click through all pages to ensure navigation works
5. Test on mobile devices too!

## Step 5: Enable GitHub Pages

1. Go to your repository settings
2. Click "Pages" in the left sidebar
3. Under "Source", select your main branch
4. Click "Save"
5. Your site will be live at: `https://stagged1-cloud.github.io/THEHUNT/`

## Tips for Migration

### Preserving Formatting

- **Bold text**: Use `<strong>text</strong>` or `<b>text</b>`
- **Italic text**: Use `<em>text</em>` or `<i>text</i>`
- **Links**: Use `<a href="url">link text</a>`
- **Line breaks**: Use `<br>` for single line breaks

### Organizing Content

Create sections using divs:

```html
<div style="background: #f0f0f0; padding: 20px; border-radius: 10px; margin: 20px 0;">
    <h3>Special Note</h3>
    <p>Your content here</p>
</div>
```

### Colors and Styling

Add inline styles to customize:

```html
<p style="color: #ff0000; font-size: 1.2em; font-weight: bold;">
    Important clue!
</p>
```

## Quick Migration Checklist

- [ ] Copy content from Google Sites page 1 → `index.html`
- [ ] Copy content from Google Sites page 2 → `page1.html`
- [ ] Copy content from Google Sites page 3 → `page2.html`
- [ ] Copy content from Google Sites page 4 → `page3.html`
- [ ] Copy content from Google Sites page 5 → `page4.html`
- [ ] Copy content from Google Sites page 6 → `page5.html`
- [ ] Copy content from Google Sites page 7 → `page6.html`
- [ ] Copy content from Google Sites page 8 → `page7.html`
- [ ] Copy content from Google Sites page 9 → `page8.html`
- [ ] Copy content from Google Sites page 10 → `page9.html`
- [ ] Copy content from Google Sites page 11 → `page10.html`
- [ ] Copy content from Google Sites page 12 → `page11.html`
- [ ] Add final clue or message → `page12.html`
- [ ] Customize completion message in `complete.html`
- [ ] Upload any images or media files
- [ ] Test all navigation links
- [ ] Enable GitHub Pages
- [ ] Share the URL with family!

## Need Help?

If you get stuck:
1. Check the `example-interactive.html` file for working examples
2. Review the README.md for more details
3. Each HTML file has helpful comments to guide you

Happy hunting! 🎄🎁
