import {
  NodeTransform,
  NodeTypes,
  ElementTypes,
  TransformContext,
  RootNode
} from '@vue/compiler-core'
import { TRANSITION } from '../runtimeHelpers'
import { createDOMCompilerError, DOMErrorCodes } from '../errors'

export const warnTransitionChildren: NodeTransform = (node, context) => {
  if (!context.parent) {
    return
  }
  node = context.parent
  if (node.type === 1 /* ELEMENT */ && node.tagType === 1 /* COMPONENT */) {
    const component = context.isBuiltInComponent(node.tag)
    if (component === TRANSITION) {
      let shouldWarn = false
      if (node.children.length === 0) {
        shouldWarn = true
      } else if (node.children.length === 1) {
        if (node.children[0].type === 11 /* FOR */) {
          shouldWarn = true
        }
      } else if (node.branches) {
        const index = context.childIndex
        const branches = node.branches
        if (
          (index === 0 && node.children[0].type !== 9) ||
          (index !== 0 && branches[index].type !== 10)
        ) {
          shouldWarn = true
        }
      }
      if (shouldWarn) {
        context.onError(
          createDOMCompilerError(64 /* X_TRANSITION_INVALID_CHILDREN */, {
            start: node.children[0].loc.start,
            end: node.children[node.children.length - 1].loc.end,
            source: ''
          })
        )
      }
    }
  }
}
