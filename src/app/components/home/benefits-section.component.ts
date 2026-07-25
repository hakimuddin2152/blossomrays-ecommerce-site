import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

const benefits = [
  {
    title: 'Free Delivery',
    description: 'Free shipping on all orders over $30 across Canada.',
    accent: '#C49A6C',
    svgPath: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12',
  },
  {
    title: '30-Day Guarantee',
    description: 'Love it or your money back. No questions asked.',
    accent: '#6B8F61',
    svgPath: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
  },
  {
    title: '24/7 Support',
    description: "We're here to help. Shop with confidence, always.",
    accent: '#8B89C8',
    svgPath: 'M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155',
  },
];

@Component({
  selector: 'app-benefits-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="bg-white border-y border-cream-dark">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-cream-dark">
        <div
          *ngFor="let b of benefits"
          class="flex items-center gap-5 px-8 lg:px-12 py-9 group cursor-default"
        >
          <div
            class="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            [style.background]="b.accent + '18'"
            [style.color]="b.accent"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="b.svgPath"/>
            </svg>
          </div>
          <div class="space-y-1">
            <h3 class="font-body text-[14px] font-semibold text-plum group-hover:text-gold transition-colors duration-200">
              {{ b.title }}
            </h3>
            <p class="font-body text-[13px] text-muted leading-relaxed">{{ b.description }}</p>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class BenefitsSectionComponent {
  readonly benefits = benefits;
}
