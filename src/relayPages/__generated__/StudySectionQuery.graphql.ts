/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";

import { FragmentRefs } from "relay-runtime";
export type StudySectionQueryVariables = {};
export type StudySectionQueryResponse = {
    readonly decks: ReadonlyArray<{
        readonly id: string;
        readonly " $fragmentRefs": FragmentRefs<"RelayDeckCard_deck">;
    }>;
};
export type StudySectionQuery = {
    readonly response: StudySectionQueryResponse;
    readonly variables: StudySectionQueryVariables;
};



/*
query StudySectionQuery {
  decks(studyOnly: true) {
    id
    ...RelayDeckCard_deck
  }
}

fragment RelayDeckCard_deck on Deck {
  id
  slug
  title
  description
  totalNotes
  totalFlashcards
  studySessionDetails {
    newCount
    learningCount
    reviewCount
  }
}
*/

const node: ConcreteRequest = (function () {
    var v0 = [
        {
            "kind": "Literal",
            "name": "studyOnly",
            "value": true
        } as any
    ], v1 = {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
    } as any;
    return {
        "fragment": {
            "argumentDefinitions": [],
            "kind": "Fragment",
            "metadata": null,
            "name": "StudySectionQuery",
            "selections": [
                {
                    "alias": null,
                    "args": (v0 /*: any*/),
                    "concreteType": "Deck",
                    "kind": "LinkedField",
                    "name": "decks",
                    "plural": true,
                    "selections": [
                        (v1 /*: any*/),
                        {
                            "args": null,
                            "kind": "FragmentSpread",
                            "name": "RelayDeckCard_deck"
                        }
                    ],
                    "storageKey": "decks(studyOnly:true)"
                }
            ],
            "type": "Query",
            "abstractKey": null
        },
        "kind": "Request",
        "operation": {
            "argumentDefinitions": [],
            "kind": "Operation",
            "name": "StudySectionQuery",
            "selections": [
                {
                    "alias": null,
                    "args": (v0 /*: any*/),
                    "concreteType": "Deck",
                    "kind": "LinkedField",
                    "name": "decks",
                    "plural": true,
                    "selections": [
                        (v1 /*: any*/),
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
                    "storageKey": "decks(studyOnly:true)"
                }
            ]
        },
        "params": {
            "cacheID": "fa4e20f45e9c897a0728427184e5c0ab",
            "id": null,
            "metadata": {},
            "name": "StudySectionQuery",
            "operationKind": "query",
            "text": "query StudySectionQuery {\n  decks(studyOnly: true) {\n    id\n    ...RelayDeckCard_deck\n  }\n}\n\nfragment RelayDeckCard_deck on Deck {\n  id\n  slug\n  title\n  description\n  totalNotes\n  totalFlashcards\n  studySessionDetails {\n    newCount\n    learningCount\n    reviewCount\n  }\n}\n"
        }
    } as any;
})();
(node as any).hash = '428c5ce5f5713b358a568436a6d9ec6e';
export default node;
