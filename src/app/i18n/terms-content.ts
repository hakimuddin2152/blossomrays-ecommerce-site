import type { Language } from './translations';

export interface TermsSection {
  heading: string;
  body: string;
}

export interface TermsContent {
  title: string;
  updated: string;
  sections: TermsSection[];
}

/**
 * Short, plain-language Terms & Conditions of Sale.
 * Deliberately concise — no dense legal boilerplate — so it fits in a
 * small, scrollable, readable popup instead of a wall of legalese.
 */
export const TERMS_VERSION = '2026-07-29';

export const TERMS_CONTENT: Record<Language, TermsContent> = {
  en: {
    title: 'Terms & Conditions of Sale',
    updated: 'July 29, 2026',
    sections: [
      {
        heading: '1. Acceptance',
        body: 'By placing an order with BlossomRays, you agree to these Terms & Conditions of Sale.',
      },
      {
        heading: '2. Products & Pricing',
        body: 'Prices are shown in CAD and exclude applicable taxes unless stated otherwise.',
      },
      {
        heading: '3. Orders & Payment',
        body: 'Orders are confirmed once payment is successfully processed through our secure payment provider (Stripe). We may refuse or cancel any order at our discretion.',
      },
      {
        heading: '4. Shipping',
        body: 'Orders ship within 1\u20133 business days. Free shipping applies once your order meets the threshold shown at checkout.',
      },
      {
        heading: '5. Returns & Refunds',
        body: 'Unused items in original condition may be returned within 30 days of delivery for a refund. Email support@blossomrays.com to start a return.',
      },
      {
        heading: '6. Limitation of Liability',
        body: 'BlossomRays is not liable for indirect or incidental damages arising from the use of our products.',
      },
      {
        heading: '7. Governing Law',
        body: 'These terms are governed by the laws of the Province of Ontario, Canada.',
      },
      {
        heading: '8. Contact',
        body: 'Questions about these terms? Email support@blossomrays.com.',
      },
    ],
  },
  fr: {
    title: 'Conditions g\u00e9n\u00e9rales de vente',
    updated: '29 juillet 2026',
    sections: [
      {
        heading: '1. Acceptation',
        body: 'En passant une commande chez BlossomRays, vous acceptez les pr\u00e9sentes conditions g\u00e9n\u00e9rales de vente.',
      },
      {
        heading: '2. Produits et prix',
        body: 'Les prix sont affichés en CAD et excluent les taxes applicables, sauf indication contraire.',
      },
      {
        heading: '3. Commandes et paiement',
        body: 'Une commande est confirm\u00e9e une fois le paiement trait\u00e9 avec succ\u00e8s par notre fournisseur de paiement s\u00e9curis\u00e9 (Stripe). Nous pouvons refuser ou annuler une commande \u00e0 notre discr\u00e9tion.',
      },
      {
        heading: '4. Exp\u00e9dition',
        body: 'Les commandes sont exp\u00e9di\u00e9es dans un d\u00e9lai de 1 \u00e0 3 jours ouvrables. La livraison gratuite s\u2019applique lorsque votre commande atteint le seuil indiqu\u00e9 au paiement.',
      },
      {
        heading: '5. Retours et remboursements',
        body: 'Les articles non utilis\u00e9s, dans leur \u00e9tat d\u2019origine, peuvent \u00eatre retourn\u00e9s dans les 30 jours suivant la livraison pour un remboursement. \u00c9crivez \u00e0 support@blossomrays.com pour amorcer un retour.',
      },
      {
        heading: '6. Limitation de responsabilit\u00e9',
        body: 'BlossomRays n\u2019est pas responsable des dommages indirects ou accessoires li\u00e9s \u00e0 l\u2019utilisation de nos produits.',
      },
      {
        heading: '7. Loi applicable',
        body: 'Les pr\u00e9sentes conditions sont r\u00e9gies par les lois de la province de l\u2019Ontario, Canada.',
      },
      {
        heading: '8. Contact',
        body: 'Des questions sur ces conditions\u00a0? \u00c9crivez \u00e0 support@blossomrays.com.',
      },
    ],
  },
};
