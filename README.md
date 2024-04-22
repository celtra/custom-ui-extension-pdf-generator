An example template for developing a custom ui extension for Celtra CA platform.

The template is in typescript.
It uses Vue framework with a Vite build.
The build packages all files into a single html which can then be served simply by uploading it and providing its url as source.


## Usage instructions

1. `npm ci` to install packages
2. `npm run dev` to build code and start development server. Open localhost url in browser to view page.
3. `npm run lint` to lint code and `npm run lint-fix` to autofix lint problems
4. `npm run build` to build a single `index.html` file in the `./dist` folder


## Usage with Celtra platform
The `index.html` file can be served from own server or uploaded. Use the url on which `index.html` served to access the page on the celtra platform.
