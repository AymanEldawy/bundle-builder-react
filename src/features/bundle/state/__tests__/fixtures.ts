import type { BundleState, Product, StepConfig } from '../types/bundle.types';

export const mockSteps: StepConfig[] = [
  { id: 'cameras', title: 'Choose your cameras', icon: '/assets/figma/camera.svg', order: 1 },
  { id: 'plan', title: 'Choose your plan', icon: '/assets/figma/shield.svg', order: 2 },
  { id: 'sensors', title: 'Choose your sensors', icon: '/assets/figma/sensor.svg', order: 3 },
  { id: 'accessories', title: 'Add extra protection', icon: '/assets/figma/shield-plus.svg', order: 4 },
];

export const mockCameraProduct: Product = {
  id: 'wyze-cam-v4',
  stepId: 'cameras',
  title: 'Wyze Cam v4',
  description: 'The clearest Wyze Cam ever made.',
  badge: 'Save 22%',
  image: '/assets/figma/Wyze Cam v4.svg',
  selectedVariantId: 'white',
  variants: [
    { id: 'white', label: 'White', price: 27.98, compareAtPrice: 35.98, quantity: 1 },
    { id: 'black', label: 'Black', price: 27.98, compareAtPrice: 35.98, quantity: 0 },
  ],
};

export const mockPlanProduct: Product = {
  id: 'cam-unlimited',
  stepId: 'plan',
  title: 'Cam Unlimited',
  description: 'Unlimited cloud recording.',
  image: '/assets/figma/logo.svg',
  selectedVariantId: 'default',
  variants: [{ id: 'default', label: 'Default', price: 9.99, compareAtPrice: 12.0, quantity: 1 }],
};

export const mockSensorProduct: Product = {
  id: 'wyze-sense-motion-sensor',
  stepId: 'sensors',
  title: 'Wyze Sense Motion Sensor',
  description: 'Motion alerts.',
  image: '/assets/figma/motion.svg',
  selectedVariantId: 'default',
  variants: [{ id: 'default', label: 'Default', price: 29.99, quantity: 2 }],
};

export const mockAccessoryProduct: Product = {
  id: 'wyze-microsd-256gb',
  stepId: 'accessories',
  title: 'Wyze MicroSD Card (256GB)',
  description: 'Local storage.',
  image: '/assets/figma/sd.svg',
  selectedVariantId: 'default',
  variants: [{ id: 'default', label: 'Default', price: 20.98, quantity: 0 }],
};

export const mockState: BundleState = {
  products: [mockCameraProduct, mockPlanProduct, mockSensorProduct, mockAccessoryProduct],
  expandedStepId: 'cameras',
};
