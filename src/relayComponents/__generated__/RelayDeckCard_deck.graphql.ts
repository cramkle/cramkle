/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type RelayDeckCard_deck = {
    readonly id: string;
    readonly slug: string;
    readonly title: string;
    readonly description: string | null;
    readonly totalNotes: number;
    readonly totalFlashcards: number;
    readonly studySessionDetails: {
        readonly newCount: number;
        readonly learningCount: number;
        readonly reviewCount: number;
    };
    readonly " $refType": "RelayDeckCard_deck";
};
export type RelayDeckCard_deck$data = RelayDeckCard_deck;
export type RelayDeckCard_deck$key = {
    readonly " $data"?: RelayDeckCard_deck$data;
    readonly " $fragmentRefs": FragmentRefs<"RelayDeckCard_deck">;
};



const node: ReaderFragment = {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "RelayDeckCard_deck",
    "selections": [
        {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
        },
        {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "slug",
            "storageKey": null
        },
        {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "title",
            "storageKey": null
        },
        {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "description",
            "storageKey": null
        },
        {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "totalNotes",
            "storageKey": null
        },
        {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "totalFlashcards",
            "storageKey": null
        },
        {
            "alias": null,
            "args": null,
            "concreteType": "StudySessionDetails",
            "kind": "LinkedField",
            "name": "studySessionDetails",
            "plural": false,
            "selections": [
                {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "newCount",
                    "storageKey": null
                },
                {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "learningCount",
                    "storageKey": null
                },
                {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "reviewCount",
                    "storageKey": null
                }
            ],
            "storageKey": null
        }
    ],
    "type": "Deck",
    "abstractKey": null
} as any;
(node as any).hash = '2c5a433bd4f69355cf385a2d44cbf1f4';
export default node;
