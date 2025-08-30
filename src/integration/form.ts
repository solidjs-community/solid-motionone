import { createSignal, createEffect, onCleanup } from 'solid-js'
import type { FormIntegrationOptions, IntegrationState } from '../types.js'

export class FormIntegrationManager {
  private options: FormIntegrationOptions
  private state: IntegrationState
  private activeForm: HTMLFormElement | null = null
  private focusedField: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null = null
  private formErrors: Record<string, string> = {}
  private formIsValid = true
  private fieldAnimations: Map<string, Animation> = new Map()

  constructor(options: FormIntegrationOptions = {}) {
    this.options = {
      formValidation: true,
      validationAnimation: { scale: 1.05, borderColor: '#ff6b6b' },
      errorAnimation: { x: [0, -10, 10, -10, 10, 0], borderColor: '#ff6b6b' },
      successAnimation: { scale: 1.02, borderColor: '#51cf66' },
      fieldFocusAnimation: { scale: 1.02, borderColor: '#339af0' },
      fieldBlurAnimation: { scale: 1, borderColor: '#dee2e6' },
      fieldErrorAnimation: { x: [0, -10, 10, -10, 10, 0], borderColor: '#ff6b6b' },
      fieldSuccessAnimation: { scale: 1.01, borderColor: '#51cf66' },
      submitAnimation: { scale: 0.98, opacity: 0.8 },
      loadingAnimation: { rotate: 360 },
      ...options
    }
    
    this.state = {
      currentRoute: null,
      previousRoute: null,
      isTransitioning: false,
      activeForm: null,
      focusedField: null,
      formErrors: {},
      formIsValid: true,
      inspectorOpen: false,
      selectedAnimation: null,
      inspectorMetrics: {
        fps: 60,
        memoryUsage: 0,
        activeAnimations: 0,
        totalElements: 0
      }
    }
    
    this.initialize()
  }

  private initialize() {
    this.setupFormListeners()
    this.setupFieldListeners()
  }

  private setupFormListeners() {
    if (typeof document === 'undefined') return

    // Listen for form submissions
    document.addEventListener('submit', this.handleFormSubmit.bind(this))
    
    // Listen for form validation events
    document.addEventListener('invalid', this.handleFieldInvalid.bind(this))
  }

  private setupFieldListeners() {
    if (typeof document === 'undefined') return

    // Listen for field focus/blur events
    document.addEventListener('focusin', this.handleFieldFocus.bind(this))
    document.addEventListener('focusout', this.handleFieldBlur.bind(this))
    
    // Listen for input validation events
    document.addEventListener('input', this.handleFieldInput.bind(this))
    document.addEventListener('change', this.handleFieldChange.bind(this))
  }

  private handleFormSubmit(event: Event) {
    const form = event.target as HTMLFormElement
    this.activeForm = form
    this.state.activeForm = form

    // Trigger form submit animation
    if (this.options.submitAnimation) {
      this.animateFormSubmit(form)
    }

    // Trigger form submit event handler
    if (this.options.onFormSubmit) {
      this.options.onFormSubmit(form)
    }

    // Validate form
    this.validateForm(form)
  }

  private handleFieldFocus(event: FocusEvent) {
    const field = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    this.focusedField = field
    this.state.focusedField = field

    // Trigger field focus animation
    if (this.options.fieldFocusAnimation) {
      this.animateFieldFocus(field)
    }

    // Trigger field focus event handler
    if (this.options.onFieldFocus) {
      this.options.onFieldFocus(field)
    }
  }

  private handleFieldBlur(event: FocusEvent) {
    const field = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    
    // Trigger field blur animation
    if (this.options.fieldBlurAnimation) {
      this.animateFieldBlur(field)
    }

    // Trigger field blur event handler
    if (this.options.onFieldBlur) {
      this.options.onFieldBlur(field)
    }

    // Clear focused field
    if (this.focusedField === field) {
      this.focusedField = null
      this.state.focusedField = null
    }
  }

