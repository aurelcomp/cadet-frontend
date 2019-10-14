function FaceTracking(){
    this.startFaceTracking = async ()=>{
		return new Promise(async (resolve)=>{
			const MODELS_PATH = 'externalLibs/faceapi/models';
			console.log('launch loading');					
			// const startTime = Date.now();
			await faceapi.loadTinyFaceDetectorModel(MODELS_PATH);
			console.log('first loaded');	
			// console.log('after loadTinyFaceDetectorModel', Date.now() - startTime);
			await faceapi.loadFaceRecognitionModel(MODELS_PATH);
			// console.log('after loadFaceRecognitionModel', Date.now() - startTime);
			await faceapi.loadFaceLandmarkTinyModel(MODELS_PATH);
			// console.log('after loadFaceLandmarkTinyModel', Date.now() - startTime);	
			//ready = true;

			renderLoop();
			resolve();
		});
	};
}