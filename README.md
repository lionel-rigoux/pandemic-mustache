# pandemic-mustache

Wrapper to apply mustache templating to your manuscript in pandemic.

## Usage

In the front matter of document, specify a list of .json or .yaml files that contain the 'views' (ie. the name/values association to replace in the template):

```yaml
---
mustache: results.json
---
```

or

```yaml
---
mustache:
- results/res1.json
- results/res2.yaml
---
```

In the case of multiple files, each file is used in turn to fill in the mustache place holders in your document. Therefore, if a value if defined in multiple files, only the first occurrence will be used in the template and no error will be thrown.
