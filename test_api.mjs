import fetch from 'node-fetch'; // if not, we use builtin fetch

async function run() {
  const req = await fetch('http://localhost:3000/api/ai/chat', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json', 'Cookie': 'vitacare_session=fake' },
     body: JSON.stringify({ message: "Hello", history: [] })
  });
  console.log(req.status);
  const text = await req.text();
  console.log(text);
}
run();
