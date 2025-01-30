import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatCard, MatCardModule} from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, CdkDragMove, DragDropModule,moveItemInArray } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatInput, MatInputModule } from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { CodeDialogComponent } from './compponents/code-dialog/code-dialog.component';
import { MatDialog } from '@angular/material/dialog';


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
  title = 'uibuilder';

  availableComponents = [
    { type: 'button', label: 'Button', properties: {} },
    { type: 'input', label: 'Input Field', properties: { value: '' } },
    { type: 'checkbox', label: 'Checkbox', properties: { checked: false } },
    {
      type: 'mat-card',
      label: 'Material Card',
      properties: {},
      children: [
        { type: 'mat-card-header', label: 'Card Header', children: [] },
        { type: 'mat-card-content', label: 'Card Content', children: [] },
        { type: 'mat-card-actions', label: 'Card Actions', children: [
          { type: 'button', label: 'LIKE' },
          { type: 'button', label: 'SHARE' }
        ]}
      ]
    },
    { type: 'mat-grid-list', label: 'Mat-grid-list', properties: {}, styles: {}, children: [] }
];



  constructor(public dialog: MatDialog) { }
 

  btn : string = 'button';

  canvasComponents: any[] = [];
  selectedComponent: any = null;
  generatedCode: string = '';

  addComponent(component: any) {
    this.canvasComponents.push({
      ...component,
      position: { left: 0, top: 0 },
      styles: {
        backgroundColor: component.styles?.backgroundColor || 'orange',
        width: component.styles?.width || '300px',
        height: component.styles?.height || '50px',
      },
    });

    this.generateAngularCode()
  }

  onDragMoved(event: CdkDragMove<any>, index: number) {
    this.canvasComponents[index].position = {
      left: event.pointerPosition?.x || 0,
      top: event.pointerPosition?.y || 0,
    };
  }

  onDragEnded(index: number) {
    const component = this.canvasComponents[index];
    console.log(
      `Component "${component.label}" positioned at: ${component.position.left}, ${component.position.top}`
    );
  }


  selectComponent(component: any) {
    this.selectedComponent = component;
  }

  updateComponentStyles(property: string, value: string) {
    if (this.selectedComponent) {
      this.selectedComponent.styles[property] = value;
    }
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
            ${this.renderChildComponents()}
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

  // Render nested components dynamically
  renderChildComponents() {
    return this.canvasComponents
      .map(component => {
        switch (component.type) {
          case 'button':
            return `<button>${component.label}</button>`;
          case 'input':
            return `<mat-form-field><input matInput placeholder="${component.label}"></mat-form-field>`;
          case 'checkbox':
            return `<mat-checkbox>${component.label}</mat-checkbox>`;
          default:
            return '';
        }
      })
      .join('\n');
  }

  

   // Update Angular code when the user edits it in the text area
   onCodeEdit() {
    // This can be used to parse the code or save it elsewhere.
    console.log('Code edited:', this.generatedCode);
  }

}
