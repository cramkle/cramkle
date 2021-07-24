import { useMutation } from '@apollo/react-hooks'
import { Trans, t } from '@lingui/macro'
import { useMachine } from '@xstate/react'
import gql from 'graphql-tag'
import type { Location } from 'history'
import * as React from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Machine, assign } from 'xstate'

import BackButton from '../components/BackButton'
import ModelFieldsForm from '../components/ModelFieldsForm'
import ModelNameForm from '../components/ModelNameForm'
import ModelTemplatesForm from '../components/ModelTemplatesForm'
import StepTab from '../components/StepTab'
import { Container } from '../components/views/Container'
import { Headline1 } from '../components/views/Typography'
import { TIMEOUT_MEDIUM, pushToast } from '../toasts/pushToast'
import { MODELS_QUERY } from './ModelsSection'
import type {
  CreateModelMutation,
  CreateModelMutationVariables,
  CreateModelMutation_createModel_model,
} from './__generated__/CreateModelMutation'
import type { ModelsQuery } from './__generated__/ModelsQuery'

const CREATE_MODEL_MUTATION = gql`
  mutation CreateModelMutation(
    $name: String!
    $fields: [FieldInput!]!
    $templates: [TemplateInput!]!
  ) {
    createModel(
      input: { name: $name, fields: $fields, templates: $templates }
    ) {
      model {
        id
        name
        templates {
          id
          name
        }
        fields {
          id
          name
        }
      }
    }
  }
`

interface MachineContext {
  name: string
  fields: { name: string }[]
  templates: { name: string }[]
  model: CreateModelMutation_createModel_model | null
}

type MachineEvents =
  | { type: 'SUBMIT_NAME'; name: string }
  | { type: 'SUBMIT_FIELDS'; fields: { name: string }[] }
  | { type: 'SUBMIT_TEMPLATES'; templates: { name: string }[] }
  | { type: 'GO_BACK' }

const machine = Machine<MachineContext, MachineEvents>(
  {
    initial: 'editName',
    context: {
      name: '',
      fields: [{ name: '' }],
      templates: [{ name: '' }],
      model: null,
    },
    states: {
      editName: {
        on: {
          SUBMIT_NAME: {
            target: 'editFields',
            actions: assign({ name: (_, event) => event.name }),
          },
        },
      },
      editFields: {
        on: {
          GO_BACK: 'editName',
          SUBMIT_FIELDS: {
            target: 'editTemplates',
            actions: assign({ fields: (_, event) => event.fields }),
          },
        },
      },
      editTemplates: {
        on: {
          GO_BACK: 'editFields',
        },
        initial: 'idle',
        states: {
          idle: {
            on: {
              SUBMIT_TEMPLATES: {
                target: 'submitting',
                actions: assign({ templates: (_, event) => event.templates }),
              },
            },
          },
          submitting: {
            on: {
              SUBMIT_TEMPLATES: undefined,
            },
            invoke: {
              src: 'tryToCreateModel',
              onDone: {
                target: 'submitted',
                actions: assign({
                  model: (_, event) => event.data.createModel.model,
                }),
              },
              onError: {
                target: 'error',
              },
            },
          },
          submitted: { type: 'final' },
          error: {
            on: {
              SUBMIT_TEMPLATES: 'submitting',
            },
          },
        },
        onDone: {
          actions: ['showCreatedToast', 'navigateToModelList'],
        },
      },
    },
  },
  {
    actions: {
      showCreatedToast: () => {},
      navigateToModelList: () => {},
    },
  }
)

const AddModelPage: React.VFC = () => {
  const [mutate] = useMutation<
    CreateModelMutation,
    CreateModelMutationVariables
  >(CREATE_MODEL_MUTATION)

  const location = useLocation() as Location<{ referrer?: string }>
  const navigate = useNavigate()

  const [state, send] = useMachine(machine, {
    actions: {
      showCreatedToast: (ctx) => {
        pushToast(
          {
            message: t`Model created successfully`,
            action: {
              label: t`View`,
              onPress: () => {
                navigate(`/m/${ctx.model!.id}`)
              },
            },
          },
          TIMEOUT_MEDIUM
        )
      },
      navigateToModelList: () => {
        navigate(location.state?.referrer ?? '/models')
      },
    },
    services: {
      tryToCreateModel: (ctx) => {
        return mutate({
          variables: ctx,
          update: (proxy, mutationResult) => {
            let data: ModelsQuery | null

            try {
              data = proxy.readQuery<ModelsQuery>({
                query: MODELS_QUERY,
              })
            } catch {
              return
            }

            const { createModel } = mutationResult!.data!

            data?.models.push(createModel!.model!)

            proxy.writeQuery({ query: MODELS_QUERY, data })
          },
        }).then(({ data }) => data)
      },
    },
  })

  let content = null

  switch (true) {
    case state.matches('editName'): {
      content = (
        <ModelNameForm
          name={state.context.name}
          onSubmit={(name) => send('SUBMIT_NAME', { name })}
        />
      )
      break
    }
    case state.matches('editFields'): {
      content = (
        <ModelFieldsForm
          fields={state.context.fields}
          onSubmit={(fields) => send('SUBMIT_FIELDS', { fields })}
          onGoBack={() => send('GO_BACK')}
        />
      )
      break
    }
    case state.matches('editTemplates'): {
      content = (
        <ModelTemplatesForm
          templates={state.context.templates}
          onGoBack={() => send('GO_BACK')}
          onSubmit={(templates) => send('SUBMIT_TEMPLATES', { templates })}
          isSubmitting={state.matches({ editTemplates: 'submitting' })}
          hasError={state.matches({ editTemplates: 'error' })}
        />
      )
      break
    }
    default: {
      throw new Error('Invalid state: ' + state.toStrings().join(', '))
    }
  }

  return (
    <Container className="py-4">
      <BackButton to={location.state?.referrer ?? '/'} />

      <Headline1 className="border-b border-divider border-opacity-divider text-txt text-opacity-text-primary">
        <Trans>Create model</Trans>
      </Headline1>

      <div className="mt-6">
        <div className="flex space-x-6">
          <StepTab isActive index={0} className="flex-1">
            <Trans>Base information</Trans>
          </StepTab>
          <StepTab
            isActive={
              state.matches('editFields') || state.matches('editTemplates')
            }
            index={1}
            className="flex-1"
          >
            <Trans>Fields</Trans>
          </StepTab>
          <StepTab
            isActive={state.matches('editTemplates')}
            index={2}
            className="flex-1"
          >
            <Trans>Templates</Trans>
          </StepTab>
        </div>

        {content}
      </div>
    </Container>
  )
}

export default AddModelPage
