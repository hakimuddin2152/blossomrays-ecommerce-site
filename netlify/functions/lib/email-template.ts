/**
 * Branded HTML email template for order confirmations.
 * Colors mirror the site's Tailwind design tokens (tailwind.config.ts):
 *   plum  #1C1C1A   gold  #C49A6C   cream #FAFAF8 / #F4F0EA   muted #7A7570   stone #C8C3BA
 */

export interface OrderConfirmationEmailItem {
  name: string;
  quantity: number;
  unitPrice: number; // cents
}

export interface OrderConfirmationShippingAddress {
  full_name: string;
  street_line_1: string;
  street_line_2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface OrderConfirmationEmailParams {
  orderId: string;
  customerName: string;
  items: OrderConfirmationEmailItem[];
  subtotal: number; // cents
  shippingCost: number; // cents
  total: number; // cents
  shippingAddress: OrderConfirmationShippingAddress;
  currency?: string;
  siteUrl?: string;
}

function formatPrice(cents: number, currency: string): string {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency }).format(cents / 100);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildOrderConfirmationEmailHtml(params: OrderConfirmationEmailParams): string {
  const currency = params.currency ?? 'CAD';
  const siteUrl = params.siteUrl ?? 'https://blossomrays.com';
  const orderShortId = params.orderId.slice(0, 8).toUpperCase();

  const itemRows = params.items
    .map(
      (item) => `
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid #E2DDD6;font-family:'Montserrat',Arial,sans-serif;font-size:14px;color:#1C1C1A;">
            ${escapeHtml(item.name)}
            <span style="display:block;color:#7A7570;font-size:12px;margin-top:2px;">Qty ${item.quantity}</span>
          </td>
          <td style="padding:14px 0;border-bottom:1px solid #E2DDD6;font-family:'Montserrat',Arial,sans-serif;font-size:14px;color:#1C1C1A;text-align:right;white-space:nowrap;">
            ${formatPrice(item.unitPrice * item.quantity, currency)}
          </td>
        </tr>`,
    )
    .join('');

  const addr = params.shippingAddress;
  const addressLines = [
    addr.full_name,
    addr.street_line_1,
    addr.street_line_2,
    `${addr.city}, ${addr.state} ${addr.zip}`,
    addr.country,
  ]
    .filter((line): line is string => Boolean(line))
    .map(escapeHtml)
    .join('<br/>');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Your BlossomRays Order Confirmation</title>
</head>
<body style="margin:0;padding:0;background-color:#F4F0EA;font-family:'Montserrat',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F4F0EA;padding:32px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#FAFAF8;border-radius:16px;overflow:hidden;box-shadow:0 2px 20px rgba(0,0,0,0.06);">
          <!-- Header -->
          <tr>
            <td style="background-color:#1C1C1A;padding:32px;text-align:center;">
              <img src="${siteUrl}/images/logo.png" alt="BlossomRays" width="72" style="display:block;margin:0 auto 8px;" />
              <span style="font-family:Georgia,serif;color:#C49A6C;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Order Confirmed</span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <h1 style="font-family:Georgia,serif;font-size:24px;color:#1C1C1A;margin:0 0 8px;">Thank you, ${escapeHtml(params.customerName)}!</h1>
              <p style="font-size:14px;color:#7A7570;margin:0 0 24px;line-height:1.6;">
                We've received your order and it's being prepared with care. Here's your confirmation:
              </p>

              <p style="font-size:12px;color:#7A7570;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">Order Number</p>
              <p style="font-size:16px;color:#C49A6C;font-weight:600;margin:0 0 24px;">#${orderShortId}</p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                ${itemRows}
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#7A7570;">Subtotal</td>
                  <td style="padding:6px 0;font-size:14px;color:#1C1C1A;text-align:right;">${formatPrice(params.subtotal, currency)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#7A7570;">Shipping</td>
                  <td style="padding:6px 0;font-size:14px;color:#1C1C1A;text-align:right;">${formatPrice(params.shippingCost, currency)}</td>
                </tr>
                <tr>
                  <td style="padding:12px 0 0;font-size:16px;color:#1C1C1A;font-weight:700;border-top:1px solid #E2DDD6;">Total</td>
                  <td style="padding:12px 0 0;font-size:16px;color:#C49A6C;font-weight:700;text-align:right;border-top:1px solid #E2DDD6;">${formatPrice(params.total, currency)}</td>
                </tr>
              </table>

              <div style="margin-top:32px;padding-top:24px;border-top:1px solid #E2DDD6;">
                <p style="font-size:12px;color:#7A7570;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">Shipping Address</p>
                <p style="font-size:14px;color:#1C1C1A;line-height:1.6;margin:0;">${addressLines}</p>
              </div>

              <div style="text-align:center;margin-top:32px;">
                <a href="${siteUrl}/order-confirmation/${params.orderId}" style="display:inline-block;background-color:#C49A6C;color:#1C1C1A;font-size:13px;font-weight:600;letter-spacing:1px;text-transform:uppercase;text-decoration:none;padding:14px 32px;border-radius:9999px;">
                  View Order
                </a>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#F4F0EA;padding:24px 32px;text-align:center;">
              <p style="font-size:12px;color:#7A7570;margin:0;">
                Questions about your order? Reply to this email and we'll be happy to help.
              </p>
              <p style="font-size:11px;color:#C8C3BA;margin:12px 0 0;">&copy; ${new Date().getFullYear()} BlossomRays. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export interface AdminOrderNotificationEmailParams {
  orderId: string;
  customerEmail: string;
  customerName: string;
  items: OrderConfirmationEmailItem[];
  subtotal: number; // cents
  shippingCost: number; // cents
  total: number; // cents
  shippingAddress: OrderConfirmationShippingAddress;
  currency?: string;
  siteUrl?: string;
}

/**
 * Simple internal notification email sent to the store owner whenever a new
 * order comes in. Deliberately plainer than the customer-facing template —
 * this is an operational alert, not a branded touchpoint.
 */
export function buildAdminOrderNotificationEmailHtml(params: AdminOrderNotificationEmailParams): string {
  const currency = params.currency ?? 'CAD';
  const siteUrl = params.siteUrl ?? 'https://blossomrays.com';
  const orderShortId = params.orderId.slice(0, 8).toUpperCase();

  const itemRows = params.items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #E2DDD6;font-family:'Montserrat',Arial,sans-serif;font-size:14px;color:#1C1C1A;">
            ${escapeHtml(item.name)} <span style="color:#7A7570;">&times; ${item.quantity}</span>
          </td>
          <td style="padding:8px 0;border-bottom:1px solid #E2DDD6;font-family:'Montserrat',Arial,sans-serif;font-size:14px;color:#1C1C1A;text-align:right;white-space:nowrap;">
            ${formatPrice(item.unitPrice * item.quantity, currency)}
          </td>
        </tr>`,
    )
    .join('');

  const addr = params.shippingAddress;
  const addressLines = [
    addr.full_name,
    addr.street_line_1,
    addr.street_line_2,
    `${addr.city}, ${addr.state} ${addr.zip}`,
    addr.country,
  ]
    .filter((line): line is string => Boolean(line))
    .map(escapeHtml)
    .join('<br/>');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>New BlossomRays Order</title>
</head>
<body style="margin:0;padding:0;background-color:#F4F0EA;font-family:'Montserrat',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F4F0EA;padding:32px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background-color:#FAFAF8;border-radius:12px;overflow:hidden;box-shadow:0 2px 20px rgba(0,0,0,0.06);">
          <tr>
            <td style="background-color:#1C1C1A;padding:24px 32px;">
              <span style="font-family:Georgia,serif;color:#C49A6C;font-size:13px;letter-spacing:2px;text-transform:uppercase;">New Order Received</span>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="font-size:12px;color:#7A7570;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">Order Number</p>
              <p style="font-size:16px;color:#C49A6C;font-weight:600;margin:0 0 16px;">#${orderShortId}</p>

              <p style="font-size:14px;color:#1C1C1A;margin:0 0 4px;"><strong>Customer:</strong> ${escapeHtml(params.customerName)}</p>
              <p style="font-size:14px;color:#1C1C1A;margin:0 0 20px;"><strong>Email:</strong> ${escapeHtml(params.customerEmail)}</p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                ${itemRows}
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#7A7570;">Subtotal</td>
                  <td style="padding:6px 0;font-size:14px;color:#1C1C1A;text-align:right;">${formatPrice(params.subtotal, currency)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#7A7570;">Shipping</td>
                  <td style="padding:6px 0;font-size:14px;color:#1C1C1A;text-align:right;">${formatPrice(params.shippingCost, currency)}</td>
                </tr>
                <tr>
                  <td style="padding:12px 0 0;font-size:16px;color:#1C1C1A;font-weight:700;border-top:1px solid #E2DDD6;">Total</td>
                  <td style="padding:12px 0 0;font-size:16px;color:#C49A6C;font-weight:700;text-align:right;border-top:1px solid #E2DDD6;">${formatPrice(params.total, currency)}</td>
                </tr>
              </table>

              <div style="margin-top:24px;padding-top:20px;border-top:1px solid #E2DDD6;">
                <p style="font-size:12px;color:#7A7570;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">Shipping Address</p>
                <p style="font-size:14px;color:#1C1C1A;line-height:1.6;margin:0;">${addressLines}</p>
              </div>

              <div style="text-align:center;margin-top:28px;">
                <a href="${siteUrl}/admin/orders" style="display:inline-block;background-color:#C49A6C;color:#1C1C1A;font-size:13px;font-weight:600;letter-spacing:1px;text-transform:uppercase;text-decoration:none;padding:12px 28px;border-radius:9999px;">
                  View in Admin
                </a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
