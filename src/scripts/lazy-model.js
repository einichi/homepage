export function enableLazyModel() {
  const host = document.querySelector('[data-model-host]')
  const fallback = document.querySelector('[data-model-fallback]')
  const status = document.querySelector('[data-model-status]')
  const retry = document.querySelector('[data-model-retry]')
  if (!host || !fallback || !status || !retry) return

  const ja = document.documentElement.lang === 'ja'
  const motion = matchMedia('(prefers-reduced-motion: reduce)')
  let booted = false
  let dispose = () => {}
  const disposeObject = (root) => {
    const textures = new Set()
    root.traverse((child) => {
      child.geometry?.dispose()
      for (const material of Array.isArray(child.material)
        ? child.material
        : [child.material]) {
        if (!material) continue
        for (const value of Object.values(material))
          if (value?.isTexture) textures.add(value)
        material.dispose()
      }
    })
    textures.forEach((texture) => texture.dispose())
  }

  const load = async () => {
    if (booted) return
    booted = true
    host.hidden = false
    fallback.hidden = false
    status.textContent = ja
      ? '3Dモデルを読み込み中…'
      : 'Loading interactive model…'
    retry.hidden = true
    let disposed = false
    let renderer,
      controls,
      observer,
      resizeObserver,
      model,
      frame = null
    const removers = []
    const stop = () => {
      if (frame !== null) cancelAnimationFrame(frame)
      frame = null
    }
    dispose = () => {
      if (disposed) return
      disposed = true
      stop()
      observer?.disconnect()
      resizeObserver?.disconnect()
      removers.forEach((remove) => remove())
      controls?.dispose()
      if (model) disposeObject(model)
      renderer?.domElement.remove()
      renderer?.dispose()
      booted = false
    }
    const listen = (target, name, callback) => {
      target.addEventListener(name, callback)
      removers.push(() => target.removeEventListener(name, callback))
    }
    listen(window, 'pagehide', dispose)

    try {
      const THREE = await import('three')
      const [{ OrbitControls }, { GLTFLoader }] = await Promise.all([
        import('three/examples/jsm/controls/OrbitControls.js'),
        import('three/examples/jsm/loaders/GLTFLoader.js')
      ])
      if (disposed) return
      const scene = new THREE.Scene()
      const target = new THREE.Vector3(0, 0, 0)
      const initialCameraPosition = new THREE.Vector3(0, 6, 24)
      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000)
      camera.position.copy(initialCameraPosition)
      camera.lookAt(target)
      for (const [x, y, z, intensity] of [
        [20, 30, 20, 1.25],
        [-40, 30, 20, 1.25],
        [-40, 30, -80, 0.5]
      ]) {
        const light = new THREE.SpotLight(0xffffff, intensity)
        light.position.set(x, y, z)
        light.angle = 0.3
        scene.add(light)
      }
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.outputEncoding = THREE.sRGBEncoding
      renderer.domElement.setAttribute('role', 'img')
      renderer.domElement.setAttribute(
        'aria-label',
        ja
          ? '回転・拡大縮小できる3Dモデル'
          : 'Interactive 3D model you can rotate and zoom'
      )
      host.append(renderer.domElement)
      controls = new OrbitControls(camera, renderer.domElement)
      controls.target.copy(target)
      controls.autoRotate = !motion.matches
      // Keep vertical touch gestures available for scrolling the page.
      controls.enablePan = false
      let visible = typeof IntersectionObserver !== 'function'
      let introFrame = motion.matches ? 101 : 0
      const canRender = () => !disposed && model && visible && !document.hidden
      const renderOnce = () => {
        if (canRender()) renderer.render(scene, camera)
      }
      const animate = () => {
        frame = null
        if (!canRender() || motion.matches) return
        if (introFrame <= 100) {
          introFrame += 1
          const turn =
            -Math.sqrt(1 - Math.pow(introFrame / 120 - 1, 4)) * Math.PI * 20
          camera.position.x = initialCameraPosition.z * Math.sin(turn)
          camera.position.z = initialCameraPosition.z * Math.cos(turn)
          camera.lookAt(target)
        } else controls.update()
        renderer.render(scene, camera)
        frame = requestAnimationFrame(animate)
      }
      const sync = () => {
        if (!canRender()) stop()
        else if (motion.matches) {
          stop()
          renderOnce()
        } else if (frame === null) frame = requestAnimationFrame(animate)
      }
      const resize = () => {
        const width = Math.max(1, host.clientWidth),
          height = Math.max(1, host.clientHeight)
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
        renderer.setSize(width, height)
        renderOnce()
      }
      listen(controls, 'change', () => {
        if (motion.matches) renderOnce()
      })
      listen(document, 'visibilitychange', sync)
      listen(window, 'resize', resize)
      listen(motion, 'change', () => {
        controls.autoRotate = !motion.matches
        if (motion.matches) introFrame = 101
        sync()
      })
      if (typeof ResizeObserver === 'function') {
        resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(host)
      }
      if (typeof IntersectionObserver === 'function') {
        observer = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting
          sync()
        })
        observer.observe(host)
      }
      resize()
      const gltf = await new Promise((resolve, reject) =>
        new GLTFLoader().load('/models/ricky.glb', resolve, undefined, reject)
      )
      if (disposed) {
        disposeObject(gltf.scene)
        return
      }
      model = gltf.scene
      model.name = 'model'
      model.position.set(0, 0, 0)
      scene.add(model)
      fallback.hidden = true
      status.textContent = ''
      resize()
      sync()
    } catch {
      if (disposed) return
      dispose()
      fallback.hidden = false
      status.textContent = ja
        ? 'この環境では3Dモデルを表示できません。'
        : 'The interactive model is unavailable in this browser.'
      retry.hidden = false
    }
  }
  retry.addEventListener('click', () => {
    dispose()
    load()
  })
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) load()
  })
  if (typeof IntersectionObserver === 'function') {
    const lazy = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          lazy.disconnect()
          load()
        }
      },
      { rootMargin: '260px 0px' }
    )
    lazy.observe(host)
  } else load()
}