  private handleFieldInput(event: Event) {
    const field = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    
    // Validate field on input
    this.validateField(field)
  }

  private handleFieldChange(event: Event) {
    const field = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    
    // Validate field on change
    this.validateField(field)
  }

  private handleFieldInvalid(event: Event) {
    const field = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    
    // Trigger field error animation
    if (this.options.fieldErrorAnimation) {
      this.animateFieldError(field)
    }

    // Add error to form errors
    const fieldName = field.name || field.id
    if (fieldName) {
      this.formErrors[fieldName] = field.validationMessage || 'Invalid field'
      this.state.formErrors = { ...this.formErrors }
    }
  }

  validateField(field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) {
    const fieldName = field.name || field.id
    if (!fieldName) return

    const isValid = field.checkValidity()
    
    if (isValid) {
      // Remove error if field is now valid
      if (this.formErrors[fieldName]) {
        delete this.formErrors[fieldName]
        this.state.formErrors = { ...this.formErrors }
        
        // Trigger field success animation
        if (this.options.fieldSuccessAnimation) {
          this.animateFieldSuccess(field)
        }

        // Trigger field success event handler
        if (this.options.onFieldSuccess) {
          this.options.onFieldSuccess(field)
        }
      }
    } else {
      // Add error if field is invalid
      const errorMessage = field.validationMessage || 'Invalid field'
      if (this.formErrors[fieldName] !== errorMessage) {
        this.formErrors[fieldName] = errorMessage
        this.state.formErrors = { ...this.formErrors }
        
        // Trigger field error animation
        if (this.options.fieldErrorAnimation) {
          this.animateFieldError(field)
        }

        // Trigger field error event handler
        if (this.options.onFieldError) {
          this.options.onFieldError(field, errorMessage)
        }
      }
    }
  }

  validateForm(form: HTMLFormElement) {
    const isValid = form.checkValidity()
    this.formIsValid = isValid
    this.state.formIsValid = isValid

    // Trigger form validation event handler
    if (this.options.onFormValidation) {
      this.options.onFormValidation(form, isValid)
    }

    // Trigger validation animation
    if (this.options.validationAnimation) {
      this.animateFormValidation(form, isValid)
    }
  }

  private animateFormSubmit(form: HTMLFormElement) {
    const animation = this.createFieldAnimation(
      form,
      this.options.submitAnimation!,
      200,
      'easeInOut'
    )
    
    this.fieldAnimations.set('form-submit', animation)
  }

  private animateFormValidation(form: HTMLFormElement, isValid: boolean) {
    const animation = isValid 
      ? this.options.successAnimation 
      : this.options.errorAnimation

    if (animation) {
      const anim = this.createFieldAnimation(
        form,
        animation,
        300,
        'easeInOut'
      )
      
      this.fieldAnimations.set('form-validation', anim)
    }
  }

  private animateFieldFocus(field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) {
    const animation = this.createFieldAnimation(
      field,
      this.options.fieldFocusAnimation!,
      200,
      'easeOut'
    )
    
    this.fieldAnimations.set(`field-focus-${field.name || field.id}`, animation)
  }

  private animateFieldBlur(field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) {
    const animation = this.createFieldAnimation(
      field,
      this.options.fieldBlurAnimation!,
      200,
      'easeIn'
    )
    
    this.fieldAnimations.set(`field-blur-${field.name || field.id}`, animation)
  }

  private animateFieldError(field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) {
    const animation = this.createFieldAnimation(
      field,
      this.options.fieldErrorAnimation!,
      400,
      'easeInOut'
    )
    
    this.fieldAnimations.set(`field-error-${field.name || field.id}`, animation)
  }

  private animateFieldSuccess(field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) {
    const animation = this.createFieldAnimation(
      field,
      this.options.fieldSuccessAnimation!,
      300,
      'easeOut'
    )
    
    this.fieldAnimations.set(`field-success-${field.name || field.id}`, animation)
  }

