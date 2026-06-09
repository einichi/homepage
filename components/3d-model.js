import { useState, useEffect, useRef } from 'react'
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

  useEffect(() => {
    const { current: container } = refContainer
    if (container) {
      const target = new THREE.Vector3(0, 0, 0)
      const initialCameraPosition = new THREE.Vector3(0, 6, 24)
      const scene = new THREE.Scene()
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

      const camera = new THREE.PerspectiveCamera(50, scW / scH, 0.1, 1000)

      camera.position.copy(initialCameraPosition)
      camera.lookAt(target)

      const spotLightA = new THREE.SpotLight(0xffffff)
      const spotLightB = new THREE.SpotLight(0xffffff)
      const spotLightC = new THREE.SpotLight(0xffffff)
      spotLightA.position.set(20, 30, 20)
      spotLightA.angle = 0.3
      spotLightA.intensity = 1.25
      scene.add(spotLightA)
      spotLightB.position.set(-40, 30, 20)
      spotLightB.angle = 0.3
      spotLightB.intensity = 1.25
      scene.add(spotLightB)
      spotLightC.position.set(-40, 30, -80)
      spotLightC.angle = 0.3
      spotLightC.intensity = 0.5
      scene.add(spotLightC)

      const controls = new OrbitControls(camera, renderer.domElement)
      controls.autoRotate = true
      controls.target = target

      loadGLTFModel(scene, '/models/ricky.glb', {
        receiveShadow: false,
        castShadow: false
      }).then(() => {
        animate()
        setLoading(false)
      })

      let req = null
      let frame = 0
      const handleWindowResize = () => {
        const width = container.clientWidth
        const height = container.clientHeight

        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(width, height)
      }

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

      window.addEventListener('resize', handleWindowResize, false)

      return () => {
        cancelAnimationFrame(req)
        window.removeEventListener('resize', handleWindowResize, false)
        controls.dispose()
        container.removeChild(renderer.domElement)
        renderer.dispose()
      }
    }
  }, [])

  return (
    <ModelContainer ref={refContainer}>
      {loading && <ModelSpinner />}
    </ModelContainer>
  )
}

export default ThreeDModel
