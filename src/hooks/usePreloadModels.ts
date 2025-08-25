import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";

export function usePreloadModels() {
  useEffect(() => {
    useGLTF.preload("/models/cloud.gltf");
    useGLTF.preload("/models/plane.gltf");
    useGLTF.preload("/models/scene.gltf");
  }, []);
}
