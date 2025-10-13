export default function handler(req, res) {
  if (req.method === 'POST') {
    const { level, message, data } = req.body;
    const logData = {
      level: level || 'info',
      message: message || 'Client-side log',
      ...data,
    };
    console.log(logData);
    res.status(200).json({ status: 'ok' });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