  private createFieldAnimation(
    element: HTMLElement,
    animation: any,
    duration: number,
    easing: string
  ): Animation {
    const keyframes = this.convertToKeyframes(animation)
    return element.animate(keyframes, {
      duration,
      easing,
      fill: 'forwards'
    })
  }

  private convertToKeyframes(animation: any): Keyframe[] {
    // Convert motionone animation to web animation keyframes
    if (typeof animation === 'object') {
      const keyframes: Keyframe[] = []
      
      // Handle special animations like shake
      if (animation.shake) {
        keyframes.push(
          { transform: 'translateX(0)' },
          { transform: 'translateX(-10px)' },
          { transform: 'translateX(10px)' },
          { transform: 'translateX(-10px)' },
          { transform: 'translateX(10px)' },
          { transform: 'translateX(0)' }
        )
      } else {
        // Handle regular animations
        keyframes.push(
          { ...animation.initial || {} },
          { ...animation.animate || {} }
        )
      }
      
      return keyframes
    }
    
    return []
  }

  registerForm(form: HTMLFormElement) {
    this.activeForm = form
    this.state.activeForm = form
  }

  unregisterForm() {
    this.activeForm = null
    this.state.activeForm = null
  }

  registerField(field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) {
    // Field is automatically registered when it receives focus
  }

  unregisterField(field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) {
    const fieldName = field.name || field.id
    if (fieldName && this.formErrors[fieldName]) {
      delete this.formErrors[fieldName]
      this.state.formErrors = { ...this.formErrors }
    }
  }

  getState(): IntegrationState {
    return { ...this.state }
  }

  getActiveForm(): HTMLFormElement | null {
    return this.activeForm
  }

  getFocusedField(): HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null {
    return this.focusedField
  }

  getFormErrors(): Record<string, string> {
    return { ...this.formErrors }
  }

  isFormValid(): boolean {
    return this.formIsValid
  }

  clearFormErrors() {
    this.formErrors = {}
    this.state.formErrors = {}
  }

  destroy() {
    // Stop all running animations
    this.fieldAnimations.forEach(animation => {
      animation.cancel()
    })
    this.fieldAnimations.clear()
    
    // Clear form state
    this.activeForm = null
    this.focusedField = null
    this.formErrors = {}
    this.formIsValid = true
  }
}

export function createFormIntegration(options?: FormIntegrationOptions): FormIntegrationManager {
  return new FormIntegrationManager(options)
}

export function createFormIntegrationEffect(
  element: () => HTMLElement | null,
  options: FormIntegrationOptions
) {
  let manager: FormIntegrationManager | null = null

  createEffect(() => {
    const el = element()
    if (el && options.formValidation) {
      if (!manager) {
        manager = createFormIntegration(options)
      }
      
      // Register form if it's a form element
      if (el.tagName === 'FORM') {
        manager.registerForm(el as HTMLFormElement)
      }
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

// Form Integration Helpers
export function createFormValidation(
  form: HTMLFormElement,
  options: FormIntegrationOptions = {}
) {
  const manager = createFormIntegration(options)
  manager.registerForm(form)
  
  return {
    manager,
    validate: () => manager.validateForm(form),
    getErrors: () => manager.getFormErrors(),
    isValid: () => manager.isFormValid(),
    clearErrors: () => manager.clearFormErrors(),
    getState: () => manager.getState()
  }
}

export function createFieldValidation(
  field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  options: FormIntegrationOptions = {}
) {
  const manager = createFormIntegration(options)
  
  return {
    manager,
    validate: () => manager.validateField(field),
    getError: () => {
      const fieldName = field.name || field.id
      return fieldName ? manager.getFormErrors()[fieldName] : null
    },
    isValid: () => field.checkValidity(),
    getState: () => manager.getState()
  }
}
