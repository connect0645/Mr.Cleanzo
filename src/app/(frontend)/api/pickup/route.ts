import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: Request) {
  const origin = request.headers.get('origin')
  const expectedOrigin = process.env.NEXT_PUBLIC_SITE_URL
  if (origin) {
    let sameSite = false
    try {
      const parsedOrigin = new URL(origin)
      sameSite =
        parsedOrigin.host === request.headers.get('host') ||
        Boolean(expectedOrigin && parsedOrigin.origin === new URL(expectedOrigin).origin)
    } catch {
      /* Malformed origins are not trusted. */
    }
    if (!sameSite)
      return Response.json(
        { error: 'Please submit your request from this website.' },
        { status: 403 },
      )
  }
  if (Number(request.headers.get('content-length') || 0) > 16384)
    return Response.json({ error: 'Your request is too large.' }, { status: 413 })
  try {
    const input = await request.json()
    const customerName = typeof input.customerName === 'string' ? input.customerName.trim() : ''
    const phone = typeof input.phone === 'string' ? input.phone.replace(/\s/g, '') : ''
    const pincode = typeof input.pincode === 'string' ? input.pincode.trim() : ''
    const address = typeof input.address === 'string' ? input.address.trim() : ''
    const notes = typeof input.notes === 'string' ? input.notes.trim() : ''
    const date = typeof input.pickupDate === 'string' ? input.pickupDate : ''
    const timeWindow = input.timeWindow
    if (input.website)
      return Response.json({ error: 'Unable to submit this request.' }, { status: 400 })
    if (
      customerName.length < 2 ||
      customerName.length > 100 ||
      !/^[6-9]\d{9}$/.test(phone) ||
      !/^[1-9]\d{5}$/.test(pincode) ||
      address.length < 10 ||
      address.length > 500 ||
      notes.length > 1000 ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !['morning', 'afternoon', 'evening'].includes(timeWindow)
    )
      return Response.json(
        { error: 'Please enter valid contact details, an address, and a pickup date and time.' },
        { status: 400 },
      )
    if (!Array.isArray(input.items) || input.items.length > 30)
      return Response.json({ error: 'Please check your selected garments.' }, { status: 400 })
    const items = input.items.map((item: { rateItem?: unknown; quantity?: unknown }) => {
      if (
        typeof item.rateItem !== 'string' ||
        !Number.isInteger(item.quantity) ||
        Number(item.quantity) < 1 ||
        Number(item.quantity) > 99
      )
        throw new Error('Invalid garments')
      return { rateItem: item.rateItem, quantity: Number(item.quantity) }
    })
    const payload = await getPayload({ config })
    const result = await payload.create({
      collection: 'pickup-requests',
      overrideAccess: false,
      data: {
        customerName,
        phone,
        pincode,
        address,
        notes,
        pickupDate: `${date}T12:00:00.000Z`,
        timeWindow,
        items,
        status: 'requested',
      },
    })
    return Response.json(
      { success: true, reference: result.id },
      { status: 201, headers: { 'Cache-Control': 'no-store' } },
    )
  } catch {
    return Response.json(
      {
        error:
          'We couldn’t save your request. Check the pickup date and garment quantities, or contact us on WhatsApp.',
      },
      { status: 400 },
    )
  }
}
