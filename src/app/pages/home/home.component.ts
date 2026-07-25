import { Component } from '@angular/core';
import { HeroSectionComponent } from '../../components/home/hero-section.component';
import { BenefitsSectionComponent } from '../../components/home/benefits-section.component';
import { ScentHighlightsComponent } from '../../components/home/scent-highlights.component';
import { HowItWorksComponent } from '../../components/home/how-it-works.component';
import { TestimonialsSectionComponent } from '../../components/home/testimonials-section.component';
import { NewsletterSectionComponent } from '../../components/home/newsletter-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroSectionComponent,
    BenefitsSectionComponent,
    ScentHighlightsComponent,
    HowItWorksComponent,
    TestimonialsSectionComponent,
    NewsletterSectionComponent,
  ],
  template: `
    <app-hero-section />
    <app-benefits-section />
    <app-scent-highlights />
    <app-how-it-works />
    <app-testimonials-section />
    <app-newsletter-section />
  `,
})
export class HomeComponent {}
