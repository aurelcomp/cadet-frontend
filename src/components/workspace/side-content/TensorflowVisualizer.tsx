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
          Welcome to the Tensorflow Visualizer!
          <br />
          <br />
        </p>
        <p id="tensorflow-results">
          Find your results here:
          <br />
        </p>
      </div>
    );
  }


}

export default TensorflowVisualizer;
