const http = require('http');
const url = require('url');

let todos = ['Koffie drinken', 'GitHub Actions instellen'];
let idCounter = todos.length;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // om  Item toe te voegen
  if (req.method === 'POST' && parsedUrl.pathname === '/add') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const params = new URLSearchParams(body);
      const text = params.get('todo');
      if (text) todos.push(text);
      res.writeHead(302, { Location: '/' });
      res.end();
    });
    return;
  }

  // om  Item te  verwijderen
  if (parsedUrl.pathname === '/delete') {
    const index = parseInt(parsedUrl.query.index);
    todos.splice(index, 1);
    res.writeHead(302, { Location: '/' });
    res.end();
    return;
  }


  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <html>
      <head>
        <title>To-Do App</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 500px; margin: 50px auto; }
          li { margin: 10px 0; font-size: 18px; }
          a { color: red; margin-left: 10px; text-decoration: none; }
          input { padding: 8px; font-size: 16px; width: 70%; }
          button { padding: 8px 16px; font-size: 16px; }
        </style>
      </head>
      <body>
        <h1>         To-Do Lijst</h1>
        <form method="POST" action="/add">
          <input type="text" name="todo" placeholder="Nieuw item..." required />
          <button type="submit">Toevoegen</button>
        </form>
        <ul>
          ${todos.map((todo, i) => `
            <li>${todo} <a href="/delete?index=${i}">✕</a></li>
          `).join('')}
        </ul>
      </body>
    </html>
  `);
});

server.listen(3000, () => console.log('To-Do app draait op [localhost](http://localhost:3000)'));
