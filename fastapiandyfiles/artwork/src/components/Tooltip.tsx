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

import './Tooltip.css'
import { useGraphComponent } from './GraphComponentProvider'
import {
  ComponentType,
  createElement,
  PropsWithChildren,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react'
import {
  GraphInputMode,
  GraphItemTypes,
  IEdge,
  IModelItem,
  INode,
  Point,
  QueryItemToolTipEventArgs,
  TimeSpan,
} from 'yfiles'
import { createPortal } from 'react-dom'

interface TooltipProps {
  title: string
  content: string
}

type TooltipRenderInfo = {
  domNode: HTMLDivElement
  component: ComponentType<TooltipProps>
  props: TooltipProps
}

export default function TooltipContent({ title, content }: TooltipProps) {
  return (
    <div className="tooltip">
      <h4>{title}</h4>
      <pre>{content}</pre>
    </div>
  )
}

/**
 * The Tooltip component adds an item tooltip to its parent component. It is designed to be used inside a
 * parent component that displays the graph.
 */
export function Tooltip() {
  const graphComponent = useGraphComponent()

  const [
    tooltipRenderInfo,
    setTooltipRenderInfo,
  ] = useState<TooltipRenderInfo | null>(null)

  useEffect(() => {
    const inputMode = graphComponent.inputMode as GraphInputMode

    // show tooltips only for nodes and edges
    inputMode.toolTipItems = GraphItemTypes.NODE | GraphItemTypes.EDGE

    // Customize the tooltip's behavior to our liking.
    const mouseHoverInputMode = inputMode.mouseHoverInputMode
    mouseHoverInputMode.toolTipLocationOffset = new Point(15, 15)
    mouseHoverInputMode.delay = TimeSpan.fromMilliseconds(500)
    mouseHoverInputMode.duration = TimeSpan.fromSeconds(5)

    // Register a listener for when a tooltip should be shown.
    const queryItemTooltipListener = (
      _: GraphInputMode,
      evt: QueryItemToolTipEventArgs<IModelItem>
    ) => {
      if (evt.handled) {
        // Tooltip content has already been assigned -> nothing to do.
        return
      }

      // Use a rich HTML element as tooltip content. Alternatively, a plain string would do as well.
      evt.toolTip = createTooltipContent(evt.item!, setTooltipRenderInfo)

      // Indicate that the tooltip content has been set.
      evt.handled = true
    }
    inputMode.addQueryItemToolTipListener(queryItemTooltipListener)

    return () => {
      inputMode.removeQueryItemToolTipListener(queryItemTooltipListener)
    }
  }, [graphComponent])

  return (
    <>
      {tooltipRenderInfo &&
        createPortal(
          createElement(
            TooltipWrapper,
            {},
            createElement<TooltipProps>(
              tooltipRenderInfo.component,
              tooltipRenderInfo.props
            )
          ),
          tooltipRenderInfo.domNode
        )}
    </>
  )
}

/**
 * The tooltip may either be a plain string or it can also be a rich HTML element. In this case, we
 * show the latter by using a dynamically compiled React component.
 */
function createTooltipContent(
  item: IModelItem,
  setTooltipInfo: (tooltipInfo: TooltipRenderInfo) => void
): HTMLDivElement {
  const tooltipContainer = document.createElement('div')

  const title =
    item instanceof INode
      ? 'Node Data'
      : item instanceof IEdge
      ? 'Edge Data'
      : 'Label Data'

  const content = item.tag
    ? JSON.stringify(item.tag, null, 2)
    : 'No data available'

  setTooltipInfo({
    domNode: tooltipContainer,
    component: TooltipContent,
    props: { title, content },
  })

  return tooltipContainer
}

/**
 * Wrapper component to ensure that the tooltip is rendered inside the window.
 */
function TooltipWrapper({ children }: PropsWithChildren) {
  const graphComponent = useGraphComponent()

  useLayoutEffect(() => {
    ;(graphComponent.inputMode as GraphInputMode).mouseHoverInputMode.toolTip?.updateLocation()
  }, [])

  return <>{children}</>
}
