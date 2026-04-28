import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useMousePosition } from '../../hooks/useMousePosition'
import { useMouseVelocity } from '../../hooks/useMouseVelocity'

// ─── 共有 velocity（球体・リング両方で参照）────────────
// モジュールレベルで持つことで Canvas 内の全コンポーネントが同じ値を参照できる
const sharedVel = { x: 0, y: 0, mag: 0 }

// ─── コナミコード カオスモード ──────────────────────────
// Canvas 外から操作するためモジュールレベルで管理
export const chaosRef = { current: false }

// ─── velocity 更新コンポーネント（Canvas 内に1つだけ置く）──
function VelocityManager() {
  const velocity = useMouseVelocity()

  useFrame(() => {
    // smoothVel に向けて lerp
    sharedVel.x = sharedVel.x * 0.97 + velocity.current.x * 0.03
    sharedVel.y = sharedVel.y * 0.97 + velocity.current.y * 0.03
    // 生velocity をゆっくり減衰
    velocity.current.x *= 0.88
    velocity.current.y *= 0.88
    sharedVel.mag = Math.min(
      Math.sqrt(sharedVel.x ** 2 + sharedVel.y ** 2), 1.0
    )
  })

  return null
}

// ─── 波形計算の定数（リング・球体で共通）────────────────
const WAVE_SPEED    = 2.2
const WAVE_SEGMENTS = 7
const BASE_AMP      = 0.015
const EXTRA_AMP     = 0.25
// 常時揺らめき
const AMBIENT_AMP   = 0.038
const AMBIENT_FREQ  = 3
const AMBIENT_SPEED = 0.9

// ─── 球体本体（エッジをリングと同じ波形で歪ませる）─────
function DeepSeaSphere() {
  const meshRef   = useRef<THREE.Mesh>(null)
  const shaderRef = useRef<{ uniforms: Record<string, THREE.IUniform> } | null>(null)
  const mouse     = useMousePosition()
  const rot       = useRef({ x: 0, y: 0 })
  const matcap    = useTexture('/images/env/matcap.png')

  const material = useMemo(() => {
    const mat = new THREE.MeshMatcapMaterial({
      matcap,
    })

    mat.onBeforeCompile = (shader) => {
      // uniforms を追加
      shader.uniforms.uTime   = { value: 0 }
      shader.uniforms.uVelX   = { value: 0 }
      shader.uniforms.uVelY   = { value: 0 }
      shader.uniforms.uVelMag = { value: 0 }

      // uniform 宣言を vertex shader の先頭に挿入
      shader.vertexShader =
        `uniform float uTime;\n` +
        `uniform float uVelX;\n` +
        `uniform float uVelY;\n` +
        `uniform float uVelMag;\n` +
        shader.vertexShader

      // begin_vertex の直後に波形変形を挿入
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        /* glsl */`
        #include <begin_vertex>

        // z=0（赤道）に近いほど edgeFactor が大きい → リングがある場所だけ変形
        float edgeFactor = 1.0 - abs(position.z / 2.0);
        edgeFactor = pow(edgeFactor, 2.5);

        // リングと同じ波形計算
        float sAngle      = atan(transformed.y, transformed.x);
        float mouseAngle  = atan(-uVelY, uVelX);
        float directional = max(cos(sAngle - mouseAngle), 0.0);

        float sWave = sin(sAngle * ${WAVE_SEGMENTS}.0 + uTime * ${WAVE_SPEED}) *
                      (${BASE_AMP} + uVelMag * ${EXTRA_AMP} * directional) *
                      edgeFactor;

        // 常時揺らめき（マウスに依存しない）
        float ambientWave = sin(sAngle * ${AMBIENT_FREQ}.0 + uTime * ${AMBIENT_SPEED}) *
                            ${AMBIENT_AMP} * edgeFactor;

        vec3 waveDir = normalize(vec3(transformed.x, transformed.y, 0.0));
        transformed  += waveDir * (sWave + ambientWave);
        `
      )

      shaderRef.current = shader
    }

    return mat
  }, [matcap])

  useFrame(({ clock }) => {
    if (!meshRef.current) return

    if (chaosRef.current) {
      // カオスモード：爆速回転 + 最大変形
      rot.current.x += 0.06
      rot.current.y += 0.09
      meshRef.current.rotation.x = rot.current.x
      meshRef.current.rotation.y = rot.current.y
      if (shaderRef.current) {
        shaderRef.current.uniforms.uTime.value   = clock.getElapsedTime() * 6
        shaderRef.current.uniforms.uVelX.value   = 1.0
        shaderRef.current.uniforms.uVelY.value   = 1.0
        shaderRef.current.uniforms.uVelMag.value = 1.0
      }
    } else {
      // 通常モード
      rot.current.x += (mouse.current.y * Math.PI * 0.8 - rot.current.x) * 0.04
      rot.current.y += (mouse.current.x * Math.PI * 0.8 - rot.current.y) * 0.04
      meshRef.current.rotation.x = rot.current.x
      meshRef.current.rotation.y = rot.current.y
      if (shaderRef.current) {
        shaderRef.current.uniforms.uTime.value   = clock.getElapsedTime()
        shaderRef.current.uniforms.uVelX.value   = sharedVel.x
        shaderRef.current.uniforms.uVelY.value   = sharedVel.y
        shaderRef.current.uniforms.uVelMag.value = sharedVel.mag
      }
    }
  })

  return (
    <mesh ref={meshRef} material={material}>
      <sphereGeometry args={[2, 128, 128]} />
    </mesh>
  )
}

