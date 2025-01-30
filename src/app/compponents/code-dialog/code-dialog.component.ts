import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-code-dialog',
  standalone: true,
  imports: [MatDialogContent,MatDialogActions],
  templateUrl: './code-dialog.component.html',
  styleUrl: './code-dialog.component.scss'
})
export class CodeDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}
