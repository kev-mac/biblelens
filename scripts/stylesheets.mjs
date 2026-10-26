import fs from 'node:fs';
// Order is shared by packaging and source checks; the generated startup bundle
// still serves every layer in one CSS request on web and native.
export const applicationStylesheets = ['reset.css', 'base.css', 'components.css', 'pages.css', 'overrides.css'];
export const readApplicationStyles = () => applicationStylesheets.map(name => fs.readFileSync('src/' + name, 'utf8')).join('\n');
