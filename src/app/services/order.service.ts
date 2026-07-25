import { Injectable, inject } from '@angular/core';
import type { Order } from '../types';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly supabase = inject(SupabaseService).client;

  async getMyOrders(): Promise<Order[]> {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*, order_items(*, product:products(name, category))')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as Order[];
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    const { data } = await this.supabase
      .from('orders')
      .select('*, order_items(*, product:products(name, images, category))')
      .eq('id', orderId)
      .single();
    return (data as Order) ?? null;
  }

  async getAllOrders(): Promise<Order[]> {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*, order_items(quantity)')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as Order[];
  }

  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    const { error } = await this.supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId);
    if (error) throw new Error(error.message);
  }
}
