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

import './ContextMenuComponent.css'
import { ReactElement, useCallback, useEffect, useState } from 'react'
import {
  GraphViewerInputMode,
  IEdge,
  IModelItem,
  INode,
  PopulateItemContextMenuEventArgs,
} from 'yfiles'
import { detectSafariVersion, detectiOSVersion } from '../lib/Workarounds'
import { useGraphComponent } from './GraphComponentProvider'

interface ContextMenuItem {
  title: string
  action: () => void
}

/**
 * Helper function to determine the page's center location.
 */
function getCenterInPage(element: HTMLElement): { x: number; y: number } {
  let left = element.clientWidth / 2.0
  let top = element.clientHeight / 2.0
  while (element.offsetParent) {
    left += element.offsetLeft
    top += element.offsetTop
    element = element.offsetParent as HTMLElement
  }
  return { x: left, y: top }
}

export function ContextMenuComponent() {
  const graphComponent = useGraphComponent()
  const [menuVisible, setMenuVisible] = useState(false)
  const [menuLocation, setMenuLocation] = useState({ x: 0, y: 0 })
  const [menuItems, setMenuItems] = useState<ContextMenuItem[]>([])

  const openContextMenu = useCallback(
    (location: { x: number; y: number }) => {
      if (graphComponent) {
        const worldLocation = graphComponent.toWorldFromPage(location)
        const showMenu = (graphComponent.inputMode as GraphViewerInputMode).contextMenuInputMode.shouldOpenMenu(
          worldLocation
        )
        if (showMenu) {
          setMenuLocation(location)
          setMenuVisible(true)
        }
      }
    },
    [graphComponent]
  )

  const populateContextMenu = useCallback(
    (args: PopulateItemContextMenuEventArgs<IModelItem>) => {
      let menuItems: ContextMenuItem[] = []
      const item = args.item
      if (INode.isInstance(item)) {
        menuItems.push({
          title: 'Node Context Menu Item',
          action: () => {
            alert('Clicked Node Context Menu Item')
          },
        })
      } else if (IEdge.isInstance(item)) {
        menuItems.push({
          title: 'Edge Context Menu Item',
          action: () => {
            alert('Clicked Edge Context Menu Item')
          },
        })
      }
      setMenuItems(menuItems)
      if (menuItems.length > 0) {
        args.showMenu = true
      }
    },
    []
  )

  const runAction = useCallback((action: () => void) => {
    // run the given action of the clicked item
    action()
    // close the contextmenu afterward
    setMenuVisible(false)
  }, [])

  /**
   * Registers the context menu listeners.
   */
  useEffect(() => {
    const componentDiv = graphComponent.div
    const contextMenuListener = (evt: MouseEvent) => {
      evt.preventDefault()
      const me = evt
      if ((evt as any).mozInputSource === 1 && me.button === 0) {
        // This event was triggered by the context menu key in Firefox.
        // Thus, the coordinates of the event point to the lower left corner of the element and should be corrected.
        openContextMenu(getCenterInPage(componentDiv))
      } else if (me.pageX === 0 && me.pageY === 0) {
        // Most likely, this event was triggered by the context menu key in IE.
        // Thus, the coordinates are meaningless and should be corrected.
        openContextMenu(getCenterInPage(componentDiv))
      } else {
        openContextMenu({ x: me.pageX, y: me.pageY })
      }
    }

    // Listen for the contextmenu event
    // Note: On Linux based systems (e.g. Ubuntu), the contextmenu event is fired on mouse down
    // which triggers the ContextMenuInputMode before the ClickInputMode. Therefore handling the
    // event, will prevent the ItemRightClicked event from firing.
    // For more information, see https://docs.yworks.com/yfileshtml/#/kb/article/780/
    componentDiv.addEventListener('contextmenu', contextMenuListener, false)

    if (detectSafariVersion() > 0 || detectiOSVersion() > 0) {
      // Additionally add a long press listener especially for iOS, since it does not fire the contextmenu event.
      let contextMenuTimer: ReturnType<typeof setTimeout> | undefined
      graphComponent.addTouchDownListener((_, args) => {
        contextMenuTimer = setTimeout(() => {
          openContextMenu(
            graphComponent.toPageFromView(
              graphComponent.toViewCoordinates(args.location)
            )
          )
        }, 500)
      })
      graphComponent.addTouchUpListener(() => {
        clearTimeout(contextMenuTimer!)
      })
    }

    // Listen to the context menu key to make it work in Chrome
    const contextMenuKeyListener = (evt: KeyboardEvent) => {
      if (evt.key === 'ContextMenu') {
        evt.preventDefault()
        openContextMenu(getCenterInPage(componentDiv))
      }
    }
    componentDiv.addEventListener('keyup', contextMenuKeyListener)

    // register the close listener
    const closeMenuListener = () => {
      setMenuVisible(false)
    }
    const inputMode = graphComponent.inputMode as GraphViewerInputMode
    inputMode.contextMenuInputMode.addCloseMenuListener(closeMenuListener)

    // register populate items listener
    const populateContextMenuListener = (
      _: GraphViewerInputMode,
      args: PopulateItemContextMenuEventArgs<IModelItem>
    ) => {
      // select the item
      if (args.item) {
        graphComponent.selection.clear()
        graphComponent.selection.setSelected(args.item, true)
      }
      // populate the menu
      populateContextMenu(args)
    }
    inputMode.addPopulateItemContextMenuListener(populateContextMenuListener)

    return () => {
      // cleanup
      componentDiv.removeEventListener('contextmenu', contextMenuListener)
      componentDiv.removeEventListener('keyup', contextMenuKeyListener)
      inputMode.contextMenuInputMode.removeCloseMenuListener(closeMenuListener)
      inputMode.removePopulateItemContextMenuListener(
        populateContextMenuListener
      )
    }
  }, [graphComponent, openContextMenu, populateContextMenu])

  let contextMenuItems: ReactElement[] = []
  if (menuVisible) {
    contextMenuItems = menuItems.map((item, i) => {
      return (
        <button onClick={() => runAction(item.action)} key={i}>
          {item.title}
        </button>
      )
    })
  }

  return (
    <div
      className="context-menu"
      style={{
        display: menuVisible && menuItems.length > 0 ? 'block' : 'none',
        left: menuLocation.x,
        top: menuLocation.y,
      }}
    >
      {contextMenuItems}
    </div>
  )
}
