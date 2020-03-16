import {
  NodeTransform,
  ElementTypes,
  NodeTypes,
  IfBranchNode,
  ParentNode,
  IfNode
} from '@vue/compiler-core'
import { TRANSITION } from '../runtimeHelpers'
import { createDOMCompilerError, DOMErrorCodes } from '../errors'

export const warnTransitionChildren: NodeTransform = (node, context) => {
  if (!context.parent) {
    return
  }
  const parentNode = context.parent
  if (
    parentNode.type === NodeTypes.ELEMENT &&
    parentNode.tagType === ElementTypes.COMPONENT
  ) {
    const component = context.isBuiltInComponent(parentNode.tag)
    if (component === TRANSITION) {
      let shouldWarn = false
      if (parentNode.children.length === 0) {
        shouldWarn = true
      } else if (parentNode.children.length === 1) {
        if (parentNode.children[0].type === NodeTypes.FOR) {
          shouldWarn = true
        }
      } else if (parentNode.children) {
        const index = context.childIndex
        const branches = (parentNode.children[0] as IfNode).branches
        if (
          (index === 0 && parentNode.children[0].type !== 9) ||
          (index !== 0 && branches[index].type !== 10)
        ) {
          shouldWarn = true
        }
      }
      if (shouldWarn) {
        context.onError(
          createDOMCompilerError(DOMErrorCodes.X_TRANSITION_INVALID_CHILDREN, {
            // start: parentNode.children[0].loc.start,
            // end: parentNode.children[parentNode.children.length - 1].loc.end,
            // source: ''
            start: parentNode.children[0].loc.start,
            end: parentNode.children[parentNode.children.length - 1].loc.end,
            source: ''
          })
        )
      }
    }
  }
}
