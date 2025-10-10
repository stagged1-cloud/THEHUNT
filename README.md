# 🎄 The Hunt - Christmas Treasure Hunt 🎁

A fun, interactive treasure hunt website for family members in different locations to enjoy together during the holidays!

## 🎯 About

The Hunt is a 12-page treasure hunt where each page contains a clue or puzzle that leads to the next page. Perfect for bringing family together during the holidays, even when you're apart!

## 📁 Structure

- `index.html` - Starting page with the first clue
- `page1.html` to `page12.html` - The 12 treasure hunt pages
- `complete.html` - Congratulations page when the hunt is finished
- `styles.css` - Styling for all pages

## 🚀 How to Deploy to GitHub Pages

1. Go to your repository settings on GitHub
2. Navigate to "Pages" in the left sidebar
3. Under "Source", select the branch you want to deploy (usually `main`)
4. Click "Save"
5. Your site will be available at: `https://stagged1-cloud.github.io/THEHUNT/`

## ✏️ How to Customize Your Hunt

### Adding Your Clues

1. Open each HTML file (index.html, page1.html, etc.)
2. Find the section with the clue text:
   ```html
   <div class="clue">
       <h3>🔍 Next Clue:</h3>
       <p><em>Replace this with your clue...</em></p>
   </div>
   ```
3. Replace the placeholder text with your actual clue or riddle

### Adding Games or Puzzles

You can add interactive elements to any page. Here's an example of a simple puzzle:

```html
<div class="game-area">
    <h3>Solve This Puzzle:</h3>
    <p>What is 2 + 2?</p>
    <input type="number" id="answer" placeholder="Enter answer">
    <button onclick="checkAnswer()">Submit</button>
    <div id="result"></div>
</div>

<script>
function checkAnswer() {
    const answer = document.getElementById('answer').value;
    const result = document.getElementById('result');
    if (answer == '4') {
        result.innerHTML = '<div class="success-message">Correct! <a href="page2.html">Continue to next page</a></div>';
    } else {
        result.innerHTML = '<div class="error-message">Try again!</div>';
    }
}
</script>
```

### Auto-Redirecting Pages

To make a page automatically redirect after a delay:

```html
<script>
// Redirect to page2.html after 5 seconds
setTimeout(function() {
    window.location.href = 'page2.html';
}, 5000);
</script>
```

### Customizing the Look

Edit `styles.css` to change:
- Colors
- Fonts
- Layout
- Animations

## 🎨 Features

- ✨ Beautiful, responsive design that works on all devices
- 🎄 Christmas-themed styling with gradients and festive colors
- 📱 Mobile-friendly
- 🔄 Navigation between pages
- 🎯 Ready-to-customize template pages
- 🎁 Completion page to celebrate success

## 📝 Tips for Creating Clues

1. **Direct clues**: "Add 'page2.html' to the current URL"
2. **Riddles**: "I come after one but before three, visit page___.html to see"
3. **Puzzles**: Solve a math problem or word puzzle to get the page number
4. **Hidden clues**: Use CSS to hide/reveal clues on hover or click
5. **Family references**: Use inside jokes or family memories as clues

## 🛠️ Migrating from Google Sites

If you have existing content from Google Sites:

1. Copy your content from each Google Sites page
2. Paste it into the corresponding page (index.html for the start, page1.html, page2.html, etc.)
3. Keep the existing navigation structure intact
4. Update any links to point to the new page filenames

## 🎊 Have Fun!

Remember, the goal is to have fun with your family! Customize the hunt to match your family's personality and enjoy the adventure together, even from afar.

Merry Christmas! 🎅🎄
