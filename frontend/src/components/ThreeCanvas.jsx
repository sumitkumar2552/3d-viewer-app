import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const ThreeCanvas = ({ modelUrl, cameraState, onCameraChange }) => {
  const mountRef = useRef(null)
  const rendererRef = useRef(null)
  const animationRef = useRef(null)

  const initScene = useCallback(() => {
    const mount = mountRef.current
    if (!mount) return

    const width = mount.clientWidth
    const height = mount.clientHeight

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#0d0d1a')

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.set(0, 2, 5)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    mount.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xffffff, 2)
    dirLight.position.set(5, 10, 5)
    scene.add(dirLight)

    const pointLight = new THREE.PointLight(0x6c63ff, 1, 100)
    pointLight.position.set(-5, 5, -5)
    scene.add(pointLight)

    // Grid
    const grid = new THREE.GridHelper(20, 20, '#333333', '#222222')
    scene.add(grid)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.update()

    controls.addEventListener('end', () => {
      if (onCameraChange) {
        onCameraChange({
          positionX: camera.position.x,
          positionY: camera.position.y,
          positionZ: camera.position.z,
          targetX: controls.target.x,
          targetY: controls.target.y,
          targetZ: controls.target.z
        })
      }
    })

    // Load Model
    if (modelUrl) {
      const loader = new GLTFLoader()

      // Loading text
      const loadDiv = document.createElement('div')
      loadDiv.id = 'load-text'
      loadDiv.style.cssText = `
        position:absolute; top:50%; left:50%;
        transform:translate(-50%,-50%);
        color:#6c63ff; font-size:1.2rem;
        font-family:sans-serif; pointer-events:none;
        background:rgba(0,0,0,0.7); padding:1rem 2rem;
        border-radius:8px;
      `
      loadDiv.textContent = 'Loading 3D Model...'
      mount.appendChild(loadDiv)

      loader.load(
        modelUrl,
        (gltf) => {
          const model = gltf.scene

          // Auto center & scale
          const box = new THREE.Box3().setFromObject(model)
          const center = box.getCenter(new THREE.Vector3())
          const size = box.getSize(new THREE.Vector3())
          const maxDim = Math.max(size.x, size.y, size.z)
          const scale = 3 / maxDim
          model.scale.setScalar(scale)
          model.position.sub(center.multiplyScalar(scale))

          scene.add(model)

          const el = document.getElementById('load-text')
          if (el) el.remove()
        },
        (xhr) => {
          if (xhr.total > 0) {
            const pct = Math.round((xhr.loaded / xhr.total) * 100)
            const el = document.getElementById('load-text')
            if (el) el.textContent = `Loading... ${pct}%`
          }
        },
        (error) => {
          console.error('GLB load error:', error)
          const el = document.getElementById('load-text')
          if (el) el.textContent = `Error loading model!`
        }
      )
    }

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Resize
    const onResize = () => {
      if (!mount) return
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(animationRef.current)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [modelUrl])

  useEffect(() => {
    const cleanup = initScene()
    return () => { if (cleanup) cleanup() }
  }, [initScene])

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}
    />
  )
}

export default ThreeCanvas