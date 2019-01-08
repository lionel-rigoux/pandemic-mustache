#!/usr/bin/env node
const fs = require('fs');
const jsyaml = require('js-yaml');
const mustache = require('mustache')
const path = require('path');
const yamlFront = require('yaml-front-matter');

// read from stdin
var content = fs.readFileSync(0, 'utf8');

// look for views: arguments > front-matter
let views;
if (process.argv.length > 2){
  console.error(`Using command line arguments:`);
  views = process.argv.splice(2);
} else {
  console.error(`Using front-matter:`);
  // look in the front matter for views to use
  const frontMatter = yamlFront.loadFront(content);
  // get vue list and ensure it's an array
  views = [].concat(frontMatter.mustache || []);
}

// apply all views iteratively
views.forEach((view) => {
  // path to view file
  filePath = path.join((process.env.PANDOC_SOURCE_PATH || process.cwd()), view);
  // log
  console.error(` {{}} <- ${filePath}`);
  // check if exists in source folder
  if (!fs.existsSync(filePath)) {
    throw new Error(`Could not find the view for mustache: ${filePath}.`);
  }
  // load view file and store
  values = jsyaml.safeLoad(fs.readFileSync(filePath, 'utf8'));
  // mustache it!
  content = mustache.render(content, values);
});

// write to the pipe
process.stdout.write(content);
