import * as React from 'react';


type TensorflowVisualizerTabState = {
  loading: boolean;
};

class TensorflowVisualizer extends React.Component<{}, TensorflowVisualizerTabState> {
  constructor(props: any) {
    super(props);
    this.state = { loading: true };
    }
  
  
  // UI can be improved
  public render() {
      return (
        <div id="tensorflow-visualizer">
        <p>
          The environmental visualizer generates the environmental model diagram based on
          breakpoints set in the editor.
        </p>
      </div>
    );
  }


}

export default TensorflowVisualizer;
