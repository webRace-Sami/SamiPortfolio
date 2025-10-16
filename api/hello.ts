export default function handler(req: any, res: any) {
  if (req.method === 'GET') {
    res.status(200).json({ ok: true, message: 'Hello from API' })
  } else {
    res.setHeader('Allow', 'GET')
    res.status(405).end('Method Not Allowed')
  }
}
