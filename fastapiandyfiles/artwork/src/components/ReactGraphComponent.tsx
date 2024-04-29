// src/components/ReactGraphComponent.tsx
import React, { useEffect, useRef, useState } from 'react';
import 'yfiles/yfiles.css';
import {
  CollapsibleNodeStyleDecorator,
  FoldingManager,
  GraphComponent,
  GroupNodeStyle,
  GroupNodeStyleIconType,
} from 'yfiles';
import { useAddGraphComponent, useGraphComponent } from './GraphComponentProvider';
import { useGraphViewerInputMode } from '../hooks/useInputMode';
import '../lib/yFilesLicense';

interface Props {
  appId: string;
}

const ReactGraphComponent: React.FC<Props> = ({ appId }) => {
  const [graphData, setGraphData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const graphComponent = useGraphComponent();
  const graphComponentContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/graph/${appId}`);
        const data = await response.json();
        setGraphData(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch graph data:', err);
        setError('Failed to load graph');
        setIsLoading(false);
      }
    };

    if (appId) {
      fetchGraphData();
    }
  }, [appId]);

  useEffect(() => {
    if (graphComponent && graphData) {
      loadGraph(graphComponent, graphData);
    }
  }, [graphData, graphComponent]);

  if (graphComponent) {
    useAddGraphComponent(graphComponentContainer, graphComponent);
    useGraphViewerInputMode(graphComponent);
  }

  if (isLoading) return <p>Loading graph...</p>;
  if (error) return <p>Error loading graph: {error}</p>;

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div
        className="graph-component-container"
        style={{ width: '100%', height: '100%' }}
        ref={graphComponentContainer}
      ></div>
    </div>
  );
};

function loadGraph(graphComponent: GraphComponent, graphData: any) {
  const graph = graphComponent.graph;
  graph.clear();
  graphData.nodes.forEach((node: any) => {
    graph.createNode({
      tag: node
    });
  });
  graphData.edges.forEach((edge: any) => {
    const sourceNode = graph.nodes.find(node => node.tag.id === edge.from);
    const targetNode = graph.nodes.find(node => node.tag.id === edge.to);
    if (sourceNode && targetNode) {
      graph.createEdge(sourceNode, targetNode);
    }
  });
  graphComponent.fitGraphBounds();
}

export default ReactGraphComponent;
