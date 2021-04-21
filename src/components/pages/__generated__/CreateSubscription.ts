/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CardDetails } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: CreateSubscription
// ====================================================

export interface CreateSubscription_createSubscription_subscription {
  __typename: "Subscription";
  active: boolean;
  period: string;
  plan: string;
  endsAt: string;
  status: string;
  paymentIntentClientSecret: string | null;
}

export interface CreateSubscription_createSubscription_error {
  __typename: "CreateSubscriptionError";
  message: string;
  status: number;
}

export interface CreateSubscription_createSubscription {
  __typename: "CreateSubscriptionPayload";
  subscription: CreateSubscription_createSubscription_subscription | null;
  error: CreateSubscription_createSubscription_error | null;
}

export interface CreateSubscription {
  createSubscription: CreateSubscription_createSubscription | null;
}

export interface CreateSubscriptionVariables {
  priceId: string;
  cardDetails?: CardDetails | null;
}
