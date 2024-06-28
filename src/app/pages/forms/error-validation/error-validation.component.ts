import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-validation',
  templateUrl: './error-validation.component.html',
  styleUrls: ['./error-validation.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorValidationComponent implements OnInit {

  @Input() message;
  @Input() type;

  constructor() { }

  ngOnInit(): void {
  }

}
