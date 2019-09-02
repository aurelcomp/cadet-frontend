import { Button, ButtonGroup, Divider} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import * as React from 'react';

type FaceapiDisplayState = {
  width: number;
  height: number;
};

class FaceapiDisplay extends React.Component<{}, FaceapiDisplayState> {
  constructor(props: any) {
    super(props);
    this.state = {
      width: (window as any)._WIDTH,
      height: (window as any)._HEIGHT,
    };

  }

  public takePhoto() {
    (window as any).video.takePhoto();
  }

  public async trainRecognition() {
    (window as any).video.trainRecognition();
  }

  // UI can be improved
  public render() {
    return (
      <div className="sa-video">
        <div className="sa-video-element">
          <video id="video"
            style={{position: 'absolute'}}
            autoPlay={true}
            width={(window as any)._WIDTH}
            height={(window as any)._HEIGHT}
          />
          <canvas id="canvas"
            style={{position: 'relative'}}
            width={(window as any)._WIDTH}
            height={(window as any)._HEIGHT}
          />
        </div>
        
        <Divider />

        <div className="sa-video-header">
          <div className="sa-video-header-element">
              <Button
                className={'sa-live-video-button'}
                style={{ height: 70 }}
                icon={IconNames.CAMERA}
                onClick={this.takePhoto}
                text={'Take picture'}
              />
              <Button
                className={'sa-still-image-button'}
                style={{ height: 70 }}
                icon={IconNames.CAMERA}
                onClick={this.trainRecognition}
                text={'Reset'}
              />
          </div>
          <Divider />
          <div className="sa-video-header-element">
            <canvas 
              id="canvas-capture"  
              style={{ height: 70 }}
            />
          </div>
        </div>

        <Divider />

        <div className="sa-video-header">
          <div className="sa-video-header-element">
            <ButtonGroup>
              <Button
                className={'sa-live-video-button'}
                icon={IconNames.CAMERA}
                onClick={this.takePhoto}
                text={'Take picture'}
              />
              <Button
                className={'sa-still-image-button'}
                icon={IconNames.CAMERA}
                text={'Reset'}
              />
            </ButtonGroup>
          </div>
          <Divider />
          <div className="sa-video-header-element">
            <canvas id="canvas-capture-2"/>
          </div>
        </div>
      </div>
    );
  }
}

export default FaceapiDisplay;
