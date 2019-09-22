# Scroll To Anchor
### A minimal smooth scroll function

Use like this (defaults shown).
``` javascript
const smoothScroll = new ScrollToAnchor({
  offset: 0, // integer in pixels from the top of window
  duration: 1000, // integer in ms the scroll animation will go for
});
```

### A template built for creating javascript libraries and general tinkering.

It uses gulp, scss, browserSync, Rollup and buble.

### Folder structure
**_src/** - is where you work  
**dev/** - is where the browserSync server runs from  
**dist/** - contains the processed js files  


### Get started
1. `npm install` - install dependencies
2. `npm run dev` - spins up the dev server
3. `npm run build` - transpiles and builds final js files in dist/ folder
