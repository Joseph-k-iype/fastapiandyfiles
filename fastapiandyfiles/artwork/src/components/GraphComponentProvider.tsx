/**
 * @license
 * This app exhibits yFiles for HTML functionalities.
 * Copyright (c) 2024 by yWorks GmbH, Vor dem Kreuzberg 28,
 * 72070 Tuebingen, Germany. All rights reserved.
 *
 * yFiles demo files exhibit yFiles for HTML functionalities.
 * Any redistribution of demo files in source code or binary form, with
 * or without modification, is not permitted.
 *
 * Owners of a valid software license for a yFiles for HTML
 * version are allowed to use the app source code as basis for their
 * own yFiles for HTML powered applications. Use of such programs is
 * governed by the rights and conditions as set out in the yFiles for HTML
 * license agreement. If in doubt, please mail to contact@yworks.com.
 *
 * THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN
 * NO EVENT SHALL yWorks BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import {
  createContext,
  PropsWithChildren,
  RefObject,
  useContext,
  useLayoutEffect,
  useMemo,
} from 'react'
import { GraphComponent, ScrollBarVisibility } from 'yfiles'

const GraphComponentContext = createContext<GraphComponent | null>(null)

/**
 * A hook that returns the [yFiles GraphComponent]{@link http://docs.yworks.com/yfileshtml/#/api/GraphComponent}
 * that is used by the parent component to display the graph.
 * This hook provides the option to use the yFiles API for customizing graph layout, visualization, and interaction.
 * While it is highly versatile, yFiles proficiency is required for effective application development.
 * @returns the GraphComponent used to display the graph.
 */
export function useGraphComponent() {
  const graphComponent = useContext(GraphComponentContext)
  if (!graphComponent) {
    throw new Error('GraphComponent is not available in this context.')
  }
  return graphComponent
}

export function GraphComponentProvider({ children }: PropsWithChildren) {
  const graphComponent = useMemo(() => {
    const graphComponent = new GraphComponent()
    graphComponent.div.style.width = '100%'
    graphComponent.div.style.height = '100%'
    graphComponent.div.style.minWidth = '400px'
    graphComponent.div.style.minHeight = '400px'
    // scrollbar styling
    graphComponent.horizontalScrollBarPolicy =
      ScrollBarVisibility.AS_NEEDED_DYNAMIC
    graphComponent.verticalScrollBarPolicy =
      ScrollBarVisibility.AS_NEEDED_DYNAMIC
    return graphComponent
  }, [])

  return (
    <GraphComponentContext.Provider value={graphComponent}>
      {children}
    </GraphComponentContext.Provider>
  )
}

/**
 * A hook that adds the given [yFiles GraphComponent]{@link http://docs.yworks.com/yfileshtml/#/api/GraphComponent}
 * to a parent in useLayoutEffect().
 */
export function useAddGraphComponent(
  parentRef: RefObject<HTMLElement>,
  graphComponent: GraphComponent
) {
  useLayoutEffect(() => {
    if (parentRef.current) {
      const firstChild = parentRef.current.firstChild
      if (firstChild) {
        parentRef.current.insertBefore(graphComponent.div, firstChild)
      } else {
        parentRef.current.appendChild(graphComponent.div)
      }
    }
    return () => {
      if (parentRef.current) {
        parentRef.current.removeChild(graphComponent.div)
      }
    }
  }, [])
}
