#!/usr/bin/env node

const fs = require('fs-extra');
const jsyaml = require('js-yaml');
const getStdin = require('get-stdin');
const mustache = require('mustache')
const path = require('path');
const yamlFront = require('yaml-front-matter');

// read from stdin
getStdin().then(content => {

  // look in the front matter for views to use
  const frontMatter = yamlFront.loadFront(content);
  views = (frontMatter.pandemic || {}).mustache;

  // if not views found, just pipe out the input
  if (!views) {
    process.stdout.write(content);
    process.exit(0);
  }

  // ensure mustache views are stored in an array
  if (!Array.isArray(views)) {
    views = [views];
  }

  // load views
  let values = {};
  views.forEach((view) => {
    // path to view file
    filePath = path.join((process.env.PANDOC_SOURCE_PATH || process.cwd()), view); 
    // check if exists in source folder
    if (!fs.existsSync(filePath)) {
      throw new Error(`Could not find the view for mustache: ${filePath}.`);
    }
    // load view file and store
    values = Object.assign(
      values,
      jsyaml.safeLoad(fs.readFileSync(filePath, 'utf8'))
    )
  });

  // mustache it!
  const out = mustache.render(content, values);

  // write to the pipe
  process.stdout.write(out);
});
