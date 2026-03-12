export default function handler(req, res) {
  if (req.method === 'POST') {
    const { message, data } = req.body;
    console.log(message, data);
    res.status(200).json({ status: 'ok' });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
