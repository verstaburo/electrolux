module.exports = pageName => `
extends ../../layouts/default

block head
  - var pageTitle = Electrolux + ' | ${pageName}'

block content
  p Страница: ${pageName}
`;
