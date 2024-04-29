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

import './Toolbar.css'
import { ExportFormat, ExportSupport } from '../lib/ExportSupport'
import { ICommand } from 'yfiles'
import PrintingSupport from '../lib/PrintingSupport'
import { useGraphComponent } from './GraphComponentProvider'
import GraphSearchInput from './GraphSearchInput'

export default function Toolbar() {
  const graphComponent = useGraphComponent()

  function exportFile(format: ExportFormat): void {
    // export the graph of the current view
    const graph = graphComponent.graph

    if (graph.nodes.size === 0) {
      return
    }

    graphComponent.updateContentRect(30)
    const exportArea = graphComponent.contentRect
    switch (format) {
      case ExportFormat.SVG:
        ExportSupport.saveSvg(graph, exportArea, 1)
        break
      case ExportFormat.PNG:
        ExportSupport.savePng(graph, exportArea, 1)
        break
      case ExportFormat.PDF:
        ExportSupport.savePdf(graph, exportArea, 1)
        break
    }
  }
  function print() {
    new PrintingSupport().printGraph(graphComponent.graph)
  }

  return (
    <div className="toolbar">
      <button
        title="Export as SVG"
        className="labeled"
        onClick={() => exportFile(ExportFormat.SVG)}
      >
        SVG
      </button>
      <button
        title="Export as PNG"
        className="labeled"
        onClick={() => exportFile(ExportFormat.PNG)}
      >
        PNG
      </button>
      <button
        title="Export as PDF"
        className="labeled"
        onClick={() => exportFile(ExportFormat.PDF)}
      >
        PDF
      </button>
      <span className="separator" />
      <button
        title="Print diagram"
        className="demo-icon-yIconPrint"
        onClick={print}
      />
      <span className="separator" />
      <button
        title="Increase Zoom"
        className="demo-icon-yIconZoomIn"
        onClick={() => ICommand.INCREASE_ZOOM.execute(null, graphComponent)}
      />
      <button
        title="Decrease Zoom"
        className="demo-icon-yIconZoomOut"
        onClick={() => ICommand.DECREASE_ZOOM.execute(null, graphComponent)}
      />
      <button
        title="Fit Graph Bounds"
        className="demo-icon-yIconZoomFit"
        onClick={() => ICommand.FIT_GRAPH_BOUNDS.execute(null, graphComponent)}
      />

      <span className="spacer" />
      <GraphSearchInput />
    </div>
  )
}
