const fs = require('fs');
const inquirer = require('inquirer');

const questions = [
  {
    type: 'input',
    name: 'title',
    message: 'Título'
  },
  {
    type: 'input',
    name: 'description',
    message: 'Descrição'
  },
  {
    type: 'input',
    name: 'main_category',
    message: 'Categoria'
  },
  {
    type: 'input',
    name: 'tags',
    message: 'Tags',
    filter: value => {
      if (value === '') return [];
      return value.split(', ');
    }
  },
  {
    type: 'input',
    name: 'categories',
    message: 'Série',
    filter: value => {
      if (value === '') return [];
      return value.split(', ');
    }
  }
];

const normalizeString = string =>
  string.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const convertToKebabCase = string =>
  normalizeString(string)
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();

const fileDateFormat = date => date.toISOString().substring(0, 10);

const fileTimeFormat = date => date.toISOString().substring(11, 19);

const fieldDateFormat = date =>
  `${fileDateFormat(date)} ${fileTimeFormat(date)}`;

inquirer.prompt(questions).then(answers => {
  const date = new Date();
  const name = convertToKebabCase(answers.title);
  const fileName = `_posts/${fileDateFormat(date)}-${name}.md`;

  const stream = fs.createWriteStream(fileName);
  stream.once('open', fd => {
    stream.write('---\n');
    stream.write('layout: post\n');
    stream.write(`title: "${answers.title}"\n`);
    stream.write(`description: "${answers.description}"\n`);
    stream.write(`date: ${fieldDateFormat(date)}\n`);
    stream.write(`main_category: ${answers.main_category}\n`);

    if (answers.tags.length) {
      stream.write('\n');
      stream.write('tags:\n');
      answers.tags.forEach(x => stream.write(`  - ${x}\n`));
    }

    if (answers.categories.length) {
      stream.write('\n');
      stream.write('categories:\n');
      answers.categories.forEach(x => stream.write(`  - "${x}"\n`));
    }

    stream.write('---\n\n\n');
    stream.end();
  });
});
