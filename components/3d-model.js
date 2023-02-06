import { useState, useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { loadGLTFModel } from '../libs/model'
import { ModelSpinner, ModelContainer } from './model-loader'

function easeOutCirc(x) {
  return Math.sqrt(1 - Math.pow(x - 1, 4))
}

const ThreeDModel = () => {
  const refContainer = useRef()
  const [loading, setLoading] = useState(true)
  const [renderer, setRenderer] = useState()
  const [_camera, setCamera] = useState()
  const [target] = useState(new THREE.Vector3(0, 0, 0))
  const [initialCameraPosition] = useState(new THREE.Vector3(0, 6, 24))
  const [spotLightPositionA] = useState(new THREE.Vector3(20, 30, 20))
  const [spotLightPositionB] = useState(new THREE.Vector3(-40, 30, 20))
  const [spotLightPositionC] = useState(new THREE.Vector3(-40, 30, -80))
  const [scene] = useState(new THREE.Scene())
  const [_controls, setControls] = useState()

  const handleWindowResize = useCallback(() => {
    const { current: container } = refContainer
    if (container && renderer) {
      const scW = container.clientWidth
      const scH = container.clientHeight

      renderer.setSize(scW, scH)
    }
  }, [renderer])

  useEffect(() => {
    const { current: container } = refContainer
    if (container && !renderer) {
      const scW = container.clientWidth
      const scH = container.clientHeight

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
      })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(scW, scH)
      renderer.outputEncoding = THREE.sRGBEncoding
      container.appendChild(renderer.domElement)
      setRenderer(renderer)

      const camera = new THREE.PerspectiveCamera(50, scW / scH, 0.1, 1000)

      camera.position.copy(initialCameraPosition)
      scene.add(camera)

      const spotLightA = new THREE.SpotLight(0xffffff)
      const spotLightB = new THREE.SpotLight(0xffffff)
      const spotLightC = new THREE.SpotLight(0xffffff)
      spotLightA.position.copy(spotLightPositionA)
      spotLightA.angle = 0.3
      spotLightA.intensity = 1.25
      scene.add(spotLightA)
      spotLightB.position.copy(spotLightPositionB)
      spotLightB.angle = 0.3
      spotLightB.intensity = 1.25
      scene.add(spotLightB)
      spotLightC.position.copy(spotLightPositionC)
      spotLightC.angle = 0.3
      spotLightC.intensity = 0.5
      scene.add(spotLightC)

      const controls = new OrbitControls(camera, renderer.domElement)
      controls.autoRotate = true
      controls.target = target
      setControls(controls)

      loadGLTFModel(scene, '/models/ricky.glb', {
        receiveShadow: false,
        castShadow: false
      }).then(() => {
        animate()
        setLoading(false)
      })

      let req = null
      let frame = 0
      const animate = () => {
        req = requestAnimationFrame(animate)
        frame = frame <= 100 ? frame + 1 : frame

        if (frame <= 100) {
          const p = initialCameraPosition
          const rotSpeed = -easeOutCirc(frame / 120) * Math.PI * 20

          camera.position.x =
            p.x * Math.cos(rotSpeed) + p.z * Math.sin(rotSpeed)
          camera.position.z =
            p.z * Math.cos(rotSpeed) - p.x * Math.sin(rotSpeed)
          camera.lookAt(target)
        } else {
          controls.update()
        }

        renderer.render(scene, camera)
      }

      return () => {
        cancelAnimationFrame(req)
        renderer.dispose()
      }
    }
  }, [])

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize, false)
    return () => {
      window.removeEventListener('resize', handleWindowResize, false)
    }
  }, [renderer, handleWindowResize])

  return (
    <ModelContainer ref={refContainer}>
      {loading && <ModelSpinner />}
    </ModelContainer>
  )
}

export default ThreeDModel
