import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import './Loader.css'

export default function Loader({ onDone }) {
  const stageRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [hiding, setHiding] = useState(false)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const width = stage.clientWidth
    const height = stage.clientHeight
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    stage.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100)
    camera.position.set(width / height < 0.75 ? 6.5 : 5, width / height < 0.75 ? 4.8 : 3.8, width / height < 0.75 ? 9 : 7)
    camera.lookAt(0, 0.55, 0)

    scene.add(new THREE.AmbientLight(0xffffff, 0.3))
    const spot = new THREE.SpotLight(0xffffff, 100, 12, Math.PI / 5, 0.4)
    spot.position.set(0, 5, 0)
    scene.add(spot)
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5)
    dirLight.position.set(2, 3, 4)
    scene.add(dirLight)

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 12),
      new THREE.MeshLambertMaterial({ color: 0x0f0f13 })
    )
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    scene.add(ground)

    const grid = new THREE.GridHelper(12, 24, 0xff5a1f, 0x24242c)
    grid.position.y = 0.001
    scene.add(grid)

    const steeringWheel = new THREE.Group()
    steeringWheel.position.set(0, 1.8, 0)
    steeringWheel.rotation.x = -0.2
    scene.add(steeringWheel)

    const rimMaterial = new THREE.MeshStandardMaterial({ color: 0x15151a, roughness: 0.3, metalness: 0.6 })
    const hubMaterial = new THREE.MeshStandardMaterial({ color: 0xff5a1f, roughness: 0.25, metalness: 0.7 })
    const rim = new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.13, 16, 64), rimMaterial)
    steeringWheel.add(rim)

    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.18, 32), hubMaterial)
    hub.rotation.x = Math.PI / 2
    steeringWheel.add(hub)

    const spokeGeometry = new THREE.BoxGeometry(0.1, 1.2, 0.12)
    ;[0, Math.PI / 2, Math.PI / 4, -Math.PI / 4].forEach((angle) => {
      const spoke = new THREE.Mesh(spokeGeometry, hubMaterial)
      spoke.rotation.z = angle
      steeringWheel.add(spoke)
    })

    const movingHardware = new THREE.Group()
    scene.add(movingHardware)
    const nutMaterial = new THREE.MeshStandardMaterial({ color: 0xf5c518, metalness: 0.85, roughness: 0.22 })
    const nutGeometry = new THREE.CylinderGeometry(0.16, 0.16, 0.12, 6)
    const nuts = [-1, 0, 1].map((x, index) => {
      const nut = new THREE.Mesh(nutGeometry, nutMaterial)
      nut.position.set(x * 1.35, 0.55 + index * 0.15, -0.3)
      nut.rotation.x = Math.PI / 2
      movingHardware.add(nut)
      return nut
    })
    const screw = new THREE.Group()
    const screwMaterial = new THREE.MeshStandardMaterial({ color: 0x9aa0ab, metalness: 0.9, roughness: 0.2 })
    const screwShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.7, 16), screwMaterial)
    const screwHead = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16), screwMaterial)
    screw.add(screwShaft, screwHead)
    screw.position.set(2.3, 1.05, -0.25)
    screw.rotation.z = Math.PI / 2
    movingHardware.add(screw)

    let raf
    const clock = new THREE.Clock()
    const render = () => {
      steeringWheel.rotation.z = clock.getElapsedTime() * 1.4
      movingHardware.rotation.y = clock.getElapsedTime() * 1.8
      screw.rotation.x = clock.getElapsedTime() * 2.4
      nuts.forEach((nut, index) => {
        nut.position.y = 0.55 + index * 0.15 + Math.sin(clock.getElapsedTime() * 2 + index) * 0.18
        nut.rotation.z = clock.getElapsedTime() * (index % 2 ? -2 : 2)
      })
      renderer.render(scene, camera)
      raf = requestAnimationFrame(render)
    }
    render()

    const onResize = () => {
      const nextWidth = stage.clientWidth
      const nextHeight = stage.clientHeight
      camera.aspect = nextWidth / nextHeight
      camera.position.z = nextWidth / nextHeight < 0.75 ? 9 : 7
      camera.position.y = nextWidth / nextHeight < 0.75 ? 4.8 : 3.8
      camera.updateProjectionMatrix()
      renderer.setSize(nextWidth, nextHeight)
    }
    window.addEventListener('resize', onResize)

    let pct = 0
    const interval = setInterval(() => {
      pct += Math.random() * 12 + 4
      if (pct >= 100) {
        pct = 100
        clearInterval(interval)
        setTimeout(() => {
          setHiding(true)
          setTimeout(() => onDone && onDone(), 700)
        }, 500)
      }
      setProgress(Math.floor(pct))
    }, 220)

    return () => {
      clearInterval(interval)
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      steeringWheel.traverse((object) => {
        if (object.isMesh) {
          object.geometry.dispose()
          object.material.dispose()
        }
      })
      movingHardware.traverse((object) => {
        if (object.isMesh) {
          object.geometry.dispose()
          object.material.dispose()
        }
      })
      renderer.dispose()
      if (renderer.domElement.parentNode) stage.removeChild(renderer.domElement)
    }
  }, [onDone])

  return (
    <div className={`loader ${hiding ? 'loader--hide' : ''}`}>
      <div className="loader__stage" ref={stageRef} />
      <div className="loader__ui">
        <div className="loader__brand">
          AUTO&nbsp;BODY&nbsp;REPAIR<span>INC.</span>
        </div>
        <div className="loader__bar">
          <div className="loader__fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="loader__meta">
          <span>Warming up the shop</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  )
}
