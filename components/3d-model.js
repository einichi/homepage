import { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { loadGLTFModel } from '../libs/model'
import { ModelSpinner, ModelContainer } from './model-loader'

const INTRO_FRAMES = 100
const SKIPPED_INTRO_FRAMES = INTRO_FRAMES + 1

function easeOutCirc(x) {
  return Math.sqrt(1 - Math.pow(x - 1, 4))
}

function disposeObject(root) {
  root.traverse((child) => {
    if (child.geometry) child.geometry.dispose()
    const material = child.material
    if (!material) return
    if (Array.isArray(material)) {
      material.forEach((entry) => entry.dispose())
    } else {
      material.dispose()
    }
  })
}

const ThreeDModel = () => {
  const refContainer = useRef()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { current: container } = refContainer
    if (!container) return undefined

    const target = new THREE.Vector3(0, 0, 0)
    const initialCameraPosition = new THREE.Vector3(0, 6, 24)
    const scene = new THREE.Scene()
    const scW = container.clientWidth
    const scH = container.clientHeight

    const reducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let renderer
    try {
      // No WebGL (blocklisted GPU, headless, disabled context) must degrade to
      // "no model", never to a thrown effect that unmounts the page. three
      // itself throws when it cannot create a context, so a plain try/catch
      // is the whole guard — do NOT create a probe canvas and hand its
      // context to the renderer: in three r144 the renderer would keep
      // domElement as its own blank canvas while rendering into the
      // detached probe canvas, i.e. an invisible model.
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
      })
    } catch (error) {
      console.error('WebGL unavailable, skipping 3D model', {
        message: error instanceof Error ? error.message : null
      })
      setLoading(false)
      return undefined
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
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
    controls.autoRotate = !reducedMotion
    controls.target = target

    let disposed = false
    let req = null
    let frame = reducedMotion ? SKIPPED_INTRO_FRAMES : 0
    let loadedModel = null
    // Wait for the first intersection result before starting the animation.
    let visible = typeof IntersectionObserver !== 'function'

    const canRender = () =>
      !disposed &&
      loadedModel &&
      visible &&
      document.visibilityState === 'visible'

    const animate = () => {
      req = null
      if (!canRender() || reducedMotion) return

      frame = frame <= INTRO_FRAMES ? frame + 1 : frame

      if (frame <= INTRO_FRAMES) {
        const p = initialCameraPosition
        const rotSpeed = -easeOutCirc(frame / 120) * Math.PI * 20

        camera.position.x = p.x * Math.cos(rotSpeed) + p.z * Math.sin(rotSpeed)
        camera.position.z = p.z * Math.cos(rotSpeed) - p.x * Math.sin(rotSpeed)
        camera.lookAt(target)
      } else {
        controls.update()
      }

      renderer.render(scene, camera)
      req = requestAnimationFrame(animate)
    }

    // Reduced motion still has to repaint while the user drags, so render on
    // demand instead of running an idle rAF loop.
    const renderOnce = () => {
      if (canRender()) renderer.render(scene, camera)
    }

    const stopAnimation = () => {
      if (req !== null) cancelAnimationFrame(req)
      req = null
    }

    const syncAnimation = () => {
      if (!canRender()) {
        stopAnimation()
      } else if (reducedMotion) {
        renderOnce()
      } else if (req === null) {
        req = requestAnimationFrame(animate)
      }
    }

    if (reducedMotion) {
      controls.addEventListener('change', renderOnce)
    }

    const handleWindowResize = () => {
      const width = container.clientWidth
      const height = container.clientHeight

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      renderOnce()
    }

    window.addEventListener('resize', handleWindowResize, false)
    document.addEventListener('visibilitychange', syncAnimation)

    // Stop burning GPU time when the model has scrolled out of view.
    let observer
    if (typeof IntersectionObserver === 'function') {
      observer = new IntersectionObserver(
        ([entry]) => {
          const nextVisible = entry.isIntersecting
          if (nextVisible === visible) return
          visible = nextVisible

          syncAnimation()
        },
        { threshold: 0 }
      )
      observer.observe(container)
    }

    // Declared before the load promise so cleanup can cancel a frame that a
    // late-resolving load would otherwise schedule after teardown.
    loadGLTFModel(scene, '/models/ricky.glb', {
      receiveShadow: false,
      castShadow: false
    })
      .then((model) => {
        loadedModel = model
        if (disposed) {
          // Unmounted mid-download: drop the geometry we just decoded.
          disposeObject(model)
          return
        }
        setLoading(false)
        syncAnimation()
      })
      .catch((error) => {
        // Never leave the spinner up forever when the GLB 404s or is corrupt.
        console.error('Failed to load 3D model', {
          message: error instanceof Error ? error.message : null
        })
        if (!disposed) setLoading(false)
      })

    return () => {
      disposed = true
      stopAnimation()
      if (observer) observer.disconnect()
      document.removeEventListener('visibilitychange', syncAnimation)
      controls.removeEventListener('change', renderOnce)
      window.removeEventListener('resize', handleWindowResize, false)
      controls.dispose()
      if (loadedModel) disposeObject(loadedModel)
      container.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  return (
    <ModelContainer ref={refContainer}>
      {loading && <ModelSpinner />}
    </ModelContainer>
  )
}

export default ThreeDModel
