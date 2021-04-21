/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PremiumPlan
// ====================================================

export interface PremiumPlan_subscriptionPlan_prices {
  __typename: "SubscriptionPrice";
  id: string;
  period: string;
  amount: number;
  currency: string;
}

export interface PremiumPlan_subscriptionPlan {
  __typename: "SubscriptionPlan";
  id: string;
  subscriptionName: string;
  plan: string;
  prices: PremiumPlan_subscriptionPlan_prices[];
}

export interface PremiumPlan {
  /**
   * Get a subscription plan details and prices
   */
  subscriptionPlan: PremiumPlan_subscriptionPlan | null;
}

export interface PremiumPlanVariables {
  currency?: string | null;
}
