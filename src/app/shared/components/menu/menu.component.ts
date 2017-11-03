import { Component, OnInit, Input, EventEmitter, Output, ElementRef, OnChanges } from '@angular/core';

@Component({
  selector: 'shared-menu',
  host: {
    '(document:click)': 'onClick($event)',
  },
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  @Input() items: any[];
  @Input() showing: boolean;
  @Input() selected: any[];
  @Input() headers: string[];

  @Output()
  selection: EventEmitter<string>;

  initializer: number;

  @Output()
  close: EventEmitter<boolean>;

  constructor(private _eref: ElementRef) {
    this.close = new EventEmitter<boolean>();
    this.selection = new EventEmitter<string>();
  }

  ngOnInit() {
    this.initializer = 0;
  }

  isHeader(item) {
    if (this.headers) {
      return this.headers.indexOf(item) >= 0;
    } else {
      return false;
    }
  }

  onSelect(item) {
    if (this.selected) {
      if (this.selected.indexOf(item) >= 0) {
        this.selected.splice(this.selected.indexOf(item), 1);
      } else {
        this.selected.push(item);
      }
    }
    this.selection.emit(item);
  }


  isSelected(item) {
    if (this.selected) {
      return this.selected.indexOf(item) >= 0;
    }
  }

  onClick(event) {
    if (this.showing && this.initializer > 0) {
      if (!this._eref.nativeElement.contains(event.target)) {
        this.close.emit(true);
        this.initializer = 0;
      }
    }
    this.initializer++;
  }

}
