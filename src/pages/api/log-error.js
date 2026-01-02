export default function handler(req, res) {
    if (req.method === 'POST') {
        console.error(req.body);
        res.status(200).json({ status: 'ok' });
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
