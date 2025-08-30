import { createSignal, createEffect, onCleanup } from 'solid-js'
import type { ThreeDOptions, ThreeDState } from '../types.js'

export class ThreeDManager {
  private options: ThreeDOptions
  private state: ThreeDState
  private matrix: number[] = []

  constructor(options: ThreeDOptions = {}) {
    this.options = {
      threeDPerspective: 1000,
      threeDRotateX: 0,
      threeDRotateY: 0,
      threeDRotateZ: 0,
      threeDTranslateX: 0,
      threeDTranslateY: 0,
      threeDTranslateZ: 0,
      threeDScaleX: 1,
      threeDScaleY: 1,
      threeDScaleZ: 1,
      threeDMatrixAuto: true,
      ...options
    }
    
    // Initialize state with explicit typing
    const rotation = {
      x: this.options.threeDRotateX ?? 0,
      y: this.options.threeDRotateY ?? 0,
      z: this.options.threeDRotateZ ?? 0
    }
    
    const translation = {
      x: this.options.threeDTranslateX ?? 0,
      y: this.options.threeDTranslateY ?? 0,
      z: this.options.threeDTranslateZ ?? 0
    }
    
    const scale = {
      x: this.options.threeDScaleX ?? 1,
      y: this.options.threeDScaleY ?? 1,
      z: this.options.threeDScaleZ ?? 1
    }
    
    this.state = {
      matrix: this.createIdentityMatrix(),
      perspective: this.options.threeDPerspective ?? 1000,
      rotation,
      translation,
      scale,
      isDirty: true
    }
    
    this.updateMatrix()
  }

