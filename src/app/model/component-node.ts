import { Position } from "./position";

export interface ComponentNode {
  id: string; // Unique identifier for the component
  componentType: string; // Type of the component (e.g., 'button', 'input', 'div', 'mat-card')
  label: string; // Label or name for the component
  position: Position // Position of the component in the layout
  styles: { [key: string]: string }; // Styles to be applied (e.g., 'width', 'height', 'backgroundColor')
  properties: { [key: string]: any }; // Additional properties specific to the component type (e.g., value for 'input')
  children: ComponentNode[]; // Nested components (if any)
}


