export function enableLazyModel() {
  const host = document.querySelector('[data-model-host]')
  const fallback = document.querySelector('[data-model-fallback]')
  const status = document.querySelector('[data-model-status]')
  const retry = document.querySelector('[data-model-retry]')
  const turnButton = document.querySelector('[data-model-turn]')
  if (!host || !fallback || !status || !retry || !turnButton) return

  const ja = document.documentElement.lang === 'ja'
  let turn = () => {}
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
      ? '3Dポートレートを読み込み中…'
      : 'Loading 3D portrait…'
    retry.hidden = true
    let disposed = false
    let renderer,
      controls,
      observer,
      resizeObserver,
      model
    const removers = []
    dispose = () => {
      if (disposed) return
      disposed = true
      turn = () => {}
      turnButton.hidden = true
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
      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000)
      camera.position.set(0, 0, 24)
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
          ? 'リッキーの3Dポートレート。ドラッグまたは下のボタンで回転できます。'
          : '3D portrait of Ricky. Drag or use the button below to turn.'
      )
      host.append(renderer.domElement)
      controls = new OrbitControls(camera, renderer.domElement)
      controls.target.copy(target)
      controls.autoRotate = false
      controls.enablePan = false
      controls.enableZoom = false
      controls.minPolarAngle = Math.PI * 0.3
      controls.maxPolarAngle = Math.PI * 0.65
      // OrbitControls sets an inline touchAction; keep vertical page scrolling.
      renderer.domElement.style.touchAction = 'pan-y pinch-zoom'
      let visible = typeof IntersectionObserver !== 'function'
      const renderOnce = () => {
        if (!disposed && model && visible && !document.hidden)
          renderer.render(scene, camera)
      }
      const framePortrait = () => {
        const bounds = new THREE.Box3().setFromObject(model)
        const size = bounds.getSize(new THREE.Vector3())
        bounds.getCenter(target)
        const halfFov = (camera.fov * Math.PI) / 360
        const distance = Math.max(size.y, size.x / camera.aspect) /
          (2 * Math.tan(halfFov)) * 1.05 + size.z / 2
        controls.target.copy(target)
        camera.position.set(target.x, target.y + size.y * 0.025, target.z + distance)
        camera.lookAt(target)
        controls.update()
      }
      const resize = () => {
        const width = Math.max(1, host.clientWidth),
          height = Math.max(1, host.clientHeight)
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
        renderer.setSize(width, height)
        if (model) framePortrait()
        renderOnce()
      }
      listen(controls, 'change', renderOnce)
      listen(document, 'visibilitychange', renderOnce)
      listen(window, 'resize', resize)
      if (typeof ResizeObserver === 'function') {
        resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(host)
      }
      if (typeof IntersectionObserver === 'function') {
        observer = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting
          renderOnce()
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
      model.rotation.y = -Math.PI / 9
      scene.add(model)
      fallback.hidden = true
      status.textContent = ''
      turnButton.hidden = false
      turn = () => {
        model.rotation.y += Math.PI / 4
        framePortrait()
        renderOnce()
      }
      resize()
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
  turnButton.addEventListener('click', () => turn())
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
