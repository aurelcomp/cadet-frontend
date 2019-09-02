import * as React from 'react';
import { Divider } from '@blueprintjs/core';

type FaceapiDisplayState = {
  loading: boolean;
};

class FaceapiDisplay2 extends React.Component<{}, FaceapiDisplayState> {
  constructor(props: any) {
    super(props);
    this.state = { loading: true };
    }
  
  
  // UI can be improved
  public render() {
      return (
        <div id="faceapi-display">
        <p>
          Face API display.
        </p>
        <div className="sa-video-element">
          <video 
            id="video"
            autoPlay={true}
            width={400}
            height={300}
            style={{position: 'absolute'}}
          />
          <canvas id='canvas' style={{position: 'relative'}}/>
        </div>
        <Divider />
        <div>
          <input type="file" id="imageUpload"/>
          <button id="capture">Capture</button>
        </div>
      </div>
      
    );
  }


}

export default FaceapiDisplay2;
