import { Button, Divider} from '@blueprintjs/core';
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

  public takePhotoA() {
    (window as any).video.takePhotoA();
  }

  public takePhotoB() {
    (window as any).video.takePhotoB();
  }

  public takePhotoC() {
    (window as any).video.takePhotoC();
  }

  public resetPhotoA() {
    (window as any).resetPhotoA();
  }

  public resetPhotoB() {
    (window as any).resetPhotoB();
  }

  public resetPhotoC() {
    (window as any).resetPhotoC();
  }


  // UI can be improved
  public render() {
    return (
      <div className="sa-video">
        <div className="header-video">
          Welcome to the Face API display! Call "launch_video();" to enable the webcam.
        </div>
        <br />
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
                style={{ height: 50 }}
                icon={IconNames.CAMERA}
                onClick={this.takePhotoA}
                text={'Take picture'}
              />
          </div>
          <Divider />
          <div className="sa-video-header-element">
            <canvas 
              id="canvas-capture-a"  
              style={{ height: 50}}
            />
          </div>
          <Divider />
          <div className="sa-video-header-element">
            <Button
                className={'sa-still-image-button'}
                style={{ height: 50 }}
                icon={IconNames.RESET}
                onClick={this.resetPhotoA}
                text={'Reset'}
            />
          </div>
        </div>

        <Divider />

        <div className="sa-video-header">
          <div className="sa-video-header-element">
              <Button
                className={'sa-live-video-button'}
                style={{ height: 50 }}
                icon={IconNames.CAMERA}
                onClick={this.takePhotoB}
                text={'Take picture'}
              />
          </div>
          <Divider />
          <div className="sa-video-header-element">
            <canvas 
              id="canvas-capture-b"  
              style={{ height: 50 }}
            />
          </div>
          <Divider />
          <div className="sa-video-header-element">
              <Button
                className={'sa-still-image-button'}
                style={{ height: 50 }}
                icon={IconNames.RESET}
                onClick={this.resetPhotoB}
                text={'Reset'}
              />
          </div>
        </div>

        <Divider />

        <div className="sa-video-header">
          <div className="sa-video-header-element">
              <Button
                className={'sa-live-video-button'}
                style={{ height: 50 }}
                icon={IconNames.CAMERA}
                onClick={this.takePhotoC}
                text={'Take picture'}
              />
          </div>
          <Divider />
          <div className="sa-video-header-element">
            <canvas 
              id="canvas-capture-c"  
              style={{ height: 50 }}
            />
          </div>
          <Divider />
          <div className="sa-video-header-element">
              <Button
                className={'sa-still-image-button'}
                style={{ height: 50 }}
                icon={IconNames.RESET}
                onClick={this.resetPhotoC}
                text={'Reset'}
              />
          </div>
        </div>
      </div>
    );
  }
}

export default FaceapiDisplay;
