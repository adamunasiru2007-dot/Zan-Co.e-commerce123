export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
}

export interface PaymentResult {
  status: 'SUCCESS' | 'FAILED';
  transactionId: string;
}

export interface Notification {
  id: string;
  type: 'email' | 'in-app';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}