// ─── 波打つグローリング（リングと球体の波形を揃える）───
const ringVertexShader = /* glsl */`
  uniform float uTime;
  uniform float uVelX;
  uniform float uVelY;
  uniform float uVelMag;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float angle       = atan(pos.y, pos.x);
    float mouseAngle  = atan(-uVelY, uVelX);
    float directional = max(cos(angle - mouseAngle), 0.0);

    float wave = sin(angle * ${WAVE_SEGMENTS}.0 + uTime * ${WAVE_SPEED}) *
                 (${BASE_AMP} + uVelMag * ${EXTRA_AMP} * directional);

    // 常時揺らめき
    float ambientWave = sin(angle * ${AMBIENT_FREQ}.0 + uTime * ${AMBIENT_SPEED}) *
                        ${AMBIENT_AMP};

    vec3 dir = normalize(vec3(pos.x, pos.y, 0.0));
    pos += dir * (wave + ambientWave);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

// チューブ断面の中心→エッジに向かってアルファを落としてブラー感を出す
const fragMain = /* glsl */`
  varying vec2 vUv;
  void main() {
    float dist  = abs(vUv.y - 0.5) * 2.0;          // 0=中心, 1=エッジ
    float alpha = 1.0 - smoothstep(0.1, 1.0, dist); // エッジでふわっと消える
    gl_FragColor = vec4(0.0, 0.08, 1.0, alpha) * 4.5;
  }
`
const fragSub = /* glsl */`
  varying vec2 vUv;
  void main() {
    float dist  = abs(vUv.y - 0.5) * 2.0;
    float alpha = 1.0 - smoothstep(0.05, 1.0, dist);
    gl_FragColor = vec4(0.05, 0.3, 1.0, alpha) * 2.2;
  }
`

function WavyRing() {
  const mat1 = useRef<THREE.ShaderMaterial>(null)
  const mat2 = useRef<THREE.ShaderMaterial>(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (const mat of [mat1.current, mat2.current]) {
      if (!mat) continue
      if (chaosRef.current) {
        mat.uniforms.uTime.value   = t * 6
        mat.uniforms.uVelX.value   = 1.0
        mat.uniforms.uVelY.value   = 1.0
        mat.uniforms.uVelMag.value = 1.0
      } else {
        mat.uniforms.uTime.value   = t
        mat.uniforms.uVelX.value   = sharedVel.x
        mat.uniforms.uVelY.value   = sharedVel.y
        mat.uniforms.uVelMag.value = sharedVel.mag
      }
    }
  })

  const makeUniforms = () => ({
    uTime:   { value: 0 },
    uVelX:   { value: 0 },
    uVelY:   { value: 0 },
    uVelMag: { value: 0 },
  })

  return (
    <group rotation={[0.12, 0, 0.06]} position={[0, -0.09, 0]}>
      <mesh renderOrder={1}>
        <torusGeometry args={[2.10, 0.012, 16, 200]} />
        <shaderMaterial
          ref={mat1}
          vertexShader={ringVertexShader}
          fragmentShader={fragMain}
          uniforms={makeUniforms()}
          transparent
          depthTest={true}
        />
      </mesh>
      <mesh renderOrder={1}>
        <torusGeometry args={[2.19, 0.005, 16, 200]} />
        <shaderMaterial
          ref={mat2}
          vertexShader={ringVertexShader}
          fragmentShader={fragSub}
          uniforms={makeUniforms()}
          transparent
          depthTest={true}
        />
      </mesh>
    </group>
  )
}

// ─── 浮遊パーティクル ────────────────────────────────────
function Particles({ count = 250 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r     = 3.2 + Math.random() * 3.0
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    return pos
  }, [count])

  useFrame((_, delta) => {
    if (pointsRef.current) {
      const speed = chaosRef.current ? 8 : 1
      pointsRef.current.rotation.y += delta * 0.04 * speed
      pointsRef.current.rotation.x += delta * 0.01 * speed
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.028} color="#4499FF"
        transparent opacity={0.75} sizeAttenuation
      />
    </points>
  )
}

// ─── Canvas エクスポート ─────────────────────────────────
export default function HeroSphere() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      {/* matcap使用でライティング不要 */}
      {/* velocity を1か所で管理 → sharedVel を通じて球体・リングへ */}
      <VelocityManager />
      <DeepSeaSphere />
      <WavyRing />
      <Particles />

      <EffectComposer>
        <Bloom luminanceThreshold={0.15} intensity={2.2} radius={0.85} />
      </EffectComposer>
    </Canvas>
  )
}
