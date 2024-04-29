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

import { DefaultGraph, IGraph, LayoutExecutorAsync } from 'yfiles'

import { getLayoutWorker } from './LayoutWorkerFactory'
import type { LayoutConfiguration } from './LayoutUtils'
import { getAlgorithm, getLayoutData, getLayoutDescriptor } from './LayoutUtils'

export function arrange<T extends IGraph | undefined>(
  graph: T | undefined,
  configuration: LayoutConfiguration
): T | IGraph | Promise<T | IGraph> {
  if (graph) {
    const layoutWorker = getLayoutWorker()
    if (configuration.worker && layoutWorker) {
      return runLayoutAsync(graph!, configuration).then(() => graph)
    } else {
      runLayoutSync(graph!, configuration)
      return graph
    }
  }
  return new DefaultGraph()
}

function runLayoutSync(
  graph: IGraph,
  configuration: LayoutConfiguration
): void {
  const layout = getAlgorithm(configuration)
  const layoutData = getLayoutData(configuration)
  graph.applyLayout(layout, layoutData)
}

let transaction = 0
function runLayoutAsync(
  graph: IGraph,
  configuration: LayoutConfiguration
): Promise<void> {
  const layoutWorker = getLayoutWorker()

  function webWorkerMessageHandler(data: any) {
    const currentTransaction = transaction
    transaction++

    data.transaction = currentTransaction

    return new Promise<object>((resolve) => {
      layoutWorker.addEventListener(
        'message',
        function onmessage(e: MessageEvent) {
          if (e.data.transaction === currentTransaction) {
            layoutWorker.removeEventListener('message', onmessage)
            resolve(e.data)
          }
        }
      )

      layoutWorker.postMessage(data)
    })
  }

  // create an asynchronous layout executor that calculates a layout on the worker
  const executor = new LayoutExecutorAsync({
    messageHandler: webWorkerMessageHandler,
    graph,
    layoutDescriptor: getLayoutDescriptor(configuration),
    layoutData: getLayoutData(configuration),
  })

  return executor.start()
}
