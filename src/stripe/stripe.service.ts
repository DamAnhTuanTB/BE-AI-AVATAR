import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { handleError } from 'src/utils';
import Stripe from 'stripe';
import { CreateOrderDto } from './dto/index.dto';

@Injectable()
export class StripeService {
  stripe: Stripe;
  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(
      configService.get<string>('PAYMENT.STRIPE_SECRET_KEY'),
      {
        apiVersion: '2023-08-16',
      },
    );
  }

  async getPrices() {
    try {
      const prices = await this.stripe.prices.list({ active: true });
      return prices.data;
    } catch (error) {
      handleError(error);
    }
  }

  async createOrder(body: CreateOrderDto) {
    try {
      const { priceId, userId, email, redirectUrl } = body;
      const paymentLinks = await this.stripe.paymentLinks.create({
        line_items: [{ price: priceId, quantity: 1 }],
        after_completion: {
          type: 'redirect',
          redirect: {
            url: redirectUrl,
          },
        },
        // automatic_tax: { enabled: true },
      });
      const paymentUrl =
        paymentLinks.url +
        `?prefilled_email=${email}&client_reference_id=${userId}`;
      return { url: paymentUrl };
    } catch (error) {
      handleError(error);
    }
  }

  async listenWebhooks(signature: string, body: any) {
    let event: any;
    try {
      event = this.stripe.webhooks.constructEvent(
        body,
        signature,
        this.configService.get<string>(
          'PAYMENT.STRIPE_WEBHOOK_ENDPOINT_SECRET',
        ),
      );
      const data = event?.data;
      const eventType = event.type || '';
      switch (eventType) {
        case 'checkout.session.completed':
          console.log('checkout success', data);
        default:
          break;
      }
    } catch (error) {
      console.log('error', error);
      handleError(error);
    }
  }
}
