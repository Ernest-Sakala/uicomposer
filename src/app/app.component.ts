import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatCard, MatCardModule} from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, CdkDragEnd, CdkDragMove, CdkDropList, DragDropModule,moveItemInArray } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatInput, MatInputModule } from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { CodeDialogComponent } from './compponents/code-dialog/code-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ComponentNode } from './model/component-node';
import { Position } from './model/position';
import { randomUUID } from 'crypto';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatCardModule,CommonModule, DragDropModule,FormsModule,MatInputModule,MatCheckboxModule,
    MatGridListModule,
    MatDatepickerModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'UI Composer';

  availableComponents = [
    { componentType: 'button', label: '', properties: {} },
    { componentType: 'input', label: 'input', properties: { value: '' } },
    { componentType: 'checkbox', label: 'Checkbox', properties: { checked: false } },
    { componentType: 'div', label: 'div', properties: {}, styles: {}, children: [] },
    { componentType: 'form', label: 'Normal form', properties: {}, styles: {}, children: [] },
    { componentType: 'label', label: 'label', properties: {}, styles: {}, children: [] },
    { componentType: 'img', label: 'img', properties: {}, styles: {}, children: [] },
    { componentType: 'ul', label: 'ul', properties: {}, styles: {}, children: [] },
    { componentType: 'li', label: 'li', properties: {}, styles: {}, children: [] },
    { componentType: 'h1', label: 'h1', properties: {}, styles: {}, children: [] }
];


  contextMenuVisible = false;
  contextMenuPosition = { x: '0px', y: '0px' };
  targetComponent: ComponentNode | undefined;


  constructor(public dialog: MatDialog) { }

  btn : string = 'button';

  canvasComponents: ComponentNode[] = [];
  selectedComponent: any = null;
  generatedCode: string = '';

  addComponent(component: any) {

    // Get the properties based on the component type
    const additionalProperties = this.getComponentProperties(component);

    this.canvasComponents.push({
      ...component,
      ...additionalProperties,
      id: Date.now().toString(),
      position: { left: 0, top: 0 },
      styles: {
        backgroundColor: component.styles['backgroundColor'] || 'orange',
        width: component.styles['width'] || '300px',
        height: component.styles['height'] || '50px',
      },
    });

    this.generateAngularCode()
  }



 // properties component e.g input | value , type
  getComponentProperties(component : any) {
    let additionalProperties = {};

    switch (component.type) {
      case 'input':
        additionalProperties = {
          value: component.properties.value || '',
          type: component.properties.type || 'text',
          placeholder: component.properties.placeholder || 'Enter value',
        };
        break;

      case 'button':
        additionalProperties = {
          label: component.properties.label || 'Button',
          type: component.properties.type || 'button',
        };
        break;

      case 'checkbox':
        additionalProperties = {
          checked: component.properties.checked || false,
          label: component.properties.label || 'Checkbox',
        };
        break;

      // Add cases for other component types as needed

      default:
        additionalProperties = {};
        break;
    }

    return additionalProperties;
  }

  // onDragMoved(event: CdkDragMove<any>, index: number) {
  //   this.canvasComponents[index].position = {
  //     left: event.pointerPosition?.x || 0,
  //     top: event.pointerPosition?.y || 0,
  //   };
  // }

  onDragMoved(event: CdkDragMove<any>, index: number) {

    const draggedComponent = this.canvasComponents[index];
    const draggedPosition = {
      left: event.pointerPosition?.x || 0,
      top: event.pointerPosition?.y || 0,
    };

    // // Update the dragged component's position
    // draggedComponent.position = draggedPosition;
    //
    // // Loop through components to find a potential parent
    // this.canvasComponents.forEach((potentialParent, i) => {
    //   if (i !== index) { // Skip comparing the component to itself
    //     const parentPosition = potentialParent.position;
    //
    //     if (this.isClose(draggedPosition, parentPosition)) {
    //       console.log(`Component ${draggedComponent.id} is now a child of ${potentialParent.id}`);
    //
    //       // Remove the dragged component from the root list if necessary
    //       this.canvasComponents.splice(index, 1);
    //
    //       // Add the dragged component as a child of the matched component
    //       potentialParent.children.push(draggedComponent);
    //     }
    //   }
    // });
  }

  private isClose(pos1: Position, pos2: Position): boolean {
    const threshold = 50; // Proximity threshold in pixels
    const xClose = Math.abs(pos1.left - pos2.left) < threshold;
    const yClose = Math.abs(pos1.top - pos2.top) < threshold;
    return xClose && yClose;
  }



  onDragEnded(event: CdkDragEnd<any>, index: number) {

    const draggedComponent :  ComponentNode = this.canvasComponents[index];

    const draggedPosition = {
      left: event.dropPoint?.x || 0,
      top: event.dropPoint?.y || 0,
    };

    // console.log("Position ", draggedPosition.left + " top " + draggedPosition.top)
    //
    // // Update the dragged component's final position
    // draggedComponent.position = draggedPosition;
    //
    //
    // let parentFound = false;
    //
    // this.canvasComponents.forEach((potentialParent : ComponentNode, i) => {
    //
    //
    //   if (i !== index && !parentFound) { // Skip itself and exit early if a parent is found
    //     const parentPosition = potentialParent.position;
    //
    //     if (this.isCloseDradEnd(draggedPosition, parentPosition)) {
    //       console.log(`Component ${draggedComponent.id} is now a child of ${potentialParent.id}`);
    //
    //       // Remove the dragged component from the root list
    //       this.canvasComponents.splice(index, 1);
    //
    //       // Add it as a child of the matched component
    //       potentialParent.children.push(draggedComponent);
    //
    //       parentFound = true;
    //     }
    //   }
    // });
  }

  private isCloseDradEnd(pos1: Position, pos2: Position): boolean {
    const threshold = 200; // Proximity threshold in pixels
    const xClose = Math.abs(pos1.left - pos2.left) < threshold;
    const yClose = Math.abs(pos1.top - pos2.top) < threshold;
    return xClose && yClose;
  }



  selectComponent(component: any) : void {
    console.log("Selecting component", component);
    this.selectedComponent = component;
  }


  selectChildComponent(event: MouseEvent,component: any) : void {
    console.log("Selecting Child component", component);
    event.stopPropagation(); // Prevent bubbling up to parent
    this.selectedComponent = component;
  }

  updateComponentStyles(property: string, value: string) {
    if (this.selectedComponent) {
      this.selectedComponent.styles[property] = value;
    }
  }


  updateComponentProperties(property: string, value: string) {
    if (this.selectedComponent) {
      this.selectedComponent.properties[property] = value;
    }
  }


  onDrop(event: CdkDragDrop<any[]>, parentComponent: any): void {

    const draggedComponent = event.item.data;

    // Remove the component from the current list
    this.canvasComponents = this.canvasComponents.filter(c => c !== draggedComponent);

    // Add the component to the parent component's children
    parentComponent.children = parentComponent.children || [];
    parentComponent.children.push(draggedComponent);

    // this.updateCanvas();
  }



  // Generate standalone Angular component code dynamically

  generateAngularCode() {
    this.generatedCode = `
      import { Component } from '@angular/core';

      @Component({
        standalone: true,
        selector: 'app-custom-component',
        template: \`
          <div class = "component-container">
            ${this.getRenderedHtml()}
          </div>
        \`,
        styles: [\`
          div {
            background-color: #f0f0f0;
            border-radius: 10px;
          }
        \`]
      })
      export class CustomComponent { }
          `;
  }


