import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-switch-button',
  templateUrl: './switch-button.component.html',
  styleUrls: ['./switch-button.component.scss']
})
export class SwitchButtonComponent implements OnInit {
  @Input()
  value: boolean = false;
  @Input()
  classToggle: string;
  @Input()
  disabled: boolean = false;

  @Output()
  changeValue = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit() {}

  onChangeValue() {
    this.value = !this.value;
    this.changeValue.emit(!this.value);
  }
}
