import {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'
import { GraphQLJSONObject } from 'graphql-type-json'

import { ContentStateDocument } from '../../mongo/ContentState'
import { graphQLGlobalIdField } from '../../utils/graphqlID'
import { nodeInterface } from '../node/types'
import { encodeEntityMapWithGlobalId } from './utils'

export const EntityRangeType = new GraphQLObjectType({
  name: 'EntityRange',
  fields: {
    key: { type: GraphQLNonNull(GraphQLInt) },
    length: { type: GraphQLNonNull(GraphQLInt) },
    offset: { type: GraphQLNonNull(GraphQLInt) },
  },
})

export const EntityRangeInputType = new GraphQLInputObjectType({
  name: 'EntityRangeInput',
  fields: {
    key: { type: GraphQLNonNull(GraphQLInt) },
    length: { type: GraphQLNonNull(GraphQLInt) },
    offset: { type: GraphQLNonNull(GraphQLInt) },
  },
})

export const InlineStyleRangeType = new GraphQLObjectType({
  name: 'InlineStyleRange',
  fields: {
    style: { type: GraphQLNonNull(GraphQLString) },
    length: { type: GraphQLNonNull(GraphQLInt) },
    offset: { type: GraphQLNonNull(GraphQLInt) },
  },
})

export const InlineStyleRangeInputType = new GraphQLInputObjectType({
  name: 'InlineStyleRangeInput',
  fields: {
    style: { type: GraphQLNonNull(GraphQLString) },
    length: { type: GraphQLNonNull(GraphQLInt) },
    offset: { type: GraphQLNonNull(GraphQLInt) },
  },
})

export const BlockType = new GraphQLObjectType({
  name: 'Block',
  fields: {
    key: { type: GraphQLNonNull(GraphQLString) },
    type: { type: GraphQLNonNull(GraphQLString) },
    text: { type: GraphQLNonNull(GraphQLString) },
    depth: { type: GraphQLNonNull(GraphQLInt) },
    inlineStyleRanges: {
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(InlineStyleRangeType))),
    },
    entityRanges: {
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(EntityRangeType))),
    },
    data: { type: GraphQLJSONObject },
  },
})

export const BlockInputType = new GraphQLInputObjectType({
  name: 'BlockInput',
  fields: {
    key: { type: GraphQLNonNull(GraphQLString) },
    type: { type: GraphQLNonNull(GraphQLString) },
    text: { type: GraphQLNonNull(GraphQLString) },
    depth: { type: GraphQLNonNull(GraphQLInt) },
    inlineStyleRanges: {
      type: GraphQLNonNull(
        GraphQLList(GraphQLNonNull(InlineStyleRangeInputType))
      ),
    },
    entityRanges: {
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(EntityRangeInputType))),
    },
    data: { type: GraphQLJSONObject },
  },
})

export const ContentStateType = new GraphQLObjectType<
  ContentStateDocument,
  Context
>({
  name: 'ContentState',
  interfaces: [nodeInterface],
  fields: {
    id: graphQLGlobalIdField(),
    entityMap: {
      type: GraphQLNonNull(GraphQLJSONObject),
      resolve: (root) => {
        const entityMap = root.entityMap || {}

        return encodeEntityMapWithGlobalId(entityMap)
      },
    },
    blocks: {
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(BlockType))),
    },
  },
})

export const ContentStateInputType = new GraphQLInputObjectType({
  name: 'ContentStateInput',
  fields: {
    blocks: {
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(BlockInputType))),
    },
    entityMap: { type: GraphQLJSONObject },
  },
})