// Render nested components dynamically (children appended inside their parent component)
renderChildComponents(component: ComponentNode): string {
  let componentHtml = '';

  switch (component.componentType) {
    case 'button':
      componentHtml = `<button>${component.label}`;
      break;

    case 'input':
      componentHtml = `<button>${component.label}`;
      break;

    case 'checkbox':
      componentHtml = `<mat-checkbox>${component.label}</mat-checkbox>`;
      break;

    case 'div':
      componentHtml = `<div>`;
      break;

    case 'form':
      componentHtml = `<form>`;
      break;

    default:
      break;
  }

  // If the component has children, recursively render them inside the parent
  if (component.children && component.children.length > 0) {
    component.children.forEach(child => {
      componentHtml += this.renderChildComponents(child); // Recursive call to render children
    });
  }

  // Close the component's tag (for div, button, input, etc.)
  if (component.componentType === 'button') {
    componentHtml += `</button>`;
  }

  if (component.componentType === 'div') {
    componentHtml += `</div>`;
  }

  if (component.componentType === 'checkbox') {
    componentHtml += `</mat-checkbox>`;
  }

  if (component.componentType === 'form') {
    componentHtml += `</form>`;
  }

  return componentHtml;
}




  getRenderedHtml() {
    return this.canvasComponents
      .map(component => this.renderChildComponents(component)) // Recursive rendering
      .join('\n');
  }

   // Update Angular code when the user edits it in the text area
   onCodeEdit() {
    // This can be used to parse the code or save it elsewhere.
    console.log('Code edited:', this.generatedCode);
  }


  addChildComponent(type: string) {

    // Get the properties based on the component type
    //const additionalProperties = this.getComponentProperties(component);

    console.log("Adding Children >>>>>>>>>>>")


    const newChild = {
      id: Date.now().toString(),
      componentType: type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Component`,
      position: { left: 0, top: 0 },
      styles: { backgroundColor: '#f0f0f0', width: '100px', height: '50px' },
      children: [],
      properties: {}
    };


    // Get additional properties based on the component type
    const additionalProperties = this.getComponentProperties(newChild);

    // Merge the properties into the new child component
    const childWithProperties = {
      ...newChild,
      ...additionalProperties,
    };

    console.log(childWithProperties)

    console.log(this.targetComponent)

    if (this.targetComponent) {


      // Update the tree immutably with the new child added to the correct parent
      this.canvasComponents = this.addComponentToTree(this.canvasComponents, this.targetComponent.id, childWithProperties);

      console.log(this.canvasComponents);

      this.closeContextMenu();
      this.generateAngularCode();
      this.logAllComponents();
    }


  }

  addComponentToTree(components: ComponentNode[], targetId: string, newChild: ComponentNode): ComponentNode[] {
    return components.map(component => {
      if (component.id === targetId) {
        return {
          ...component,
          children: [...component.children, newChild]
        };
      } else if (component.children && component.children.length > 0) {
        return {
          ...component,
          children: this.addComponentToTree(component.children, targetId, newChild)
        };
      }
      return component;
    });
  }

  logAllComponents() {
    const traverseAndLog = (components: ComponentNode[], depth: number = 0): void => {
      components.forEach(component => {
        console.log(`${' '.repeat(depth * 2)}Component: ${component.componentType} (ID: ${component.id})`);
        if (component.children && component.children.length > 0) {
          traverseAndLog(component.children, depth + 1);
        }
      });
    };
    traverseAndLog(this.canvasComponents);
  }


  closeContextMenu() {
    this.contextMenuVisible = false;
  }




  openContextMenu(event: MouseEvent, component: ComponentNode) {
    event.preventDefault(); // Prevent default right-click behavior
    this.contextMenuVisible = true;
    this.contextMenuPosition = {
      x: `${event.clientX}px`,
      y: `${event.clientY}px`
    };

    this.targetComponent = component;
  }



  // element resizing

  resizing: boolean = false;
  initialMousePosition: { x: number; y: number } = { x: 0, y: 0 };
  initialSize: { width: number; height: number } = { width: 0, height: 0 };

  // Mouse down to start resizing
  onMouseDown(event: MouseEvent, component: ComponentNode) {
    if (this.isNearBottomRightCorner(event, component)) {
      this.resizing = true;
      this.selectedComponent = component;
      this.initialMousePosition = { x: event.clientX, y: event.clientY };
      this.initialSize = {
        width: parseInt(component.styles['width'] || '100', 10),
        height: parseInt(component.styles['height'] || '100', 10),
      };
      event.preventDefault();
      window.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('mouseup', this.onMouseUp);
    }
  }

  // Mouse move to resize the component
  onMouseMove = (event: MouseEvent) => {
    if (this.resizing && this.selectedComponent) {
      const deltaX = event.clientX - this.initialMousePosition.x;
      const deltaY = event.clientY - this.initialMousePosition.y;

      const newWidth = this.initialSize.width + deltaX;
      const newHeight = this.initialSize.height + deltaY;

      this.selectedComponent.styles.width = `${Math.max(newWidth, 50)}px`;
      this.selectedComponent.styles.height = `${Math.max(newHeight, 50)}px`;
    }
  };

  // Mouse up to stop resizing
  onMouseUp = () => {
    this.resizing = false;
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  };

  // Check if the mouse is near the bottom-right corner
  isNearBottomRightCorner(event: MouseEvent, component: ComponentNode): boolean {
    const componentElement = document.getElementById(component.id);
    if (!componentElement) return false;

    const rect = componentElement.getBoundingClientRect();
    const buffer = 10; // Threshold to trigger resizing
    return (
      event.clientX >= rect.right - buffer &&
      event.clientY >= rect.bottom - buffer
    );
  }


}
