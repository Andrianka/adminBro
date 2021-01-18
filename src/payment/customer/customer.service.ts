import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { stripe } from '../../config/stripe.config';

@Injectable()
export class CustomerService {
  private readonly stripe: Stripe = stripe;

  async findAllCustomers(): Promise<Stripe.ApiListPromise<Stripe.Customer>> {
    const customers = await this.stripe.customers.list();
    return customers;
  }

  async findCustomer(
    id: string,
  ): Promise<Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>> {
    const customer = await this.stripe.customers.retrieve(id);
    return await customer;
  }

  async createCustomer(
    customerInfo: Stripe.CustomerCreateParams,
  ): Promise<Stripe.Response<Stripe.Customer>> {
    const customer = await this.stripe.customers.create(customerInfo);
    return customer;
  }

  async updateCustomer(
    id: string,
    customerInfo: Stripe.CustomerUpdateParams,
  ): Promise<Stripe.Response<Stripe.Customer>> {
    const customer = await this.stripe.customers.update(id, customerInfo);
    return customer;
  }

  async deleteCustomer(
    id: string,
  ): Promise<Stripe.Response<Stripe.DeletedCustomer>> {
    const deletetionConfirmation = await this.stripe.customers.del(id);
    return deletetionConfirmation;
  }
}