  private createIdentityMatrix(): number[] {
    return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]
  }

  private updateMatrix() {
    if (!this.state.isDirty) return

    // Create transformation matrix
    const matrix = this.createIdentityMatrix()
    
    // Apply perspective
    const perspective = this.state.perspective
    if (perspective !== 0) {
      matrix[11] = -1 / perspective
    }

    // Apply translation
    this.translateMatrix(matrix, this.state.translation.x, this.state.translation.y, this.state.translation.z)

    // Apply rotation
    this.rotateMatrix(matrix, this.state.rotation.x, this.state.rotation.y, this.state.rotation.z)

    // Apply scale
    this.scaleMatrix(matrix, this.state.scale.x, this.state.scale.y, this.state.scale.z)

    this.state.matrix = matrix
    this.state.isDirty = false

    // Call onThreeDUpdate callback
    if (this.options.onThreeDUpdate) {
      this.options.onThreeDUpdate(matrix)
    }
  }

  private translateMatrix(matrix: number[], x: number, y: number, z: number) {
    matrix[12] += x
    matrix[13] += y
    matrix[14] += z
  }

  private rotateMatrix(matrix: number[], x: number, y: number, z: number) {
    const radX = (x * Math.PI) / 180
    const radY = (y * Math.PI) / 180
    const radZ = (z * Math.PI) / 180

    // Rotation around X-axis
    if (radX !== 0) {
      const cosX = Math.cos(radX)
      const sinX = Math.sin(radX)
      const temp = [...matrix]
      
      matrix[4] = temp[4] * cosX + temp[8] * sinX
      matrix[5] = temp[5] * cosX + temp[9] * sinX
      matrix[6] = temp[6] * cosX + temp[10] * sinX
      matrix[7] = temp[7] * cosX + temp[11] * sinX
      matrix[8] = temp[8] * cosX - temp[4] * sinX
      matrix[9] = temp[9] * cosX - temp[5] * sinX
      matrix[10] = temp[10] * cosX - temp[6] * sinX
      matrix[11] = temp[11] * cosX - temp[7] * sinX
    }

    // Rotation around Y-axis
    if (radY !== 0) {
      const cosY = Math.cos(radY)
      const sinY = Math.sin(radY)
      const temp = [...matrix]
      
      matrix[0] = temp[0] * cosY - temp[8] * sinY
      matrix[1] = temp[1] * cosY - temp[9] * sinY
      matrix[2] = temp[2] * cosY - temp[10] * sinY
      matrix[3] = temp[3] * cosY - temp[11] * sinY
      matrix[8] = temp[0] * sinY + temp[8] * cosY
      matrix[9] = temp[1] * sinY + temp[9] * cosY
      matrix[10] = temp[2] * sinY + temp[10] * cosY
      matrix[11] = temp[3] * sinY + temp[11] * cosY
    }

    // Rotation around Z-axis
    if (radZ !== 0) {
      const cosZ = Math.cos(radZ)
      const sinZ = Math.sin(radZ)
      const temp = [...matrix]
      
      matrix[0] = temp[0] * cosZ + temp[4] * sinZ
      matrix[1] = temp[1] * cosZ + temp[5] * sinZ
      matrix[2] = temp[2] * cosZ + temp[6] * sinZ
      matrix[3] = temp[3] * cosZ + temp[7] * sinZ
      matrix[4] = temp[4] * cosZ - temp[0] * sinZ
      matrix[5] = temp[5] * cosZ - temp[1] * sinZ
      matrix[6] = temp[6] * cosZ - temp[2] * sinZ
      matrix[7] = temp[7] * cosZ - temp[3] * sinZ
    }
  }

  private scaleMatrix(matrix: number[], x: number, y: number, z: number) {
    matrix[0] *= x
    matrix[1] *= x
    matrix[2] *= x
    matrix[3] *= x
    matrix[4] *= y
    matrix[5] *= y
    matrix[6] *= y
    matrix[7] *= y
    matrix[8] *= z
    matrix[9] *= z
    matrix[10] *= z
    matrix[11] *= z
  }

  // Public API
  setPerspective(perspective: number) {
    this.state.perspective = perspective
    this.state.isDirty = true
    this.updateMatrix()
  }

  setRotation(x: number, y: number, z: number) {
    this.state.rotation = { x, y, z }
    this.state.isDirty = true
    this.updateMatrix()
  }

  setTranslation(x: number, y: number, z: number) {
    this.state.translation = { x, y, z }
    this.state.isDirty = true
    this.updateMatrix()
  }

  setScale(x: number, y: number, z: number) {
    this.state.scale = { x, y, z }
    this.state.isDirty = true
    this.updateMatrix()
  }

  rotateX(angle: number) {
    this.state.rotation.x += angle
    this.state.isDirty = true
    this.updateMatrix()
  }

  rotateY(angle: number) {
    this.state.rotation.y += angle
    this.state.isDirty = true
    this.updateMatrix()
  }

  rotateZ(angle: number) {
    this.state.rotation.z += angle
    this.state.isDirty = true
    this.updateMatrix()
  }

  translateX(distance: number) {
    this.state.translation.x += distance
    this.state.isDirty = true
    this.updateMatrix()
  }

  translateY(distance: number) {
    this.state.translation.y += distance
    this.state.isDirty = true
    this.updateMatrix()
  }

  translateZ(distance: number) {
    this.state.translation.z += distance
    this.state.isDirty = true
    this.updateMatrix()
  }

  scaleX(factor: number) {
    this.state.scale.x *= factor
    this.state.isDirty = true
    this.updateMatrix()
  }

  scaleY(factor: number) {
    this.state.scale.y *= factor
    this.state.isDirty = true
    this.updateMatrix()
  }

  scaleZ(factor: number) {
    this.state.scale.z *= factor
    this.state.isDirty = true
    this.updateMatrix()
  }

  getMatrix(): number[] {
    return [...this.state.matrix]
  }

  getState(): ThreeDState {
    return { ...this.state }
  }

  applyToElement(element: HTMLElement) {
    const matrix = this.getMatrix()
    const matrixString = `matrix3d(${matrix.join(', ')})`
    element.style.transform = matrixString
  }

  destroy() {
    this.state.matrix = this.createIdentityMatrix()
    this.state.isDirty = false
  }
}

export function createThreeD(options?: ThreeDOptions): ThreeDManager {
  return new ThreeDManager(options)
}

export function createThreeDEffect(
  element: () => HTMLElement | null,
  options: ThreeDOptions
) {
  let manager: ThreeDManager | null = null

  createEffect(() => {
    const el = element()
    if (el && options.threeD) {
      if (!manager) {
        manager = createThreeD(options)
      }
      
      manager.applyToElement(el)
    }
  })

  onCleanup(() => {
    if (manager) {
      manager.destroy()
      manager = null
    }
  })

  return manager
}
