"use client";

import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame } from 'react-three-fiber';
import * as posenet from '@tensorflow-models/posenet';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';

const Model = () => {
  const meshRef = useRef();

  useFrame(() => {
    // Actualiza la posición del modelo en cada cuadro
    // Puedes usar Three.js para manipular la posición del modelo 3D
    meshRef.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={meshRef}>
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};

const IndexPage = () => {
  const webcamRef = useRef(null);

  useEffect(() => {
    const runPosenet = async () => {
      const net = await posenet.load({
        architecture: 'MobileNetV1',
        outputStride: 16,
        inputResolution: { width: 640, height: 480 },
        multiplier: 0.75,
      });

      setInterval(() => {
        detect(net);
      }, 1000);
    };

    const detect = async (net) => {
      if (
        typeof webcamRef.current !== 'undefined' &&
        webcamRef.current !== null &&
        webcamRef.current.video.readyState === 4
      ) {
        const video = webcamRef.current.video;
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;

        const pose = await net.estimateSinglePose(video);
        console.log(pose);

        // Actualiza la posición del modelo 3D utilizando las coordenadas de pose
        updateModelPosition(pose);
      }
    };

    const updateModelPosition = (pose) => {
      // Actualiza la posición del modelo 3D según las coordenadas de pose
      // Aquí puedes usar Three.js para manipular la posición del modelo 3D
    };

    runPosenet();
  }, []);

  return (
    <div>
      <Webcam
        ref={webcamRef}
        mirrored={true}
        style={{
          position: 'absolute',
          marginLeft: 'auto',
          marginRight: 'auto',
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 9,
          width: 640,
          height: 480,
        }}
      />

      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />

        {/* Renderiza tu modelo 3D */}
        <Model />
      </Canvas>
    </div>
  );
};

export default IndexPage;
